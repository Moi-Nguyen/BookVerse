<?php 
$pageTitle='Cài đặt hệ thống'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-settings.css'];
$extraJs=['assets/js/pages/admin-auth-guard.js', 'assets/js/admin.js', 'assets/js/pages/admin-settings.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- System Settings -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">⚙️</span>
                    Cài đặt hệ thống
                </h1>
                <p class="page-subtitle">Cấu hình và quản lý các thiết lập hệ thống</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="resetSettings()">
                    <span class="btn-icon">🔄</span>
                    Khôi phục mặc định
                </button>
                <button class="btn btn-primary" onclick="saveAllSettings()">
                    <span class="btn-icon">💾</span>
                    Lưu tất cả
                </button>
            </div>
        </div>

        <!-- Settings Navigation -->
        <div class="settings-nav">
            <button class="nav-tab active" data-tab="general">Tổng quan</button>
            <button class="nav-tab" data-tab="security">Bảo mật</button>
            <button class="nav-tab" data-tab="email">Email</button>
            <button class="nav-tab" data-tab="payment">Thanh toán</button>
            <button class="nav-tab" data-tab="notifications">Thông báo</button>
            <button class="nav-tab" data-tab="maintenance">Bảo trì</button>
        </div>

        <!-- Settings Content -->
        <div class="settings-content">
            <!-- General Settings -->
            <div class="settings-tab active" id="general-tab">
                <div class="settings-section">
                    <h3 class="section-title">Thông tin cơ bản</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Tên website</label>
                            <input type="text" id="siteName" class="form-input" value="Bookverse" placeholder="Nhập tên website">
                            <p class="setting-description">Tên hiển thị của website</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Mô tả website</label>
                            <textarea id="siteDescription" class="form-textarea" placeholder="Nhập mô tả website">Nền tảng thương mại điện tử chuyên về sách</textarea>
                            <p class="setting-description">Mô tả ngắn về website</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Logo website</label>
                            <div class="file-upload">
                                <input type="file" id="siteLogo" accept="image/*" onchange="previewLogo(this)">
                                <label for="siteLogo" class="upload-btn">
                                    <span class="btn-icon">📁</span>
                                    Chọn logo
                                </label>
                            </div>
                            <div class="logo-preview" id="logoPreview">
                                <img src="../../assets/images/logo.png" alt="Current logo">
                            </div>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Favicon</label>
                            <div class="file-upload">
                                <input type="file" id="siteFavicon" accept="image/*" onchange="previewFavicon(this)">
                                <label for="siteFavicon" class="upload-btn">
                                    <span class="btn-icon">📁</span>
                                    Chọn favicon
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="section-title">Cài đặt SEO</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Meta title</label>
                            <input type="text" id="metaTitle" class="form-input" placeholder="Nhập meta title">
                            <p class="setting-description">Tiêu đề hiển thị trên Google</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Meta description</label>
                            <textarea id="metaDescription" class="form-textarea" placeholder="Nhập meta description"></textarea>
                            <p class="setting-description">Mô tả hiển thị trên Google</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Keywords</label>
                            <input type="text" id="metaKeywords" class="form-input" placeholder="Nhập keywords, phân cách bằng dấu phẩy">
                            <p class="setting-description">Từ khóa SEO</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Security Settings -->
            <div class="settings-tab" id="security-tab">
                <div class="settings-section">
                    <h3 class="section-title">Bảo mật đăng nhập</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Thời gian hết hạn token (phút)</label>
                            <input type="number" id="tokenExpiry" class="form-input" value="15" min="5" max="1440">
                            <p class="setting-description">Thời gian hết hạn của access token</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Số lần đăng nhập sai tối đa</label>
                            <input type="number" id="maxLoginAttempts" class="form-input" value="5" min="3" max="10">
                            <p class="setting-description">Số lần đăng nhập sai trước khi khóa tài khoản</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Thời gian khóa tài khoản (phút)</label>
                            <input type="number" id="lockoutDuration" class="form-input" value="30" min="5" max="1440">
                            <p class="setting-description">Thời gian khóa tài khoản sau khi đăng nhập sai</p>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="section-title">Cài đặt mật khẩu</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Độ dài tối thiểu</label>
                            <input type="number" id="minPasswordLength" class="form-input" value="8" min="6" max="20">
                            <p class="setting-description">Độ dài tối thiểu của mật khẩu</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Yêu cầu chữ hoa</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="requireUppercase" checked>
                                <label for="requireUppercase"></label>
                            </div>
                            <p class="setting-description">Yêu cầu ít nhất 1 chữ hoa</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Yêu cầu số</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="requireNumbers" checked>
                                <label for="requireNumbers"></label>
                            </div>
                            <p class="setting-description">Yêu cầu ít nhất 1 số</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Yêu cầu ký tự đặc biệt</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="requireSpecialChars" checked>
                                <label for="requireSpecialChars"></label>
                            </div>
                            <p class="setting-description">Yêu cầu ít nhất 1 ký tự đặc biệt</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Email Settings -->
            <div class="settings-tab" id="email-tab">
                <div class="settings-section">
                    <h3 class="section-title">Cấu hình SMTP</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">SMTP Host</label>
                            <input type="text" id="smtpHost" class="form-input" placeholder="smtp.gmail.com">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">SMTP Port</label>
                            <input type="number" id="smtpPort" class="form-input" value="587">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Username</label>
                            <input type="email" id="smtpUsername" class="form-input" placeholder="your-email@gmail.com">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Password</label>
                            <input type="password" id="smtpPassword" class="form-input" placeholder="App password">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">From Email</label>
                            <input type="email" id="fromEmail" class="form-input" placeholder="noreply@bookverse.com">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">From Name</label>
                            <input type="text" id="fromName" class="form-input" placeholder="Bookverse">
                        </div>
                    </div>
                    <div class="setting-actions">
                        <button class="btn btn-outline" onclick="testEmailConnection()">
                            <span class="btn-icon">📧</span>
                            Test kết nối
                        </button>
                    </div>
                </div>
            </div>

            <!-- Payment Settings -->
            <div class="settings-tab" id="payment-tab">
                <div class="settings-section">
                    <h3 class="section-title">Cấu hình thanh toán</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Phí vận chuyển mặc định (VNĐ)</label>
                            <input type="number" id="defaultShippingFee" class="form-input" value="30000" min="0">
                            <p class="setting-description">Phí vận chuyển mặc định</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Miễn phí vận chuyển từ (VNĐ)</label>
                            <input type="number" id="freeShippingThreshold" class="form-input" value="500000" min="0">
                            <p class="setting-description">Miễn phí vận chuyển khi đơn hàng từ số tiền này</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Phí xử lý (%)</label>
                            <input type="number" id="processingFee" class="form-input" value="2.5" min="0" max="10" step="0.1">
                            <p class="setting-description">Phí xử lý đơn hàng</p>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="section-title">Cấu hình ví điện tử</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">MoMo Partner Code</label>
                            <input type="text" id="momoPartnerCode" class="form-input" placeholder="Partner code">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">MoMo Access Key</label>
                            <input type="text" id="momoAccessKey" class="form-input" placeholder="Access key">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">MoMo Secret Key</label>
                            <input type="password" id="momoSecretKey" class="form-input" placeholder="Secret key">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notifications Settings -->
            <div class="settings-tab" id="notifications-tab">
                <div class="settings-section">
                    <h3 class="section-title">Cài đặt thông báo</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Thông báo đơn hàng mới</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifyNewOrders" checked>
                                <label for="notifyNewOrders"></label>
                            </div>
                            <p class="setting-description">Gửi email khi có đơn hàng mới</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Thông báo người dùng mới</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifyNewUsers" checked>
                                <label for="notifyNewUsers"></label>
                            </div>
                            <p class="setting-description">Gửi email khi có người dùng mới đăng ký</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Thông báo sản phẩm mới</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifyNewProducts" checked>
                                <label for="notifyNewProducts"></label>
                            </div>
                            <p class="setting-description">Gửi email khi có sản phẩm mới</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Thông báo đánh giá mới</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifyNewReviews" checked>
                                <label for="notifyNewReviews"></label>
                            </div>
                            <p class="setting-description">Gửi email khi có đánh giá mới</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Maintenance Settings -->
            <div class="settings-tab" id="maintenance-tab">
                <div class="settings-section">
                    <h3 class="section-title">Chế độ bảo trì</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Bật chế độ bảo trì</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="maintenanceMode" onchange="toggleMaintenanceMode()">
                                <label for="maintenanceMode"></label>
                            </div>
                            <p class="setting-description">Tạm thời đóng website để bảo trì</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Thông báo bảo trì</label>
                            <textarea id="maintenanceMessage" class="form-textarea" placeholder="Website đang được bảo trì, vui lòng quay lại sau..."></textarea>
                            <p class="setting-description">Thông báo hiển thị cho người dùng</p>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="section-title">Dọn dẹp hệ thống</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">Xóa cache</label>
                            <button class="btn btn-outline" onclick="clearCache()">
                                <span class="btn-icon">🗑️</span>
                                Xóa cache
                            </button>
                            <p class="setting-description">Xóa tất cả cache của hệ thống</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Xóa logs cũ</label>
                            <button class="btn btn-outline" onclick="clearOldLogs()">
                                <span class="btn-icon">📄</span>
                                Xóa logs
                            </button>
                            <p class="setting-description">Xóa logs cũ hơn 30 ngày</p>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Tối ưu database</label>
                            <button class="btn btn-outline" onclick="optimizeDatabase()">
                                <span class="btn-icon">⚡</span>
                                Tối ưu DB
                            </button>
                            <p class="setting-description">Tối ưu hóa database</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>
