<?php 
$pageTitle='Dashboard Người Bán'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css']; 
$extraJs=[
    'assets/js/pages/seller-auth-guard.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.js',
    'assets/js/seller.js',
    'assets/js/pages/seller-dashboard.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li aria-current="page">Dashboard Người Bán</li>
        </ol>
    </div>
</nav>

<main class="seller-dashboard">
    <div class="container">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <div class="welcome-section">
                    <h1>Chào mừng trở lại! <span id="liveIndicator" class="live-indicator" title="Auto-refresh every 30s">🟢 LIVE</span></h1>
                    <p>Quản lý cửa hàng sách của bạn một cách hiệu quả</p>
                </div>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-overview">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-content">
                    <h3 data-stat="totalProducts">⏳</h3>
                    <p>Tổng sản phẩm</p>
                </div>
                <div class="stat-trend" data-growth="products">
                    <span class="trend-icon">⏳</span>
                    <span class="trend-value">...</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                    <h3 data-stat="totalRevenue">⏳</h3>
                    <p>Doanh thu tháng</p>
                </div>
                <div class="stat-trend" data-growth="revenue">
                    <span class="trend-icon">⏳</span>
                    <span class="trend-value">...</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🛒</div>
                <div class="stat-content">
                    <h3 data-stat="totalOrders">⏳</h3>
                    <p>Đơn hàng</p>
                </div>
                <div class="stat-trend" data-growth="orders">
                    <span class="trend-icon">⏳</span>
                    <span class="trend-value">...</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">⏳</div>
                <div class="stat-content">
                    <h3 data-stat="pendingOrders">⏳</h3>
                    <p>Chờ xử lý</p>
                </div>
                <div class="stat-trend" data-growth="pendingOrders">
                    <span class="trend-icon">⏳</span>
                    <span class="trend-value">...</span>
                </div>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <!-- Left Column -->
            <div class="dashboard-main">
                <!-- Recent Orders -->
                <section class="dashboard-section">
                    <div class="section-header">
                        <h2>Đơn hàng gần đây</h2>
                        <a href="orders.php" class="btn btn-outline btn-sm" onclick="event.preventDefault(); window.location.href='orders.php'; return false;">Xem tất cả</a>
                    </div>
                    <div class="orders-table-container">
                        <table class="orders-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="recentOrdersTable">
                                <!-- Recent orders will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Top Products -->
                <section class="dashboard-section">
                    <div class="section-header">
                        <h2>Sản phẩm bán chạy</h2>
                        <a href="products.php" class="btn btn-outline btn-sm">Quản lý sản phẩm</a>
                    </div>
                    <div class="products-grid" id="topProductsGrid">
                        <!-- Top products will be loaded here -->
                    </div>
                </section>

                <!-- Sales Chart -->
                <section class="dashboard-section">
                    <div class="section-header">
                        <h2>Biểu đồ doanh thu</h2>
                        <div class="chart-controls">
                            <select id="chartPeriod" class="chart-select">
                                <option value="7">7 ngày qua</option>
                                <option value="30" selected>30 ngày qua</option>
                                <option value="90">90 ngày qua</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                </section>
            </div>

            <!-- Right Sidebar -->
            <div class="dashboard-sidebar">
                <!-- Quick Stats -->
                <section class="sidebar-section">
                    <h3>Thống kê nhanh</h3>
                    <div class="quick-stats">
                        <div class="quick-stat">
                            <span class="stat-label">Hôm nay</span>
                            <span class="stat-value" id="todaySales">0₫</span>
                        </div>
                        <div class="quick-stat">
                            <span class="stat-label">Tuần này</span>
                            <span class="stat-value" id="weekSales">0₫</span>
                        </div>
                        <div class="quick-stat">
                            <span class="stat-label">Tháng này</span>
                            <span class="stat-value" id="monthSales">0₫</span>
                        </div>
                    </div>
                </section>

                <!-- Recent Reviews -->
                <section class="sidebar-section">
                    <h3>Đánh giá mới</h3>
                    <div class="reviews-list" id="recentReviews">
                        <!-- Recent reviews will be loaded here -->
                    </div>
                </section>

                <!-- Quick Actions -->
                <section class="sidebar-section">
                    <h3>Thao tác nhanh</h3>
                    <div class="quick-actions-list">
                        <a href="products.php" class="quick-action">
                            <span class="action-icon">📦</span>
                            <span>Quản lý sản phẩm</span>
                        </a>
                        <a href="orders.php" class="quick-action" onclick="event.preventDefault(); window.location.href='orders.php'; return false;">
                            <span class="action-icon">📋</span>
                            <span>Đơn hàng</span>
                        </a>
                        <a href="analytics.php" class="quick-action">
                            <span class="action-icon">📊</span>
                            <span>Báo cáo</span>
                        </a>
                        <a href="settings.php" class="quick-action" onclick="event.preventDefault(); window.location.href='settings.php'; return false;">
                            <span class="action-icon">⚙️</span>
                            <span>Cài đặt</span>
                        </a>
                    </div>
                </section>

                <!-- Notifications -->
                <section class="sidebar-section">
                    <h3>Thông báo</h3>
                    <div class="notifications-list" id="notificationsList">
                        <!-- Notifications will be loaded here -->
                    </div>
                </section>
            </div>
        </div>
    </div>
</main>

<!-- Add Product Modal -->
<div class="modal" id="addProductModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Thêm sản phẩm mới</h3>
            <button class="modal-close" id="closeAddProductModal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addProductForm" class="product-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="productTitle">Tên sản phẩm *</label>
                        <input type="text" id="productTitle" name="title" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="productAuthor">Tác giả *</label>
                        <input type="text" id="productAuthor" name="author" required>
                    </div>
                    <div class="form-group">
                        <label for="productPublisher">Nhà xuất bản</label>
                        <input type="text" id="productPublisher" name="publisher">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="productPrice">Giá bán *</label>
                        <input type="number" id="productPrice" name="price" required min="0">
                    </div>
                    <div class="form-group">
                        <label for="productOriginalPrice">Giá gốc</label>
                        <input type="number" id="productOriginalPrice" name="originalPrice" min="0">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="productCategory">Danh mục *</label>
                        <select id="productCategory" name="category" required>
                            <option value="">Chọn danh mục</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="productStock">Số lượng *</label>
                        <input type="number" id="productStock" name="stock" required min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label for="productDescription">Mô tả sản phẩm</label>
                    <textarea id="productDescription" name="description" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="productImages">Hình ảnh sản phẩm</label>
                    <input type="file" id="productImages" name="images" multiple accept="image/*">
                    <div class="image-preview" id="imagePreview"></div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancelAddProduct">Hủy</button>
            <button type="submit" form="addProductForm" class="btn btn-primary">Thêm sản phẩm</button>
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>

