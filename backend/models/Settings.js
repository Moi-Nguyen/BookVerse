const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // General Settings
    siteName: {
        type: String,
        default: 'Bookverse'
    },
    siteDescription: {
        type: String,
        default: 'Nền tảng thương mại điện tử chuyên về sách'
    },
    siteLogo: {
        type: String,
        default: ''
    },
    siteFavicon: {
        type: String,
        default: ''
    },
    
    // SEO Settings
    metaTitle: {
        type: String,
        default: ''
    },
    metaDescription: {
        type: String,
        default: ''
    },
    metaKeywords: {
        type: [String],
        default: []
    },
    
    // Security Settings
    tokenExpiry: {
        type: Number,
        default: 15 // minutes
    },
    maxLoginAttempts: {
        type: Number,
        default: 5
    },
    lockoutDuration: {
        type: Number,
        default: 30 // minutes
    },
    minPasswordLength: {
        type: Number,
        default: 8
    },
    requireUppercase: {
        type: Boolean,
        default: true
    },
    requireNumbers: {
        type: Boolean,
        default: true
    },
    requireSpecialChars: {
        type: Boolean,
        default: true
    },
    
    // Email Settings
    smtpHost: {
        type: String,
        default: ''
    },
    smtpPort: {
        type: Number,
        default: 587
    },
    smtpUsername: {
        type: String,
        default: ''
    },
    smtpPassword: {
        type: String,
        default: ''
    },
    fromEmail: {
        type: String,
        default: ''
    },
    fromName: {
        type: String,
        default: 'Bookverse'
    },
    
    // Payment Settings
    defaultShippingFee: {
        type: Number,
        default: 30000
    },
    freeShippingThreshold: {
        type: Number,
        default: 500000
    },
    processingFee: {
        type: Number,
        default: 2.5 // percentage
    },
    momoPartnerCode: {
        type: String,
        default: ''
    },
    momoAccessKey: {
        type: String,
        default: ''
    },
    momoSecretKey: {
        type: String,
        default: ''
    },
    
    // Notification Settings
    notifyNewOrders: {
        type: Boolean,
        default: true
    },
    notifyNewUsers: {
        type: Boolean,
        default: true
    },
    notifyNewProducts: {
        type: Boolean,
        default: true
    },
    notifyNewReviews: {
        type: Boolean,
        default: true
    },
    
    // Maintenance Settings
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maintenanceMessage: {
        type: String,
        default: 'Website đang được bảo trì, vui lòng quay lại sau...'
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

settingsSchema.statics.updateSettings = async function(updates) {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create(updates);
    } else {
        Object.assign(settings, updates);
        await settings.save();
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);

