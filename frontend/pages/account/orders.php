<?php 
$pageTitle='Đơn hàng của tôi'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/account.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js', '../../assets/js/pages/orders.js'];
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
                            <a href="profile.php" class="nav-link">
                                <span class="nav-icon">👤</span>
                                Hồ sơ cá nhân
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="orders.php" class="nav-link active">
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
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Chi tiết đơn hàng</h2>
            <button class="modal-close" onclick="closeOrderModal()">×</button>
        </div>
        <div class="modal-body" id="orderModalBody">
            <!-- Order details will be loaded here -->
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>