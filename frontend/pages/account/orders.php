<?php 
// Use safe auth check (no redirect)
require_once __DIR__.'/../../includes/auth-check-safe.php';

$pageTitle='Đơn hàng của tôi'; 
$extraCss=['assets/css/account.css']; 
$extraJs=[
    'assets/js/pages/account-auth-guard.js',
    'assets/js/pages/orders.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-content">
                <div class="account-header">
                    <h1>Đơn hàng của tôi</h1>
                    <p>Quản lý và theo dõi đơn hàng của bạn</p>
                </div>

                <!-- Order Filters -->
                <div class="order-filters">
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-status="all">Tất cả</button>
                        <button class="filter-tab" data-status="pending">Chờ xử lý</button>
                        <button class="filter-tab" data-status="processing">Đang xử lý</button>
                        <button class="filter-tab" data-status="shipped">Đang giao</button>
                        <button class="filter-tab" data-status="delivered">Đã giao</button>
                        <button class="filter-tab" data-status="cancelled">Đã hủy</button>
                    </div>
                    
                    <div class="filter-actions">
                        <div class="search-box">
                            <input type="text" id="orderSearch" placeholder="Tìm kiếm đơn hàng..." />
                            <span class="search-icon">🔍</span>
                        </div>
                        <select id="sortOrders" class="sort-select">
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="price-high">Giá cao nhất</option>
                            <option value="price-low">Giá thấp nhất</option>
                        </select>
                    </div>
                </div>

                <!-- Orders List -->
                <div class="orders-container">
                    <div id="ordersLoading" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Đang tải đơn hàng...</p>
                    </div>
                    
                    <div id="ordersList" class="orders-list" style="display: none;">
                        <!-- Orders will be loaded here -->
                    </div>
                    
                    <div id="ordersEmpty" class="empty-state" style="display: none;">
                        <div class="empty-icon">📦</div>
                        <h3>Chưa có đơn hàng nào</h3>
                        <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                        <a href="../../pages/products/list.php" class="btn btn-primary">
                            <span class="btn-icon">🛍️</span>
                            Mua sắm ngay
                        </a>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="ordersPagination" class="pagination" style="display: none;">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Order Detail Modal -->
<div id="orderModal" class="modal" style="display: none;">
    <div class="modal-overlay" onclick="closeOrderModal()"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Chi tiết đơn hàng</h2>
            <button class="modal-close" onclick="closeOrderModal()" type="button">×</button>
        </div>
        <div class="modal-body" id="orderModalBody">
            <!-- Order details will be loaded here -->
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>