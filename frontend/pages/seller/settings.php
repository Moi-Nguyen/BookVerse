<?php 
$pageTitle='Cài đặt tài khoản'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/seller-settings.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'assets/js/main.js', 'assets/js/pages/seller-settings.js'];
include '../../includes/header.php'; 
?>

<main class="main seller-main" role="main">
    <!-- Page Header -->
    <section class="page-header">
        <div class="container">
            <div class="page-header-content">
                <h1 class="page-title">Cài đặt tài khoản</h1>
                <p class="page-subtitle">Quản lý thông tin tài khoản và cài đặt bán hàng</p>
                <nav class="breadcrumb">
                    <a href="../../index.php">Trang chủ</a>
                    <span class="breadcrumb-separator">/</span>
                    <a href="dashboard.php">Kênh người bán</a>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">Cài đặt</span>
                </nav>
            </div>
        </div>
    </section>

    <!-- Settings Content -->
    <section class="seller-settings">
        <div class="container">
            <div class="settings-wrapper">
                <!-- Settings Navigation -->
                <aside class="settings-nav">
                    <nav class="settings-menu">
                        <h3 class="menu-title">Cài đặt</h3>
                        <ul class="menu-list">
                            <li class="menu-item">
                                <a href="#profile" class="menu-link active" data-section="profile">
                                    <span class="menu-icon">👤</span>
                                    Thông tin cá nhân
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="#business" class="menu-link" data-section="business">
                                    <span class="menu-icon">🏪</span>
                                    Thông tin kinh doanh
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="#security" class="menu-link" data-section="security">
                                    <span class="menu-icon">🔒</span>
                                    Bảo mật
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="#notifications" class="menu-link" data-section="notifications">
                                    <span class="menu-icon">🔔</span>
                                    Thông báo
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="#preferences" class="menu-link" data-section="preferences">
                                    <span class="menu-icon">⚙️</span>
                                    Tùy chọn
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <!-- Settings Content -->
                <div class="settings-content">
                    <!-- Profile Settings -->
                    <div id="profile" class="settings-section active">
                        <div class="section-header">
                            <h2 class="section-title">Thông tin cá nhân</h2>
                            <p class="section-subtitle">Cập nhật thông tin cá nhân của bạn</p>
                        </div>

                        <form class="settings-form" id="profileForm">
                            <div class="form-section">
                                <h3 class="form-section-title">Thông tin cơ bản</h3>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="firstName">Họ *</label>
                                        <input type="text" id="firstName" name="firstName" required 
                                               placeholder="Nhập họ của bạn">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="lastName">Tên *</label>
                                        <input type="text" id="lastName" name="lastName" required 
                                               placeholder="Nhập tên của bạn">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email">Email *</label>
                                        <input type="email" id="email" name="email" required 
                                               placeholder="Nhập email của bạn">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="phone">Số điện thoại</label>
                                        <input type="tel" id="phone" name="phone" 
                                               placeholder="Nhập số điện thoại">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="address">Địa chỉ</label>
                                    <textarea id="address" name="address" rows="3" 
                                              placeholder="Nhập địa chỉ của bạn"></textarea>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Ảnh đại diện</h3>
                                
                                <div class="avatar-upload">
                                    <div class="avatar-preview">
                                        <img id="avatarPreview" src="../../assets/images/default-avatar.svg" 
                                             alt="Ảnh đại diện">
                                        <div class="avatar-overlay">
                                            <span class="upload-text">Thay đổi ảnh</span>
                                        </div>
                                    </div>
                                    <input type="file" id="avatarInput" name="avatar" accept="image/*" hidden>
                                    <button type="button" class="btn btn-outline" onclick="document.getElementById('avatarInput').click()">
                                        Chọn ảnh
                                    </button>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Lưu thay đổi</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                                <button type="button" class="btn btn-outline" onclick="resetForm('profileForm')">
                                    Đặt lại
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Business Settings -->
                    <div id="business" class="settings-section">
                        <div class="section-header">
                            <h2 class="section-title">Thông tin kinh doanh</h2>
                            <p class="section-subtitle">Cập nhật thông tin cửa hàng của bạn</p>
                        </div>

                        <form class="settings-form" id="businessForm">
                            <div class="form-section">
                                <h3 class="form-section-title">Thông tin cửa hàng</h3>
                                
                                <div class="form-group">
                                    <label for="businessName">Tên cửa hàng *</label>
                                    <input type="text" id="businessName" name="businessName" required 
                                           placeholder="Nhập tên cửa hàng">
                                </div>

                                <div class="form-group">
                                    <label for="businessDescription">Mô tả cửa hàng</label>
                                    <textarea id="businessDescription" name="businessDescription" rows="4" 
                                              placeholder="Mô tả về cửa hàng của bạn"></textarea>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="businessType">Loại hình kinh doanh</label>
                                        <select id="businessType" name="businessType">
                                            <option value="individual">Cá nhân</option>
                                            <option value="company">Công ty</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="businessLicense">Số giấy phép kinh doanh</label>
                                        <input type="text" id="businessLicense" name="businessLicense" 
                                               placeholder="Nhập số giấy phép">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="taxId">Mã số thuế</label>
                                    <input type="text" id="taxId" name="taxId" 
                                           placeholder="Nhập mã số thuế">
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Thông tin liên hệ kinh doanh</h3>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="businessEmail">Email kinh doanh</label>
                                        <input type="email" id="businessEmail" name="businessEmail" 
                                               placeholder="Nhập email kinh doanh">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="businessPhone">Điện thoại kinh doanh</label>
                                        <input type="tel" id="businessPhone" name="businessPhone" 
                                               placeholder="Nhập số điện thoại">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="businessAddress">Địa chỉ kinh doanh</label>
                                    <textarea id="businessAddress" name="businessAddress" rows="3" 
                                              placeholder="Nhập địa chỉ kinh doanh"></textarea>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Lưu thay đổi</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                                <button type="button" class="btn btn-outline" onclick="resetForm('businessForm')">
                                    Đặt lại
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Security Settings -->
                    <div id="security" class="settings-section">
                        <div class="section-header">
                            <h2 class="section-title">Bảo mật</h2>
                            <p class="section-subtitle">Quản lý mật khẩu và bảo mật tài khoản</p>
                        </div>

                        <form class="settings-form" id="securityForm">
                            <div class="form-section">
                                <h3 class="form-section-title">Thay đổi mật khẩu</h3>
                                
                                <div class="form-group">
                                    <label for="currentPassword">Mật khẩu hiện tại *</label>
                                    <input type="password" id="currentPassword" name="currentPassword" required 
                                           placeholder="Nhập mật khẩu hiện tại">
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="newPassword">Mật khẩu mới *</label>
                                        <input type="password" id="newPassword" name="newPassword" required 
                                               placeholder="Nhập mật khẩu mới">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="confirmPassword">Xác nhận mật khẩu *</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" required 
                                               placeholder="Nhập lại mật khẩu mới">
                                    </div>
                                </div>

                                <div class="password-strength">
                                    <div class="strength-bar">
                                        <div class="strength-fill" id="strengthFill"></div>
                                    </div>
                                    <span class="strength-text" id="strengthText">Mật khẩu yếu</span>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Xác thực hai yếu tố</h3>
                                
                                <div class="two-factor-info">
                                    <div class="info-card">
                                        <div class="info-icon">🔐</div>
                                        <div class="info-content">
                                            <h4>Bảo mật tài khoản</h4>
                                            <p>Kích hoạt xác thực hai yếu tố để tăng cường bảo mật tài khoản</p>
                                        </div>
                                        <div class="info-action">
                                            <label class="toggle-switch">
                                                <input type="checkbox" id="twoFactorEnabled" name="twoFactorEnabled">
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Cập nhật bảo mật</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Notifications Settings -->
                    <div id="notifications" class="settings-section">
                        <div class="section-header">
                            <h2 class="section-title">Thông báo</h2>
                            <p class="section-subtitle">Quản lý các thông báo bạn muốn nhận</p>
                        </div>

                        <form class="settings-form" id="notificationsForm">
                            <div class="form-section">
                                <h3 class="form-section-title">Thông báo email</h3>
                                
                                <div class="notification-options">
                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Đơn hàng mới</h4>
                                            <p>Nhận thông báo khi có đơn hàng mới</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="newOrderEmail" name="newOrderEmail" checked>
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Cập nhật đơn hàng</h4>
                                            <p>Nhận thông báo khi đơn hàng được cập nhật</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="orderUpdateEmail" name="orderUpdateEmail" checked>
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Thanh toán</h4>
                                            <p>Nhận thông báo về thanh toán</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="paymentEmail" name="paymentEmail" checked>
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Tin tức và cập nhật</h4>
                                            <p>Nhận thông báo về tin tức và cập nhật từ Bookverse</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="newsEmail" name="newsEmail">
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Thông báo push</h3>
                                
                                <div class="notification-options">
                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Thông báo đơn hàng</h4>
                                            <p>Nhận thông báo push về đơn hàng</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="orderPush" name="orderPush" checked>
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div class="notification-item">
                                        <div class="notification-info">
                                            <h4>Thông báo thanh toán</h4>
                                            <p>Nhận thông báo push về thanh toán</p>
                                        </div>
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="paymentPush" name="paymentPush" checked>
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Lưu cài đặt</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Preferences Settings -->
                    <div id="preferences" class="settings-section">
                        <div class="section-header">
                            <h2 class="section-title">Tùy chọn</h2>
                            <p class="section-subtitle">Cài đặt tùy chọn cá nhân</p>
                        </div>

                        <form class="settings-form" id="preferencesForm">
                            <div class="form-section">
                                <h3 class="form-section-title">Giao diện</h3>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="theme">Chủ đề</label>
                                        <select id="theme" name="theme">
                                            <option value="light">Sáng</option>
                                            <option value="dark">Tối</option>
                                            <option value="auto">Tự động</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="language">Ngôn ngữ</label>
                                        <select id="language" name="language">
                                            <option value="vi">Tiếng Việt</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Bán hàng</h3>
                                
                                <div class="form-group">
                                    <label for="autoApprove">Tự động phê duyệt sản phẩm</label>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="autoApprove" name="autoApprove">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <p class="form-help">Tự động phê duyệt sản phẩm mới (chỉ áp dụng cho người bán uy tín)</p>
                                </div>

                                <div class="form-group">
                                    <label for="stockAlert">Cảnh báo hết hàng</label>
                                    <input type="number" id="stockAlert" name="stockAlert" min="0" value="5" 
                                           placeholder="Số lượng tối thiểu">
                                    <p class="form-help">Nhận cảnh báo khi số lượng sản phẩm dưới mức này</p>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="form-section-title">Dữ liệu</h3>
                                
                                <div class="data-actions">
                                    <div class="action-item">
                                        <div class="action-info">
                                            <h4>Xuất dữ liệu</h4>
                                            <p>Xuất dữ liệu sản phẩm và đơn hàng</p>
                                        </div>
                                        <button type="button" class="btn btn-outline" onclick="exportData()">
                                            Xuất dữ liệu
                                        </button>
                                    </div>

                                    <div class="action-item">
                                        <div class="action-info">
                                            <h4>Xóa tài khoản</h4>
                                            <p>Xóa vĩnh viễn tài khoản và dữ liệu</p>
                                        </div>
                                        <button type="button" class="btn btn-danger" onclick="deleteAccount()">
                                            Xóa tài khoản
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Lưu tùy chọn</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include '../../includes/footer.php'; ?>
