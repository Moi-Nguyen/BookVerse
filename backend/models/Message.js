const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'file'],
        default: 'file'
    },
    width: Number,
    height: Number
}, { _id: false });

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        maxlength: 4000
    },
    attachments: [attachmentSchema],
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readAt: {
        type: Date,
        default: null
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, status: 1 });

module.exports = mongoose.model('Message', messageSchema);

