const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    subject: {
        type: String,
        trim: true,
        maxlength: 200
    },
    lastMessage: {
        preview: {
            type: String,
            default: ''
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    },
    buyerUnreadCount: {
        type: Number,
        default: 0
    },
    sellerUnreadCount: {
        type: Number,
        default: 0
    },
    isArchivedByBuyer: {
        type: Boolean,
        default: false
    },
    isArchivedBySeller: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdFrom: {
        type: String,
        enum: ['product', 'order', 'store', 'system'],
        default: 'product'
    }
}, {
    timestamps: true
});

conversationSchema.index({ buyer: 1, seller: 1, product: 1, order: 1 }, { unique: false });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ buyer: 1, updatedAt: -1 });
conversationSchema.index({ seller: 1, updatedAt: -1 });

conversationSchema.methods.incrementUnread = function(isBuyer) {
    if (isBuyer) {
        this.buyerUnreadCount += 1;
    } else {
        this.sellerUnreadCount += 1;
    }
    return this.save();
};

conversationSchema.methods.resetUnread = function(isBuyer) {
    if (isBuyer) {
        this.buyerUnreadCount = 0;
    } else {
        this.sellerUnreadCount = 0;
    }
    return this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema);

