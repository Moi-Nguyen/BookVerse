const express = require('express');
const router = express.Router();
const { auth, seller } = require('../middlewares/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Apply auth and seller middleware to all routes
router.use(auth, seller);

// @route   GET /api/seller/dashboard
// @desc    Get seller dashboard statistics
// @access  Private (Seller)
router.get('/dashboard', async (req, res) => {
    try {
        const sellerId = req.user._id;
        
        // Calculate date ranges for growth comparison
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        
        // Get total products (current)
        const totalProducts = await Product.countDocuments({ 
            seller: sellerId 
        });
        
        // Get products from last period (30-60 days ago)
        const productsLastPeriod = await Product.countDocuments({
            seller: sellerId,
            createdAt: { $lt: thirtyDaysAgo }
        });
        
        // Get active products
        const activeProducts = await Product.countDocuments({ 
            seller: sellerId,
            isActive: true,
            status: 'approved'
        });
        
        // Get pending products
        const pendingProducts = await Product.countDocuments({ 
            seller: sellerId,
            status: 'pending'
        });
        
        // Get orders from last 30 days
        const orders = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        // Get orders from previous 30 days (30-60 days ago)
        const ordersLastPeriod = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });
        
        const totalOrders = orders.length;
        const totalOrdersLastPeriod = ordersLastPeriod.length;
        
        // Calculate revenue for current period
        let totalRevenue = 0;
        let pendingRevenue = 0;
        let completedOrders = 0;
        let pendingOrders = 0;
        
        let totalProductsSold = 0;
        
        orders.forEach(order => {
            // Calculate seller's portion from this order
            const sellerItems = order.items.filter(item => 
                item.seller && item.seller.toString() === sellerId.toString()
            );
            
            const orderRevenue = sellerItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            
            // Calculate total products sold (quantity)
            const orderProductsSold = sellerItems.reduce((sum, item) => 
                sum + (item.quantity || 0), 0
            );
            
            totalRevenue += orderRevenue;
            totalProductsSold += orderProductsSold;
            
            if (order.status === 'delivered' || order.status === 'completed') {
                completedOrders++;
            } else if (order.status === 'pending' || order.status === 'processing') {
                pendingOrders++;
                pendingRevenue += orderRevenue;
            }
        });
        
        // Calculate revenue and products sold for last period
        let revenueLastPeriod = 0;
        let productsSoldLastPeriod = 0;
        
        ordersLastPeriod.forEach(order => {
            const sellerItems = order.items.filter(item => 
                item.seller && item.seller.toString() === sellerId.toString()
            );
            const orderRevenue = sellerItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            const orderProductsSold = sellerItems.reduce((sum, item) => 
                sum + (item.quantity || 0), 0
            );
            revenueLastPeriod += orderRevenue;
            productsSoldLastPeriod += orderProductsSold;
        });
        
        // Get recent orders (last 5)
        const recentOrders = await Order.find({
            'items.seller': sellerId
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'username email profile')
        .lean();
        
        // Format recent orders for frontend
        const formattedOrders = recentOrders.map(order => {
            const sellerItems = order.items.filter(item => 
                item.seller && item.seller.toString() === sellerId.toString()
            );
            
            const orderTotal = sellerItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            
            return {
                _id: order._id,
                orderNumber: order.orderNumber,
                customer: order.customer,
                items: sellerItems,
                total: orderTotal,
                status: order.status,
                createdAt: order.createdAt
            };
        });
        
        // Get low stock products
        const lowStockProducts = await Product.find({
            seller: sellerId,
            stock: { $lt: 10, $gt: 0 },
            isActive: true
        })
        .select('title stock price images')
        .limit(5);
        
        // Get out of stock products
        const outOfStockCount = await Product.countDocuments({
            seller: sellerId,
            stock: 0
        });
        
        // Get top selling products (based on order items)
        const topProducts = await Product.find({
            seller: sellerId,
            isActive: true
        })
        .sort({ sales: -1 })
        .limit(5)
        .select('title author price images stock sales _id')
        .lean();
        
        // Calculate quick stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const todayOrders = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: today }
        });
        
        const weekOrders = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: weekAgo }
        });
        
        const monthOrders = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: monthAgo }
        });
        
        const calculateRevenue = (orders) => {
            return orders.reduce((total, order) => {
                const sellerItems = order.items.filter(item => 
                    item.seller && item.seller.toString() === sellerId.toString()
                );
                return total + sellerItems.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0
                );
            }, 0);
        };
        
        const todaySales = calculateRevenue(todayOrders);
        const weekSales = calculateRevenue(weekOrders);
        const monthSales = calculateRevenue(monthOrders);
        
        // Get sales chart data (last 30 days by default, or from query param, or custom date range)
        let startDate, endDate;
        if (req.query.startDate && req.query.endDate) {
            startDate = new Date(req.query.startDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999);
        } else {
            const period = parseInt(req.query.period) || 30;
            endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date();
            startDate.setDate(startDate.getDate() - period);
            startDate.setHours(0, 0, 0, 0);
        }
        
        const salesChartData = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const date = new Date(currentDate);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dayOrders = await Order.find({
                'items.seller': sellerId,
                createdAt: { $gte: date, $lt: nextDate }
            }).populate('customer', '_id');
            
            const dayRevenue = calculateRevenue(dayOrders);
            const uniqueCustomers = new Set(dayOrders.map(o => o.customer?._id?.toString()).filter(Boolean));
            const totalProducts = dayOrders.reduce((sum, order) => {
                const sellerItems = order.items.filter(item => 
                    item.seller && item.seller.toString() === sellerId.toString()
                );
                return sum + sellerItems.reduce((s, item) => s + item.quantity, 0);
            }, 0);
            
            salesChartData.push({
                date: date.toISOString().split('T')[0],
                revenue: dayRevenue,
                orders: dayOrders.length,
                products: totalProducts,
                customers: uniqueCustomers.size
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Get category statistics
        const categoryStats = await Order.aggregate([
            {
                $match: {
                    'items.seller': sellerId,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $unwind: '$items' },
            {
                $match: {
                    'items.seller': sellerId
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: '$productData' },
            {
                $group: {
                    _id: '$productData.category',
                    revenue: {
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            { $unwind: '$categoryData' },
            {
                $project: {
                    category: '$categoryData.name',
                    revenue: 1
                }
            },
            { $sort: { revenue: -1 } }
        ]);
        
        // Get order status statistics
        const orderStatusStats = await Order.aggregate([
            {
                $match: {
                    'items.seller': sellerId,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const orderStatusMap = {};
        orderStatusStats.forEach(stat => {
            orderStatusMap[stat._id] = stat.count;
        });
        
        // Get unique customers count
        const uniqueCustomers = await Order.distinct('customer', {
            'items.seller': sellerId,
            createdAt: { $gte: startDate, $lte: endDate }
        });
        
        const totalCustomers = uniqueCustomers.length;
        
        // Calculate previous period for comparison
        const periodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - periodDays);
        const previousEndDate = new Date(startDate);
        
        const previousOrders = await Order.find({
            'items.seller': sellerId,
            createdAt: { $gte: previousStartDate, $lt: previousEndDate }
        });
        
        const previousRevenue = calculateRevenue(previousOrders);
        const previousCustomers = await Order.distinct('customer', {
            'items.seller': sellerId,
            createdAt: { $gte: previousStartDate, $lt: previousEndDate }
        });
        
        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        
        const customersGrowth = calculateGrowth(totalCustomers, previousCustomers.length);
        
        const productsGrowth = calculateGrowth(totalProducts, productsLastPeriod);
        const productsSoldGrowth = calculateGrowth(totalProductsSold, productsSoldLastPeriod);
        const ordersGrowth = calculateGrowth(totalOrders, totalOrdersLastPeriod);
        const revenueGrowth = calculateGrowth(totalRevenue, revenueLastPeriod);
        const pendingOrdersGrowth = calculateGrowth(pendingOrders, 
            ordersLastPeriod.filter(o => o.status === 'pending' || o.status === 'processing').length
        );
        
        res.json({
            success: true,
            data: {
                stats: {
                    totalProducts,
                    activeProducts,
                    pendingProducts,
                    totalOrders,
                    completedOrders,
                    pendingOrders,
                    totalRevenue,
                    pendingRevenue,
                    outOfStockCount,
                    totalCustomers,
                    totalProductsSold
                },
                growth: {
                    products: productsGrowth,
                    productsSold: productsSoldGrowth,
                    orders: ordersGrowth,
                    revenue: revenueGrowth,
                    pendingOrders: pendingOrdersGrowth,
                    customers: customersGrowth
                },
                quickStats: {
                    todaySales,
                    weekSales,
                    monthSales
                },
                recentOrders: formattedOrders,
                lowStockProducts,
                topProducts,
                salesChartData,
                categoryStats: categoryStats.map(cat => ({
                    category: cat.category,
                    revenue: cat.revenue
                })),
                orderStatusStats: orderStatusMap
            }
        });
    } catch (error) {
        console.error('Get seller dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;

