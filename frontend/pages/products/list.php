<?php 
$pageTitle='Sản phẩm - Bookverse'; 
$extraCss=['assets/css/global.css', 'assets/css/products.css']; 
$extraJs=[
    'assets/js/config.js',
    'assets/js/api.js',
    'assets/js/main.js',
    'assets/js/pages/products-list.js',
    'assets/js/pages/products-debug.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="products-main">
    <div class="container">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Khám phá thế giới sách</h1>
                <p class="hero-subtitle">Hàng nghìn cuốn sách từ các nhà xuất bản uy tín, giá tốt nhất thị trường</p>
                <div class="hero-search">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Tìm kiếm sách, tác giả, ISBN..." class="search-input">
                        <button class="search-btn" id="searchBtn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quick Categories -->
        <section class="quick-categories">
            <div class="section-header">
                <h2>Danh mục nổi bật</h2>
            </div>
            <div class="categories-grid">
                <a href="#" class="category-card" data-category="fiction">
                    <div class="category-icon">📚</div>
                    <h3>Tiểu thuyết</h3>
                    <p>Hơn 2,000 cuốn</p>
                </a>
                <a href="#" class="category-card" data-category="business">
                    <div class="category-icon">💼</div>
                    <h3>Kinh doanh</h3>
                    <p>Hơn 1,500 cuốn</p>
                </a>
                <a href="#" class="category-card" data-category="education">
                    <div class="category-icon">🎓</div>
                    <h3>Giáo dục</h3>
                    <p>Hơn 3,000 cuốn</p>
                </a>
                <a href="#" class="category-card" data-category="children">
                    <div class="category-icon">👶</div>
                    <h3>Thiếu nhi</h3>
                    <p>Hơn 1,200 cuốn</p>
                </a>
                <a href="#" class="category-card" data-category="technology">
                    <div class="category-icon">💻</div>
                    <h3>Công nghệ</h3>
                    <p>Hơn 800 cuốn</p>
                </a>
                <a href="#" class="category-card" data-category="health">
                    <div class="category-icon">🏥</div>
                    <h3>Sức khỏe</h3>
                    <p>Hơn 600 cuốn</p>
                </a>
        </div>
        </section>

        <!-- Main Content -->
        <div class="products-layout">
            <!-- Filters Sidebar -->
            <aside class="filters-sidebar">
                <div class="filters-header">
                    <h3>Bộ lọc</h3>
                    <button class="clear-filters" id="clearFilters">Xóa bộ lọc</button>
                </div>

                <div class="filter-section">
                    <h4>Danh mục</h4>
                    <div class="filter-options" id="categoryFilters">
                        <div class="filter-loading">Đang tải danh mục...</div>
                    </div>
                </div>


                <div class="filter-section">
                    <h4>Đánh giá</h4>
                    <div class="rating-options" id="ratingFilters">
                        <label class="rating-filter">
                            <input type="checkbox" value="5">
                            <span class="stars">★★★★★</span>
                            <span>5 sao</span>
                        </label>
                        <label class="rating-filter">
                            <input type="checkbox" value="4">
                            <span class="stars">★★★★☆</span>
                            <span>4 sao trở lên</span>
                        </label>
                        <label class="rating-filter">
                            <input type="checkbox" value="3">
                            <span class="stars">★★★☆☆</span>
                            <span>3 sao trở lên</span>
                        </label>
                    </div>
                </div>

                <div class="filter-section">
                    <h4>Tình trạng</h4>
                    <div class="filter-options" id="availabilityFilters">
                        <label class="availability-filter">
                            <input type="checkbox" value="in-stock">
                            <span class="checkmark"></span>
                            Còn hàng
                        </label>
                        <label class="availability-filter">
                            <input type="checkbox" value="pre-order">
                            <span class="checkmark"></span>
                            Đặt trước
                        </label>
                        <label class="availability-filter">
                            <input type="checkbox" value="coming-soon">
                            <span class="checkmark"></span>
                            Sắp ra mắt
                        </label>
                    </div>
                </div>
            </aside>

            <!-- Products Content -->
            <div class="products-content">
                <!-- Products Header -->
                <div class="products-header">
                    <div class="products-info">
                        <h2>Kết quả tìm kiếm</h2>
                        <p class="products-count" id="resultsCount">Đang tải sản phẩm...</p>
                    </div>
                    <div class="products-controls">
                    <div class="sort-controls">
                            <label for="sortSelect">Sắp xếp:</label>
                            <select id="sortSelect" class="sort-select">
                                <option value="createdAt-desc">Mới nhất</option>
                                <option value="totalSold-desc">Bán chạy</option>
                                <option value="price-asc">Giá thấp đến cao</option>
                                <option value="price-desc">Giá cao đến thấp</option>
                                <option value="averageRating-desc">Đánh giá cao</option>
                                <option value="name-asc">Tên A → Z</option>
                            </select>
                        </div>
                        <div class="view-controls">
                            <button class="view-btn active" data-view="grid" title="Lưới">
                                <i class="fas fa-th"></i>
                            </button>
                            <button class="view-btn" data-view="list" title="Danh sách">
                                <i class="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="products-grid" id="productsGrid">
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Đang tải sản phẩm...</p>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination" id="pagination"></div>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>
