<?php 
$pageTitle='Ví điện tử - Bookverse'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/account.css', '../../assets/css/wallet.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/pages/wallet.js'];
include '../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-layout">
            <!-- Sidebar -->
            <aside class="account-sidebar">
                <div class="sidebar-header">
                    <h3>Tài khoản của tôi</h3>
                </div>
                <nav class="sidebar-nav">
                    <a href="profile.php" class="nav-item">
                        <span class="nav-icon">👤</span>
                        <span class="nav-text">Thông tin cá nhân</span>
                    </a>
                    <a href="orders.php" class="nav-item">
                        <span class="nav-icon">📦</span>
                        <span class="nav-text">Đơn hàng của tôi</span>
                    </a>
                    <a href="wishlist.php" class="nav-item">
                        <span class="nav-icon">❤️</span>
                        <span class="nav-text">Danh sách yêu thích</span>
                    </a>
                    <a href="wallet.php" class="nav-item active">
                        <span class="nav-icon">💰</span>
                        <span class="nav-text">Ví điện tử</span>
                    </a>
                </nav>
            </aside>

            <!-- Main Content -->
            <div class="account-content">
                <div class="content-header">
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
                <div class="deposit-section">
                    <h2>Nạp tiền vào ví</h2>
                    <form class="deposit-form" id="depositForm">
                        <div class="form-group">
                            <label for="depositAmount">Số tiền nạp (VND)</label>
                            <input type="number" id="depositAmount" name="amount" min="1000" step="1000" required />
                            <small class="form-help">Số tiền tối thiểu: 1,000 VND</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="depositMethod">Phương thức thanh toán</label>
                            <select id="depositMethod" name="method" required>
                                <option value="">Chọn phương thức</option>
                                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                                <option value="cash">Thanh toán tiền mặt</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="depositDescription">Ghi chú (tùy chọn)</label>
                            <textarea id="depositDescription" name="description" rows="3" placeholder="Nhập ghi chú cho giao dịch..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">💳</span>
                            Nạp tiền
                        </button>
                    </form>
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
    </div>
</main>

<!-- Deposit Success Modal -->
<div class="modal" id="depositModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Yêu cầu nạp tiền</h3>
            <button class="modal-close" id="closeDepositModal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="success-icon">✅</div>
            <p>Yêu cầu nạp tiền của bạn đã được gửi thành công!</p>
            <div class="deposit-details">
                <div class="detail-item">
                    <span class="detail-label">Số tiền:</span>
                    <span class="detail-value" id="modalAmount">0 VND</span>
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
        <div class="modal-footer">
            <button class="btn btn-primary" id="confirmDepositModal">Đã hiểu</button>
        </div>
    </div>
</div>

<?php include '../../includes/footer.php'; ?>
