const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth, resourceOwner } = require('../middlewares/auth');
const { validateOrder, validateObjectId, validateQuery } = require('../middlewares/validation');

const router = express.Router();

// @route   POST /api/orders/checkout
// @desc    Checkout with wallet payment
// @access  Private
router.post('/checkout', auth, async (req, res) => {
    try {
        const { items, shippingAddress, shippingFee = 0 } = req.body;
        const userId = req.user.id || req.user._id;

        // Get user with wallet balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate products and calculate totals
        let subtotal = 0;
        const validatedItems = [];
        const sellerAmounts = {}; // Track amounts per seller

        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm không tồn tại`
                });
            }

            if (!product.isActive || product.status !== 'approved') {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm "${product.title}" không khả dụng`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm "${product.title}" không đủ số lượng. Còn lại: ${product.stock}`
                });
            }

            const itemTotal = item.quantity * product.price;
            subtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                seller: product.seller,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });

            // Track seller amounts
            const sellerId = product.seller.toString();
            if (!sellerAmounts[sellerId]) {
                sellerAmounts[sellerId] = 0;
            }
            sellerAmounts[sellerId] += itemTotal;
        }

        // Calculate total
        const total = subtotal + (shippingFee || 0);

        // Check wallet balance
        const walletBalance = user.wallet?.balance || 0;
        if (walletBalance < total) {
            const shortage = total - walletBalance;
            return res.status(400).json({
                success: false,
                message: `Số dư không đủ. Vui lòng nạp thêm ${shortage.toLocaleString('vi-VN')} VND`,
                data: {
                    balance: walletBalance,
                    required: total,
                    shortage: shortage
                }
            });
        }

        // Validate shipping address (Order model requires these fields)
        // If not provided, use default values or get from user profile
        const defaultShippingAddress = {
            fullName: shippingAddress?.fullName || 
                (user.profile?.firstName && user.profile?.lastName 
                    ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
                    : user.username || 'Khách hàng'),
            phone: shippingAddress?.phone || user.profile?.phone || user.email || '0000000000',
            email: shippingAddress?.email || user.email || 'customer@bookverse.vn',
            street: shippingAddress?.street || 'Chưa cập nhật',
            city: shippingAddress?.city || 'Chưa cập nhật',
            state: shippingAddress?.state || 'Chưa cập nhật',
            zipCode: shippingAddress?.zipCode || '00000',
            country: shippingAddress?.country || 'Vietnam'
        };

        // Validate required fields
        if (!defaultShippingAddress.email || defaultShippingAddress.email === '') {
            return res.status(400).json({
                success: false,
                message: 'Email là bắt buộc. Vui lòng cập nhật thông tin tài khoản.'
            });
        }

        // Generate order number before creating order
        const orderCount = await Order.countDocuments();
        const orderNumber = `BV${Date.now().toString().slice(-8)}${(orderCount + 1).toString().padStart(4, '0')}`;

        // Create order
        const order = new Order({
            orderNumber: orderNumber,
            customer: userId,
            items: validatedItems,
            shippingAddress: defaultShippingAddress,
            payment: {
                method: 'wallet',
                status: 'paid',
                paidAt: new Date()
            },
            shipping: {
                cost: shippingFee || 0
            },
            subtotal,
            total,
            status: 'confirmed'
        });

        await order.save();
        console.log('✅ Order created:', order.orderNumber);

        // Deduct from user wallet
        if (!user.wallet) {
            user.wallet = { balance: 0, currency: 'VND' };
        }
        const oldBalance = user.wallet.balance;
        user.wallet.balance -= total;
        await user.save();

        // Create payment transaction for user
        try {
            await Transaction.createPayment(
                userId,
                total,
                order._id,
                `Thanh toán đơn hàng ${order.orderNumber}`
            );
            console.log('✅ Payment transaction created for user');
        } catch (txError) {
            console.error('Error creating payment transaction:', txError);
            // Don't fail the order if transaction creation fails
            // The wallet balance has already been deducted
        }

        // Process payments to sellers (with 2% commission)
        const commissionRate = 0.02; // 2%
        
        for (const [sellerId, amount] of Object.entries(sellerAmounts)) {
            const seller = await User.findById(sellerId);
            if (!seller) {
                console.error(`Seller ${sellerId} not found`);
                continue;
            }

            // Calculate seller amount (minus 2% commission)
            const commission = amount * commissionRate;
            const sellerAmount = amount - commission;

            // Add to seller wallet
            if (!seller.wallet) {
                seller.wallet = { balance: 0, currency: 'VND' };
            }
            seller.wallet.balance += sellerAmount;
            await seller.save();

            // Create transaction for seller
            await Transaction.create({
                user: sellerId,
                type: 'commission',
                amount: sellerAmount,
                description: `Thanh toán từ đơn hàng ${order.orderNumber} (trừ ${commission.toLocaleString('vi-VN')} VND hoa hồng 2%)`,
                order: order._id,
                status: 'completed',
                metadata: {
                    orderNumber: order.orderNumber,
                    commissionRate: commissionRate,
                    commissionAmount: commission
                }
            });

            // Create commission transaction for admin (if needed)
            // You can add admin user ID here if you want to track commission
        }

        // Update product stock
        for (const item of validatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sales: item.quantity }
            });
        }

        // Populate order data
        await order.populate('items.product', 'title author images price');
        await order.populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName');

        console.log('✅ Checkout successful:', {
            orderId: order._id,
            orderNumber: order.orderNumber,
            userId: userId,
            total: total,
            oldBalance: oldBalance,
            newBalance: user.wallet.balance
        });

        res.status(201).json({
            success: true,
            message: 'Thanh toán thành công',
            data: {
                order: order.toJSON(),
                wallet: {
                    oldBalance: oldBalance,
                    newBalance: user.wallet.balance
                }
            }
        });
    } catch (error) {
        console.error('❌ Checkout error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            userId: req.user?.id || req.user?._id
        });
        
        // Return detailed error in development
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Thanh toán thất bại';
            
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : undefined
        });
    }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, validateOrder, async (req, res) => {
    try {
        const { items, shippingAddress, payment } = req.body;

        // Validate products and calculate totals
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                });
            }

            if (!product.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `Product "${product.title}" is not available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product "${product.title}". Available: ${product.stock}`
                });
            }

            const itemTotal = item.quantity * product.price;
            subtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                seller: product.seller,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });
        }

        // Create order
        const order = new Order({
            customer: req.user._id,
            items: validatedItems,
            shippingAddress,
            payment,
            subtotal,
            total: subtotal // Will be calculated with shipping and tax in pre-save
        });

        await order.save();

        // Update product stock
        for (const item of validatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sales: item.quantity }
            });
        }

        await order.populate('items.product', 'title author images price');
        await order.populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order: order.toJSON()
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Order creation failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = { customer: req.user._id };
        
        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Payment status filter
        if (req.query.paymentStatus) {
            query['payment.status'] = req.query.paymentStatus;
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        const orders = await Order.find(query)
            .populate('items.product', 'title author images price')
            .populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, validateObjectId(), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if user is customer, seller, or admin
        const isCustomer = order.customer.toString() === req.user._id.toString();
        const isSeller = order.items.some(item => 
            item.seller && item.seller.toString() === req.user._id.toString()
        );
        const isAdmin = req.user.role === 'admin';
        
        if (!isCustomer && !isSeller && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this order'
            });
        }
        
        await order.populate('customer', 'username email profile.firstName profile.lastName');
        await order.populate('items.product', 'title author images price');
        await order.populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName');

        res.json({
            success: true,
            data: order.toJSON()
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', auth, validateObjectId(), async (req, res) => {
    try {
        const { status, note, trackingNumber } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get order
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Only customer can cancel, only seller can update other statuses
        if (status === 'cancelled') {
            if (order.customer.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the customer can cancel an order'
                });
            }
            
            if (['shipped', 'delivered'].includes(order.status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot cancel order that has been shipped or delivered'
                });
            }
        } else {
            // Check if user is seller of any item in the order
            const isSeller = order.items.some(item => 
                item.seller && item.seller.toString() === req.user._id.toString()
            );
            
            if (!isSeller && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only sellers can update order status'
                });
            }
        }

        order.status = status;
        if (note) {
            order.statusHistory.push({
                status,
                timestamp: new Date(),
                note,
                updatedBy: req.user._id
            });
        }

        // Set specific timestamps
        if (status === 'shipped') {
            order.shipping.shippedAt = new Date();
        } else if (status === 'delivered') {
            order.shipping.deliveredAt = new Date();
        } else if (status === 'cancelled') {
            order.cancelledAt = new Date();
            order.cancelledBy = req.user._id;
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                order: order.toJSON()
            }
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Order status update failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/orders/seller/my-orders
// @desc    Get seller's orders
// @access  Private (Seller)
router.get('/seller/my-orders', auth, validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {
            'items.seller': req.user._id
        };
        
        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }
        
        // Date filter
        if (req.query.startDate || req.query.endDate) {
            query.createdAt = {};
            if (req.query.startDate) {
                query.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        const orders = await Order.find(query)
            .populate('customer', 'username profile.firstName profile.lastName')
            .populate('items.product', 'title author images price')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get seller orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get seller orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/orders/:id/tracking
// @desc    Add tracking information
// @access  Private (Seller)
router.post('/:id/tracking', auth, validateObjectId(), async (req, res) => {
    try {
        const { trackingNumber, carrier, estimatedDelivery } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is seller of any item in the order
        const isSeller = order.items.some(item => 
            item.seller.toString() === req.user._id.toString()
        );

        if (!isSeller && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only sellers can add tracking information'
            });
        }

        order.shipping.trackingNumber = trackingNumber;
        order.shipping.carrier = carrier;
        order.shipping.estimatedDelivery = estimatedDelivery;

        await order.save();

        res.json({
            success: true,
            message: 'Tracking information added successfully',
            data: {
                order: order.toJSON()
            }
        });
    } catch (error) {
        console.error('Add tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add tracking information',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;

