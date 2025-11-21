<?php 
$pageTitle='Xác thực OTP'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/auth.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/auth.js', '../../assets/js/pages/auth-verify-otp.js'];
include __DIR__.'/../../includes/auth-header.php'; 
?>

<!-- Back to Home Link -->
<div class="auth-back-home">
    <a href="../../index.php" class="back-link">
        <span class="back-icon">←</span>
        <span>Về trang chủ</span>
    </a>
</div>

<!-- Auth Background -->
<div class="auth-background">
    <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
    </div>
    <div class="floating-books">
        <div class="book book-1">📚</div>
        <div class="book book-2">📖</div>
        <div class="book book-3">📕</div>
        <div class="book book-4">📗</div>
        <div class="book book-5">📘</div>
    </div>
</div>

<main>
    <div class="auth-container">
        <h1>Xác thực mã OTP</h1>
        <p class="auth-page-description">
            Nhập mã OTP 6 số đã được gửi đến email của bạn
        </p>
        
        <form id="verifyOtpForm" class="auth-form">
            <div id="verifyOtpError" class="error-message"></div>
            <div id="verifyOtpSuccess" class="success-message"></div>
            
            <label>
                Email
                <input type="email" name="email" id="verifyEmailInput" required placeholder="Nhập email đã đăng ký" />
            </label>
            
            <div class="otp-input-group">
                <label class="otp-label">
                    Mã OTP
                </label>
                <div class="otp-container">
                    <input type="text" class="otp-input" id="otp-1" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                    <input type="text" class="otp-input" id="otp-2" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                    <input type="text" class="otp-input" id="otp-3" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                    <input type="text" class="otp-input" id="otp-4" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                    <input type="text" class="otp-input" id="otp-5" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                    <input type="text" class="otp-input" id="otp-6" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" />
                </div>
                <input type="hidden" name="otp" id="verifyOtpInput" required />
                <small class="auth-hint-text text-center">
                    <span class="otp-timer" id="otpTimer">Mã OTP có hiệu lực trong 10 phút</span>
                </small>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="verifyOtpBtn">
                <span class="btn-text">Xác thực OTP</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <p class="muted">
                Chưa nhận được mã? 
                <a href="forgot.php">Gửi lại mã OTP</a>
            </p>
        </form>
    </div>
</main>

<?php include __DIR__.'/../../includes/auth-footer.php'; ?>
