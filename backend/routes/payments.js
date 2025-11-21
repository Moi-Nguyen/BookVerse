const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, admin, seller } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

// SePay Helper Functions - Create QR Code using VietQR with SePay pattern
// Theo hướng dẫn: https://sepay.vn/lap-trinh-cong-thanh-toan.html
// SePay hoạt động qua webhook, không có API tạo QR trực tiếp
// Tạo QR code từ thông tin tài khoản ngân hàng với nội dung chứa pattern
async function createSePayQRCode(amount, user) {
    try {
        const matchPattern = process.env.SEPAY_MATCH_PATTERN || 'SE';
        
        console.log('Creating QR code with:', {
            matchPattern,
            userId: user._id,
            amount: amount || 'no amount'
        });
        
        // Generate unique order code with pattern
        // Format: {PATTERN}{USER_ID}{TIMESTAMP}
        // Ví dụ: SE12345678901234
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits
        const userIdShort = user._id.toString().slice(-6); // Last 6 digits of user ID
        const orderCode = `${matchPattern}${userIdShort}${timestamp}`;
        
        // Get bank account info from environment
        const bankAccount = {
            bankBin: process.env.VIETQR_BANK_BIN || '970415', // Default: Vietcombank
            bankNumber: process.env.VIETQR_BANK_NUMBER,
            accountName: process.env.VIETQR_ACCOUNT_NAME || 'BOOKVERSE',
            template: 'compact2' // compact, compact2, qr_only
        };

        console.log('Bank account config:', {
            bankBin: bankAccount.bankBin,
            bankNumber: bankAccount.bankNumber ? '***' + bankAccount.bankNumber.slice(-4) : 'NOT SET',
            accountName: bankAccount.accountName
        });

        if (!bankAccount.bankNumber || bankAccount.bankNumber.trim() === '') {
            throw new Error('Chưa cấu hình số tài khoản ngân hàng (VIETQR_BANK_NUMBER). Vui lòng thêm vào file .env');
        }
        
        // Validate bank number format (should be numeric)
        if (!/^\d+$/.test(bankAccount.bankNumber.trim())) {
            throw new Error('Số tài khoản ngân hàng không hợp lệ (chỉ được chứa số)');
        }

        // Create description with SePay pattern
        // Format: "Thanh toan QR {PATTERN}{CODE}" - SePay sẽ match pattern này
        // Ví dụ: "Thanh toan QR SE12345678901234"
        const description = `Thanh toan QR ${orderCode}`;

        // VietQR API endpoint
        // Format: https://img.vietqr.io/image/{BIN}-{accountNumber}-{template}.png?amount={amount}&addInfo={description}&accountName={name}
        let vietQRUrl = `https://img.vietqr.io/image/${bankAccount.bankBin}-${bankAccount.bankNumber}-${bankAccount.template}.png`;
        
        // Add query parameters
        const qrParams = [];
        if (amount && amount > 0) {
            qrParams.push(`amount=${amount}`);
        }
        qrParams.push(`addInfo=${encodeURIComponent(description)}`);
        qrParams.push(`accountName=${encodeURIComponent(bankAccount.accountName)}`);
        
        if (qrParams.length > 0) {
            vietQRUrl += '?' + qrParams.join('&');
        }

        // Get bank name from BIN
        const bankNames = {
            '970415': 'Vietcombank',
            '970422': 'MBBank',
            '970436': 'VietinBank',
            '970403': 'BIDV',
            '970427': 'ACB', // Asia Commercial Bank
            '970405': 'TPBank',
            '970414': 'VPBank'
        };

        const result = {
            orderId: orderCode,
            qrCode: vietQRUrl,
            bankAccount: {
                bankName: bankNames[bankAccount.bankBin] || 'Ngân hàng',
                accountNumber: bankAccount.bankNumber,
                accountHolder: bankAccount.accountName
            },
            amount: amount || null,
            orderCode: orderCode // SePay order code with pattern để match với webhook
        };
        
        console.log('QR code created successfully:', {
            orderCode: result.orderCode,
            qrCodeUrl: result.qrCode.substring(0, 100) + '...'
        });
        
        return result;
    } catch (error) {
        console.error('Error in createSePayQRCode:', error);
        throw error;
    }
}

async function createSePayPayment(payment, user) {
    const sepayApiKey = process.env.SEPAY_API_KEY;
    const sepaySecretKey = process.env.SEPAY_SECRET_KEY;
    const sepayApiUrl = process.env.SEPAY_API_URL || 'https://api.sepay.vn';
    
    if (!sepayApiKey || !sepaySecretKey) {
        throw new Error('SePay API credentials not configured');
    }
    
    // Generate unique order ID
    const orderId = `BOOKVERSE_${payment._id}_${Date.now()}`;
    
    // Prepare payment data
    const paymentData = {
        amount: payment.amount,
        orderId: orderId,
        orderInfo: payment.description || `Nạp tiền vào ví Bookverse - ${payment.amount} VND`,
        customerName: user.profile?.firstName && user.profile?.lastName 
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : user.username,
        customerEmail: user.email,
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:8000'}/pages/account/wallet.php?payment=success`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:8000'}/pages/account/wallet.php?payment=cancelled`,
        webhookUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/sepay/webhook`
    };
    
    // Create signature
    const signatureData = `${sepayApiKey}${orderId}${payment.amount}${paymentData.orderInfo}`;
    const signature = crypto
        .createHmac('sha256', sepaySecretKey)
        .update(signatureData)
        .digest('hex');
    
    try {
        // Call SePay API to create payment
        const response = await fetch(`${sepayApiUrl}/v1/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sepayApiKey}`,
                'X-Signature': signature
            },
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create SePay payment');
        }
        
        const sepayResponse = await response.json();
        
        return {
            orderId: orderId,
            paymentUrl: sepayResponse.data?.paymentUrl || sepayResponse.paymentUrl,
            qrCode: sepayResponse.data?.qrCode || sepayResponse.qrCode,
            bankAccount: sepayResponse.data?.bankAccount || null
        };
    } catch (error) {
        console.error('SePay API Error:', error);
        throw error;
    }
}

function verifySePayWebhook(signature, payload, secret) {
    try {
        const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payloadString)
            .digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        console.error('Error verifying SePay webhook:', error);
        return false;
    }
}

// Get user's payment history
router.get('/history', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        const userId = req.user.id || req.user._id;
        const query = { user: userId };
        
        // Default: only show deposit payments (nạp tiền), not spending
        // If type is explicitly provided, use it; otherwise default to 'deposit'
        if (type) {
            query.type = type;
        } else {
            query.type = 'deposit'; // Only show deposits by default
        }
        
        // Default: only show completed payments
        if (status) {
            query.status = status;
        } else {
            query.status = 'completed'; // Only show completed by default
        }
        
        const payments = await Payment.find(query)
            .populate('order', 'orderNumber totalAmount')
            .populate('seller', 'username profile.firstName profile.lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Payment.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử thanh toán',
            error: error.message
        });
    }
});

// Get user's wallet balance
router.get('/balance', auth, async (req, res) => {
    try {
        // Get user ID from req.user (could be id or _id after serialization)
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        // Get balance from user wallet (source of truth)
        const user = await User.findById(userId).select('wallet');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Use wallet balance if available, otherwise calculate from transactions
        let balance = 0;
        
        // Check if wallet balance exists (could be 0, which is valid)
        if (user.wallet && typeof user.wallet.balance === 'number') {
            balance = user.wallet.balance;
        } else {
            // If wallet balance is not set, try to get from last transaction
            const lastTransaction = await Transaction.findOne({ user: userId })
                .sort({ createdAt: -1 });
            if (lastTransaction) {
                balance = lastTransaction.balance;
                // Update user wallet balance to sync
                if (!user.wallet) {
                    user.wallet = { balance: 0, currency: 'VND' };
                }
                user.wallet.balance = balance;
                await user.save();
            }
        }
        
        res.json({
            success: true,
            data: { balance }
        });
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy số dư ví',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Deposit money to wallet
router.post('/deposit', [
    auth,
    body('amount').isNumeric().withMessage('Số tiền phải là số'),
    body('amount').isFloat({ min: 1000 }).withMessage('Số tiền tối thiểu là 1,000 VND'),
    body('method').isIn(['bank_transfer', 'cash', 'sepay']).withMessage('Phương thức thanh toán không hợp lệ'),
    body('description').optional().isString().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { amount, method, description } = req.body;
        
        // Get user ID from req.user (could be id or _id after serialization)
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        // Create payment record
        const payment = await Payment.createDeposit(
            userId,
            amount,
            method,
            description || `Nạp tiền vào ví - ${method}`
        );
        
        // If SePay, create payment link
        if (method === 'sepay') {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                const sepayData = await createSePayPayment(payment, user);
                payment.sepay = sepayData;
                await payment.save();
                
                return res.json({
                    success: true,
                    message: 'Đã tạo link thanh toán SePay',
                    data: { 
                        payment,
                        sepay: {
                            paymentUrl: sepayData.paymentUrl,
                            qrCode: sepayData.qrCode,
                            orderId: sepayData.orderId
                        }
                    }
                });
            } catch (sepayError) {
                console.error('SePay error:', sepayError);
                // If SePay fails, still save payment but mark as pending manual approval
                return res.json({
                    success: true,
                    message: 'Yêu cầu nạp tiền đã được tạo, nhưng không thể tạo link SePay. Vui lòng thử lại hoặc chọn phương thức khác.',
                    data: { payment }
                });
            }
        }
        
        res.json({
            success: true,
            message: 'Yêu cầu nạp tiền đã được gửi, chờ admin xử lý',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo yêu cầu nạp tiền',
            error: error.message
        });
    }
});

// Seller: Add/Update bank account
router.post('/bank-account', [
    auth,
    seller,
    body('bankName').notEmpty().withMessage('Tên ngân hàng là bắt buộc'),
    body('accountNumber').notEmpty().withMessage('Số tài khoản là bắt buộc'),
    body('accountHolder').notEmpty().withMessage('Tên chủ tài khoản là bắt buộc'),
    body('branch').optional().isString().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { bankName, accountNumber, accountHolder, branch } = req.body;
        
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Ensure sellerProfile exists
        if (!user.sellerProfile) {
            user.sellerProfile = {};
        }
        
        // Update bank account info
        user.sellerProfile.bankAccount = {
            bankName: bankName.trim(),
            accountNumber: accountNumber.trim(),
            accountHolder: accountHolder.trim(),
            branch: branch ? branch.trim() : '',
            isVerified: false,
            updatedAt: new Date()
        };
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Thông tin tài khoản ngân hàng đã được cập nhật, chờ admin xác minh',
            data: { bankAccount: user.sellerProfile.bankAccount }
        });
    } catch (error) {
        console.error('Error updating bank account:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật tài khoản ngân hàng',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Seller: Get bank account info
router.get('/bank-account', auth, seller, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            data: { bankAccount: user.sellerProfile.bankAccount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tài khoản ngân hàng',
            error: error.message
        });
    }
});

// Seller: Get payment history
router.get('/seller/payments', auth, seller, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const userId = req.user.id || req.user._id;
        const query = { seller: userId };
        
        if (status) query.status = status;
        
        const payments = await Payment.find(query)
            .populate('order', 'orderNumber totalAmount')
            .populate('user', 'username profile.firstName profile.lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Payment.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Error getting seller payments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử thanh toán',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Seller: Create withdrawal request
router.post('/withdrawal', auth, seller, [
    body('amount').isNumeric().withMessage('Số tiền phải là số'),
    body('amount').isFloat({ min: 50000 }).withMessage('Số tiền tối thiểu là 50,000 VND'),
    body('notes').optional().isString().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { amount, notes } = req.body;
        const userId = req.user.id || req.user._id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Check balance
        if (user.wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Số dư không đủ để rút tiền'
            });
        }
        
        // Check if bank account is set
        if (!user.sellerProfile?.bankAccount?.accountNumber) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cập nhật thông tin tài khoản ngân hàng trước khi rút tiền'
            });
        }
        
        // Create withdrawal request
        const payment = new Payment({
            user: userId,
            seller: userId,
            amount: amount,
            type: 'withdrawal',
            status: 'pending',
            method: 'bank_transfer',
            description: notes || `Yêu cầu rút tiền ${amount.toLocaleString('vi-VN')} VND`,
            notes: notes,
            bankAccount: {
                bankName: user.sellerProfile.bankAccount.bankName,
                accountNumber: user.sellerProfile.bankAccount.accountNumber,
                accountHolder: user.sellerProfile.bankAccount.accountHolder
            }
        });
        
        await payment.save();
        
        res.json({
            success: true,
            message: 'Yêu cầu rút tiền đã được gửi thành công',
            data: { payment }
        });
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo yêu cầu rút tiền',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin: Get all pending payments
router.get('/admin/pending', admin, async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const query = { status: 'pending' };
        
        if (type) query.type = type;
        
        const payments = await Payment.find(query)
            .populate('user', 'username email profile.firstName profile.lastName')
            .populate('seller', 'username email profile.firstName profile.lastName')
            .populate('order', 'orderNumber totalAmount')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Payment.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách thanh toán chờ xử lý',
            error: error.message
        });
    }
});

// Admin: Approve deposit
router.post('/admin/approve-deposit/:paymentId', [
    admin,
    body('notes').optional().isString().trim()
], async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { notes } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }
        
        if (payment.type !== 'deposit') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể duyệt giao dịch nạp tiền'
            });
        }
        
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch đã được xử lý'
            });
        }
        
        // Approve payment
        await payment.approve(req.user.id);
        
        // Create transaction record
        await Transaction.createDeposit(
            payment.user,
            payment.amount,
            `Nạp tiền vào ví - ${payment.method}`,
            payment._id
        );
        
        // Update user wallet balance
        const user = await User.findById(payment.user);
        if (user) {
            user.wallet.balance += payment.amount;
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Đã duyệt nạp tiền thành công',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi duyệt nạp tiền',
            error: error.message
        });
    }
});

// Admin: Approve withdrawal request
router.post('/admin/approve-withdrawal/:paymentId', [
    auth,
    admin,
    body('notes').optional().isString().trim()
], async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { notes } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu rút tiền'
            });
        }
        
        if (payment.type !== 'withdrawal') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể duyệt yêu cầu rút tiền'
            });
        }
        
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu đã được xử lý'
            });
        }
        
        const user = await User.findById(payment.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Check balance again
        if (user.wallet.balance < payment.amount) {
            return res.status(400).json({
                success: false,
                message: 'Số dư không đủ để thực hiện rút tiền'
            });
        }
        
        // Update payment status
        payment.status = 'completed';
        payment.approvedBy = req.user.id || req.user._id;
        payment.approvedAt = new Date();
        if (notes) {
            payment.notes = notes;
        }
        await payment.save();
        
        // Deduct from seller wallet
        user.wallet.balance -= payment.amount;
        await user.save();
        
        // Create transaction record (balance will be calculated by pre-save hook)
        await Transaction.create({
            user: payment.user,
            type: 'withdrawal',
            amount: payment.amount,
            description: `Rút tiền - ${payment.description}`,
            status: 'completed',
            payment: payment._id
        });
        
        res.json({
            success: true,
            message: 'Đã duyệt yêu cầu rút tiền thành công',
            data: { payment }
        });
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi duyệt yêu cầu rút tiền',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin: Reject withdrawal request
router.post('/admin/reject-withdrawal/:paymentId', [
    auth,
    admin,
    body('reason').notEmpty().withMessage('Lý do từ chối là bắt buộc')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { paymentId } = req.params;
        const { reason } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu rút tiền'
            });
        }
        
        if (payment.type !== 'withdrawal') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể từ chối yêu cầu rút tiền'
            });
        }
        
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu đã được xử lý'
            });
        }
        
        // Update payment status
        payment.status = 'cancelled';
        payment.approvedBy = req.user.id || req.user._id;
        payment.approvedAt = new Date();
        payment.notes = reason;
        await payment.save();
        
        res.json({
            success: true,
            message: 'Đã từ chối yêu cầu rút tiền',
            data: { payment }
        });
    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi từ chối yêu cầu rút tiền',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin: Approve seller payment
router.post('/admin/approve-seller-payment/:paymentId', [
    admin,
    body('notes').optional().isString().trim()
], async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { notes } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }
        
        if (payment.type !== 'withdrawal') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể duyệt thanh toán cho seller'
            });
        }
        
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch đã được xử lý'
            });
        }
        
        // Approve payment
        await payment.approve(req.user.id);
        
        // Create transaction record
        await Transaction.createSellerWithdrawal(
            payment.seller,
            payment.amount,
            payment.order,
            `Thanh toán cho đơn hàng #${payment.order}`
        );
        
        res.json({
            success: true,
            message: 'Đã duyệt thanh toán cho seller thành công',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi duyệt thanh toán cho seller',
            error: error.message
        });
    }
});

// Admin: Reject payment
router.post('/admin/reject/:paymentId', [
    admin,
    body('reason').notEmpty().withMessage('Lý do từ chối là bắt buộc')
], async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { reason } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }
        
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch đã được xử lý'
            });
        }
        
        // Reject payment
        await payment.reject(req.user.id, reason);
        
        res.json({
            success: true,
            message: 'Đã từ chối giao dịch',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi từ chối giao dịch',
            error: error.message
        });
    }
});

// Admin: Get commission statistics
router.get('/admin/commission-stats', admin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { type: 'commission' };
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const commissions = await Payment.find(query)
            .populate('order', 'orderNumber totalAmount')
            .sort({ createdAt: -1 });
            
        const totalCommission = commissions.reduce((sum, commission) => {
            return sum + commission.commission.amount;
        }, 0);
        
        res.json({
            success: true,
            data: {
                commissions,
                totalCommission,
                count: commissions.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê hoa hồng',
            error: error.message
        });
    }
});

// SePay Webhook - Receive payment notifications
// Theo format từ: https://sepay.vn/lap-trinh-cong-thanh-toan.html
// Route: POST /api/payments/sepay/webhook

// Test endpoint (GET) - để kiểm tra webhook URL có hoạt động không
router.get('/sepay/webhook', (req, res) => {
    console.log('🔍 GET request to webhook endpoint (test)');
    res.json({
        success: true,
        message: 'Webhook endpoint is accessible',
        method: 'GET',
        note: 'This endpoint only accepts POST requests from SePay'
    });
});

// Main webhook endpoint (POST)
router.post('/sepay/webhook', express.json(), async (req, res) => {
    console.log('🔔 SePay Webhook received:', {
        method: req.method,
        url: req.url,
        path: req.path,
        headers: {
            authorization: req.headers.authorization ? 'Present' : 'Missing',
            'content-type': req.headers['content-type']
        },
        body: req.body
    });
    
    try {
        // Verify webhook authentication
        // SePay uses format: Authorization: "apikey_API_KEY"
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN;
        const matchPattern = process.env.SEPAY_MATCH_PATTERN || 'SE';
        
        if (!authHeader || !webhookToken) {
            console.error('Missing authorization header or webhook token', {
                hasAuthHeader: !!authHeader,
                hasWebhookToken: !!webhookToken
            });
            return res.status(401).json({
                success: false,
                message: 'Missing authorization header or webhook token'
            });
        }
        
        // SePay sends: "apikey_API_KEY" format
        // Extract API key from header
        let token;
        if (authHeader.startsWith('apikey_')) {
            token = authHeader.replace('apikey_', '');
        } else if (authHeader.startsWith('Bearer ')) {
            // Fallback for Bearer format
            token = authHeader.replace('Bearer ', '');
        } else {
            // Try direct match
            token = authHeader;
        }
        
        if (token !== webhookToken) {
            console.error('Invalid webhook token', {
                received: token,
                expected: webhookToken,
                authHeader: authHeader
            });
            return res.status(401).json({
                success: false,
                message: 'Invalid webhook token'
            });
        }
        
        console.log('Webhook authentication successful');
        
        // Parse webhook data
        // Format từ SePay: gateway, transactionDate, accountNumber, content, transferType, transferAmount, referenceCode, etc.
        const webhookData = req.body;
        const {
            gateway,
            transactionDate,
            accountNumber,
            content,
            transferType,
            transferAmount,
            referenceCode,
            description,
            accumulated,
            id
        } = webhookData;
        
        console.log('SePay Webhook received:', {
            gateway,
            transactionDate,
            accountNumber,
            content,
            transferType,
            transferAmount,
            referenceCode
        });
        
        // Only process incoming transfers (transferType === 'in')
        if (transferType !== 'in') {
            return res.json({
                success: true,
                message: 'Webhook received but not an incoming transfer'
            });
        }
        
        // Extract order code from content
        // Content format có thể là:
        // - "Thanh toan QR {PATTERN}{CODE}" 
        // - "QR - Thanh toan QR {PATTERN}{CODE} GD ..."
        // - "{PATTERN}{CODE}"
        // Ví dụ: "QR - Thanh toan QR SEe4db4241051500 GD 841567-111525 00:24:24"
        console.log('🔍 Extracting order code from content:', {
            content: content,
            matchPattern: matchPattern,
            contentType: typeof content
        });
        
        // Pattern match: Tìm {PATTERN} theo sau bởi chữ cái và số
        // Ví dụ: SEe4db4241051500 hoặc SE12345678901234
        const patternMatch = new RegExp(`${matchPattern}[a-zA-Z0-9]+`, 'i');
        const match = content?.match(patternMatch);
        
        if (!match) {
            console.error('❌ No pattern match found in content:', {
                content: content,
                matchPattern: matchPattern,
                regex: patternMatch.toString()
            });
            return res.json({
                success: true,
                message: 'No matching pattern found in transaction content',
                debug: {
                    content: content,
                    pattern: matchPattern
                }
            });
        }
        
        console.log('✅ Pattern matched:', match[0]);
        
        const orderCode = match[0]; // e.g., "SE12345678901234"
        
        // Find payment by order code (stored in sepay.orderId)
        const payment = await Payment.findOne({ 
            'sepay.orderId': orderCode,
            status: 'pending'
        });
        
        if (!payment) {
            // Try to find by matching pattern in description or create new payment
            console.log('Payment not found for order code:', orderCode);
            
            // Extract user ID from order code (format: {PATTERN}{USER_ID}{TIMESTAMP})
            // Pattern length + 6 digits user ID
            const patternLength = matchPattern.length;
            const userIdFromCode = orderCode.substring(patternLength, patternLength + 6);
            
            // Try to find user and create payment if not exists
            // This handles case where QR was generated but payment record wasn't created
            const users = await User.find({});
            let matchedUser = null;
            
            for (const u of users) {
                const userIdStr = u._id.toString();
                if (userIdStr.endsWith(userIdFromCode)) {
                    matchedUser = u;
                    break;
                }
            }
            
            if (matchedUser && transferAmount > 0) {
                console.log('Creating new payment for user:', {
                    userId: matchedUser._id,
                    amount: transferAmount,
                    orderCode
                });
                
                // Check if payment already exists (prevent duplicate)
                const existingPayment = await Payment.findOne({
                    'sepay.orderId': orderCode,
                    status: 'completed'
                });
                
                if (existingPayment) {
                    console.log('⚠️ Payment already exists and completed:', existingPayment._id);
                    return res.json({
                        success: true,
                        message: 'Payment already processed'
                    });
                }
                
                // Create payment record
                const newPayment = await Payment.create({
                    user: matchedUser._id,
                    amount: transferAmount,
                    type: 'deposit',
                    method: 'sepay',
                    status: 'completed',
                    approvedAt: new Date(),
                    description: `Nạp tiền vào ví qua SePay - ${orderCode}`,
                    transactionId: referenceCode || id?.toString(),
                    sepay: {
                        orderId: orderCode,
                        bankAccount: {
                            bankName: gateway,
                            accountNumber: accountNumber
                        }
                    }
                });
                
                // Create transaction record
                console.log('Creating transaction record...');
                await Transaction.createDeposit(
                    matchedUser._id,
                    transferAmount,
                    `Nạp tiền vào ví qua SePay - ${orderCode}`,
                    newPayment._id
                );
                
                // Reload user to get latest data
                const user = await User.findById(matchedUser._id);
                if (!user) {
                    console.error('User not found after payment creation');
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
                
                // Update user wallet balance
                if (!user.wallet) {
                    user.wallet = { balance: 0, currency: 'VND' };
                }
                
                const oldBalance = user.wallet.balance;
                user.wallet.balance += transferAmount;
                await user.save();
                
                console.log('✅ New payment processed successfully:', {
                    paymentId: newPayment._id,
                    userId: user._id,
                    amount: transferAmount,
                    oldBalance,
                    newBalance: user.wallet.balance,
                    orderCode
                });
                
                return res.json({
                    success: true,
                    message: 'Payment created and processed successfully'
                });
            }
            
            return res.json({
                success: true,
                message: 'Payment not found, but webhook received'
            });
        }
        
        // Update existing payment
        if (payment.status === 'pending') {
            console.log('Processing pending payment:', {
                paymentId: payment._id,
                userId: payment.user,
                amount: transferAmount || payment.amount,
                orderCode
            });
            
            // Get the actual amount from webhook (more accurate)
            const actualAmount = transferAmount || payment.amount;
            
            // Approve payment
            payment.status = 'completed';
            payment.approvedAt = new Date();
            payment.amount = actualAmount; // Update with actual amount from webhook
            payment.transactionId = referenceCode || id?.toString();
            payment.sepay = payment.sepay || {};
            payment.sepay.bankAccount = {
                bankName: gateway,
                accountNumber: accountNumber
            };
            await payment.save();
            
            // Get user before creating transaction
            const user = await User.findById(payment.user);
            if (!user) {
                console.error('User not found for payment:', payment.user);
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            // Check if transaction already exists (prevent duplicate)
            const existingTransaction = await Transaction.findOne({
                payment: payment._id,
                type: 'deposit'
            });
            
            if (!existingTransaction) {
                // Create transaction record
                console.log('Creating transaction record...');
                await Transaction.createDeposit(
                    payment.user,
                    actualAmount,
                    `Nạp tiền vào ví qua SePay - ${orderCode}`,
                    payment._id
                );
                
                // Update user wallet balance
                if (!user.wallet) {
                    user.wallet = { balance: 0, currency: 'VND' };
                }
                
                const oldBalance = user.wallet.balance;
                user.wallet.balance += actualAmount;
                await user.save();
                
                console.log('✅ Payment processed successfully:', {
                    paymentId: payment._id,
                    userId: user._id,
                    amount: actualAmount,
                    oldBalance,
                    newBalance: user.wallet.balance,
                    orderCode
                });
            } else {
                console.log('⚠️ Transaction already exists, skipping duplicate:', existingTransaction._id);
            }
        } else if (payment.status === 'completed') {
            console.log('Payment already completed, skipping:', payment._id);
        }
        
        res.json({
            success: true,
            message: 'Webhook processed successfully'
        });
    } catch (error) {
        console.error('SePay webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing webhook',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Generate SePay QR Code (simplified - no payment record needed)
router.post('/sepay/qrcode', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        // Get user ID from req.user (could be id or _id after serialization)
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Validate amount if provided
        if (amount && (isNaN(amount) || amount < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền không hợp lệ'
            });
        }
        
        // Create QR code
        let qrData;
        try {
            console.log('Starting QR code generation for user:', userId);
            qrData = await createSePayQRCode(amount || null, user);
            console.log('QR code generated successfully');
        } catch (qrError) {
            console.error('Error in createSePayQRCode:', {
                message: qrError.message,
                stack: qrError.stack
            });
            throw qrError; // Re-throw to be caught by outer catch
        }
        
        // Create payment record to track this order code
        // This helps match webhook with payment later
        let payment = null;
        try {
            console.log('Creating payment record...');
            payment = await Payment.create({
                user: userId,
                amount: amount || 0,
                type: 'deposit',
                method: 'sepay',
                status: 'pending',
                description: `Nạp tiền vào ví qua SePay - ${qrData.orderCode}`,
                sepay: {
                    orderId: qrData.orderCode,
                    qrCode: qrData.qrCode,
                    bankAccount: qrData.bankAccount
                }
            });
            console.log('Payment record created:', payment._id);
        } catch (paymentError) {
            console.error('Error creating payment record:', {
                message: paymentError.message,
                stack: paymentError.stack,
                name: paymentError.name
            });
            // Even if payment creation fails, still return QR code
            // User can still use QR code, webhook will create payment if needed
            console.warn('Payment record creation failed, but QR code is valid');
        }
        
        res.json({
            success: true,
            data: {
                qrCode: qrData.qrCode,
                orderId: qrData.orderId,
                orderCode: qrData.orderCode,
                amount: qrData.amount,
                bankAccount: qrData.bankAccount,
                paymentId: payment?._id || null
            }
        });
    } catch (error) {
        console.error('Error generating SePay QR code:', error);
        
        // Return detailed error message
        const errorMessage = error.message || 'Lỗi khi tạo mã QR';
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // Check common errors
        let userMessage = errorMessage;
        if (errorMessage.includes('VIETQR_BANK_NUMBER')) {
            userMessage = 'Chưa cấu hình số tài khoản ngân hàng. Vui lòng thêm VIETQR_BANK_NUMBER vào file .env';
        }
        
        res.status(500).json({
            success: false,
            message: userMessage,
            error: isDevelopment ? error.message : undefined,
            hint: isDevelopment ? {
                checkEnv: 'Kiểm tra file .env có đầy đủ: VIETQR_BANK_NUMBER, VIETQR_BANK_BIN, VIETQR_ACCOUNT_NAME',
                stack: error.stack
            } : undefined
        });
    }
});

// Check SePay payment status
router.get('/sepay/status/:paymentId', auth, async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
        
        const payment = await Payment.findOne({
            _id: paymentId,
            user: userId,
            method: 'sepay'
        });
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                payment: {
                    id: payment._id,
                    status: payment.status,
                    amount: payment.amount,
                    sepay: payment.sepay
                }
            }
        });
    } catch (error) {
        console.error('Error checking SePay status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking payment status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
