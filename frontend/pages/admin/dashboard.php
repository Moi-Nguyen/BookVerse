<?php 
$pageTitle='Admin Dashboard'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-dashboard.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-dashboard.js'
];
include '../../includes/header.php'; 
?>

<!-- Admin Dashboard -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1 class="dashboard-title">
                    <span class="title-icon">⚡</span>
                    Admin Dashboard
                </h1>
                <p class="dashboard-subtitle">Tổng quan hệ thống Bookverse</p>
                </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="refreshDashboard()">
                        <span class="btn-icon">🔄</span>
                    Làm mới
                    </button>
                <button class="btn btn-outline" onclick="exportReport()">
                        <span class="btn-icon">📊</span>
                    Xuất báo cáo
                    </button>
                </div>
            </div>

        <!-- Stats Overview -->
        <div class="stats-grid" id="statsGrid">
            <!-- Stats will be loaded here -->
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2 class="section-title">Thao tác nhanh</h2>
            <div class="actions-grid">
                <a href="users.php" class="action-card">
                    <div class="action-icon">👥</div>
                    <h3>Quản lý người dùng</h3>
                    <p>Xem và quản lý tài khoản người dùng</p>
                </a>
                <a href="products.php" class="action-card">
                    <div class="action-icon">📚</div>
                    <h3>Quản lý sản phẩm</h3>
                    <p>Phê duyệt và quản lý sản phẩm</p>
                </a>
                <a href="orders.php" class="action-card">
                    <div class="action-icon">📦</div>
                    <h3>Quản lý đơn hàng</h3>
                    <p>Theo dõi và xử lý đơn hàng</p>
                </a>
                <a href="payments.php" class="action-card">
                    <div class="action-icon">💰</div>
                    <h3>Quản lý thanh toán</h3>
                    <p>Giám sát giao dịch và hoa hồng</p>
                </a>
                <a href="categories.php" class="action-card">
                    <div class="action-icon">📂</div>
                    <h3>Quản lý danh mục</h3>
                    <p>Tạo và chỉnh sửa danh mục sách</p>
                </a>
                <a href="settings.php" class="action-card">
                    <div class="action-icon">⚙️</div>
                    <h3>Cài đặt hệ thống</h3>
                    <p>Cấu hình và tùy chỉnh hệ thống</p>
                </a>
                </div>
            </div>

        <!-- Charts Section -->
        <div class="charts-section">
            <!-- Revenue Chart -->
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">Doanh thu theo tháng</h3>
                    <div class="chart-controls">
                        <select id="revenuePeriod" class="form-select">
                            <option value="6">6 tháng gần đây</option>
                            <option value="12">12 tháng gần đây</option>
                            <option value="24">24 tháng gần đây</option>
                        </select>
                    </div>
                </div>
                <div class="chart-content">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>

            <!-- Orders Chart -->
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">Đơn hàng theo trạng thái</h3>
                    <div class="chart-controls">
                        <select id="ordersPeriod" class="form-select">
                            <option value="7">7 ngày gần đây</option>
                            <option value="30">30 ngày gần đây</option>
                            <option value="90">90 ngày gần đây</option>
                        </select>
                    </div>
                </div>
                <div class="chart-content">
                    <canvas id="ordersChart"></canvas>
                    </div>
                </div>
            </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
            <div class="activity-header">
                <h2 class="section-title">Hoạt động gần đây</h2>
                <button class="btn btn-outline btn-sm" onclick="loadMoreActivity()">
                    Xem tất cả
                </button>
                    </div>
            <div class="activity-list" id="activityList">
                <!-- Activity items will be loaded here -->
                </div>
            </div>

        <!-- System Health -->
        <div class="system-health">
            <h2 class="section-title">Tình trạng hệ thống</h2>
            <div class="health-grid">
                <div class="health-card" data-service="database">
                    <div class="health-icon">🟢</div>
                    <div class="health-info">
                        <h4>Database</h4>
                        <p class="health-status">Đang tải...</p>
                        <div class="health-metrics">
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    </div>
                </div>
                <div class="health-card" data-service="cache">
                    <div class="health-icon">🟢</div>
                    <div class="health-info">
                        <h4>Redis Cache</h4>
                        <p class="health-status">Đang tải...</p>
                        <div class="health-metrics">
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    </div>
                </div>
                <div class="health-card" data-service="api">
                    <div class="health-icon">🟡</div>
                    <div class="health-info">
                        <h4>API Server</h4>
                        <p class="health-status">Đang tải...</p>
                        <div class="health-metrics">
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    </div>
                </div>
                <div class="health-card" data-service="system">
                    <div class="health-icon">🟢</div>
                    <div class="health-info">
                        <h4>System</h4>
                        <p class="health-status">Đang tải...</p>
                        <div class="health-metrics">
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending Approvals -->
        <div class="pending-approvals">
            <h2 class="section-title">Chờ phê duyệt</h2>
            <div class="approvals-grid">
                <div class="approval-card">
                    <div class="approval-header">
                        <h4>Người bán mới</h4>
                        <span class="approval-count" id="pendingSellers">0</span>
                        </div>
                    <p>Đang chờ phê duyệt tài khoản người bán</p>
                    <a href="users.php?filter=pending_sellers" class="btn btn-outline btn-sm">
                        Xem chi tiết
                    </a>
                    </div>
                <div class="approval-card">
                    <div class="approval-header">
                        <h4>Sản phẩm mới</h4>
                        <span class="approval-count" id="pendingProducts">0</span>
                    </div>
                    <p>Đang chờ phê duyệt sản phẩm</p>
                    <a href="products.php?filter=pending" class="btn btn-outline btn-sm">
                        Xem chi tiết
                    </a>
                    </div>
                <div class="approval-card">
                    <div class="approval-header">
                        <h4>Đánh giá mới</h4>
                        <span class="approval-count" id="pendingReviews">0</span>
                    </div>
                    <p>Đang chờ kiểm duyệt đánh giá</p>
                    <a href="reviews.php?filter=pending" class="btn btn-outline btn-sm">
                        Xem chi tiết
                        </a>
                    </div>
            </div>
        </div>
    </div>
</main>

<!-- Loading Overlay -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
        </div>
        </div>

<!-- Toast Container -->
<div id="toastContainer" class="toast-container"></div>

<?php include __DIR__.'/../../includes/footer.php'; ?>