<?php 
$pageTitle='Báo cáo & Phân tích'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/seller-analytics.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.js', 'assets/js/main.js', 'assets/js/pages/seller-analytics.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="dashboard.php">Dashboard</a></li>
            <li aria-current="page">Báo cáo & Phân tích</li>
        </ol>
    </div>
</nav>

<main class="seller-main">
    <div class="container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <div class="header-info">
                    <h1>Báo cáo & Phân tích</h1>
                    <p>Theo dõi hiệu suất kinh doanh và phân tích dữ liệu</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-outline" id="exportReportBtn">
                        <span class="btn-icon">📥</span>
                        <span>Xuất báo cáo</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Date Range Filter -->
        <div class="analytics-filters">
            <div class="filter-group">
                <label for="dateRange">Khoảng thời gian:</label>
                <select id="dateRange" class="filter-select">
                    <option value="7">7 ngày qua</option>
                    <option value="30" selected>30 ngày qua</option>
                    <option value="90">90 ngày qua</option>
                    <option value="180">6 tháng qua</option>
                    <option value="365">1 năm qua</option>
                    <option value="custom">Tùy chọn</option>
                </select>
            </div>
            <div class="filter-group" id="customDateRange" style="display: none;">
                <label for="startDate">Từ ngày:</label>
                <input type="date" id="startDate" class="filter-input">
                <label for="endDate">Đến ngày:</label>
                <input type="date" id="endDate" class="filter-input">
                <button class="btn btn-primary btn-sm" id="applyCustomDate">Áp dụng</button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="analytics-summary">
            <div class="summary-card">
                <div class="summary-icon revenue">💰</div>
                <div class="summary-content">
                    <h3 id="totalRevenue">0₫</h3>
                    <p>Tổng doanh thu</p>
                    <span class="summary-change" id="revenueChange">+0%</span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon orders">🛒</div>
                <div class="summary-content">
                    <h3 id="totalOrders">0</h3>
                    <p>Tổng đơn hàng</p>
                    <span class="summary-change" id="ordersChange">+0%</span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon products">📦</div>
                <div class="summary-content">
                    <h3 id="totalProducts">0</h3>
                    <p>Sản phẩm đã bán</p>
                    <span class="summary-change" id="productsChange">+0%</span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon customers">👥</div>
                <div class="summary-content">
                    <h3 id="totalCustomers">0</h3>
                    <p>Khách hàng</p>
                    <span class="summary-change" id="customersChange">+0%</span>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="analytics-charts">
            <!-- Revenue Chart -->
            <div class="chart-card">
                <div class="chart-header">
                    <h2>Biểu đồ doanh thu</h2>
                    <div class="chart-legend">
                        <span class="legend-item">
                            <span class="legend-color" style="background: #5865f2;"></span>
                            Doanh thu
                        </span>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>

            <!-- Orders Chart -->
            <div class="chart-card">
                <div class="chart-header">
                    <h2>Biểu đồ đơn hàng</h2>
                    <div class="chart-legend">
                        <span class="legend-item">
                            <span class="legend-color" style="background: #10b981;"></span>
                            Số đơn hàng
                        </span>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="ordersChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Detailed Analytics -->
        <div class="analytics-details">
            <!-- Top Products -->
            <div class="analytics-section">
                <div class="section-header">
                    <h2>Sản phẩm bán chạy</h2>
                    <select id="topProductsLimit" class="filter-select">
                        <option value="5">Top 5</option>
                        <option value="10" selected>Top 10</option>
                        <option value="20">Top 20</option>
                    </select>
                </div>
                <div class="table-container">
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Sản phẩm</th>
                                <th>Đã bán</th>
                                <th>Doanh thu</th>
                                <th>Tỷ lệ</th>
                            </tr>
                        </thead>
                        <tbody id="topProductsTable">
                            <tr>
                                <td colspan="5" class="text-center">Đang tải...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Category Performance -->
            <div class="analytics-section">
                <div class="section-header">
                    <h2>Hiệu suất theo danh mục</h2>
                </div>
                <div class="chart-container">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>

            <!-- Order Status Distribution -->
            <div class="analytics-section">
                <div class="section-header">
                    <h2>Phân bố trạng thái đơn hàng</h2>
                </div>
                <div class="chart-container">
                    <canvas id="orderStatusChart"></canvas>
                </div>
            </div>

            <!-- Daily Performance -->
            <div class="analytics-section">
                <div class="section-header">
                    <h2>Hiệu suất theo ngày</h2>
                    <div class="table-controls">
                        <select id="dailyPerformanceLimit" class="filter-select">
                            <option value="10">10 ngày gần nhất</option>
                            <option value="30" selected>30 ngày gần nhất</option>
                            <option value="50">50 ngày gần nhất</option>
                            <option value="all">Tất cả</option>
                        </select>
                        <select id="dailyPerformanceSort" class="filter-select">
                            <option value="desc" selected>Mới nhất trước</option>
                            <option value="asc">Cũ nhất trước</option>
                        </select>
                    </div>
                </div>
                <div class="table-container">
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Đơn hàng</th>
                                <th>Doanh thu</th>
                                <th>Sản phẩm bán</th>
                                <th>Khách hàng</th>
                            </tr>
                        </thead>
                        <tbody id="dailyPerformanceTable">
                            <tr>
                                <td colspan="5" class="text-center">Đang tải...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>





<?php include __DIR__.'/../../includes/footer.php'; ?>

