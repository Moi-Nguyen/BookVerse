<?php 
$pageTitle='Rút tiền - Bookverse'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/wallet.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'assets/js/main.js', 'assets/js/pages/withdrawal.js'];
include '../../includes/header.php'; 
?>

<main class="seller-main">
    <div class="container">
        <!-- Main Content -->
        <div class="seller-content">
            <div class="content-header">
                <h1>Rút tiền</h1>
                <p>Yêu cầu rút tiền từ tài khoản của bạn</p>
            </div>

            <!-- Wallet Balance -->
            <div class="wallet-balance">
                <div class="balance-card">
                    <div class="balance-icon">💰</div>
                    <div class="balance-info">
                        <h3>Số dư hiện tại</h3>
                        <div class="balance-amount" id="currentBalance">0₫</div>
                    </div>
                    <div class="balance-actions">
                        <button class="btn btn-outline" onclick="window.location.href='bank-account.php'" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
                            <span class="btn-icon">🏦</span>
                            Quản lý tài khoản ngân hàng
                        </button>
                    </div>
                </div>
            </div>

            <!-- Withdrawal Form -->
            <div class="bank-form-section">
                <h2>Yêu cầu rút tiền</h2>
                <form class="bank-form" id="withdrawalForm">
                    <div class="form-group">
                        <label for="amount">Số tiền muốn rút (VND) *</label>
                        <input type="number" id="amount" name="amount" required 
                               min="50000" step="1000" 
                               placeholder="Nhập số tiền (tối thiểu 50,000 VND)" />
                        <small class="form-hint">Số tiền tối thiểu: 50,000 VND</small>
                    </div>

                    <div class="form-group">
                        <label for="notes">Ghi chú (tùy chọn)</label>
                        <textarea id="notes" name="notes" rows="3" 
                                  placeholder="Thêm ghi chú cho yêu cầu rút tiền..."></textarea>
                    </div>

                    <div class="form-info" style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                        <div class="info-item" style="display: flex; align-items: start; gap: 0.75rem; margin-bottom: 1rem;">
                            <span class="info-icon" style="font-size: 1.25rem;">ℹ️</span>
                            <span class="info-text" style="color: #6b7280; line-height: 1.6;">Yêu cầu rút tiền sẽ được gửi đến admin để xem xét và duyệt</span>
                        </div>
                        <div class="info-item" style="display: flex; align-items: start; gap: 0.75rem; margin-bottom: 1rem;">
                            <span class="info-icon" style="font-size: 1.25rem;">⏱️</span>
                            <span class="info-text" style="color: #6b7280; line-height: 1.6;">Thời gian xử lý: 1-3 ngày làm việc</span>
                        </div>
                        <div class="info-item" style="display: flex; align-items: start; gap: 0.75rem;">
                            <span class="info-icon" style="font-size: 1.25rem;">🏦</span>
                            <span class="info-text" style="color: #6b7280; line-height: 1.6;">Tiền sẽ được chuyển vào tài khoản ngân hàng đã đăng ký</span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <span class="btn-icon">💸</span>
                            <span class="btn-text">Gửi yêu cầu rút tiền</span>
                            <span class="btn-loading" style="display: none;">⏳</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelBtn">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>

            <!-- Withdrawal History -->
            <div class="payment-history">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2>Lịch sử rút tiền</h2>
                    <select id="statusFilter" class="filter-select" style="padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white;">
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="completed">Đã duyệt</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div class="history-list" id="withdrawalHistory">
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Đang tải lịch sử rút tiền...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Success Modal -->
<div class="modal" id="successModal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>Yêu cầu rút tiền đã được gửi</h3>
            <button class="modal-close" id="closeSuccessModal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="success-icon">✅</div>
            <p id="successMessage">Yêu cầu rút tiền của bạn đã được gửi thành công!</p>
            <p class="modal-note">Admin sẽ xem xét và xử lý yêu cầu của bạn trong thời gian sớm nhất.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" id="confirmSuccessModal">Đã hiểu</button>
        </div>
    </div>
</div>

<?php include '../../includes/footer.php'; ?>

