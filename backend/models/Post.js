const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['review', 'discussion', 'sell-tips', 'request', 'news'],
        default: 'discussion'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'deleted'],
        default: 'approved'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text' });

// Update likesCount before save
postSchema.pre('save', function(next) {
    if (this.isModified('likes')) {
        this.likesCount = this.likes.length;
    }
    next();
});

// Virtual for author role (will be populated)
postSchema.virtual('authorRole', {
    ref: 'User',
    localField: 'author',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Post', postSchema);

