const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

// GET /api/forum/posts - Get all posts with filters
router.get('/posts', async (req, res) => {
    try {
        const {
            category,
            role,
            search,
            page = 1,
            limit = 20,
            sort = 'newest'
        } = req.query;

        const query = {
            isDeleted: false,
            status: 'approved'
        };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by author role
        if (role && role !== 'all') {
            const usersWithRole = await User.find({ role }).select('_id');
            query.author = { $in: usersWithRole.map(u => u._id) };
        }

        // Search
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Sort
        let sortOption = { createdAt: -1 };
        if (sort === 'popular') {
            sortOption = { likesCount: -1, createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find(query)
            .populate('author', 'username profile role')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Format posts
        const formattedPosts = posts.map(post => ({
            id: post._id,
            author: post.author?.profile?.firstName && post.author?.profile?.lastName
                ? `${post.author.profile.firstName} ${post.author.profile.lastName}`.trim()
                : post.author?.username || 'Người dùng',
            role: post.author?.role || 'user',
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags || [],
            likes: post.likesCount || 0,
            createdAt: post.createdAt,
            comments: [] // Will be loaded separately if needed
        }));

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            data: formattedPosts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải bài viết',
            error: error.message
        });
    }
});

// GET /api/forum/posts/:id - Get single post with comments
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            isDeleted: false,
            status: 'approved'
        })
            .populate('author', 'username profile role')
            .lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        // Get comments
        const comments = await Comment.find({
            post: post._id,
            isDeleted: false
        })
            .populate('author', 'username profile role')
            .sort({ createdAt: 1 })
            .lean();

        const formattedComments = comments.map(comment => ({
            author: comment.author?.profile?.firstName && comment.author?.profile?.lastName
                ? `${comment.author.profile.firstName} ${comment.author.profile.lastName}`.trim()
                : comment.author?.username || 'Người dùng',
            role: comment.author?.role || 'user',
            content: comment.content,
            createdAt: comment.createdAt
        }));

        res.json({
            success: true,
            data: {
                id: post._id,
                author: post.author?.profile?.firstName && post.author?.profile?.lastName
                    ? `${post.author.profile.firstName} ${post.author.profile.lastName}`.trim()
                    : post.author?.username || 'Người dùng',
                role: post.author?.role || 'user',
                title: post.title,
                content: post.content,
                category: post.category,
                tags: post.tags || [],
                likes: post.likesCount || 0,
                createdAt: post.createdAt,
                comments: formattedComments
            }
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải bài viết',
            error: error.message
        });
    }
});

// POST /api/forum/posts - Create new post (requires auth)
router.post('/posts', auth, async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề và nội dung là bắt buộc'
            });
        }

        const post = new Post({
            author: req.user._id,
            title: title.trim(),
            content: content.trim(),
            category: category || 'discussion',
            tags: tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [],
            status: 'approved' // Auto-approve for now
        });

        await post.save();
        await post.populate('author', 'username profile role');

        res.status(201).json({
            success: true,
            message: 'Đăng bài thành công',
            data: {
                id: post._id,
                author: post.author?.profile?.firstName && post.author?.profile?.lastName
                    ? `${post.author.profile.firstName} ${post.author.profile.lastName}`.trim()
                    : post.author?.username || 'Người dùng',
                role: post.author?.role || 'user',
                title: post.title,
                content: post.content,
                category: post.category,
                tags: post.tags || [],
                likes: 0,
                createdAt: post.createdAt,
                comments: []
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng bài',
            error: error.message
        });
    }
});

// POST /api/forum/posts/:id/like - Like/unlike post (requires auth)
router.post('/posts/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        const userId = req.user._id;
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => !id.equals(userId));
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            liked: !isLiked,
            likesCount: post.likesCount
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thích bài viết',
            error: error.message
        });
    }
});

// POST /api/forum/posts/:id/comments - Add comment (requires auth)
router.post('/posts/:id/comments', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nội dung bình luận là bắt buộc'
            });
        }

        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        const comment = new Comment({
            post: post._id,
            author: req.user._id,
            content: content.trim()
        });

        await comment.save();
        await comment.populate('author', 'username profile role');

        // Update post comments count
        post.commentsCount = (post.commentsCount || 0) + 1;
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Bình luận thành công',
            data: {
                author: comment.author?.profile?.firstName && comment.author?.profile?.lastName
                    ? `${comment.author.profile.firstName} ${comment.author.profile.lastName}`.trim()
                    : comment.author?.username || 'Người dùng',
                role: comment.author?.role || 'user',
                content: comment.content,
                createdAt: comment.createdAt
            }
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi bình luận',
            error: error.message
        });
    }
});

// GET /api/forum/stats - Get forum statistics
router.get('/stats', async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments({ isDeleted: false, status: 'approved' });
        const totalComments = await Comment.countDocuments({ isDeleted: false });
        const activeUsers = await User.countDocuments({ role: { $in: ['user', 'seller'] } });

        res.json({
            success: true,
            data: {
                posts: totalPosts,
                comments: totalComments,
                members: activeUsers
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải thống kê',
            error: error.message
        });
    }
});

// GET /api/forum/moderators - Get list of moderators/admins
router.get('/moderators', async (req, res) => {
    try {
        const moderators = await User.find({
            role: { $in: ['admin', 'seller'] },
            isActive: true
        })
            .select('username profile role')
            .limit(10)
            .lean();

        const formatted = moderators.map(mod => ({
            name: mod.profile?.firstName && mod.profile?.lastName
                ? `${mod.profile.firstName} ${mod.profile.lastName}`.trim()
                : mod.username || 'Người dùng',
            role: mod.role,
            roleLabel: mod.role === 'admin' 
                ? 'Admin & Trưởng nhóm cộng đồng'
                : mod.role === 'seller'
                ? 'Seller Mentor'
                : 'Curator Review'
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching moderators:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải danh sách quản trị viên',
            error: error.message
        });
    }
});

// GET /api/forum/featured - Get featured/popular posts
router.get('/featured', async (req, res) => {
    try {
        const featuredPosts = await Post.find({
            isDeleted: false,
            status: 'approved'
        })
            .populate('author', 'username profile role')
            .sort({ commentsCount: -1, likesCount: -1, createdAt: -1 })
            .limit(5)
            .lean();

        const formatted = featuredPosts.map(post => ({
            id: post._id,
            title: post.title,
            commentsCount: post.commentsCount || 0,
            authorRole: post.author?.role || 'user',
            roleLabel: post.author?.role === 'admin' ? 'admin' 
                : post.author?.role === 'seller' ? 'seller' 
                : 'user'
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải bài viết nổi bật',
            error: error.message
        });
    }
});

module.exports = router;

