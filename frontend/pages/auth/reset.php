<?php 
$pageTitle='Đặt lại mật khẩu'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/auth.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/auth.js', '../../assets/js/pages/auth-reset.js'];
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
        <h1>Đặt lại mật khẩu</h1>
        <p class="auth-page-description">
            Tạo mật khẩu mới cho tài khoản của bạn
        </p>
        
        <form id="resetForm" class="auth-form">
            <div id="resetError" class="error-message"></div>
            <div id="resetSuccess" class="success-message"></div>
            
            <input type="hidden" name="email" id="resetEmailInput" />
            <input type="hidden" name="otp" id="resetOtpInput" />
            
            <label>
                Mật khẩu mới
                <div class="input-with-icon">
                    <input type="password" name="newPassword" id="newPasswordInput" required placeholder="Tạo mật khẩu mới" minlength="6" />
                    <button type="button" id="toggleNewPwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                </div>
                <small class="auth-hint-text">
                    Mật khẩu phải có ít nhất 6 ký tự
                </small>
            </label>
            
            <label>
                Xác nhận mật khẩu mới
                <div class="input-with-icon">
                    <input type="password" name="confirmPassword" id="confirmNewPasswordInput" required placeholder="Nhập lại mật khẩu mới" minlength="6" />
                    <button type="button" id="toggleConfirmNewPwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                </div>
            </label>
            
            <button type="submit" class="btn btn-primary btn-block" id="resetBtn">
                <span class="btn-text">Đặt lại mật khẩu</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <p class="muted">
                Quay lại? 
                <a href="login.php">Đăng nhập</a>
            </p>
        </form>
    </div>
</main>

<?php include __DIR__.'/../../includes/auth-footer.php'; ?>
