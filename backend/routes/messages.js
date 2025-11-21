const express = require('express');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads', 'messages');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
];

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5
    },
    fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported. Allowed: jpg, png, webp, gif, pdf'));
        }
    }
});

const formatAttachment = (file) => ({
    url: `/uploads/messages/${path.basename(file.path)}`,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    type: file.mimetype.startsWith('image/') ? 'image' : 'file'
});

const canAccessConversation = (user, conversation) => {
    if (!conversation) return false;
    if (user.role === 'admin') return true;
    return conversation.buyer.toString() === user._id.toString() ||
        conversation.seller.toString() === user._id.toString();
};

const buildConversationFilter = (req) => {
    const { scope = 'mine', sellerId, buyerId } = req.query;
    const filter = {};

    if (req.user.role === 'admin' && scope === 'all') {
        if (sellerId) filter.seller = sellerId;
        if (buyerId) filter.buyer = buyerId;
        return filter;
    }

    filter.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
    ];
    return filter;
};

const STALE_CONVERSATION_TIMEOUT = 30 * 1000;

const isConversationEmpty = (conversation) => {
    return !conversation ||
        !conversation.lastMessage ||
        !conversation.lastMessage.preview ||
        conversation.lastMessage.preview.trim() === '';
};

const scheduleConversationCleanup = (conversationId) => {
    setTimeout(async () => {
        try {
            const conversation = await Conversation.findById(conversationId).lean();
            if (isConversationEmpty(conversation)) {
                await Promise.all([
                    Message.deleteMany({ conversation: conversationId }),
                    Conversation.deleteOne({ _id: conversationId })
                ]);
            }
        } catch (error) {
            console.error('Auto cleanup conversation failed:', error);
        }
    }, STALE_CONVERSATION_TIMEOUT);
};

const cleanupStaleConversations = async () => {
    const cutoff = new Date(Date.now() - STALE_CONVERSATION_TIMEOUT);
    try {
        const staleConversations = await Conversation.find({
            updatedAt: { $lte: cutoff },
            $or: [
                { 'lastMessage.preview': { $exists: false } },
                { 'lastMessage.preview': '' },
                { lastMessage: null }
            ]
        }).select('_id');

        if (staleConversations.length > 0) {
            const ids = staleConversations.map(conv => conv._id);
            await Promise.all([
                Message.deleteMany({ conversation: { $in: ids } }),
                Conversation.deleteMany({ _id: { $in: ids } })
            ]);
        }
    } catch (error) {
        console.error('Failed to cleanup stale conversations:', error);
    }
};

router.use(auth);

const returnValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return true;
    }
    return false;
};

const handleUpload = (req, res, next) => {
    upload.array('attachments', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

// List conversations
router.get(
    '/conversations',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 50 })
    ],
    async (req, res) => {
        if (returnValidationErrors(req, res)) return;
        try {
            await cleanupStaleConversations();
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const skip = (page - 1) * limit;
            const search = (req.query.search || '').trim();

            const baseFilter = buildConversationFilter(req);
            const andFilters = [];
            if (baseFilter && Object.keys(baseFilter).length > 0) {
                andFilters.push(baseFilter);
            }
            if (search) {
                andFilters.push({
                    subject: { $regex: search, $options: 'i' }
                });
            }
            const finalFilter = andFilters.length > 0 ? { $and: andFilters } : {};

            const [conversations, total] = await Promise.all([
                Conversation.find(finalFilter)
                    .sort({ updatedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('buyer', 'username profile avatar email')
                    .populate('seller', 'username profile avatar email sellerProfile')
                    .populate('product', 'title slug coverImage images')
                    .populate('order', 'orderNumber status totalAmount'),
                Conversation.countDocuments(finalFilter)
            ]);

            res.json({
                success: true,
                data: conversations,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Failed to list conversations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get conversations',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// Create or get conversation
router.post(
    '/conversations',
    [
        body('buyerId').optional().isMongoId(),
        body('sellerId').optional().isMongoId(),
        body('subject').optional().isString().isLength({ max: 200 }),
        body('productId').optional().isMongoId(),
        body('orderId').optional().isMongoId()
    ],
    async (req, res) => {
        if (returnValidationErrors(req, res)) return;
        try {
            const { subject, productId, orderId, createdFrom = 'product' } = req.body;
            let { buyerId, sellerId } = req.body;

            if (req.user.role === 'user') {
                buyerId = req.user._id.toString();
                if (!sellerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'sellerId is required'
                    });
                }
            } else if (req.user.role === 'seller') {
                sellerId = req.user._id.toString();
                if (!buyerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'buyerId is required'
                    });
                }
            } else if (req.user.role === 'admin') {
                if (!buyerId || !sellerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'buyerId and sellerId are required'
                    });
                }
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Role not supported for messaging'
                });
            }

            const [buyer, seller] = await Promise.all([
                User.findById(buyerId),
                User.findById(sellerId)
            ]);

            if (!buyer || buyer.role !== 'user') {
                return res.status(404).json({
                    success: false,
                    message: 'Buyer not found'
                });
            }

            if (!seller || seller.role !== 'seller') {
                return res.status(404).json({
                    success: false,
                    message: 'Seller not found'
                });
            }

            let product = null;
            let order = null;

            if (productId) {
                product = await Product.findById(productId);
            }

            if (orderId) {
                order = await Order.findById(orderId);
            }

            const existingConversation = await Conversation.findOne({
                buyer: buyerId,
                seller: sellerId,
                product: productId || null,
                order: orderId || null
            });

            if (existingConversation) {
                return res.json({
                    success: true,
                    data: existingConversation
                });
            }

            const conversation = await Conversation.create({
                buyer: buyerId,
                seller: sellerId,
                product: productId || null,
                order: orderId || null,
                subject: subject || (product ? `Hỏi đáp về: ${product.title}` : 'Trao đổi với người bán'),
                createdFrom
            });

            scheduleConversationCleanup(conversation._id);

            res.status(201).json({
                success: true,
                data: conversation
            });
        } catch (error) {
            console.error('Failed to create conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create conversation',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// Get conversation details
router.get('/conversations/:id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('buyer', 'username profile avatar email')
            .populate('seller', 'username profile avatar email sellerProfile')
            .populate('product', 'title slug coverImage images')
            .populate('order', 'orderNumber status totalAmount');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!canAccessConversation(req.user, conversation)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this conversation'
            });
        }

        res.json({
            success: true,
            data: conversation
        });
    } catch (error) {
        console.error('Failed to get conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get conversation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// List messages in a conversation
router.get('/conversations/:id/messages', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 30;
        const page = parseInt(req.query.page, 10) || 1;
        const skip = (page - 1) * limit;

        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!canAccessConversation(req.user, conversation)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this conversation'
            });
        }

        const [messages, total] = await Promise.all([
            Message.find({ conversation: conversation._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Message.countDocuments({ conversation: conversation._id })
        ]);

        res.json({
            success: true,
            data: messages.reverse(), // chronological order
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to get messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get messages',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Send message in a conversation
router.post(
    '/conversations/:id/messages',
    handleUpload,
    [
        body('body').optional().isString().isLength({ max: 4000 })
    ],
    async (req, res) => {
        if (returnValidationErrors(req, res)) return;
        try {
            const conversation = await Conversation.findById(req.params.id);

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            if (!canAccessConversation(req.user, conversation)) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to send messages in this conversation'
                });
            }

            if (!req.body.body && (!req.files || req.files.length === 0)) {
                return res.status(400).json({
                    success: false,
                    message: 'Message content or attachment is required'
                });
            }

            const recipientId = conversation.buyer.toString() === req.user._id.toString()
                ? conversation.seller
                : conversation.buyer;

            const attachments = (req.files || []).map(formatAttachment);

            const message = await Message.create({
                conversation: conversation._id,
                sender: req.user._id,
                recipient: recipientId,
                body: req.body.body,
                attachments
            });

            // Update conversation metadata
            conversation.lastMessage = {
                preview: req.body.body || (attachments.length ? attachments[0].fileName : ''),
                sender: req.user._id,
                sentAt: new Date()
            };

            if (recipientId.toString() === conversation.buyer.toString()) {
                conversation.buyerUnreadCount += 1;
            } else {
                conversation.sellerUnreadCount += 1;
            }

            await conversation.save();

            res.status(201).json({
                success: true,
                data: message
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to send message',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
);

// Mark conversation as read
router.patch('/conversations/:id/read', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!canAccessConversation(req.user, conversation)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this conversation'
            });
        }

        const isBuyer = conversation.buyer.toString() === req.user._id.toString();
        if (isBuyer) {
            conversation.buyerUnreadCount = 0;
        } else {
            conversation.sellerUnreadCount = 0;
        }

        await Promise.all([
            conversation.save(),
            Message.updateMany(
                {
                    conversation: conversation._id,
                    recipient: req.user._id,
                    status: { $ne: 'read' }
                },
                {
                    $set: {
                        status: 'read',
                        readAt: new Date()
                    }
                }
            )
        ]);

        res.json({
            success: true,
            message: 'Conversation marked as read'
        });
    } catch (error) {
        console.error('Failed to mark conversation as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark conversation as read',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete a conversation (soft delete)
router.delete('/conversations/:id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!canAccessConversation(req.user, conversation)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this conversation'
            });
        }

        await Promise.all([
            Message.deleteMany({ conversation: conversation._id }),
            conversation.deleteOne()
        ]);

        res.json({
            success: true,
            message: 'Conversation deleted'
        });
    } catch (error) {
        console.error('Failed to delete conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete conversation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Admin moderation: delete a message
router.delete('/messages/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const conversation = await Conversation.findById(message.conversation);
        const isParticipant = conversation && canAccessConversation(req.user, conversation);

        if (!(req.user.role === 'admin' || isParticipant)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this message'
            });
        }

        message.isDeleted = true;
        message.body = '[Tin nhắn đã bị xoá]';
        message.deletedAt = new Date();
        await message.save();

        res.json({
            success: true,
            message: 'Message deleted'
        });
    } catch (error) {
        console.error('Failed to delete message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

