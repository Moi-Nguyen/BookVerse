const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'payment', 'commission', 'refund'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    // Related entities
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    // For seller transactions
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Transaction metadata (Mixed type to allow any fields)
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Indexes
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

// Pre-save middleware to calculate balance
transactionSchema.pre('save', async function(next) {
    try {
        // Only calculate balance if it's a new document and balance is not explicitly set
        if (this.isNew && (this.balance === undefined || this.balance === null)) {
            const lastTransaction = await this.constructor
                .findOne({ user: this.user })
                .sort({ createdAt: -1 });
            
            const previousBalance = lastTransaction ? lastTransaction.balance : 0;
            
            if (this.type === 'deposit' || this.type === 'commission') {
                this.balance = previousBalance + this.amount;
            } else if (this.type === 'withdrawal' || this.type === 'payment') {
                this.balance = previousBalance - this.amount;
            } else {
                this.balance = previousBalance;
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Static methods
transactionSchema.statics.getUserBalance = async function(userId) {
    const lastTransaction = await this.findOne({ user: userId })
        .sort({ createdAt: -1 });
    
    return lastTransaction ? lastTransaction.balance : 0;
};

transactionSchema.statics.createDeposit = function(userId, amount, description, paymentId) {
    return this.create({
        user: userId,
        type: 'deposit',
        amount: amount,
        description: description,
        payment: paymentId,
        status: 'completed'
    });
};

transactionSchema.statics.createPayment = function(userId, amount, orderId, description) {
    return this.create({
        user: userId,
        type: 'payment',
        amount: amount,
        description: description,
        order: orderId,
        metadata: {
            orderNumber: `#${orderId}`
        },
        status: 'completed'
    });
};

transactionSchema.statics.createSellerWithdrawal = function(sellerId, amount, orderId, description) {
    return this.create({
        user: sellerId,
        seller: sellerId,
        type: 'withdrawal',
        amount: amount,
        description: description,
        order: orderId,
        status: 'pending'
    });
};

transactionSchema.statics.createCommission = function(adminId, amount, orderId) {
    return this.create({
        user: adminId,
        type: 'commission',
        amount: amount,
        description: `Hoa hồng 2% từ đơn hàng #${orderId}`,
        order: orderId,
        metadata: {
            commissionRate: 0.02
        },
        status: 'completed'
    });
};

module.exports = mongoose.model('Transaction', transactionSchema);
