<?php 
$pageTitle='Đăng nhập'; 
$extraCss=['../../assets/css/auth.css', '../../assets/css/notifications.css']; 
$extraJs=['../../assets/js/notifications.js', '../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/auth.js', '../../assets/js/pages/auth-login.js'];

$googleClientId = '601825279443-cirutlg6eojl085sj73m9eckudced3eg.apps.googleusercontent.com';

if (empty($googleClientId)) {
    $googleClientId = getenv('GOOGLE_CLIENT_ID') ?: '';
}

$returnUrl = isset($_GET['returnUrl']) ? urldecode($_GET['returnUrl']) : '';
if (!empty($returnUrl)) {
    // Ensure the return URL stays within the Bookverse domain
    if (filter_var($returnUrl, FILTER_VALIDATE_URL)) {
        $parsed = parse_url($returnUrl);
        $host = $_SERVER['HTTP_HOST'] ?? '';
        if (!isset($parsed['host']) || $parsed['host'] !== $host) {
            $returnUrl = '';
        } else {
            $path = $parsed['path'] ?? '/';
            $query = isset($parsed['query']) ? '?'.$parsed['query'] : '';
            $returnUrl = $path.$query;
        }
    } elseif ($returnUrl[0] !== '/') {
        $returnUrl = '/'.ltrim($returnUrl, '/');
    }
}

include __DIR__.'/../../includes/auth-header.php'; 
?>
<div 
    id="loginPageData" 
    data-return-url="<?php echo htmlspecialchars($returnUrl ?? '', ENT_QUOTES); ?>"
    data-google-client-prefix="<?php echo htmlspecialchars(substr($googleClientId ?? '', 0, 20), ENT_QUOTES); ?>"
    data-google-configured="<?php echo !empty($googleClientId) ? '1' : '0'; ?>"
></div>
<!-- Google Client ID Meta Tag -->
<?php if (!empty($googleClientId)): ?>
<meta name="google-client-id" content="<?php echo htmlspecialchars($googleClientId); ?>">
<?php endif; ?>

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
        <h1>Đăng nhập</h1>
        <p class="auth-page-description">Chào mừng bạn quay trở lại Bookverse</p>
        
        <div class="auth-socials">
            <button type="button" class="social-btn google" onclick="handleSocialLogin('google')">
                <span class="icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.9 0 7.1 1.6 9.3 3.7l6.3-6.3C35.7 3 30.3 1 24 1 14.7 1 6.7 6.4 3.1 14.1l7.5 5.8C12.2 13.1 17.6 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.2-3.2-.6-4.7H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.4z"/>
                        <path fill="#FBBC05" d="M10.6 28.1A14.5 14.5 0 0 1 9.5 24c0-1.4.2-2.7.6-4L2.6 14a23 23 0 0 0 0 20l8-5.9z"/>
                        <path fill="#34A853" d="M24 47c6.3 0 11.6-2.1 15.5-5.7l-7.6-5.9c-2.1 1.4-4.7 2.3-7.9 2.3-6.4 0-11.8-4.2-13.7-10l-8 5.9C6.7 41.6 14.7 47 24 47z"/>
                    </svg>
                </span> 
                Google
            </button>
            <button type="button" class="social-btn facebook" onclick="handleSocialLogin('facebook')">
                <span class="icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#1877F2"/>
                        <path d="M13.5 8.5h1.8V6h-1.8c-2 0-3.3 1.2-3.3 3.2V11H8v2.4h2.2V18h2.6v-4.6h2.1L15.3 11h-2.5V9.4c0-.6.2-.9.7-.9z" fill="#fff"/>
                    </svg>
                </span> 
                Facebook
            </button>
        </div>
        
        <div class="auth-sep"><span>Hoặc</span></div>
        
        <form id="loginForm" class="auth-form">
            <div id="loginError" class="error-message"></div>
            
            <label>
                Email
                <input type="email" name="email" required placeholder="Nhập email của bạn" />
            </label>
            
            <label>
                Mật khẩu
                <div class="input-with-icon">
                    <input type="password" name="password" id="passwordInput" required placeholder="Nhập mật khẩu" />
                    <button type="button" id="togglePwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                </div>
            </label>
            
            <div class="auth-row">
                <a class="auth-link" href="forgot.php">Quên mật khẩu?</a>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="loginBtn">
                <span class="btn-text">Đăng nhập</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <p class="muted">
                Chưa có tài khoản? 
                <a href="register.php">Đăng ký ngay</a>
            </p>
        </form>
    </div>
</main>
<?php include __DIR__.'/../../includes/auth-footer.php'; ?>




