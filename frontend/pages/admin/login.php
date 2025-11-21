<?php 
$pageTitle='Admin Login'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/auth.css', '../../assets/css/auth-admin-login.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js', '../../assets/js/admin-auth.js'];
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
        <div class="book book-1">👑</div>
        <div class="book book-2">⚙️</div>
        <div class="book book-3">📊</div>
        <div class="book book-4">🔧</div>
        <div class="book book-5">🛡️</div>
    </div>
</div>

<main>
    <div class="auth-container admin-login">
        <div class="admin-badge">
            <span class="admin-icon">👑</span>
            <span>Admin Portal</span>
        </div>
        
        <h1>Đăng nhập Admin</h1>
        <p class="auth-page-description">Truy cập vào hệ thống quản trị Bookverse</p>
        
        <form id="adminLoginForm" class="auth-form">
            <div id="adminLoginError" class="error-message"></div>
            
            <label>
                Email Admin
                <input type="email" name="email" required placeholder="Nhập email admin" />
            </label>
            
            <label>
                Mật khẩu
                <div class="input-with-icon">
                    <input type="password" name="password" id="adminPasswordInput" required placeholder="Nhập mật khẩu admin" />
                    <button type="button" id="toggleAdminPwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                </div>
            </label>
            
            <div class="auth-row">
                <div class="form-checkbox">
                    <input type="checkbox" id="rememberAdmin" name="remember" />
                    <label for="rememberAdmin">Ghi nhớ đăng nhập</label>
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="adminLoginBtn">
                <span class="btn-text">Đăng nhập Admin</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <div class="admin-links">
                <p class="muted">
                    <a href="../auth/login.php">Đăng nhập User</a> | 
                    <a href="../auth/register.php">Đăng ký Seller</a>
                </p>
            </div>
        </form>
    </div>
</main>

<?php include __DIR__.'/../../includes/auth-footer.php'; ?>
