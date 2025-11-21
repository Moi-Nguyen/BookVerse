const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    profile: {
                        firstName: user.profile?.firstName || '',
                        lastName: user.profile?.lastName || '',
                        phone: user.profile?.phone || '',
                        birthDate: user.profile?.birthDate || '',
                        gender: user.profile?.gender || '',
                        bio: user.profile?.bio || '',
                        avatar: user.profile?.avatar || '',
                        address: user.profile?.address || {}
                    },
                    sellerProfile: user.sellerProfile || {},
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, phone, birthDate, gender, bio, address } = req.body;
        
        console.log('📝 Updating profile for user:', req.user._id);
        console.log('📝 Request body:', req.body);
        
        // Build update data object - only include fields that are provided
        const updateData = {};
        
        if (firstName !== undefined) updateData['profile.firstName'] = firstName;
        if (lastName !== undefined) updateData['profile.lastName'] = lastName;
        if (phone !== undefined) {
            // Only update phone if it's not empty, or set to null if empty
            updateData['profile.phone'] = phone && phone.trim() !== '' ? phone.trim() : null;
        }
        if (birthDate !== undefined) updateData['profile.birthDate'] = birthDate;
        if (gender !== undefined) updateData['profile.gender'] = gender;
        if (bio !== undefined) updateData['profile.bio'] = bio;

        // Handle address - update nested fields individually
        if (address && typeof address === 'object') {
            if (address.street !== undefined) updateData['profile.address.street'] = address.street;
            if (address.city !== undefined) updateData['profile.address.city'] = address.city;
            if (address.state !== undefined) updateData['profile.address.state'] = address.state;
            if (address.zipCode !== undefined) updateData['profile.address.zipCode'] = address.zipCode;
            if (address.country !== undefined) updateData['profile.address.country'] = address.country;
        } else if (address && typeof address === 'string') {
            // Legacy support: if address is a string, set it as city
            updateData['profile.address.city'] = address;
            updateData['profile.address.country'] = 'Vietnam';
        }

        console.log('📝 Update data:', updateData);

        // Ensure profile object exists
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: false } // Set runValidators to false to avoid phone validation issues
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Profile updated successfully');

        res.json({
            success: true,
            data: {
                user: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    isActive: updatedUser.isActive,
                    profile: {
                        firstName: updatedUser.profile?.firstName || '',
                        lastName: updatedUser.profile?.lastName || '',
                        phone: updatedUser.profile?.phone || '',
                        birthDate: updatedUser.profile?.birthDate || '',
                        gender: updatedUser.profile?.gender || '',
                        bio: updatedUser.profile?.bio || '',
                        avatar: updatedUser.profile?.avatar || '',
                        address: updatedUser.profile?.address || {}
                    },
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt
                }
            }
        });
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
    try {
        // This would typically aggregate data from orders, reviews, etc.
        // For now, return mock data
        const stats = {
            totalOrders: 0,
            totalWishlist: 0,
            totalReviews: 0,
            memberSince: new Date().getFullYear()
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update seller profile
router.put('/seller/profile', auth, async (req, res) => {
    try {
        const { businessName, businessType, businessLicense, taxId, description } = req.body;
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Ensure sellerProfile exists
        if (!user.sellerProfile) {
            user.sellerProfile = {};
        }
        
        const updateData = {};
        if (businessName !== undefined) updateData['sellerProfile.businessName'] = businessName;
        if (businessType !== undefined) updateData['sellerProfile.businessType'] = businessType;
        if (businessLicense !== undefined) updateData['sellerProfile.businessLicense'] = businessLicense;
        if (taxId !== undefined) updateData['sellerProfile.taxId'] = taxId;
        if (description !== undefined) updateData['sellerProfile.description'] = description;
        
        await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        const updatedUser = await User.findById(req.user._id).select('-password');
        
        res.json({
            success: true,
            message: 'Seller profile updated successfully',
            data: {
                sellerProfile: updatedUser.sellerProfile || {}
            }
        });
    } catch (error) {
        console.error('Error updating seller profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating seller profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Change password
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }
        
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Upload avatar
router.post('/avatar', auth, async (req, res) => {
    try {
        // This would typically handle file upload
        // For now, return mock response
        const avatarUrl = 'https://via.placeholder.com/150x150?text=Avatar';
        
        await User.findByIdAndUpdate(req.user._id, {
            'profile.avatar': avatarUrl
        });

        res.json({
            success: true,
            data: {
                avatarUrl: avatarUrl
            }
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
    try {
        const { emailNotifications, smsNotifications, marketingEmails, theme, language } = req.body;
        
        const updateData = {
            'preferences.emailNotifications': emailNotifications,
            'preferences.smsNotifications': smsNotifications,
            'preferences.marketingEmails': marketingEmails,
            'preferences.theme': theme,
            'preferences.language': language
        };

        await User.findByIdAndUpdate(req.user._id, {
            $set: updateData
        });

        res.json({
            success: true,
            message: 'Preferences updated successfully'
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/sellers
// @desc    Get top sellers
// @access  Public
router.get('/sellers', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const searchTerm = (req.query.search || '').trim();
        const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchFilter = searchTerm ? {
            $or: [
                { username: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                { email: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                { 'profile.firstName': { $regex: escapeRegex(searchTerm), $options: 'i' } },
                { 'profile.lastName': { $regex: escapeRegex(searchTerm), $options: 'i' } },
                { 'sellerProfile.businessName': { $regex: escapeRegex(searchTerm), $options: 'i' } }
            ]
        } : null;
        
        const sellers = await User.find({ 
            role: 'seller',
            isActive: true,
            'sellerProfile.isApproved': true,
            ...(searchFilter || {})
        })
        .select('username email profile sellerProfile createdAt')
        .sort({ createdAt: -1 })
        .limit(limit);

        // Calculate stats for each seller
        const sellersWithStats = await Promise.all(sellers.map(async (seller) => {
            // Count total products for this seller
            const totalProducts = await Product.countDocuments({ 
                seller: seller._id,
                status: 'approved',
                isActive: true
            });

            // Calculate average rating from product reviews
            const sellerProducts = await Product.find({ 
                seller: seller._id,
                status: 'approved',
                isActive: true
            }).select('_id');
            const productIds = sellerProducts.map(p => p._id);
            
            let avgRating = 0;
            if (productIds.length > 0) {
                const reviews = await Review.find({ product: { $in: productIds } });
                if (reviews.length > 0) {
                    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                    avgRating = totalRating / reviews.length;
                }
            }

            // Calculate total orders and revenue from Order model
            const orders = await Order.find({
                'items.seller': seller._id,
                status: { $in: ['delivered', 'completed'] }
            });

            let totalOrders = 0;
            let totalRevenue = 0;

            if (orders.length > 0) {
                // Count unique orders (each order can have multiple items from this seller)
                const uniqueOrderIds = new Set(orders.map(o => o._id.toString()));
                totalOrders = uniqueOrderIds.size;

                // Calculate total revenue from seller's items in orders
                orders.forEach(order => {
                    const sellerItems = order.items.filter(item => 
                        item.seller && item.seller.toString() === seller._id.toString()
                    );
                    
                    const orderRevenue = sellerItems.reduce((sum, item) => 
                        sum + (item.price * item.quantity), 0
                    );
                    
                    totalRevenue += orderRevenue;
                });
            }

            // Convert to plain object and add stats
            const sellerObj = seller.toObject();
            sellerObj.sellerProfile = sellerObj.sellerProfile || {};
            sellerObj.sellerProfile.totalProducts = totalProducts;
            sellerObj.sellerProfile.rating = avgRating;
            sellerObj.sellerProfile.totalOrders = totalOrders;
            sellerObj.sellerProfile.totalRevenue = totalRevenue;

            return sellerObj;
        }));

        // Sort by rating (highest first)
        sellersWithStats.sort((a, b) => {
            const ratingA = a.sellerProfile?.rating || 0;
            const ratingB = b.sellerProfile?.rating || 0;
            return ratingB - ratingA;
        });

        res.json({
            success: true,
            data: {
                sellers: sellersWithStats
            }
        });
    } catch (error) {
        console.error('Get sellers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get sellers',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const sortParam = req.query.sort || '-createdAt';
        
        // Build query
        const query = { user: req.user._id };
        
        // Search filter
        if (req.query.search) {
            const products = await Product.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { author: { $regex: req.query.search, $options: 'i' } }
                ]
            }).select('_id');
            const productIds = products.map(p => p._id);
            if (productIds.length > 0) {
                query.product = { $in: productIds };
            } else {
                // No products match search, return empty
                return res.json({
                    success: true,
                    data: {
                        items: [],
                        pagination: {
                            page,
                            limit,
                            total: 0,
                            pages: 0
                        }
                    }
                });
            }
        }
        
        // Category filter
        if (req.query.category) {
            const products = await Product.find({ category: req.query.category }).select('_id');
            const productIds = products.map(p => p._id);
            if (productIds.length > 0) {
                if (query.product) {
                    query.product = { $in: productIds.filter(id => query.product.$in.includes(id)) };
                } else {
                    query.product = { $in: productIds };
                }
            } else {
                // No products in category, return empty
                return res.json({
                    success: true,
                    data: {
                        items: [],
                        pagination: {
                            page,
                            limit,
                            total: 0,
                            pages: 0
                        }
                    }
                });
            }
        }
        
        // Get wishlist items with populated product
        let wishlistItems = await Wishlist.find(query)
            .populate({
                path: 'product',
                populate: {
                    path: 'seller',
                    select: 'username profile'
                }
            })
            .skip(skip)
            .limit(limit);
        
        // Filter out items with deleted products
        wishlistItems = wishlistItems.filter(item => item.product !== null);
        
        // Handle sorting
        if (sortParam === 'price-low') {
            wishlistItems.sort((a, b) => (a.product?.price || 0) - (b.product?.price || 0));
        } else if (sortParam === 'price-high') {
            wishlistItems.sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));
        } else if (sortParam === 'title') {
            wishlistItems.sort((a, b) => (a.product?.title || '').localeCompare(b.product?.title || ''));
        } else if (sortParam === 'createdAt') {
            wishlistItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortParam === '-createdAt') {
            wishlistItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        const validItems = wishlistItems;
        
        // Get total count
        const total = await Wishlist.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                items: validItems,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/users/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            user: req.user._id,
            product: productId
        });
        
        if (existing) {
            return res.json({
                success: true,
                message: 'Product already in wishlist',
                data: { item: existing }
            });
        }
        
        // Add to wishlist
        const wishlistItem = await Wishlist.create({
            user: req.user._id,
            product: productId
        });
        
        await wishlistItem.populate({
            path: 'product',
            populate: {
                path: 'seller',
                select: 'username profile'
            }
        });
        
        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            data: { item: wishlistItem }
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to add to wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/users/wishlist/:itemId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:itemId', auth, async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const wishlistItem = await Wishlist.findOne({
            _id: itemId,
            user: req.user._id
        });
        
        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist item not found'
            });
        }
        
        await Wishlist.findByIdAndDelete(itemId);
        
        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/users/wishlist/batch
// @desc    Remove multiple products from wishlist
// @access  Private
router.delete('/wishlist/batch', auth, async (req, res) => {
    try {
        const { itemIds } = req.body;
        
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Item IDs array is required'
            });
        }
        
        const result = await Wishlist.deleteMany({
            _id: { $in: itemIds },
            user: req.user._id
        });
        
        res.json({
            success: true,
            message: `${result.deletedCount} product(s) removed from wishlist`,
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error('Batch remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/users/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/wishlist', auth, async (req, res) => {
    try {
        const result = await Wishlist.deleteMany({ user: req.user._id });
        
        res.json({
            success: true,
            message: 'Wishlist cleared',
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear wishlist',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;