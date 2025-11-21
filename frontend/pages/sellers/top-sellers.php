<?php 
$pageTitle='Người bán hàng đầu'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/responsive.css', '../../assets/css/top-sellers.css']; 
$extraJs=['../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/main.js', '../../assets/js/pages/top-sellers.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Top Sellers Page -->
<main class="top-sellers-page">
    <!-- Hero Section -->
    <section class="sellers-hero">
        <div class="hero-background">
            <div class="hero-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
        </div>
        <div class="container">
            <div class="hero-content">
                <div class="hero-badge">
                    <span class="badge-icon">🏆</span>
                    <span>Top Sellers</span>
                </div>
                <h1 class="hero-title">Người bán hàng đầu</h1>
                <p class="hero-subtitle">Khám phá những người bán sách uy tín và có thành tích xuất sắc nhất trên Bookverse</p>
                <div class="hero-stats">
                    <div class="stat-badge">
                        <span class="stat-number" id="totalSellers">0</span>
                        <span class="stat-label">Người bán</span>
                    </div>
                    <div class="stat-badge">
                        <span class="stat-number" id="totalProducts">0</span>
                        <span class="stat-label">Sản phẩm</span>
                    </div>
                    <div class="stat-badge">
                        <span class="stat-number" id="avgRating">0</span>
                        <span class="stat-label">Đánh giá TB</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
        <div class="container">
            <div class="filters-wrapper">
                <div class="filters-header">
                    <h2 class="filters-title">Tìm kiếm & Lọc</h2>
                    <button class="filters-toggle" id="filtersToggle" aria-label="Toggle filters">
                        <span class="toggle-icon">🔽</span>
                    </button>
                </div>
                <div class="filters-content" id="filtersContent">
                    <div class="filters-grid">
                        <div class="filter-group">
                            <label class="filter-label">
                                <span class="label-icon">🔍</span>
                                Tìm kiếm
                            </label>
                            <input type="text" id="searchInput" class="filter-input" placeholder="Tìm theo tên, cửa hàng, email...">
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">
                                <span class="label-icon">📊</span>
                                Sắp xếp theo
                            </label>
                            <select id="sortBy" class="filter-select">
                                <option value="rating">Đánh giá cao nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="name">Tên A-Z</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">
                                <span class="label-icon">📍</span>
                                Khu vực
                            </label>
                            <select id="locationFilter" class="filter-select">
                                <option value="">Tất cả khu vực</option>
                                <option value="hanoi">Hà Nội</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="danang">Đà Nẵng</option>
                                <option value="cantho">Cần Thơ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">
                                <span class="label-icon">⭐</span>
                                Đánh giá tối thiểu
                            </label>
                            <select id="ratingFilter" class="filter-select">
                                <option value="">Tất cả</option>
                                <option value="4.5">4.5+ sao</option>
                                <option value="4.0">4.0+ sao</option>
                                <option value="3.5">3.5+ sao</option>
                                <option value="3.0">3.0+ sao</option>
                            </select>
                        </div>
                    </div>
                    <div class="filters-actions">
                        <button class="btn btn-secondary" onclick="sellersManager.clearFilters()">
                            <span class="btn-icon">🔄</span>
                            <span>Xóa bộ lọc</span>
                        </button>
                        <button class="btn btn-primary" onclick="sellersManager.applyFilters()">
                            <span class="btn-icon">✓</span>
                            <span>Áp dụng</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Sellers Section -->
    <section class="sellers-section">
        <div class="container">
            <div class="section-header">
                <div class="header-info">
                    <h2 class="section-title">Danh sách người bán</h2>
                    <p class="section-subtitle" id="sellersCount">Đang tải...</p>
                </div>
                <div class="view-controls">
                    <button class="view-btn active" data-view="grid" onclick="sellersManager.switchView('grid')" aria-label="Grid view">
                        <span class="view-icon">⊞</span>
                    </button>
                    <button class="view-btn" data-view="list" onclick="sellersManager.switchView('list')" aria-label="List view">
                        <span class="view-icon">☰</span>
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div class="loading-container" id="loadingState">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-text">Đang tải danh sách người bán...</p>
            </div>

            <!-- Sellers Grid -->
            <div class="sellers-grid" id="sellersGrid">
                <!-- Sellers will be loaded here -->
            </div>

            <!-- Empty State -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <div class="empty-icon">📚</div>
                <h3 class="empty-title">Không tìm thấy người bán nào</h3>
                <p class="empty-text">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy nhiều kết quả hơn</p>
                <button class="btn btn-primary" onclick="sellersManager.clearFilters()">
                    <span class="btn-icon">🔄</span>
                    <span>Xóa bộ lọc</span>
                </button>
            </div>

            <!-- Pagination -->
            <div class="pagination-wrapper" id="paginationSection" style="display: none;">
                <div class="pagination-info">
                    <span id="paginationInfo">Hiển thị 1-10 của 0 người bán</span>
                </div>
                <div class="pagination-controls" id="paginationControls">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </section>
</main>

<!-- Seller Detail Modal -->
<div class="modal-overlay" id="sellerModal" style="display: none;">
    <div class="modal-container">
        <div class="modal-header">
            <h3 class="modal-title">Thông tin người bán</h3>
            <button class="modal-close" onclick="sellersManager.closeModal()" aria-label="Close modal">
                <span>&times;</span>
            </button>
        </div>
        <div class="modal-body" id="sellerDetailContent">
            <!-- Seller details will be loaded here -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="sellersManager.closeModal()">Đóng</button>
            <button class="btn btn-primary" onclick="sellersManager.viewSellerStore()">
                <span class="btn-icon">🏪</span>
                <span>Xem cửa hàng</span>
            </button>
        </div>
    </div>
</div>





<?php include __DIR__.'/../../includes/footer.php'; ?>
