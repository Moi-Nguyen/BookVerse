const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookverse');
        
        logger.success('MongoDB connected', { host: conn.connection.host });
    } catch (error) {
        logger.error('MongoDB connection error', error);
        process.exit(1);
    }
};

module.exports = connectDB;

