<?php 
$pageTitle='Analytics Dashboard'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/analytics.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
    'assets/js/admin.js',
    'assets/js/analytics.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Analytics Dashboard -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">📊</span>
                    Analytics Dashboard
                </h1>
                <p class="page-subtitle">Phân tích dữ liệu và hiệu suất hệ thống</p>
            </div>
            <div class="header-actions">
                <select id="timeRange" class="form-select">
                    <option value="7d">7 ngày qua</option>
                    <option value="30d" selected>30 ngày qua</option>
                    <option value="90d">90 ngày qua</option>
                    <option value="1y">1 năm qua</option>
                </select>
                <button class="btn btn-outline" onclick="exportAnalytics()">
                    <span class="btn-icon">📈</span>
                    Xuất báo cáo
                </button>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-header">
                    <h3 class="metric-title">Tổng doanh thu</h3>
                    <span class="metric-trend positive">+12.5%</span>
                </div>
                <div class="metric-value" id="totalRevenue">₫0</div>
                <div class="metric-subtitle">So với tháng trước</div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3 class="metric-title">Đơn hàng</h3>
                    <span class="metric-trend positive">+8.2%</span>
                </div>
                <div class="metric-value" id="totalOrders">0</div>
                <div class="metric-subtitle">Đơn hàng mới</div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3 class="metric-title">Người dùng</h3>
                    <span class="metric-trend positive">+15.3%</span>
                </div>
                <div class="metric-value" id="totalUsers">0</div>
                <div class="metric-subtitle">Người dùng mới</div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3 class="metric-title">Sản phẩm</h3>
                    <span class="metric-trend positive">+5.7%</span>
                </div>
                <div class="metric-value" id="totalProducts">0</div>
                <div class="metric-subtitle">Sản phẩm mới</div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">Doanh thu theo thời gian</h3>
                    <div class="chart-controls">
                        <button class="chart-btn active" data-type="revenue">Doanh thu</button>
                        <button class="chart-btn" data-type="orders">Đơn hàng</button>
                        <button class="chart-btn" data-type="users">Người dùng</button>
                    </div>
                </div>
                <div class="chart-content">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>

            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">Phân bố đơn hàng theo trạng thái</h3>
                </div>
                <div class="chart-content">
                    <canvas id="ordersStatusChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Detailed Analytics -->
        <div class="analytics-grid">
            <!-- Top Products -->
            <div class="analytics-card">
                <div class="card-header">
                    <h3 class="card-title">Sản phẩm bán chạy</h3>
                    <button class="btn btn-sm btn-outline" onclick="viewAllProducts()">Xem tất cả</button>
                </div>
                <div class="card-content">
                    <div class="top-products-list" id="topProductsList">
                        <!-- Top products will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Top Sellers -->
            <div class="analytics-card">
                <div class="card-header">
                    <h3 class="card-title">Người bán hàng đầu</h3>
                    <button class="btn btn-sm btn-outline" onclick="viewAllSellers()">Xem tất cả</button>
                </div>
                <div class="card-content">
                    <div class="top-sellers-list" id="topSellersList">
                        <!-- Top sellers will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="analytics-card">
                <div class="card-header">
                    <h3 class="card-title">Hoạt động gần đây</h3>
                </div>
                <div class="card-content">
                    <div class="activity-list" id="recentActivityList">
                        <!-- Recent activity will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- System Health -->
            <div class="analytics-card">
                <div class="card-header">
                    <h3 class="card-title">Tình trạng hệ thống</h3>
                </div>
                <div class="card-content">
                    <div class="health-metrics" id="systemHealth">
                        <!-- System health will be loaded here -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Geographic Analytics -->
        <div class="analytics-section">
            <div class="section-header">
                <h2 class="section-title">Phân tích địa lý</h2>
                <p class="section-subtitle">Dữ liệu đơn hàng theo khu vực</p>
            </div>
            <div class="geographic-grid">
                <div class="geo-card">
                    <h4 class="geo-title">Top thành phố</h4>
                    <div class="geo-list" id="topCitiesList">
                        <!-- Top cities will be loaded here -->
                    </div>
                </div>
                <div class="geo-card">
                    <h4 class="geo-title">Phân bố khu vực</h4>
                    <div class="geo-chart">
                        <canvas id="geographicChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Loading Overlay -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Đang tải dữ liệu analytics...</p>
    </div>
</div>
