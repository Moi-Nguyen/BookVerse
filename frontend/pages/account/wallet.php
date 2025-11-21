<?php 
// Use safe auth check (no redirect)
require_once __DIR__.'/../../includes/auth-check-safe.php';

$pageTitle='Ví điện tử - Bookverse'; 
$extraCss=['assets/css/account.css', 'assets/css/wallet.css']; 
$extraJs=[
    'assets/js/pages/account-auth-guard.js',
    'assets/js/pages/wallet.js'
];
include '../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-content">
                <div class="account-header">
                    <h1>Ví điện tử</h1>
                    <p>Quản lý số dư và lịch sử giao dịch</p>
                </div>

                <!-- Wallet Balance -->
                <div class="wallet-balance">
                    <div class="balance-card">
                        <div class="balance-icon">💰</div>
                        <div class="balance-info">
                            <h3>Số dư hiện tại</h3>
                            <div class="balance-amount" id="walletBalance">0 VND</div>
                        </div>
                    </div>
                </div>

                <!-- Deposit Section -->
                <div class="qr-deposit-container">
                    <h2>Nạp tiền vào ví</h2>
                    <div class="qr-controls">
                        <div class="form-group">
                            <label for="depositAmount">Số tiền nạp (VND) - Tùy chọn</label>
                            <input type="number" id="depositAmount" name="amount" min="1000" step="1000" placeholder="Nhập số tiền để quét nhanh hơn" />
                            <small class="form-help">Nhập số tiền để QR code tự động cập nhật, hoặc để trống để tự nhập trong app ngân hàng</small>
                        </div>
                    </div>
                    
                    <!-- QR Code Display -->
                    <div class="qr-display" id="qrDisplay">
                        <div class="qr-code-wrapper">
                            <h3>Quét mã QR để nạp tiền</h3>
                            <div class="qr-code-container">
                                <div class="qr-loading" id="qrLoading" style="display: flex; align-items: center; justify-content: center; min-height: 300px;">
                                    <div style="text-align: center;">
                                        <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid var(--border-color, #4b5563); border-top: 4px solid var(--primary-color, #667eea); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                                        <p style="color: var(--text-secondary, #d1d5db);">Đang tạo mã QR...</p>
                                    </div>
                                </div>
                                <img id="qrCodeImage" src="" alt="QR Code" style="display: none;" />
                            </div>
                            <div class="qr-info">
                                <p class="qr-amount" id="qrAmountInfo"></p>
                                <p class="qr-note">💡 Quét mã QR bằng app ngân hàng của bạn để thanh toán</p>
                                <p class="qr-note-small" id="qrNoteSmall"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment History -->
                <div class="payment-history">
                    <div class="section-header">
                        <h2>Lịch sử giao dịch</h2>
                        <div class="filter-controls">
                            <select id="statusFilter" class="filter-select">
                                <option value="">Tất cả trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="failed">Thất bại</option>
                            </select>
                            <select id="typeFilter" class="filter-select">
                                <option value="">Tất cả loại</option>
                                <option value="deposit">Nạp tiền</option>
                                <option value="withdrawal">Rút tiền</option>
                                <option value="payment">Thanh toán</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="history-list" id="paymentHistory">
                        <!-- Payment history will be loaded here -->
                        <div class="loading-state">
                            <div class="loading-spinner"></div>
                            <p>Đang tải lịch sử giao dịch...</p>
                        </div>
                    </div>
                    
                    <div class="pagination" id="pagination">
                        <!-- Pagination will be loaded here -->
                    </div>
                </div>
        </div>
    </div>
</main>

<!-- Deposit Success Modal -->
<div class="modal" id="depositModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modalTitle">Yêu cầu nạp tiền</h3>
            <button class="modal-close" id="closeDepositModal">&times;</button>
        </div>
        <div class="modal-body">
            <!-- SePay Payment Section -->
            <div id="sepayPaymentSection" style="display: none;">
                <div class="success-icon">💳</div>
                <p>Quét mã QR hoặc click vào link để thanh toán</p>
                <div class="sepay-payment-info">
                    <div class="qr-code-container" id="qrCodeContainer">
                        <img id="qrCodeImage" src="" alt="QR Code" style="max-width: 300px; margin: 20px auto; display: block;">
                    </div>
                    <div class="payment-url-container" style="margin: 20px 0;">
                        <a href="#" id="paymentUrlLink" target="_blank" class="btn btn-primary" style="display: block; text-align: center; text-decoration: none;">
                            🔗 Thanh toán qua SePay
                        </a>
                    </div>
                    <div class="deposit-details">
                        <div class="detail-item">
                            <span class="detail-label">Số tiền:</span>
                            <span class="detail-value" id="modalAmount">0 VND</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Mã đơn hàng:</span>
                            <span class="detail-value" id="modalOrderId">-</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Trạng thái:</span>
                            <span class="detail-value status-pending" id="modalStatus">Đang chờ thanh toán</span>
                        </div>
                    </div>
                    <p class="modal-note" style="margin-top: 20px; color: #666; font-size: 0.9rem;">
                        ⏱️ Hệ thống sẽ tự động cập nhật số dư khi thanh toán thành công. Vui lòng không đóng trang này.
                    </p>
                </div>
            </div>
            
            <!-- Regular Deposit Section -->
            <div id="regularDepositSection">
                <div class="success-icon">✅</div>
                <p>Yêu cầu nạp tiền của bạn đã được gửi thành công!</p>
                <div class="deposit-details">
                    <div class="detail-item">
                        <span class="detail-label">Số tiền:</span>
                        <span class="detail-value" id="modalAmountRegular">0 VND</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phương thức:</span>
                        <span class="detail-value" id="modalMethod">-</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Trạng thái:</span>
                        <span class="detail-value status-pending">Chờ admin xử lý</span>
                    </div>
                </div>
                <p class="modal-note">Admin sẽ xem xét và xử lý yêu cầu của bạn trong thời gian sớm nhất.</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" id="confirmDepositModal">Đã hiểu</button>
        </div>
    </div>
</div>

<?php include '../../includes/footer.php'; ?>
