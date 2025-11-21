<?php 
$pageTitle='Đăng ký Seller'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/auth.css', '../../assets/css/auth-seller-register.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js', '../../assets/js/auth.js'];
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
        <div class="book book-1">🏪</div>
        <div class="book book-2">💰</div>
        <div class="book book-3">📦</div>
        <div class="book book-4">📊</div>
        <div class="book book-5">💼</div>
    </div>
</div>

<main>
    <div class="auth-container seller-register">
        <div class="seller-badge">
            <span class="seller-icon">🏪</span>
            <span>Seller Registration</span>
        </div>
        
        <h1>Đăng ký làm Seller</h1>
        <p class="auth-page-description">Bắt đầu bán sách trên Bookverse và kiếm tiền từ đam mê của bạn</p>
        
        <form id="sellerRegisterForm" class="auth-form">
            <div id="sellerRegisterError" class="error-message"></div>
            
            <!-- Personal Information -->
            <div class="form-section">
                <h3>Thông tin cá nhân</h3>
                <div class="form-row">
                    <label>
                        Họ
                        <input type="text" name="firstName" placeholder="Nhập họ của bạn" />
                    </label>
                    <label>
                        Tên
                        <input type="text" name="lastName" placeholder="Nhập tên của bạn" />
                    </label>
                </div>
                
                <label>
                    Tên đăng nhập
                    <input type="text" name="username" required placeholder="Chọn tên đăng nhập" />
                </label>
                
                <label>
                    Email
                    <input type="email" name="email" required placeholder="Nhập email của bạn" />
                </label>
                
                <label>
                    Số điện thoại
                    <input type="tel" name="phone" placeholder="Nhập số điện thoại" />
                </label>
                
                <label>
                    Mật khẩu
                    <div class="input-with-icon">
                        <input type="password" name="password" id="sellerPasswordInput" required placeholder="Tạo mật khẩu mạnh" />
                        <button type="button" id="toggleSellerPwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                    </div>
                </label>
                
                <label>
                    Xác nhận mật khẩu
                    <div class="input-with-icon">
                        <input type="password" name="confirmPassword" id="sellerConfirmPasswordInput" required placeholder="Nhập lại mật khẩu" />
                        <button type="button" id="toggleSellerConfirmPwd" class="eye-btn" aria-label="Hiển thị/ẩn mật khẩu">👁️</button>
                    </div>
                </label>
            </div>
            
            <!-- Business Information -->
            <div class="form-section">
                <h3>Thông tin kinh doanh</h3>
                
                <label>
                    Tên cửa hàng
                    <input type="text" name="storeName" required placeholder="Nhập tên cửa hàng của bạn" />
                </label>
                
                <label>
                    Mô tả cửa hàng
                    <textarea name="storeDescription" rows="3" placeholder="Mô tả ngắn về cửa hàng của bạn"></textarea>
                </label>
                
                <label>
                    Địa chỉ cửa hàng
                    <input type="text" name="storeAddress" placeholder="Địa chỉ cửa hàng" />
                </label>
                
                <div class="form-row">
                    <label>
                        Thành phố
                        <input type="text" name="city" placeholder="Thành phố" />
                    </label>
                    <label>
                        Quận/Huyện
                        <input type="text" name="district" placeholder="Quận/Huyện" />
                    </label>
                </div>
            </div>
            
            <!-- Business Documents -->
            <div class="form-section">
                <h3>Tài liệu kinh doanh</h3>
                
                <label>
                    Số CMND/CCCD
                    <input type="text" name="idNumber" placeholder="Nhập số CMND/CCCD" />
                </label>
                
                <label>
                    Ngày cấp CMND/CCCD
                    <input type="date" name="idIssueDate" />
                </label>
                
                <label>
                    Nơi cấp CMND/CCCD
                    <input type="text" name="idIssuePlace" placeholder="Nơi cấp CMND/CCCD" />
                </label>
                
                <label>
                    Mã số thuế (nếu có)
                    <input type="text" name="taxCode" placeholder="Mã số thuế" />
                </label>
            </div>
            
            <!-- Terms and Conditions -->
            <div class="form-checkbox">
                <input type="checkbox" id="agreeSellerTerms" name="agreeTerms" required />
                <label for="agreeSellerTerms">
                    Tôi đồng ý với 
                    <a href="#" target="_blank">Điều khoản sử dụng</a> 
                    và 
                    <a href="#" target="_blank">Chính sách bảo mật</a>
                    của Bookverse
                </label>
            </div>
            
            <div class="form-checkbox">
                <input type="checkbox" id="agreeSellerPolicy" name="agreeSellerPolicy" required />
                <label for="agreeSellerPolicy">
                    Tôi cam kết tuân thủ 
                    <a href="#" target="_blank">Chính sách người bán</a>
                    và các quy định của Bookverse
                </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="sellerRegisterBtn">
                <span class="btn-text">Đăng ký làm Seller</span>
                <span class="btn-loading">⏳</span>
            </button>
            
            <p class="muted">
                Đã có tài khoản? 
                <a href="login.php">Đăng nhập ngay</a>
            </p>
        </form>
    </div>
</main>

<?php include __DIR__.'/../../includes/auth-footer.php'; ?>
