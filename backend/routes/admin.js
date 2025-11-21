const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const { auth, admin } = require('../middlewares/auth');
const { validateObjectId, validateQuery, validateCategory } = require('../middlewares/validation');

const router = express.Router();

// Apply admin middleware to all routes
router.use(auth, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics with real-time updates
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
    try {
        // Date ranges for growth calculation
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        
        const [
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            completedOrders,
            cancelledOrders,
            totalRevenue,
            recentUsers,
            recentOrders,
            // Previous period data
            usersLastPeriod,
            sellersLastPeriod,
            productsLastPeriod,
            ordersLastPeriod
        ] = await Promise.all([
            User.countDocuments({ role: 'user', isActive: true }),
            User.countDocuments({ role: 'seller', isActive: true }),
            Product.countDocuments({ isActive: true }),
            Order.countDocuments(),
            Order.countDocuments({ status: 'pending' }),
            Order.countDocuments({ status: 'processing' }),
            Order.countDocuments({ status: 'shipped' }),
            Order.countDocuments({ status: { $in: ['delivered', 'completed'] } }),
            Order.countDocuments({ status: 'cancelled' }),
            Order.aggregate([
                { $match: { status: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            User.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('username email role createdAt'),
            Order.find()
                .populate('customer', 'username profile.firstName profile.lastName')
                .sort({ createdAt: -1 })
                .limit(5),
            // Last period counts
            User.countDocuments({ role: 'user', createdAt: { $lt: thirtyDaysAgo } }),
            User.countDocuments({ role: 'seller', createdAt: { $lt: thirtyDaysAgo } }),
            Product.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),
            Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
        ]);

        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        
        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        
        const growth = {
            users: calculateGrowth(totalUsers, usersLastPeriod),
            sellers: calculateGrowth(totalSellers, sellersLastPeriod),
            products: calculateGrowth(totalProducts, productsLastPeriod),
            orders: calculateGrowth(totalOrders, ordersLastPeriod)
        };

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalSellers,
                    totalProducts,
                    totalOrders,
                    pendingOrders,
                    processingOrders,
                    shippedOrders,
                    completedOrders,
                    cancelledOrders,
                    totalRevenue: revenue
                },
                growth,
                recentUsers,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics (real-time updates)
// @access  Private (Admin)
router.get('/dashboard/stats', async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [
            // Current stats
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders,
            monthlyOrdersRevenue,
            deliveredOrders,
            completedOrders,
            totalOrdersCount,
            paidOrders,
            // Previous period for growth
            usersLastPeriod,
            sellersLastPeriod,
            productsLastPeriod,
            ordersLastPeriod,
            revenueLastPeriod,
            previousCompletedOrders
        ] = await Promise.all([
            User.countDocuments({ role: 'user', isActive: true }),
            User.countDocuments({ role: 'seller', isActive: true }),
            Product.countDocuments({ isActive: true }),
            Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
            // Get all orders in current month (not just delivered) for admin commission calculation
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, status: { $in: ['delivered', 'processing', 'shipped'] } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Order.countDocuments({ status: 'delivered' }),
            Order.countDocuments({ status: { $in: ['delivered', 'completed', 'shipped'] } }), // Completed orders (various statuses)
            Order.countDocuments(), // Total orders
            Order.countDocuments({ 'payment.status': 'paid' }), // Paid orders for conversion
            // Previous period
            User.countDocuments({ role: 'user', createdAt: { $lt: thirtyDaysAgo }, isActive: true }),
            User.countDocuments({ role: 'seller', createdAt: { $lt: thirtyDaysAgo }, isActive: true }),
            Product.countDocuments({ createdAt: { $lt: thirtyDaysAgo }, isActive: true }),
            Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $in: ['delivered', 'processing', 'shipped'] } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Previous period completed orders for conversion rate calculation
            Order.countDocuments({ 
                status: 'delivered', 
                createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
            })
        ]);

        // Admin revenue = 2% commission from all seller orders
        const totalOrdersRevenue = monthlyOrdersRevenue[0]?.total || 0;
        const adminCommissionRate = 0.02; // 2%
        const monthlyRevenue = Math.round(totalOrdersRevenue * adminCommissionRate);
        
        const previousTotalRevenue = revenueLastPeriod[0]?.total || 0;
        const previousRevenue = Math.round(previousTotalRevenue * adminCommissionRate);
        
        // Conversion rate calculation - multiple approaches
        // Primary: (Paid orders / Total orders) * 100 - payment conversion rate (most important)
        // Secondary: (Completed orders / Total orders) * 100 - completion rate
        // Tertiary: (Total orders / Total users) * 100 - orders per user percentage
        
        let conversionRate = 0;
        
        if (totalOrdersCount > 0) {
            // Primary metric: Payment conversion (most important for business)
            if (paidOrders > 0) {
                conversionRate = ((paidOrders / totalOrdersCount) * 100).toFixed(2);
            }
            // Secondary: Completed orders (delivered, shipped, completed)
            else if (completedOrders > 0) {
                conversionRate = ((completedOrders / totalOrdersCount) * 100).toFixed(2);
            }
            // Tertiary: Just delivered orders
            else if (deliveredOrders > 0) {
                conversionRate = ((deliveredOrders / totalOrdersCount) * 100).toFixed(2);
            }
            // If no successful orders, show 0% (realistic)
            else {
                conversionRate = 0;
            }
        } else if (totalUsers > 0 && totalOrders > 0) {
            // If no total orders count but have monthly orders, calculate orders per user
            conversionRate = ((totalOrders / totalUsers) * 100).toFixed(2);
        }
        
        conversionRate = parseFloat(conversionRate) || 0;
        
        // Log for debugging
        console.log('Conversion Rate Debug:', {
            totalOrdersCount,
            paidOrders,
            completedOrders,
            deliveredOrders,
            conversionRate
        });

        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        // Calculate previous period conversion rate for comparison
        const previousConversionRate = ordersLastPeriod > 0 ? ((previousCompletedOrders / ordersLastPeriod) * 100).toFixed(2) : 0;
        const conversionChange = calculateGrowth(parseFloat(conversionRate), parseFloat(previousConversionRate));

        res.json({
            success: true,
            data: {
                totalUsers,
                totalSellers,
                totalProducts,
                totalOrders,
                monthlyRevenue: monthlyRevenue, // Admin commission (2% of seller orders)
                conversionRate: parseFloat(conversionRate), // Orders per user percentage
                usersChange: calculateGrowth(totalUsers, usersLastPeriod),
                sellersChange: calculateGrowth(totalSellers, sellersLastPeriod),
                productsChange: calculateGrowth(totalProducts, productsLastPeriod),
                ordersChange: calculateGrowth(totalOrders, ordersLastPeriod),
                revenueChange: calculateGrowth(monthlyRevenue, previousRevenue),
                conversionChange: conversionChange
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get stats',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/activity
// @desc    Get recent activity (real-time updates)
// @access  Private (Admin)
router.get('/dashboard/activity', async (req, res) => {
    try {
        const [
            recentUsers,
            recentOrders,
            recentProducts,
            recentReviews
        ] = await Promise.all([
            User.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('username email role createdAt')
                .lean(),
            Order.find()
                .populate('customer', 'username email')
                .populate('items.product', 'title')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Product.find({ isActive: true })
                .populate('seller', 'username')
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title seller createdAt')
                .lean(),
            require('../models/Review').find()
                .populate('user', 'username')
                .populate('product', 'title')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        // Format activities with types and icons
        const activities = [
            ...recentUsers.map(u => ({
                type: 'user',
                icon: '👤',
                title: `Người dùng mới đăng ký: ${u.username}`,
                description: u.email,
                time: u.createdAt,
                data: u
            })),
            ...recentOrders.map(o => ({
                type: 'order',
                icon: '📦',
                title: `Đơn hàng mới #${o.orderNumber || o._id.toString().slice(-6).toUpperCase()}`,
                description: `${o.customer?.username || 'Unknown'} - ${o.total?.toLocaleString('vi-VN')}₫`,
                time: o.createdAt,
                data: o
            })),
            ...recentProducts.map(p => ({
                type: 'product',
                icon: '📚',
                title: `Sản phẩm "${p.title}" được thêm bởi người bán`,
                description: p.seller?.username || 'Unknown',
                time: p.createdAt,
                data: p
            })),
            ...recentReviews.map(r => ({
                type: 'review',
                icon: '⭐',
                title: `Đánh giá mới cho "${r.product?.title}"`,
                description: `${r.user?.username} - ${r.rating}/5 sao`,
                time: r.createdAt,
                data: r
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get activity',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/pending
// @desc    Get pending approvals (real-time updates)
// @access  Private (Admin)
router.get('/dashboard/pending', async (req, res) => {
    try {
        const [
            pendingSellers,
            pendingProducts,
            pendingOrders,
            pendingReviews
        ] = await Promise.all([
            // Sellers waiting for approval (not approved yet)
            User.countDocuments({ 
                role: 'seller', 
                $or: [
                    { 'sellerProfile.isApproved': false },
                    { 'sellerProfile.isApproved': { $exists: false } }
                ],
                isActive: true
            }),
            Product.countDocuments({ status: 'pending' }),
            Order.countDocuments({ status: { $in: ['pending', 'processing'] } }),
            require('../models/Review').countDocuments({ status: 'pending' })
        ]);

        res.json({
            success: true,
            data: {
                sellers: pendingSellers,
                products: pendingProducts,
                orders: pendingOrders,
                reviews: pendingReviews,
                total: pendingSellers + pendingProducts + pendingOrders + pendingReviews
            }
        });
    } catch (error) {
        console.error('Get pending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get pending items',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/revenue
// @desc    Get revenue data for charts
// @access  Private (Admin)
router.get('/dashboard/revenue', async (req, res) => {
    try {
        const range = req.query.range || '30d';
        const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30;
        
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        // Get revenue data grouped by day/month
        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: { $in: ['delivered', 'processing', 'shipped'] }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: days <= 30 ? '%Y-%m-%d' : '%Y-%m',
                            date: '$createdAt'
                        }
                    },
                    total: { $sum: '$total' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Calculate admin commission (2%)
        const labels = revenueData.map(item => item._id);
        const values = revenueData.map(item => Math.round(item.total * 0.02));
        
        res.json({
            success: true,
            data: {
                labels,
                values
            }
        });
    } catch (error) {
        console.error('Get revenue data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get revenue data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/orders
// @desc    Get orders data for charts
// @access  Private (Admin)
router.get('/dashboard/orders', async (req, res) => {
    try {
        const range = req.query.range || '30d';
        const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30;
        
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const statusLabels = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'shipped': 'Đã giao',
            'delivered': 'Đã giao hàng',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy',
            'refunded': 'Hoàn trả'
        };
        
        const statusLabelsArray = ordersByStatus.map(item => statusLabels[item._id] || item._id);
        const statusValuesArray = ordersByStatus.map(item => item.count);
        
        res.json({
            success: true,
            data: {
                statusLabels: statusLabelsArray,
                statusValues: statusValuesArray
            }
        });
    } catch (error) {
        console.error('Get orders data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/dashboard/health
// @desc    Get system health status (real-time updates)
// @access  Private (Admin)
router.get('/dashboard/health', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const os = require('os');
        
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
        
        // Get system metrics
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);
        
        const cpuUsage = os.loadavg()[0].toFixed(2);
        const uptime = Math.floor(process.uptime());
        
        // Check collections
        const [usersCount, productsCount, ordersCount] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                database: {
                    status: dbStatus,
                    message: dbStatus === 'healthy' ? 'Kết nối tốt' : 'Lỗi kết nối',
                    collections: {
                        users: usersCount,
                        products: productsCount,
                        orders: ordersCount
                    }
                },
                api: {
                    status: 'healthy',
                    message: 'Hoạt động bình thường',
                    uptime: uptime
                },
                cache: {
                    status: 'healthy',
                    message: 'Redis hoạt động tốt'
                },
                system: {
                    memory: {
                        total: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                        used: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                        free: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                        usage: `${memoryUsage}%`
                    },
                    cpu: {
                        load: cpuUsage,
                        cores: os.cpus().length
                    },
                    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
                }
            }
        });
    } catch (error) {
        console.error('Get health error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get system health',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {};
        
        // Role filter - apply first
        if (req.query.role) {
            query.role = req.query.role;
        }
        
        // Status filter
        if (req.query.status) {
            if (req.query.status === 'active') {
                query.isActive = true;
            } else if (req.query.status === 'inactive') {
                query.isActive = false;
            } else if (req.query.status === 'pending') {
                // Pending sellers (not approved) - only for sellers
                query.role = 'seller'; // Override role to seller for pending status
                query['sellerProfile.isApproved'] = false;
                query.isActive = true;
            }
        } else {
            // Default: show active users only (if no status filter)
            query.isActive = true;
        }

        // Search filter - search in username, email, firstName, lastName
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            const searchOr = [
                { username: searchRegex },
                { email: searchRegex },
                { 'profile.firstName': searchRegex },
                { 'profile.lastName': searchRegex }
            ];
            
            // If query already has other conditions, use $and
            if (Object.keys(query).length > 0) {
                const baseConditions = { ...query };
                query.$and = [
                    baseConditions,
                    { $or: searchOr }
                ];
            } else {
                query.$or = searchOr;
            }
        }

        // Date range filter
        if (req.query.dateFrom || req.query.dateTo) {
            query.createdAt = {};
            if (req.query.dateFrom) {
                const dateFrom = new Date(req.query.dateFrom);
                dateFrom.setHours(0, 0, 0, 0);
                query.createdAt.$gte = dateFrom;
            }
            if (req.query.dateTo) {
                const dateTo = new Date(req.query.dateTo);
                dateTo.setHours(23, 59, 59, 999);
                query.createdAt.$lte = dateTo;
            }
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        console.log('Query params:', req.query);
        console.log('MongoDB query:', JSON.stringify(query, null, 2));

        const users = await User.find(query)
            .select('-password')
            .populate('sellerProfile.approvedBy', 'username')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments(query);
        
        console.log(`Found ${users.length} users, total: ${total}`);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin)
router.post('/users', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            profile: {
                firstName: firstName || '',
                lastName: lastName || '',
                phone: phone || ''
            },
            isActive: true,
            isEmailVerified: false
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private (Admin)
router.get('/users/:id', validateObjectId(), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('sellerProfile.approvedBy', 'username')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin)
router.put('/users/:id', validateObjectId(), async (req, res) => {
    try {
        const { username, email, firstName, lastName, phone, role, password } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (password) {
            const bcrypt = require('bcryptjs');
            user.password = await bcrypt.hash(password, 10);
        }

        // Update profile
        if (!user.profile) {
            user.profile = {};
        }
        if (firstName !== undefined) user.profile.firstName = firstName;
        if (lastName !== undefined) user.profile.lastName = lastName;
        if (phone !== undefined) user.profile.phone = phone;

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/users/:id/add-money
// @desc    Add money to user wallet
// @access  Private (Admin)
router.post('/users/:id/add-money', validateObjectId(), async (req, res) => {
    try {
        const { amount, note } = req.body;

        // Validate amount
        const amountNum = parseFloat(amount);
        if (!amountNum || isNaN(amountNum) || amountNum < 1000) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền phải lớn hơn hoặc bằng 1,000 VND'
            });
        }

        // Check admin user
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize wallet if not exists
        if (!user.wallet) {
            user.wallet = { balance: 0, currency: 'VND' };
        }

        // Get current balance from last transaction or wallet
        const lastTransaction = await Transaction.findOne({ user: user._id })
            .sort({ createdAt: -1 });
        
        const oldBalance = lastTransaction ? lastTransaction.balance : (user.wallet?.balance || 0);

        // Create transaction record (balance will be calculated by pre-save middleware)
        const adminUser = req.user;
        
        const description = note 
            ? `Admin đã cộng cho bạn số tiền ${amountNum.toLocaleString('vi-VN')} VND. ${note}`
            : `Admin đã cộng cho bạn số tiền ${amountNum.toLocaleString('vi-VN')} VND`;

        // Create transaction - pre-save middleware will calculate balance
        const transactionData = {
            user: user._id,
            type: 'deposit',
            amount: amountNum,
            description: description,
            status: 'completed'
        };

        // Add metadata if needed (optional field)
        if (note || adminUser._id) {
            transactionData.metadata = {};
            if (adminUser._id) {
                transactionData.metadata.addedBy = adminUser._id.toString();
            }
            if (note) {
                transactionData.metadata.adminNote = note;
            }
        }

        const transaction = new Transaction(transactionData);

        // Save transaction (pre-save middleware will calculate balance)
        await transaction.save();

        // Update user wallet balance to match transaction balance
        user.wallet.balance = transaction.balance;
        await user.save();

        res.json({
            success: true,
            message: 'Đã cộng tiền vào ví người dùng thành công',
            data: {
                user: user.toJSON(),
                transaction: transaction.toJSON(),
                oldBalance,
                newBalance: transaction.balance
            }
        });
    } catch (error) {
        console.error('Add money error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add money',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', validateObjectId(), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Soft delete by setting isActive to false
        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', validateObjectId(), async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/sellers/pending
// @desc    Get pending seller applications
// @access  Private (Admin)
router.get('/sellers/pending', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            role: 'seller',
            'sellerProfile.isApproved': false,
            isActive: true
        };

        const sellers = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                sellers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get pending sellers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get pending sellers',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/sellers/:id/approve
// @desc    Approve seller application
// @access  Private (Admin)
router.put('/sellers/:id/approve', validateObjectId(), async (req, res) => {
    try {
        const { approved, note } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        if (user.role !== 'seller') {
            return res.status(400).json({
                success: false,
                message: 'User is not a seller'
            });
        }

        user.sellerProfile.isApproved = approved;
        user.sellerProfile.approvedAt = new Date();
        user.sellerProfile.approvedBy = req.user._id;

        if (note) {
            user.sellerProfile.note = note;
        }

        await user.save();

        res.json({
            success: true,
            message: `Seller application ${approved ? 'approved' : 'rejected'} successfully`,
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        console.error('Approve seller error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve seller',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin
// @access  Private (Admin)
router.get('/products', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {};
        
        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Active filter
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Seller filter
        if (req.query.seller) {
            query.seller = req.query.seller;
        }

        // Price range filter
        if (req.query.priceFrom || req.query.priceTo) {
            query.price = {};
            if (req.query.priceFrom) {
                query.price.$gte = parseFloat(req.query.priceFrom);
            }
            if (req.query.priceTo) {
                query.price.$lte = parseFloat(req.query.priceTo);
            }
        }

        // Search filter - search in title, author, ISBN
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            const searchConditions = {
                $or: [
                    { title: searchRegex },
                    { author: searchRegex },
                    { isbn: searchRegex }
                ]
            };
            
            // Combine search with existing query using $and
            if (Object.keys(query).length > 0) {
                const baseQuery = { ...query };
                query.$and = [
                    baseQuery,
                    searchConditions
                ];
            } else {
                Object.assign(query, searchConditions);
            }
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        console.log('Products query:', JSON.stringify(query, null, 2));

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('seller', 'username profile.firstName profile.lastName sellerProfile.businessName')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(query);

        console.log(`Found ${products.length} products, total: ${total}`);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get products',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/products/:id
// @desc    Get product by ID
// @access  Private (Admin)
router.get('/products/:id', validateObjectId(), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('seller', 'username profile.firstName profile.lastName sellerProfile.businessName')
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                product
            }
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get product',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/products/:id/approve
// @desc    Approve product
// @access  Private (Admin)
router.put('/products/:id/approve', validateObjectId(), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.status = 'approved';
        product.approvedAt = new Date();
        product.approvedBy = req.user._id;

        await product.save();

        res.json({
            success: true,
            message: 'Product approved successfully',
            data: {
                product: product.toJSON()
            }
        });
    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve product',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/products/:id/reject
// @desc    Reject product
// @access  Private (Admin)
router.put('/products/:id/reject', validateObjectId(), async (req, res) => {
    try {
        const { reason } = req.body;
        
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.status = 'rejected';
        product.rejectedAt = new Date();
        product.rejectedBy = req.user._id;
        
        if (reason) {
            product.rejectionReason = reason;
        }

        await product.save();

        res.json({
            success: true,
            message: 'Product rejected successfully',
            data: {
                product: product.toJSON()
            }
        });
    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject product',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/products/:id/status
// @desc    Update product status
// @access  Private (Admin)
router.put('/products/:id/status', validateObjectId(), async (req, res) => {
    try {
        const { status, isActive } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (status !== undefined) {
            product.status = status;
        }
        
        if (isActive !== undefined) {
            product.isActive = isActive;
        }

        await product.save();

        res.json({
            success: true,
            message: 'Product status updated successfully',
            data: {
                product: product.toJSON()
            }
        });
    } catch (error) {
        console.error('Update product status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Private (Admin)
router.get('/orders', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {};
        
        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Payment method filter
        if (req.query.paymentMethod) {
            query['payment.method'] = req.query.paymentMethod;
        }

        // Date range filter
        if (req.query.dateFrom) {
            query.createdAt = { $gte: new Date(req.query.dateFrom) };
        }
        if (req.query.dateTo) {
            if (!query.createdAt) query.createdAt = {};
            query.createdAt.$lte = new Date(req.query.dateTo);
        }

        // Search filter - search in orderNumber or customer
        if (req.query.search) {
            const searchTerm = req.query.search;
            const searchRegex = { $regex: searchTerm, $options: 'i' };
            
            // Try to find customers matching search
            const matchingCustomers = await User.find({
                $or: [
                    { username: searchRegex },
                    { email: searchRegex },
                    { 'profile.firstName': searchRegex },
                    { 'profile.lastName': searchRegex }
                ]
            }).select('_id').lean();
            
            const customerIds = matchingCustomers.map(c => c._id);
            
            // Search in orderNumber or customer IDs
            query.$or = [
                { orderNumber: searchRegex }
            ];
            
            if (customerIds.length > 0) {
                query.$or.push({ customer: { $in: customerIds } });
            }
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        console.log('Orders query:', JSON.stringify(query, null, 2));

        const orders = await Order.find(query)
            .populate('customer', 'username email profile.firstName profile.lastName')
            .populate('items.product', 'title author images price')
            .populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments(query);

        console.log(`Found ${orders.length} orders, total: ${total}`);

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
        console.error('Get admin orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/orders/:id
// @desc    Get order by ID
// @access  Private (Admin)
router.get('/orders/:id', validateObjectId(), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'username email profile.firstName profile.lastName profile.phone')
            .populate('items.product', 'title author images price isbn')
            .populate('items.seller', 'username profile.firstName profile.lastName sellerProfile.businessName')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: {
                order
            }
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

// @route   GET /api/admin/categories
// @desc    Get all categories with stats
// @access  Private (Admin)
router.get('/categories', async (req, res) => {
    try {
        // Get all categories
        const categories = await Category.find()
            .sort({ sortOrder: 1, name: 1 })
            .lean();

        // Get product counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({
                    category: category._id,
                    isActive: true
                });
                return {
                    ...category,
                    productCount
                };
            })
        );

        // Calculate stats
        const totalCategories = categories.length;
        const activeCategories = categories.filter(cat => cat.isActive).length;
        const totalProducts = await Product.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                categories: categoriesWithCounts,
                stats: {
                    totalCategories,
                    activeCategories,
                    totalProducts
                }
            }
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get categories',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private (Admin)
router.post('/categories', validateCategory, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: {
                category: category.toJSON()
            }
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Category creation failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/categories/:id', validateObjectId(), validateCategory, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: {
                category: category.toJSON()
            }
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Category update failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/categories/:id', validateObjectId(), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ category: category._id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with products. Please move or delete products first.'
            });
        }

        // Check if category has subcategories
        const subcategoryCount = await Category.countDocuments({ parent: category._id });
        if (subcategoryCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories. Please delete subcategories first.'
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Category deletion failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/payments/withdrawals
// @desc    Get withdrawal requests from sellers
// @access  Private (Admin)
router.get('/payments/withdrawals', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {
            type: 'withdrawal',
            ...(req.query.status && { status: req.query.status })
        };

        // Search filter
        if (req.query.search) {
            query.$or = [
                { transactionId: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (req.query.dateFrom || req.query.dateTo) {
            query.createdAt = {};
            if (req.query.dateFrom) {
                query.createdAt.$gte = new Date(req.query.dateFrom);
            }
            if (req.query.dateTo) {
                const toDate = new Date(req.query.dateTo);
                toDate.setHours(23, 59, 59, 999);
                query.createdAt.$lte = toDate;
            }
        }

        const [withdrawals, total] = await Promise.all([
            Payment.find(query)
                .populate('user', 'username email profile.firstName profile.lastName')
                .populate('seller', 'username email profile.firstName profile.lastName sellerProfile.businessName')
                .populate('approvedBy', 'username')
                .sort({ [sort]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments(query)
        ]);

        // Calculate stats
        const stats = {
            total: await Payment.countDocuments({ type: 'withdrawal' }),
            pending: await Payment.countDocuments({ type: 'withdrawal', status: 'pending' }),
            completed: await Payment.countDocuments({ type: 'withdrawal', status: 'completed' }),
            failed: await Payment.countDocuments({ type: 'withdrawal', status: 'failed' }),
            totalAmount: await Payment.aggregate([
                { $match: { type: 'withdrawal', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(result => result[0]?.total || 0)
        };

        res.json({
            success: true,
            data: {
                withdrawals,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats
            }
        });
    } catch (error) {
        console.error('Get withdrawals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get withdrawal requests',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/payments/transactions
// @desc    Get all transactions (payments, deposits, etc.) - Exclude pending and zero amount
// @access  Private (Admin)
router.get('/payments/transactions', validateQuery, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const query = {
            // Exclude pending transactions and zero amount
            status: { $ne: 'pending' },
            amount: { $gt: 0 }
        };

        // Type filter
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Status filter - always exclude pending
        if (req.query.status && req.query.status !== 'pending') {
            query.status = req.query.status;
        }
        // Note: pending transactions are always excluded (already set above)

        // Method filter
        if (req.query.method) {
            query.method = req.query.method;
        }

        // Search filter
        if (req.query.search) {
            query.$or = [
                { transactionId: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (req.query.dateFrom || req.query.dateTo) {
            query.createdAt = {};
            if (req.query.dateFrom) {
                query.createdAt.$gte = new Date(req.query.dateFrom);
            }
            if (req.query.dateTo) {
                const toDate = new Date(req.query.dateTo);
                toDate.setHours(23, 59, 59, 999);
                query.createdAt.$lte = toDate;
            }
        }

        const [transactions, total] = await Promise.all([
            Payment.find(query)
                .populate('user', 'username email profile.firstName profile.lastName')
                .populate('seller', 'username email profile.firstName profile.lastName sellerProfile.businessName')
                .populate('approvedBy', 'username')
                .sort({ [sort]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments(query)
        ]);

        // Calculate stats - only count completed transactions with amount > 0
        const stats = {
            totalRevenue: await Payment.aggregate([
                { $match: { type: 'deposit', status: 'completed', amount: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(result => result[0]?.total || 0),
            successPayments: await Payment.countDocuments({ status: 'completed', amount: { $gt: 0 } }),
            pendingPayments: await Payment.countDocuments({ status: 'pending' }),
            failedPayments: await Payment.countDocuments({ status: 'failed', amount: { $gt: 0 } })
        };

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get transactions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json({
            success: true,
            data: {
                settings: settings.toJSON()
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove sensitive fields that shouldn't be updated directly
        delete updates._id;
        delete updates.__v;
        delete updates.createdAt;
        delete updates.updatedAt;
        
        // Handle metaKeywords if it's a string
        if (updates.metaKeywords && typeof updates.metaKeywords === 'string') {
            updates.metaKeywords = updates.metaKeywords.split(',').map(k => k.trim()).filter(k => k);
        }
        
        const settings = await Settings.updateSettings(updates);
        
        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: {
                settings: settings.toJSON()
            }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/settings/reset
// @desc    Reset settings to default
// @access  Private (Admin)
router.post('/settings/reset', async (req, res) => {
    try {
        await Settings.deleteMany({});
        const settings = await Settings.getSettings();
        
        res.json({
            success: true,
            message: 'Settings reset to default',
            data: {
                settings: settings.toJSON()
            }
        });
    } catch (error) {
        console.error('Reset settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/settings/test-email
// @desc    Test email connection
// @access  Private (Admin)
router.post('/settings/test-email', async (req, res) => {
    try {
        // TODO: Implement email test
        res.json({
            success: true,
            message: 'Email test functionality will be implemented'
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test email',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/admin/settings/clear-cache
// @desc    Clear system cache
// @access  Private (Admin)
router.post('/settings/clear-cache', async (req, res) => {
    try {
        // TODO: Implement cache clearing
        res.json({
            success: true,
            message: 'Cache cleared successfully'
        });
    } catch (error) {
        console.error('Clear cache error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cache',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;

