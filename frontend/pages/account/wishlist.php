<?php 
// Use safe auth check (no redirect)
require_once __DIR__.'/../../includes/auth-check-safe.php';

$pageTitle='Sản phẩm yêu thích'; 
$extraCss=['assets/css/account.css']; 
$extraJs=[
    'assets/js/pages/account-auth-guard.js',
    'assets/js/pages/wishlist.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-content">
                <div class="account-header">
                    <h1>Sản phẩm yêu thích</h1>
                    <p>Danh sách các sản phẩm bạn đã thêm vào yêu thích</p>
                </div>

                <!-- Wishlist Filters -->
                <div class="wishlist-filters">
                    <div class="filters-left">
                        <div class="search-box">
                            <input type="text" id="wishlistSearch" placeholder="Tìm kiếm sản phẩm..." />
                            <button class="search-btn" id="searchBtn">
                                <span class="search-icon">🔍</span>
                            </button>
                        </div>
                        
                        <select id="categoryFilter" class="filter-select">
                            <option value="">Tất cả danh mục</option>
                        </select>
                        
                        <select id="sortFilter" class="filter-select">
                            <option value="-createdAt">Thêm gần đây</option>
                            <option value="createdAt">Thêm cũ nhất</option>
                            <option value="price-low">Giá thấp nhất</option>
                            <option value="price-high">Giá cao nhất</option>
                            <option value="title">Tên A-Z</option>
                        </select>
                    </div>
                    
                    <div class="filters-right">
                        <div class="view-toggle">
                            <button class="view-btn active" data-view="grid" title="Xem dạng lưới">
                                <span>⊞</span>
                            </button>
                            <button class="view-btn" data-view="list" title="Xem dạng danh sách">
                                <span>☰</span>
                            </button>
                        </div>
                        
                        <button class="btn btn-outline btn-sm" id="clearWishlistBtn">
                            <span class="btn-icon">🗑️</span>
                            <span>Xóa tất cả</span>
                        </button>
                    </div>
                </div>

                <!-- Batch Actions -->
                <div class="batch-actions" id="batchActions" style="display: none;">
                    <div class="batch-info">
                        <span id="selectedCount">0</span> sản phẩm được chọn
                    </div>
                    <div class="batch-buttons">
                        <button class="btn btn-outline btn-sm" id="batchAddToCart">Thêm vào giỏ</button>
                        <button class="btn btn-outline btn-sm" id="batchRemove">Xóa khỏi yêu thích</button>
                    </div>
                </div>

                <!-- Wishlist Container -->
                <div class="wishlist-container">
                    <div id="wishlistLoading" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Đang tải danh sách yêu thích...</p>
                    </div>
                    
                    <div id="wishlistGrid" class="wishlist-grid" style="display: none;">
                        <!-- Wishlist items will be loaded here -->
                    </div>
                    
                    <div id="wishlistList" class="wishlist-list" style="display: none;">
                        <!-- Wishlist list view will be loaded here -->
                    </div>
                    
                    <div id="wishlistEmpty" class="empty-state" style="display: none;">
                        <div class="empty-icon">❤️</div>
                        <h3>Danh sách yêu thích trống</h3>
                        <p>Hãy thêm những sản phẩm bạn yêu thích vào danh sách này!</p>
                        <a href="../../index.php" class="btn btn-primary">Khám phá sản phẩm</a>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="wishlistPagination" class="pagination" style="display: none;">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Product Quick View Modal -->
<div id="quickViewModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h2 id="quickViewTitle">Xem nhanh sản phẩm</h2>
            <button class="modal-close" id="closeQuickView">×</button>
        </div>
        <div class="modal-body">
            <div class="product-quick-view" id="quickViewContent">
                <!-- Product quick view will be loaded here -->
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="closeQuickViewBtn">Đóng</button>
            <button type="button" class="btn btn-primary" id="addToCartFromQuickView">
                <span class="btn-icon">🛒</span>
                <span>Thêm vào giỏ</span>
            </button>
        </div>
    </div>
</div>

<!-- Remove Confirmation Modal -->
<div id="removeConfirmModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Xác nhận xóa</h2>
            <button class="modal-close" id="closeRemoveModal">×</button>
        </div>
        <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?</p>
            <div class="product-preview" id="removeProductPreview">
                <!-- Product preview will be loaded here -->
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancelRemove">Hủy</button>
            <button type="button" class="btn btn-danger" id="confirmRemove">
                <span class="btn-text">Xóa khỏi yêu thích</span>
                <span class="btn-loading" style="display: none;">⏳</span>
            </button>
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>
