<?php 
$pageTitle='Tài khoản ngân hàng - Bookverse'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/bank-account.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'assets/js/main.js', 'assets/js/pages/bank-account.js'];
include '../../includes/header.php'; 
?>


<main class="seller-main">
    <div class="container">
            <!-- Main Content -->
            <div class="seller-content">
                <div class="content-header">
                    <h1>Tài khoản ngân hàng</h1>
                    <p>Quản lý thông tin tài khoản ngân hàng để nhận thanh toán</p>
                </div>

                <!-- Bank Account Status -->
                <div class="bank-status" id="bankStatus">
                    <div class="status-card">
                        <div class="status-icon">🏦</div>
                        <div class="status-info">
                            <h3>Trạng thái tài khoản</h3>
                            <div class="status-badge" id="accountStatus">Chưa cập nhật</div>
                        </div>
                    </div>
                </div>

                <!-- Bank Account Form -->
                <div class="bank-form-section">
                    <h2>Thông tin tài khoản ngân hàng</h2>
                    <form class="bank-form" id="bankForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="bankName">Tên ngân hàng *</label>
                                <select id="bankName" name="bankName" required>
                                    <option value="">Chọn ngân hàng</option>
                                    <option value="Vietcombank">Vietcombank</option>
                                    <option value="VietinBank">VietinBank</option>
                                    <option value="BIDV">BIDV</option>
                                    <option value="Agribank">Agribank</option>
                                    <option value="Techcombank">Techcombank</option>
                                    <option value="ACB">ACB</option>
                                    <option value="Sacombank">Sacombank</option>
                                    <option value="MB Bank">MB Bank</option>
                                    <option value="VPBank">VPBank</option>
                                    <option value="TPBank">TPBank</option>
                                    <option value="MSB">MSB</option>
                                    <option value="HDBank">HDBank</option>
                                    <option value="VIB">VIB</option>
                                    <option value="SHB">SHB</option>
                                    <option value="Eximbank">Eximbank</option>
                                    <option value="SeABank">SeABank</option>
                                    <option value="LienVietPostBank">LienVietPostBank</option>
                                    <option value="DongA Bank">DongA Bank</option>
                                    <option value="KienLongBank">KienLongBank</option>
                                    <option value="Nam A Bank">Nam A Bank</option>
                                    <option value="NCB">NCB</option>
                                    <option value="OCB">OCB</option>
                                    <option value="PGBank">PGBank</option>
                                    <option value="PublicBank">PublicBank</option>
                                    <option value="PVcomBank">PVcomBank</option>
                                    <option value="SCB">SCB</option>
                                    <option value="VietABank">VietABank</option>
                                    <option value="VietBank">VietBank</option>
                                    <option value="VietCapitalBank">VietCapitalBank</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="accountNumber">Số tài khoản *</label>
                                <input type="text" id="accountNumber" name="accountNumber" required 
                                       placeholder="Nhập số tài khoản" />
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="accountHolder">Tên chủ tài khoản *</label>
                                <input type="text" id="accountHolder" name="accountHolder" required 
                                       placeholder="Nhập tên chủ tài khoản" />
                            </div>
                            
                            <div class="form-group">
                                <label for="branch">Chi nhánh (tùy chọn)</label>
                                <input type="text" id="branch" name="branch" 
                                       placeholder="Nhập tên chi nhánh" />
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <span class="btn-icon">💾</span>
                                Lưu thông tin
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancelBtn">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Current Bank Account Info -->
                <div class="current-account" id="currentAccount" style="display: none;">
                    <h2>Thông tin tài khoản hiện tại</h2>
                    <div class="account-info">
                        <div class="info-item">
                            <span class="info-label">Ngân hàng:</span>
                            <span class="info-value" id="currentBankName">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Số tài khoản:</span>
                            <span class="info-value" id="currentAccountNumber">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Chủ tài khoản:</span>
                            <span class="info-value" id="currentAccountHolder">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Chi nhánh:</span>
                            <span class="info-value" id="currentBranch">-</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Trạng thái:</span>
                            <span class="info-value" id="currentStatus">-</span>
                        </div>
                    </div>
                    
                    <div class="account-actions">
                        <button class="btn btn-outline" id="editAccountBtn">
                            <span class="btn-icon">✏️</span>
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

                <!-- Payment History -->
                <div class="payment-history">
                    <h2>Lịch sử thanh toán</h2>
                    <div class="history-list" id="paymentHistory">
                        <div class="loading-state">
                            <div class="loading-spinner"></div>
                            <p>Đang tải lịch sử thanh toán...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Success Modal -->
<div class="modal" id="successModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Thành công</h3>
            <button class="modal-close" id="closeSuccessModal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="success-icon">✅</div>
            <p id="successMessage">Thông tin tài khoản ngân hàng đã được cập nhật thành công!</p>
            <p class="modal-note">Admin sẽ xem xét và xác minh thông tin của bạn trong thời gian sớm nhất.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" id="confirmSuccessModal">Đã hiểu</button>
        </div>
    </div>
</div>

<?php include '../../includes/footer.php'; ?>
