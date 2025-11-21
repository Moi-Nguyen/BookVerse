<?php 
$pageTitle='Quản lý đơn hàng'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/seller-orders.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'assets/js/main.js', 'assets/js/seller.js', 'assets/js/pages/seller-orders.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="dashboard.php">Dashboard</a></li>
            <li aria-current="page">Quản lý đơn hàng</li>
        </ol>
    </div>
</nav>

<main class="seller-main">
    <div class="container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <div class="header-info">
                    <h1>Quản lý đơn hàng</h1>
                    <p>Theo dõi và xử lý đơn hàng của bạn</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-outline" id="exportOrdersBtn">
                        <span class="btn-icon">📊</span>
                        <span>Xuất báo cáo</span>
                    </button>
                    <button class="btn btn-primary" id="refreshOrdersBtn">
                        <span class="btn-icon">🔄</span>
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Order Filters -->
        <div class="orders-filters">
            <div class="filters-left">
                <div class="search-box">
                    <input type="text" id="orderSearch" placeholder="Tìm kiếm đơn hàng..." autocomplete="off" />
                    <button class="search-btn" id="searchBtn" type="button">
                        <span class="search-icon">🔍</span>
                    </button>
                </div>
                
                <select id="statusFilter" class="filter-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã giao</option>
                    <option value="delivered">Đã nhận</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
                
                <select id="dateFilter" class="filter-select">
                    <option value="">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                </select>
            </div>
            
            <div class="filters-right">
                <select id="sortFilter" class="filter-select">
                    <option value="-createdAt">Mới nhất</option>
                    <option value="createdAt">Cũ nhất</option>
                    <option value="-total">Tổng tiền (Giảm dần)</option>
                    <option value="total">Tổng tiền (Tăng dần)</option>
                </select>
                
                <div class="view-toggle">
                    <button class="view-btn active" data-view="table" title="Xem dạng bảng" type="button">
                        <span>⊞</span>
                    </button>
                    <button class="view-btn" data-view="cards" title="Xem dạng thẻ" type="button">
                        <span>☰</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Batch Actions -->
        <div class="batch-actions" id="batchActions" style="display: none;">
            <div class="batch-info">
                <span id="selectedCount">0</span> đơn hàng được chọn
            </div>
            <div class="batch-buttons">
                <button class="btn btn-outline btn-sm" id="batchProcess">Xử lý</button>
                <button class="btn btn-outline btn-sm" id="batchShip">Giao hàng</button>
                <button class="btn btn-outline btn-sm" id="batchCancel">Hủy</button>
            </div>
        </div>

        <!-- Orders Container -->
        <div class="orders-container">
            <div id="ordersLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Đang tải đơn hàng...</p>
            </div>
            
            <div id="ordersTable" class="orders-table-container" style="display: none;">
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" id="selectAllOrders" />
                            </th>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày đặt</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <!-- Orders will be loaded here -->
                    </tbody>
                </table>
            </div>
            
            <div id="ordersCards" class="orders-cards" style="display: none;">
                <!-- Order cards will be loaded here -->
            </div>
            
            <div id="ordersEmpty" class="empty-state" style="display: none;">
                <div class="empty-icon">🛒</div>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Đơn hàng của bạn sẽ hiển thị ở đây khi có khách hàng đặt mua.</p>
            </div>
        </div>

        <!-- Pagination -->
        <div id="ordersPagination" class="pagination" style="display: none;">
            <!-- Pagination will be loaded here -->
        </div>
    </div>
</main>

<!-- Order Detail Modal -->
<div id="orderDetailModal" class="modal order-detail-modal" style="display: none;">
    <div class="modal-overlay" id="closeOrderModalOverlay"></div>
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h2 id="modalOrderNumber">Chi tiết đơn hàng #...</h2>
            <button class="modal-close" id="closeOrderModal" aria-label="Đóng">×</button>
        </div>
        <div class="modal-body">
            <div class="order-detail" id="orderDetailContent">
                <!-- Order details will be loaded here -->
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="closeOrderDetail">Đóng</button>
            <button type="button" class="btn btn-primary" id="updateOrderStatus">Cập nhật trạng thái</button>
        </div>
    </div>
</div>

<!-- Update Status Modal -->
<div id="updateStatusModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Cập nhật trạng thái đơn hàng</h2>
            <button class="modal-close" id="closeStatusModal">×</button>
        </div>
        <div class="modal-body">
            <form id="updateStatusForm">
                <div class="form-group">
                    <label for="newStatus">Trạng thái mới</label>
                    <select id="newStatus" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao</option>
                        <option value="delivered">Đã nhận</option>
                        <option value="cancelled">Hủy đơn</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statusNotes">Ghi chú</label>
                    <textarea id="statusNotes" name="notes" rows="3" placeholder="Thêm ghi chú về trạng thái..."></textarea>
                </div>
                <div class="form-group">
                    <label for="trackingNumber">Mã vận đơn (nếu có)</label>
                    <input type="text" id="trackingNumber" name="trackingNumber" placeholder="Nhập mã vận đơn..." />
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancelStatusUpdate">Hủy</button>
            <button type="submit" form="updateStatusForm" class="btn btn-primary" id="saveStatusUpdate">
                <span class="btn-text">Cập nhật</span>
                <span class="btn-loading" style="display: none;">⏳</span>
            </button>
        </div>
    </div>
</div>





<?php include __DIR__.'/../../includes/footer.php'; ?>
