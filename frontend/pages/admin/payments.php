<?php 
$pageTitle='Quản lý thanh toán'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-payments.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-payments.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Payments Management -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">💳</span>
                    Quản lý thanh toán
                </h1>
                <p class="page-subtitle">Theo dõi giao dịch và yêu cầu rút tiền từ seller</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="exportPayments()">
                    <span class="btn-icon">📊</span>
                    Xuất báo cáo
                </button>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            <button class="tab active" onclick="switchTab('withdrawals')">
                💰 Yêu cầu rút tiền
            </button>
            <button class="tab" onclick="switchTab('transactions')">
                💳 Giao dịch
            </button>
        </div>

        <!-- Withdrawals Tab -->
        <div id="withdrawalsTab" class="tab-content active">
            <!-- Stats Cards -->
            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <h3 id="totalWithdrawals">0</h3>
                        <p>Tổng yêu cầu</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-content">
                        <h3 id="pendingWithdrawals">0</h3>
                        <p>Chờ duyệt</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <h3 id="completedWithdrawals">0</h3>
                        <p>Đã duyệt</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💵</div>
                    <div class="stat-content">
                        <h3 id="totalWithdrawalAmount">0₫</h3>
                        <p>Tổng đã rút</p>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters-section">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label class="filter-label">Tìm kiếm</label>
                        <input type="text" id="withdrawalSearch" class="form-input" placeholder="Mã GD, mô tả..." onkeyup="loadWithdrawals()">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Trạng thái</label>
                        <select id="withdrawalStatusFilter" class="form-select" onchange="loadWithdrawals()">
                            <option value="">Tất cả</option>
                            <option value="pending">⏳ Chờ duyệt</option>
                            <option value="completed">✅ Đã duyệt</option>
                            <option value="failed">❌ Từ chối</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Từ ngày</label>
                        <input type="date" id="withdrawalFromDate" class="form-input" onchange="loadWithdrawals()">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Đến ngày</label>
                        <input type="date" id="withdrawalToDate" class="form-input" onchange="loadWithdrawals()">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" onclick="clearWithdrawalFilters()">
                            <span class="btn-icon">🔄</span>
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            <!-- Withdrawals Table -->
            <div class="table-section">
                <div class="table-header">
                    <div class="table-info">
                        <h3>Danh sách yêu cầu rút tiền</h3>
                        <span class="table-count" id="withdrawalCount">0 yêu cầu</span>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Mã GD</th>
                                <th>Seller</th>
                                <th>Số tiền</th>
                                <th>Thông tin ngân hàng</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="withdrawalsTableBody">
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 40px;">
                                    <div style="font-size: 48px; margin-bottom: 16px;">💳</div>
                                    <h3>Đang tải dữ liệu...</h3>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Transactions Tab -->
        <div id="transactionsTab" class="tab-content">
            <!-- Stats Cards -->
            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <h3 id="totalRevenue">0₫</h3>
                        <p>Tổng doanh thu</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <h3 id="successPayments">0</h3>
                        <p>Thành công</p>
                    </div>
                </div>
            <div class="stat-card">
                <div class="stat-icon">💸</div>
                <div class="stat-content">
                    <h3 id="totalTransactions">0</h3>
                    <p>Tổng giao dịch</p>
                </div>
            </div>
                <div class="stat-card">
                    <div class="stat-icon">❌</div>
                    <div class="stat-content">
                        <h3 id="failedPayments">0</h3>
                        <p>Thất bại</p>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters-section">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label class="filter-label">Tìm kiếm</label>
                        <input type="text" id="transactionSearch" class="form-input" placeholder="Mã GD, mô tả..." onkeyup="loadTransactions()">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Loại</label>
                        <select id="transactionTypeFilter" class="form-select" onchange="loadTransactions()">
                            <option value="">Tất cả</option>
                            <option value="deposit">💰 Nạp tiền</option>
                            <option value="withdrawal">💸 Rút tiền</option>
                            <option value="commission">💼 Hoa hồng</option>
                            <option value="refund">↩️ Hoàn tiền</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Trạng thái</label>
                        <select id="transactionStatusFilter" class="form-select" onchange="loadTransactions()">
                            <option value="">Tất cả</option>
                            <option value="completed">✅ Thành công</option>
                            <option value="failed">❌ Thất bại</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Phương thức</label>
                        <select id="transactionMethodFilter" class="form-select" onchange="loadTransactions()">
                            <option value="">Tất cả</option>
                            <option value="bank_transfer">🏦 Chuyển khoản</option>
                            <option value="cash">💵 Tiền mặt</option>
                            <option value="online_payment">💳 Online</option>
                            <option value="sepay">📱 SePay</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Từ ngày</label>
                        <input type="date" id="transactionFromDate" class="form-input" onchange="loadTransactions()">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Đến ngày</label>
                        <input type="date" id="transactionToDate" class="form-input" onchange="loadTransactions()">
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" onclick="clearTransactionFilters()">
                            <span class="btn-icon">🔄</span>
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            <!-- Transactions Table -->
            <div class="table-section">
                <div class="table-header">
                    <div class="table-info">
                        <h3>Danh sách giao dịch</h3>
                        <span class="table-count" id="transactionCount">0 giao dịch</span>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Mã GD</th>
                                <th>Người dùng</th>
                                <th>Loại</th>
                                <th>Số tiền</th>
                                <th>Phương thức</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="transactionsTableBody">
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 40px;">
                                    <div style="font-size: 48px; margin-bottom: 16px;">💳</div>
                                    <h3>Đang tải dữ liệu...</h3>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Withdrawal Detail Modal -->
<div id="withdrawalDetailModal" class="modal" style="display: none;">
    <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
            <h3>Chi tiết yêu cầu rút tiền</h3>
            <button class="modal-close" onclick="closeWithdrawalModal()">&times;</button>
        </div>
        <div id="withdrawalDetails" class="modal-body">
            <!-- Details will be loaded here -->
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>
