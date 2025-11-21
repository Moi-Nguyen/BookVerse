const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');
const { validateUser, validateLogin, validatePasswordChange } = require('../middlewares/validation');
const emailService = require('../services/email');

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
    const jwtSecret = process.env.JWT_SECRET || 'bookverse_default_secret_key_2024_development_only';
    
    if (!process.env.JWT_SECRET) {
        console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables. Using default secret for development only!');
    }
    
    return jwt.sign({ id: userId }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUser, async (req, res) => {
    try {
        const { username, email, password, profile, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Process profile data
        let processedProfile = profile || {};
        
        // Handle address field - convert string to object if needed
        if (processedProfile.address && typeof processedProfile.address === 'string') {
            processedProfile.address = {
                city: processedProfile.address,
                country: 'Vietnam'
            };
        }

        // Determine user role - default to 'user' if not specified
        const userRole = role || 'user';
        
        // Create user data
        const userData = {
            username,
            email,
            password,
            role: userRole,
            profile: processedProfile
        };

        // If registering as seller, add sellerProfile with isApproved = false
        // Regular users don't need approval
        if (userRole === 'seller') {
            userData.sellerProfile = {
                isApproved: false, // Seller needs admin approval
                businessName: profile?.businessName || username,
                description: profile?.description || ''
            };
        }

        // Create new user
        const user = new User(userData);

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Different messages based on role
        let message = 'User registered successfully';
        if (userRole === 'seller') {
            message = 'Seller account created successfully. Waiting for admin approval to start selling.';
        } else if (userRole === 'user') {
            message = 'User registered successfully. You can start shopping now!';
        }

        res.status(201).json({
            success: true,
            message: message,
            data: {
                user: user.toJSON(),
                token,
                needsApproval: userRole === 'seller' // Indicate if user needs approval
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Set Content-Type header explicitly
        res.setHeader('Content-Type', 'application/json');
        
        // Ensure user data is properly serialized and remove sensitive fields
        let userData = null;
        if (req.user) {
            if (req.user.toJSON && typeof req.user.toJSON === 'function') {
                userData = req.user.toJSON();
            } else if (req.user.toObject && typeof req.user.toObject === 'function') {
                userData = req.user.toObject();
            } else {
                userData = req.user;
            }
            
            // Remove sensitive fields
            if (userData && typeof userData === 'object') {
                delete userData.password;
                delete userData.resetPassword;
                delete userData.__v;
            }
        }
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const responseData = {
            success: true,
            data: {
                user: userData
            }
        };
        
        // Debug logging (disabled for now)
        // try {
        //     console.log('Response data:', JSON.stringify(responseData, null, 2));
        // } catch (logError) {
        //     console.error('Logging error:', logError);
        // }
        
        res.json(responseData);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
    try {
        const token = generateToken(req.user._id);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token
            }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, validatePasswordChange, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);

        if (!isCurrentPasswordValid) {
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
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password change failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not
            return res.json({
                success: true,
                message: 'If the email exists, an OTP has been sent'
            });
        }

        // Rate limit simple: at most once per 60 seconds
        const now = new Date();
        if (user.resetPassword?.lastRequestedAt && (now - user.resetPassword.lastRequestedAt) < 60000) {
            return res.json({ success: true, message: 'OTP already sent. Please check your email.' });
        }

        // Generate 6-digit OTP and set expiry 10 minutes
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPassword = {
            otp: { code: otpCode, expiresAt: new Date(now.getTime() + 10 * 60 * 1000), attempts: 0 },
            lastRequestedAt: now
        };
        await user.save();

        // Send OTP email
        const username = user.profile?.firstName || user.username || 'Người dùng';
        const emailResult = await emailService.sendOTPEmail(user.email, otpCode, username);

        // Prepare response
        const response = {
            success: true,
            message: emailResult.success 
                ? 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.' 
                : 'OTP đã được tạo. Vui lòng kiểm tra email hoặc liên hệ hỗ trợ.',
            data: {}
        };

        // In development mode, include OTP in response if email failed or not configured
        if (process.env.NODE_ENV === 'development' && (!emailResult.success || emailResult.otp)) {
            response.data.otp = otpCode;
            response.message += ' (Mã OTP hiển thị trong development mode)';
        }

        res.json(response);
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset request failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP code
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isActive || !user.resetPassword?.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user or OTP not requested'
            });
        }

        const { code, expiresAt, attempts } = user.resetPassword.otp;
        
        // Check attempts limit
        if (attempts >= 5) {
            return res.status(429).json({ 
                success: false, 
                message: 'Quá nhiều lần thử sai. Vui lòng yêu cầu mã OTP mới.' 
            });
        }
        
        // Check expiry
        if (new Date() > new Date(expiresAt)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã OTP mới.' 
            });
        }
        
        // Verify OTP
        if (otp !== code) {
            user.resetPassword.otp.attempts = attempts + 1;
            await user.save();
            return res.status(400).json({ 
                success: false, 
                message: 'Mã OTP không đúng. Vui lòng thử lại.' 
            });
        }

        // OTP is valid - return success (don't reset password yet)
        res.json({
            success: true,
            message: 'Mã OTP hợp lệ. Bạn có thể đặt lại mật khẩu.',
            data: {
                email: user.email,
                verified: true
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Xác thực OTP thất bại',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/google
// @desc    Login or register with Google OAuth
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'Google ID token is required'
            });
        }

        // Verify Google ID token
        let ticket;
        try {
            ticket = await googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
        } catch (error) {
            console.error('Google token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email not provided by Google'
            });
        }

        // Check if user exists by email or Google ID
        let user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { oauthProvider: 'google', oauthId: googleId }
            ]
        });

        if (user) {
            // User exists - update OAuth info if needed and login
            if (!user.oauthProvider || !user.oauthId) {
                user.oauthProvider = 'google';
                user.oauthId = googleId;
                if (picture && !user.profile.avatar) {
                    user.profile.avatar = picture;
                }
                await user.save();
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();
        } else {
            // New user - create account
            // Generate username from email or name
            const baseUsername = name 
                ? name.toLowerCase().replace(/\s+/g, '') 
                : email.split('@')[0];
            
            let username = baseUsername;
            let counter = 1;
            
            // Ensure unique username
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            // Split name into first and last name
            const nameParts = name ? name.split(' ') : [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            user = new User({
                username,
                email: email.toLowerCase(),
                oauthProvider: 'google',
                oauthId: googleId,
                isEmailVerified: true, // Google emails are verified
                profile: {
                    firstName,
                    lastName,
                    avatar: picture || null
                },
                role: 'user' // Default role for OAuth users
            });

            await user.save();
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Google login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with verified OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP and new password are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive || !user.resetPassword?.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user or OTP not verified'
            });
        }

        // Verify OTP again (double check)
        const { code, expiresAt, attempts } = user.resetPassword.otp;
        if (attempts >= 5) {
            return res.status(429).json({ 
                success: false, 
                message: 'Quá nhiều lần thử sai. Vui lòng yêu cầu mã OTP mới.' 
            });
        }
        if (new Date() > new Date(expiresAt)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã OTP mới.' 
            });
        }
        if (otp !== code) {
            user.resetPassword.otp.attempts = attempts + 1;
            await user.save();
            return res.status(400).json({ 
                success: false, 
                message: 'Mã OTP không đúng. Vui lòng xác thực lại.' 
            });
        }

        user.password = newPassword;
        user.resetPassword = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;

