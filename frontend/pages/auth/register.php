<?php
$pageTitle = 'Đăng ký';
$extraCss = ['../../assets/css/notifications.css', '../../assets/css/auth-register.css'];
$extraJs = ['../../assets/js/notifications.js', '../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/pages/auth-register.js'];
include __DIR__ . '/../../includes/auth-header.php';
?>

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
        <div class="book book-3">📗</div>
        <div class="book book-4">📘</div>
        <div class="book book-5">📙</div>
    </div>
</div>

<main class="auth-register-page">
    <div class="auth-back-home">
        <a href="../../index.php" class="back-link">
            <span class="back-icon">←</span>
            <span>Về trang chủ</span>
        </a>
    </div>

    <div class="auth-container">
        <h1>Đăng ký</h1>
        <p class="subtitle">Tham gia cộng đồng Bookverse ngay hôm nay</p>

        <div class="account-type-selection">
            <h3>Chọn loại tài khoản</h3>
            <div class="account-types">
                <div class="account-type-card active" data-type="buyer">
                    <div class="account-icon">👤</div>
                    <h4>Người mua</h4>
                    <p>Mua sách và quản lý đơn hàng</p>
                </div>
                <div class="account-type-card" data-type="seller">
                    <div class="account-icon">🏪</div>
                    <h4>Người bán</h4>
                    <p>Bán sách và quản lý cửa hàng</p>
                </div>
            </div>
        </div>

        <form id="registerForm" class="auth-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="lastName">Họ</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Nhập họ của bạn" required>
                </div>
                <div class="form-group">
                    <label for="firstName">Tên</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Nhập tên của bạn" required>
                </div>
            </div>

            <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <input type="text" id="username" name="username" placeholder="Chọn tên đăng nhập" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Nhập email của bạn" required>
            </div>

            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <div class="password-field">
                    <input type="password" id="password" name="password" placeholder="Tạo mật khẩu mạnh" required>
                    <button type="button" class="password-toggle">👁️</button>
                </div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu</label>
                <div class="password-field">
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" required>
                    <button type="button" class="password-toggle">👁️</button>
                </div>
            </div>

            <button type="submit" class="auth-btn">
                <span>Đăng ký</span>
            </button>
        </form>

        <div class="auth-footer">
            <p>Đã có tài khoản? <a href="login.php" class="link">Đăng nhập ngay</a></p>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../../includes/auth-footer.php'; ?>

