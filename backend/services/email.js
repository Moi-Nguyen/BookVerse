const nodemailer = require('nodemailer');

/**
 * Email Service for Bookverse
 * Handles sending emails for OTP, notifications, etc.
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.init();
    }

    init() {
        // Check if email is configured
        const emailHost = process.env.EMAIL_HOST?.trim();
        const emailUser = process.env.EMAIL_USER?.trim();
        let emailPass = process.env.EMAIL_PASS?.trim();

        if (!emailHost || !emailUser || !emailPass) {
            console.warn('⚠️  Email service not configured. Email sending will be disabled.');
            console.warn('   Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env file');
            this.isConfigured = false;
            return;
        }

        // Remove spaces from App Password (Gmail App Passwords often have spaces)
        if (emailPass.includes(' ')) {
            emailPass = emailPass.replace(/\s+/g, '');
            console.log('📝 Removed spaces from EMAIL_PASS (Gmail App Password format)');
        }

        try {
            this.transporter = nodemailer.createTransport({
                host: emailHost,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: emailUser,
                    pass: emailPass
                },
                // For Gmail, you may need to enable "Less secure app access" or use App Password
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates (for development)
                }
            });

            this.isConfigured = true;
            console.log('✅ Email service initialized');
            console.log(`   Host: ${emailHost}:${process.env.EMAIL_PORT || '587'}`);
            console.log(`   User: ${emailUser}`);
        } catch (error) {
            console.error('❌ Failed to initialize email service:', error.message);
            this.isConfigured = false;
        }
    }

    /**
     * Send OTP email for password reset
     * @param {string} to - Recipient email
     * @param {string} otp - 6-digit OTP code
     * @param {string} username - User's name (optional)
     * @returns {Promise<Object>}
     */
    async sendOTPEmail(to, otp, username = 'Người dùng') {
        if (!this.isConfigured || !this.transporter) {
            console.warn('📧 Email service not configured. OTP would be:', otp);
            // In development, log the OTP instead of sending
            if (process.env.NODE_ENV === 'development') {
                console.log(`\n📧 [DEV MODE] OTP for ${to}: ${otp}\n`);
                return {
                    success: true,
                    message: 'Email service not configured. OTP logged to console (dev mode)',
                    otp: otp // Return OTP for development
                };
            }
            return {
                success: false,
                message: 'Email service is not configured'
            };
        }

        const mailOptions = {
            from: `"Bookverse" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Mã OTP khôi phục mật khẩu - Bookverse',
            html: this.getOTPEmailTemplate(otp, username),
            text: `Mã OTP khôi phục mật khẩu của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ OTP email sent successfully to:', to);
            return {
                success: true,
                message: 'OTP email sent successfully',
                messageId: info.messageId
            };
        } catch (error) {
            console.error('❌ Failed to send OTP email:', error.message);
            
            // In development, still log the OTP
            if (process.env.NODE_ENV === 'development') {
                console.log(`\n📧 [DEV MODE - Email failed] OTP for ${to}: ${otp}\n`);
                return {
                    success: true,
                    message: 'Email sending failed, but OTP logged to console (dev mode)',
                    otp: otp,
                    error: error.message
                };
            }

            return {
                success: false,
                message: 'Failed to send email',
                error: error.message
            };
        }
    }

    /**
     * Get HTML template for OTP email
     * @param {string} otp - 6-digit OTP
     * @param {string} username - User's name
     * @returns {string} HTML email template
     */
    getOTPEmailTemplate(otp, username) {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã OTP khôi phục mật khẩu</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚 Bookverse</div>
            <h1>Khôi phục mật khẩu</h1>
        </div>
        
        <p>Xin chào <strong>${username}</strong>,</p>
        
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để đặt lại mật khẩu:</p>
        
        <div class="otp-box">
            <p style="margin: 0 0 10px 0;">Mã OTP của bạn:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Mã này có hiệu lực trong <strong>10 phút</strong></p>
        </div>
        
        <div class="warning">
            <strong>⚠️ Lưu ý bảo mật:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
                <li>Bookverse sẽ không bao giờ yêu cầu bạn cung cấp mã OTP qua điện thoại</li>
                <li>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này</li>
            </ul>
        </div>
        
        <p>Nếu bạn không yêu cầu khôi phục mật khẩu, bạn có thể bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
        
        <div class="footer">
            <p>Trân trọng,<br>Đội ngũ Bookverse</p>
            <p style="margin-top: 20px; font-size: 11px; color: #999;">
                Email này được gửi tự động, vui lòng không trả lời email này.
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Verify email service configuration
     * @returns {Promise<boolean>}
     */
    async verifyConnection() {
        if (!this.isConfigured || !this.transporter) {
            return false;
        }

        try {
            await this.transporter.verify();
            console.log('✅ Email service connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email service connection failed:', error.message);
            return false;
        }
    }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;

