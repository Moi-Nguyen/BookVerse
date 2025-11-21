<?php 
$pageTitle='Quản lý sản phẩm'; 
$path = '../../'; // Set path for footer.php to load scripts correctly
$extraCss=['assets/css/global.css', 'assets/css/seller.css']; 
$extraJs=[
    'assets/js/pages/seller-auth-guard.js',
    'assets/js/pages/seller-products.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="dashboard.php">Dashboard</a></li>
            <li aria-current="page">Quản lý sản phẩm</li>
        </ol>
    </div>
</nav>

<main class="seller-main">
    <div class="container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <div class="header-info">
                    <h1>Quản lý sản phẩm</h1>
                    <p>Quản lý và theo dõi sản phẩm của bạn</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" id="addProductBtn">
                        <span class="btn-icon">➕</span>
                        <span>Thêm sản phẩm</span>
                    </button>
                    <button class="btn btn-outline" id="exportProductsBtn">
                        <span class="btn-icon">📊</span>
                        <span>Xuất báo cáo</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="products-filters">
            <div class="filters-left">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Tìm kiếm sản phẩm..." />
                    <button class="search-btn" id="searchBtn">
                        <span class="search-icon">🔍</span>
                    </button>
                </div>
                
                <select id="categoryFilter" class="filter-select">
                    <option value="">Tất cả danh mục</option>
                </select>
                
                <select id="statusFilter" class="filter-select">
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Bị từ chối</option>
                    <option value="inactive">Không hoạt động</option>
                </select>
            </div>
            
            <div class="filters-right">
                <select id="sortFilter" class="filter-select">
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="price-high">Giá cao nhất</option>
                    <option value="price-low">Giá thấp nhất</option>
                    <option value="sales">Bán chạy nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                </select>
                
                <div class="view-toggle">
                    <button class="view-btn active" data-view="grid" title="Xem dạng lưới">
                        <span>⊞</span>
                    </button>
                    <button class="view-btn" data-view="list" title="Xem dạng danh sách">
                        <span>☰</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Batch Actions -->
        <div class="batch-actions" id="batchActions" style="display: none;">
            <div class="batch-info">
                <span id="selectedCount">0</span> sản phẩm được chọn
            </div>
            <div class="batch-buttons">
                <button class="btn btn-outline btn-sm" id="batchActivate">Kích hoạt</button>
                <button class="btn btn-outline btn-sm" id="batchDeactivate">Tạm dừng</button>
                <button class="btn btn-outline btn-sm" id="batchDelete">Xóa</button>
            </div>
        </div>

        <!-- Products Container -->
        <div class="products-container">
            <div id="productsLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
            
            <div id="productsGrid" class="products-grid" style="display: none;">
                <!-- Products will be loaded here -->
            </div>
            
            <div id="productsList" class="products-list" style="display: none;">
                <!-- Products list view will be loaded here -->
            </div>
            
            <div id="productsEmpty" class="empty-state" style="display: none;">
                <div class="empty-icon">📦</div>
                <h3>Chưa có sản phẩm nào</h3>
                <p>Bắt đầu thêm sản phẩm đầu tiên của bạn!</p>
                <button class="btn btn-primary" id="addFirstProduct">
                    <span class="btn-icon">➕</span>
                    <span>Thêm sản phẩm đầu tiên</span>
                </button>
            </div>
        </div>

        <!-- Pagination -->
        <div id="productsPagination" class="pagination" style="display: none;">
            <!-- Pagination will be loaded here -->
        </div>
    </div>
</main>

<!-- Add/Edit Product Modal -->
<div id="addProductModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h2 id="modalTitle">Thêm sản phẩm mới</h2>
            <button class="modal-close" id="closeAddProductModal">×</button>
        </div>
        <div class="modal-body">
            <form id="addProductForm" class="product-form">
                <div id="productError" class="error-message" style="display: none;"></div>
                <div id="productSuccess" class="success-message" style="display: none;"></div>
                
                <!-- Basic Information -->
                <div class="form-section">
                    <h3>Thông tin cơ bản</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productTitle">Tên sản phẩm *</label>
                            <input type="text" id="productTitle" name="title" required placeholder="Nhập tên sản phẩm" />
                        </div>
                        <div class="form-group">
                            <label for="productAuthor">Tác giả *</label>
                            <input type="text" id="productAuthor" name="author" required placeholder="Nhập tên tác giả" />
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productPublisher">Nhà xuất bản</label>
                            <input type="text" id="productPublisher" name="publisher" placeholder="Nhập nhà xuất bản" />
                        </div>
                        <div class="form-group">
                            <label for="productIsbn">ISBN</label>
                            <input type="text" id="productIsbn" name="isbn" placeholder="Nhập mã ISBN" />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="productDescription">Mô tả sản phẩm</label>
                        <textarea id="productDescription" name="description" rows="4" placeholder="Mô tả chi tiết về sản phẩm"></textarea>
                    </div>
                </div>
                
                <!-- Pricing and Inventory -->
                <div class="form-section">
                    <h3>Giá cả và tồn kho</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productPrice">Giá bán *</label>
                            <input type="number" id="productPrice" name="price" required min="0" placeholder="0" />
                        </div>
                        <div class="form-group">
                            <label for="productOriginalPrice">Giá gốc</label>
                            <input type="number" id="productOriginalPrice" name="originalPrice" min="0" placeholder="0" />
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productStock">Số lượng tồn kho *</label>
                            <input type="number" id="productStock" name="stock" required min="0" placeholder="0" />
                        </div>
                        <div class="form-group">
                            <label for="productCondition">Tình trạng</label>
                            <select id="productCondition" name="condition">
                                <option value="new">Mới</option>
                                <option value="like_new">Như mới</option>
                                <option value="good">Tốt</option>
                                <option value="fair">Khá</option>
                                <option value="poor">Cũ</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Category and Details -->
                <div class="form-section">
                    <h3>Phân loại và chi tiết</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productCategory">Danh mục *</label>
                            <select id="productCategory" name="category" required>
                                <option value="">Chọn danh mục</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productPublishYear">Năm xuất bản</label>
                            <input type="number" id="productPublishYear" name="publishYear" min="1000" max="2025" placeholder="2024" />
                        </div>
                        <div class="form-group">
                            <label for="productPages">Số trang</label>
                            <input type="number" id="productPages" name="pages" min="1" placeholder="200" />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="productTags">Tags (phân cách bằng dấu phẩy)</label>
                        <input type="text" id="productTags" name="tags" placeholder="sách hay, bestseller, tiểu thuyết" />
                    </div>
                </div>
                
                <!-- Images -->
                <div class="form-section">
                    <h3>Hình ảnh sản phẩm</h3>
                    <div class="form-group">
                        <label for="productImages">Tải lên hình ảnh</label>
                        <input type="file" id="productImages" name="images" multiple accept="image/*" />
                        <div class="image-preview" id="imagePreview">
                            <!-- Image previews will be shown here -->
                        </div>
                    </div>
                </div>
                
                <!-- SEO -->
                <div class="form-section">
                    <h3>SEO</h3>
                    <div class="form-group">
                        <label for="productMetaTitle">Meta Title</label>
                        <input type="text" id="productMetaTitle" name="metaTitle" placeholder="Tiêu đề SEO" />
                    </div>
                    <div class="form-group">
                        <label for="productMetaDescription">Meta Description</label>
                        <textarea id="productMetaDescription" name="metaDescription" rows="3" placeholder="Mô tả SEO"></textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancelProduct">Hủy</button>
            <button type="submit" form="addProductForm" class="btn btn-primary" id="saveProduct">
                <span class="btn-text">Lưu sản phẩm</span>
                <span class="btn-loading" style="display: none;">⏳</span>
            </button>
        </div>
    </div>
</div>

<!-- Product Actions Modal -->
<div id="productActionsModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Thao tác sản phẩm</h2>
            <button class="modal-close" id="closeActionsModal">×</button>
        </div>
        <div class="modal-body">
            <div class="action-buttons">
                <button class="btn btn-outline" id="editProduct">
                    <span class="btn-icon">✏️</span>
                    <span>Chỉnh sửa</span>
                </button>
                <button class="btn btn-outline" id="toggleProduct">
                    <span class="btn-icon">🔄</span>
                    <span>Kích hoạt/Tạm dừng</span>
                </button>
                <button class="btn btn-outline" id="duplicateProduct">
                    <span class="btn-icon">📋</span>
                    <span>Sao chép</span>
                </button>
                <button class="btn btn-outline" id="viewProduct">
                    <span class="btn-icon">👁️</span>
                    <span>Xem chi tiết</span>
                </button>
                <button class="btn btn-danger" id="deleteProduct">
                    <span class="btn-icon">🗑️</span>
                    <span>Xóa sản phẩm</span>
                </button>
            </div>
        </div>
    </div>
</div>



<?php include __DIR__.'/../../includes/footer.php'; ?>