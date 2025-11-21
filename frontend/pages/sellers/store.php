<?php 
$pageTitle='Cửa hàng'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/responsive.css', '../../assets/css/seller-store.css']; 
$extraJs=['../../assets/js/config.js', '../../assets/js/api.js', '../../assets/js/main.js', '../../assets/js/pages/seller-store.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Seller Store Page -->
<main class="seller-store-page">
    <!-- Seller Header -->
    <section class="seller-header-section" id="sellerHeader">
        <div class="container">
            <div class="seller-header-content">
                <div class="seller-avatar-large" id="sellerAvatar">
                    <span class="avatar-initials" id="avatarInitials">??</span>
                    <img id="avatarImage" style="display: none;" onerror="this.style.display='none'; document.getElementById('avatarInitials').style.display='flex';" onload="this.parentElement.classList.add('has-image'); document.getElementById('avatarInitials').style.display='none';" />
                </div>
                <div class="seller-header-info">
                    <h1 class="seller-name" id="sellerName">Đang tải...</h1>
                    <p class="seller-business" id="sellerBusiness">Người bán uy tín</p>
                    <div class="seller-meta">
                        <div class="meta-item">
                            <span class="meta-icon">⭐</span>
                            <span class="meta-value" id="sellerRating">0.0</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📦</span>
                            <span class="meta-value" id="sellerProducts">0</span>
                            <span class="meta-label">sản phẩm</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">🛒</span>
                            <span class="meta-value" id="sellerOrders">0</span>
                            <span class="meta-label">đơn hàng</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">💰</span>
                            <span class="meta-value" id="sellerRevenue">0₫</span>
                        </div>
                    </div>
                    <div class="seller-location" id="sellerLocation">
                        <span class="location-icon">📍</span>
                        <span id="locationText">Chưa cập nhật</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Filters Section -->
    <section class="store-filters-section">
        <div class="container">
            <div class="filters-wrapper">
                <div class="filters-left">
                    <div class="search-box">
                        <input type="text" id="productSearch" placeholder="Tìm kiếm sản phẩm..." autocomplete="off" />
                        <button class="search-btn" id="searchBtn" type="button">
                            <span class="search-icon">🔍</span>
                        </button>
                    </div>
                    
                    <select id="categoryFilter" class="filter-select">
                        <option value="">Tất cả danh mục</option>
                    </select>
                    
                    <select id="sortFilter" class="filter-select">
                        <option value="-createdAt">Mới nhất</option>
                        <option value="createdAt">Cũ nhất</option>
                        <option value="-price">Giá cao → thấp</option>
                        <option value="price">Giá thấp → cao</option>
                        <option value="-rating.average">Đánh giá cao nhất</option>
                        <option value="-sales">Bán chạy nhất</option>
                    </select>
                </div>
                
                <div class="filters-right">
                    <div class="view-toggle">
                        <button class="view-btn active" data-view="grid" type="button" title="Xem dạng lưới">
                            <span>⊞</span>
                        </button>
                        <button class="view-btn" data-view="list" type="button" title="Xem dạng danh sách">
                            <span>☰</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section class="products-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Sản phẩm</h2>
                <p class="section-subtitle" id="productsCount">Đang tải...</p>
            </div>

            <!-- Loading State -->
            <div class="loading-container" id="loadingState">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-text">Đang tải sản phẩm...</p>
            </div>

            <!-- Products Grid -->
            <div class="products-grid" id="productsGrid">
                <!-- Products will be loaded here -->
            </div>

            <!-- Empty State -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <div class="empty-icon">📚</div>
                <h3 class="empty-title">Không tìm thấy sản phẩm nào</h3>
                <p class="empty-text">Cửa hàng này chưa có sản phẩm hoặc không có sản phẩm phù hợp với bộ lọc của bạn</p>
            </div>

            <!-- Pagination -->
            <div class="pagination-wrapper" id="paginationSection" style="display: none;">
                <div class="pagination-info">
                    <span id="paginationInfo">Hiển thị 1-12 của 0 sản phẩm</span>
                </div>
                <div class="pagination-controls" id="paginationControls">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </section>
</main>





<?php include __DIR__.'/../../includes/footer.php'; ?>

