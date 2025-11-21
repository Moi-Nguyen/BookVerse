<?php 
$pageTitle='Quên mật khẩu'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/auth.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/auth.js'];
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
        <h1>Quên mật khẩu</h1>
        <p class="auth-page-description">
            Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
        </p>
        
        <form id="forgotForm" class="auth-form">
            <div id="forgotError" class="error-message"></div>
            <div id="forgotSuccess" class="success-message"></div>
            
            <label>
                Email
                <input type="email" name="email" required placeholder="Nhập email đã đăng ký" />
            </label>
            
            <button type="submit" class="btn btn-primary btn-block" id="forgotBtn">
                <span class="btn-text">Gửi mã OTP</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <p class="muted">
                Nhớ mật khẩu rồi? 
                <a href="login.php">Đăng nhập ngay</a>
            </p>
        </form>
    </div>
</main>

<?php include __DIR__.'/../../includes/auth-footer.php'; ?>