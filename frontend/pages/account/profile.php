<?php 
$pageTitle='Hồ sơ cá nhân'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/account.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js', '../../assets/js/pages/profile.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-layout">
            <!-- Sidebar -->
            <aside class="account-sidebar">
                <div class="account-nav">
                    <h3>Tài khoản</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="profile.php" class="nav-link active">
                                <span class="nav-icon">👤</span>
                                Hồ sơ cá nhân
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="orders.php" class="nav-link">
                                <span class="nav-icon">📦</span>
                                Đơn hàng
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="wishlist.php" class="nav-link">
                                <span class="nav-icon">❤️</span>
                                Danh sách yêu thích
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="wallet.php" class="nav-link">
                                <span class="nav-icon">💰</span>
                                Ví điện tử
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="reviews.php" class="nav-link">
                                <span class="nav-icon">⭐</span>
                                Đánh giá của tôi
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="settings.php" class="nav-link">
                                <span class="nav-icon">⚙️</span>
                                Cài đặt
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="account-content">
                <div class="account-header">
                    <h1>Hồ sơ cá nhân</h1>
                    <p>Cập nhật thông tin cá nhân của bạn</p>
                </div>

                <div class="profile-container">
                    <!-- Profile Form -->
                    <form id="profileForm" class="profile-form">
                        <div id="profileError" class="error-message" style="display: none;"></div>
                        <div id="profileSuccess" class="success-message" style="display: none;"></div>

                        <!-- Avatar Section -->
                        <div class="profile-avatar-section">
                            <div class="avatar-container">
                                <div class="avatar-preview" id="avatarPreview">
                                    <img src="../../assets/images/default-avatar.svg" alt="Avatar" id="avatarImage" />
                                </div>
                                <div class="avatar-actions">
                                    <input type="file" id="avatarInput" accept="image/*" style="display: none;" />
                                    <button type="button" class="btn btn-outline" onclick="document.getElementById('avatarInput').click()">
                                        <span class="btn-icon">📷</span>
                                        Thay đổi ảnh
                                    </button>
                                    <button type="button" class="btn btn-text" id="removeAvatar">
                                        <span class="btn-icon">🗑️</span>
                                        Xóa ảnh
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Personal Information -->
                        <div class="form-section">
                            <h3>Thông tin cá nhân</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">Họ</label>
                                    <input type="text" id="firstName" name="firstName" placeholder="Nhập họ của bạn" />
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Tên</label>
                                    <input type="text" id="lastName" name="lastName" placeholder="Nhập tên của bạn" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="username">Tên đăng nhập</label>
                                <input type="text" id="username" name="username" readonly />
                                <small class="form-help">Tên đăng nhập không thể thay đổi</small>
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" readonly />
                                <small class="form-help">Email không thể thay đổi</small>
                            </div>

                            <div class="form-group">
                                <label for="phone">Số điện thoại</label>
                                <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại" />
                            </div>
                        </div>

                        <!-- Address Information -->
                        <div class="form-section">
                            <h3>Địa chỉ</h3>
                            
                            <div class="form-group">
                                <label for="street">Địa chỉ</label>
                                <input type="text" id="street" name="street" placeholder="Số nhà, tên đường" />
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">Thành phố</label>
                                    <input type="text" id="city" name="city" placeholder="Thành phố" />
                                </div>
                                <div class="form-group">
                                    <label for="state">Tỉnh/Thành phố</label>
                                    <input type="text" id="state" name="state" placeholder="Tỉnh/Thành phố" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="zipCode">Mã bưu điện</label>
                                    <input type="text" id="zipCode" name="zipCode" placeholder="Mã bưu điện" />
                                </div>
                                <div class="form-group">
                                    <label for="country">Quốc gia</label>
                                    <select id="country" name="country">
                                        <option value="Vietnam">Việt Nam</option>
                                        <option value="USA">Hoa Kỳ</option>
                                        <option value="UK">Anh</option>
                                        <option value="Japan">Nhật Bản</option>
                                        <option value="Korea">Hàn Quốc</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Account Settings -->
                        <div class="form-section">
                            <h3>Cài đặt tài khoản</h3>
                            
                            <div class="form-group">
                                <label for="role">Vai trò</label>
                                <input type="text" id="role" name="role" readonly />
                                <small class="form-help">Vai trò được xác định bởi hệ thống</small>
                            </div>

                            <div class="form-group">
                                <label for="joinDate">Ngày tham gia</label>
                                <input type="text" id="joinDate" name="joinDate" readonly />
                            </div>

                            <div class="form-group">
                                <label for="lastLogin">Lần đăng nhập cuối</label>
                                <input type="text" id="lastLogin" name="lastLogin" readonly />
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancelBtn">
                                <span class="btn-icon">↶</span>
                                Hủy
                            </button>
                            <button type="submit" class="btn btn-primary" id="saveBtn">
                                <span class="btn-text">Lưu thay đổi</span>
                                <span class="btn-loading" style="display: none;">⏳</span>
                            </button>
                        </div>
                    </form>

                    <!-- Change Password Section -->
                    <div class="password-section">
                        <h3>Đổi mật khẩu</h3>
                        <form id="passwordForm" class="password-form">
                            <div id="passwordError" class="error-message" style="display: none;"></div>
                            <div id="passwordSuccess" class="success-message" style="display: none;"></div>

                            <div class="form-group">
                                <label for="currentPassword">Mật khẩu hiện tại</label>
                                <div class="input-with-icon">
                                    <input type="password" id="currentPassword" name="currentPassword" required />
                                    <button type="button" class="eye-btn" onclick="togglePassword('currentPassword', this)">👁️</button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newPassword">Mật khẩu mới</label>
                                <div class="input-with-icon">
                                    <input type="password" id="newPassword" name="newPassword" required />
                                    <button type="button" class="eye-btn" onclick="togglePassword('newPassword', this)">👁️</button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="confirmNewPassword">Xác nhận mật khẩu mới</label>
                                <div class="input-with-icon">
                                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required />
                                    <button type="button" class="eye-btn" onclick="togglePassword('confirmNewPassword', this)">👁️</button>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary" id="changePasswordBtn">
                                    <span class="btn-text">Đổi mật khẩu</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>
<?php include __DIR__.'/../../includes/footer.php'; ?>