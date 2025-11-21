<?php 
$pageTitle='Quản lý đơn hàng';
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-orders.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-orders.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Orders Management -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">📦</span>
                    Quản lý đơn hàng
                </h1>
                <p class="page-subtitle">Theo dõi và quản lý tất cả đơn hàng trên hệ thống</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="exportOrders()">
                    <span class="btn-icon">📊</span>
                    Xuất Excel
                </button>
                <button class="btn btn-primary" onclick="showBulkActions()">
                    <span class="btn-icon">⚡</span>
                    Thao tác hàng loạt
                </button>
            </div>
        </div>

        <!-- Order Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon pending">⏳</div>
                <div class="stat-content">
                    <div class="stat-value" id="pendingOrders">0</div>
                    <div class="stat-label">Chờ xử lý</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon processing">🔄</div>
                <div class="stat-content">
                    <div class="stat-value" id="processingOrders">0</div>
                    <div class="stat-label">Đang xử lý</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon shipped">🚚</div>
                <div class="stat-content">
                    <div class="stat-value" id="shippedOrders">0</div>
                    <div class="stat-label">Đã giao</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon completed">✅</div>
                <div class="stat-content">
                    <div class="stat-value" id="completedOrders">0</div>
                    <div class="stat-label">Hoàn thành</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon cancelled">❌</div>
                <div class="stat-content">
                    <div class="stat-value" id="cancelledOrders">0</div>
                    <div class="stat-label">Đã hủy</div>
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="filters-section">
            <div class="filters-grid">
                <div class="filter-group">
                    <label class="filter-label">Tìm kiếm</label>
                    <input type="text" id="searchInput" class="form-input" placeholder="Tìm theo mã đơn hàng, tên khách hàng...">
                </div>
                <div class="filter-group">
                    <label class="filter-label">Trạng thái</label>
                    <select id="statusFilter" class="form-select">
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao</option>
                        <option value="delivered">Đã nhận</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Phương thức thanh toán</label>
                    <select id="paymentFilter" class="form-select">
                        <option value="">Tất cả phương thức</option>
                        <option value="cod">Thanh toán khi nhận hàng</option>
                        <option value="bank">Chuyển khoản</option>
                        <option value="momo">MoMo</option>
                        <option value="zalopay">ZaloPay</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Khoảng thời gian</label>
                    <select id="dateFilter" class="form-select">
                        <option value="">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                    </select>
                </div>
            </div>
            <div class="filters-actions">
                <button class="btn btn-outline" onclick="clearFilters()">
                    <span class="btn-icon">🔄</span>
                    Xóa bộ lọc
                </button>
                <button class="btn btn-primary" onclick="applyFilters()">
                    <span class="btn-icon">🔍</span>
                    Áp dụng bộ lọc
                </button>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="table-section">
            <div class="table-header">
                <div class="table-info">
                    <span id="ordersCount">0 đơn hàng</span>
                    <span class="table-subtitle">Hiển thị 1-10 của 0</span>
                </div>
                <div class="table-actions">
                    <button class="btn btn-sm btn-outline" onclick="refreshOrders()">
                        <span class="btn-icon">🔄</span>
                        Làm mới
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                            </th>
                            <th>Mã đơn hàng</th>
                            <th>Khách hàng</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <!-- Orders will be loaded here -->
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-section">
                <div class="pagination-info">
                    <span id="paginationInfo">Hiển thị 1-10 của 0 đơn hàng</span>
                </div>
                <div class="pagination-controls" id="paginationControls">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Order Detail Modal -->
<div id="orderDetailModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Chi tiết đơn hàng</h3>
            <button class="modal-close" onclick="closeOrderDetail()">&times;</button>
        </div>
        <div class="modal-body" id="orderDetailContent">
            <!-- Order details will be loaded here -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeOrderDetail()">Đóng</button>
            <button class="btn btn-primary" onclick="updateOrderStatus()">Cập nhật trạng thái</button>
        </div>
    </div>
</div>

<!-- Bulk Actions Modal -->
<div id="bulkActionsModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Thao tác hàng loạt</h3>
            <button class="modal-close" onclick="closeBulkActions()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="bulk-actions-grid">
                <button class="bulk-action-btn" onclick="bulkUpdateStatus('processing')">
                    <span class="action-icon">🔄</span>
                    <span class="action-text">Chuyển sang "Đang xử lý"</span>
                </button>
                <button class="bulk-action-btn" onclick="bulkUpdateStatus('shipped')">
                    <span class="action-icon">🚚</span>
                    <span class="action-text">Chuyển sang "Đã giao"</span>
                </button>
                <button class="bulk-action-btn" onclick="bulkUpdateStatus('delivered')">
                    <span class="action-icon">✅</span>
                    <span class="action-text">Chuyển sang "Hoàn thành"</span>
                </button>
                <button class="bulk-action-btn" onclick="bulkUpdateStatus('cancelled')">
                    <span class="action-icon">❌</span>
                    <span class="action-text">Hủy đơn hàng</span>
                </button>
            </div>
        </div>
    </div>
</div>


<?php include __DIR__.'/../../includes/footer.php'; ?>
