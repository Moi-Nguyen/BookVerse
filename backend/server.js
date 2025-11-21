// Load environment variables FIRST, before any other requires
require('dotenv').config({ encoding: 'utf8' });

const logger = require('./utils/logger');
logger.bindConsole();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Enhanced Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:8000',
            'http://localhost:3000',
            'http://localhost',
            'https://bookversevn.store',
            'https://www.bookversevn.store',
            'https://api.bookversevn.store',
            'https://bookverse.com',
            'https://staging.bookverse.com'
        ];
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        
        // Allow ngrok and other tunnel services for development
        // This allows testing production frontend with local backend
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            // Allow ngrok URLs (https://*.ngrok.io, https://*.ngrok-free.app)
            if (origin.includes('ngrok.io') || origin.includes('ngrok-free.app') || origin.includes('localhost.run')) {
                return callback(null, true);
            }
            // Allow localhost with any port in development
            if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
                return callback(null, true);
            }
        }
        
        // Allow Render URLs (for production backend)
        if (origin.includes('onrender.com')) {
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Log blocked origin for debugging
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Debug-Mode'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

app.use(cors(corsOptions));

// Unified request logging
app.use((req, res, next) => {
    const useBigInt = typeof process.hrtime.bigint === 'function';
    const start = useBigInt ? process.hrtime.bigint() : process.hrtime();

    res.on('finish', () => {
        let durationMs;
        if (useBigInt) {
            const diff = process.hrtime.bigint() - start;
            durationMs = Number(diff) / 1e6;
        } else {
            const diff = process.hrtime(start);
            durationMs = (diff[0] * 1e3) + (diff[1] / 1e6);
        }

        logger.http(`${req.method} ${req.originalUrl}`, {
            status: res.statusCode,
            duration: `${durationMs.toFixed(1)}ms`,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            user: req.user ? req.user._id : 'guest'
        });
    });

    next();
});

// Body parsing with size limits and error handling
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Handle JSON parsing errors (only for requests with body)
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        // Only handle JSON parsing errors for requests that should have body
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON format',
                error: 'Malformed JSON in request body'
            });
        }
        // For GET requests, just continue to next middleware
        return next();
    }
    next(error);
});

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));

// Static uploads (attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Response interceptor to ensure proper Content-Type and valid JSON (disabled for now)
// app.use((req, res, next) => {
//     const originalJson = res.json;
//     res.json = function(data) {
//         try {
//             // Handle circular references and ensure clean JSON
//             const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
//                 if (typeof value === 'object' && value !== null) {
//                     // Handle Mongoose documents
//                     if (value.toJSON && typeof value.toJSON === 'function') {
//                         return value.toJSON();
//                     }
//                     // Handle Mongoose objects
//                     if (value.toObject && typeof value.toObject === 'function') {
//                         return value.toObject();
//                     }
//                     // Handle arrays
//                     if (Array.isArray(value)) {
//                         return value;
//                     }
//                     // Handle Date objects
//                     if (value instanceof Date) {
//                         return value.toISOString();
//                     }
//                     // Remove circular references
//                     if (value.constructor && value.constructor.name === 'Object') {
//                         return value;
//                     }
//                 }
//                 return value;
//             }));
//             
//             res.setHeader('Content-Type', 'application/json');
//             
//             // Debug logging
//             console.log(`📤 Response for ${req.method} ${req.url}:`, JSON.stringify(cleanData, null, 2));
//             
//             return originalJson.call(this, cleanData);
//         } catch (error) {
//             console.error('JSON serialization error:', error);
//             res.setHeader('Content-Type', 'application/json');
//             return originalJson.call(this, {
//                 success: false,
//                 message: 'Response serialization failed',
//                 error: 'Invalid response data'
//             });
//         }
//     };
//     next();
// });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/seller', require('./routes/seller'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/forum', require('./routes/forum'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bookverse API is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Import response middleware
const { globalErrorHandler, notFoundHandler } = require('./middlewares/response');

// Global error handling middleware
app.use(globalErrorHandler);

// 404 handler
app.use('*', notFoundHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.success(`Server running on port ${PORT}`);
    logger.info('Bookverse Marketplace API v1.0.0');
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
