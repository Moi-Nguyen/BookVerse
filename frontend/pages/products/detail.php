<?php 
$pageTitle='Chi tiết sản phẩm'; 
$extraCss=['assets/css/global.css', 'assets/css/products.css', 'assets/css/product-detail.css']; 
$extraJs=['assets/js/main.js', 'assets/js/api.js','assets/js/product.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="list.php">Sản phẩm</a></li>
            <li aria-current="page">Chi tiết sản phẩm</li>
        </ol>
    </div>
</nav>

<main class="product-detail-page">
    <div class="container">
        <!-- Product Detail Section -->
        <section id="productDetail" class="product-detail-section">
            <div class="product-detail-grid">
                <!-- Product Images -->
                <div class="product-images">
                    <div class="main-image-container">
                        <img id="mainImage" src="../../assets/images/no-image.jpg" alt="Product Image" class="main-image">
                        <div class="image-zoom-overlay" id="imageZoom">
                            <img id="zoomImage" src="" alt="Zoomed Product Image">
                        </div>
                    </div>
                    <div class="thumbnail-gallery" id="thumbnailGallery">
                        <!-- Thumbnails will be loaded here -->
                    </div>
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <div class="product-header">
                        <h1 id="productTitle" class="product-title">Đang tải...</h1>
                        <div class="product-badges" id="productBadges">
                            <!-- Badges will be loaded here -->
                        </div>
                    </div>

                    <div class="product-meta">
                        <div class="product-author">
                            <span class="meta-label">Tác giả:</span>
                            <span id="productAuthor" class="meta-value">Đang tải...</span>
                        </div>
                        <div class="product-publisher">
                            <span class="meta-label">Nhà xuất bản:</span>
                            <span id="productPublisher" class="meta-value">Đang tải...</span>
                        </div>
                        <div class="product-category">
                            <span class="meta-label">Danh mục:</span>
                            <span id="productCategory" class="meta-value">Đang tải...</span>
                        </div>
                    </div>

                    <div class="product-rating-section">
                        <div class="rating-display">
                            <div class="stars" id="productStars">★★★★★</div>
                            <span class="rating-score" id="ratingScore">0</span>
                            <span class="rating-count" id="ratingCount">(0 đánh giá)</span>
                        </div>
                    </div>

                    <div class="product-description">
                        <h3>Mô tả sản phẩm</h3>
                        <p id="productDescription">Đang tải mô tả...</p>
                    </div>

                    <div class="product-price-section">
                        <div class="price-display">
                            <span class="current-price" id="currentPrice">0₫</span>
                            <span class="original-price" id="originalPrice" style="display: none;">0₫</span>
                            <span class="discount-badge" id="discountBadge" style="display: none;">-0%</span>
                        </div>
                        <div class="price-details">
                            <span class="price-label">Giá bán:</span>
                            <span class="price-value" id="priceValue">0₫</span>
                        </div>
                    </div>

                    <div class="purchase-card">
                        <div class="purchase-card-header">
                            <h3>Chọn mua</h3>
                            <p>Chọn số lượng và hình thức mua hàng</p>
                        </div>

                        <div class="purchase-card-content">
                            <div class="quantity-selector">
                                <label for="quantity">Số lượng</label>
                                <div class="quantity-controls">
                                    <button type="button" class="quantity-btn" id="decreaseQty">-</button>
                                    <input type="number" id="quantity" name="quantity" value="1" min="1" max="99">
                                    <button type="button" class="quantity-btn" id="increaseQty">+</button>
                                </div>
                            </div>

                            <div class="action-buttons">
                                <button class="btn btn-primary btn-large" id="addToCartBtn">
                                    <span class="btn-icon">🛒</span>
                                    <span class="btn-text">Thêm vào giỏ</span>
                                </button>
                                <button class="btn btn-outline btn-large" id="buyNowBtn">
                                    <span class="btn-icon">⚡</span>
                                    <span class="btn-text">Mua ngay</span>
                                </button>
                                <button class="btn btn-outline btn-large" id="messageSellerBtn" style="display: none;">
                                    <span class="btn-icon">💬</span>
                                    <span class="btn-text">Nhắn người bán</span>
                                </button>
                                <button class="btn btn-secondary btn-large wishlist-btn" id="addToWishlistBtn">
                                    <span class="btn-icon">❤️</span>
                                    <span class="btn-text">Yêu thích</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="product-shipping">
                        <div class="shipping-info">
                            <span class="shipping-icon">🚚</span>
                            <div class="shipping-details">
                                <strong>Miễn phí vận chuyển</strong>
                                <p>Cho đơn hàng từ 500.000₫</p>
                            </div>
                        </div>
                        <div class="shipping-info">
                            <span class="shipping-icon">⏰</span>
                            <div class="shipping-details">
                                <strong>Giao hàng nhanh</strong>
                                <p>1-2 ngày làm việc</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Product Tabs -->
        <section class="product-tabs">
            <div class="tab-navigation">
                <button class="tab-btn active" data-tab="description">Mô tả chi tiết</button>
                <button class="tab-btn" data-tab="specifications">Thông số kỹ thuật</button>
                <button class="tab-btn" data-tab="reviews">Đánh giá (0)</button>
                <button class="tab-btn" data-tab="shipping">Vận chuyển & Trả hàng</button>
            </div>

            <div class="tab-content">
                <div class="tab-panel active" id="description">
                    <div class="tab-panel-content">
                        <h3>Mô tả chi tiết</h3>
                        <div id="detailedDescription">
                            <!-- Detailed description will be loaded here -->
                        </div>
                    </div>
                </div>

                <div class="tab-panel" id="specifications">
                    <div class="tab-panel-content">
                        <h3>Thông số kỹ thuật</h3>
                        <div class="specifications-table" id="specificationsTable">
                            <!-- Specifications will be loaded here -->
                        </div>
                    </div>
                </div>

                <div class="tab-panel" id="reviews">
                    <div class="tab-panel-content">
                        <h3>Đánh giá sản phẩm</h3>
                        <div class="reviews-summary">
                            <div class="rating-breakdown">
                                <div class="rating-overview">
                                    <div class="overall-rating">
                                        <span class="rating-number" id="overallRating">0</span>
                                        <div class="rating-stars" id="overallStars">★★★★★</div>
                                        <span class="rating-total">dựa trên 0 đánh giá</span>
                                    </div>
                                </div>
                                <div class="rating-bars">
                                    <!-- Rating bars will be loaded here -->
                                </div>
                            </div>
                        </div>
                        <div class="reviews-list" id="reviewsList">
                            <!-- Reviews will be loaded here -->
                        </div>
                        <div class="review-form-container">
                            <h4>Viết đánh giá của bạn</h4>
                            <form id="reviewForm" class="review-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="reviewRating">Đánh giá của bạn:</label>
                                        <div class="star-rating" id="starRating">
                                            <input type="radio" name="rating" value="5" id="star5">
                                            <label for="star5">★</label>
                                            <input type="radio" name="rating" value="4" id="star4">
                                            <label for="star4">★</label>
                                            <input type="radio" name="rating" value="3" id="star3">
                                            <label for="star3">★</label>
                                            <input type="radio" name="rating" value="2" id="star2">
                                            <label for="star2">★</label>
                                            <input type="radio" name="rating" value="1" id="star1">
                                            <label for="star1">★</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="reviewTitle">Tiêu đề đánh giá:</label>
                                        <input type="text" id="reviewTitle" name="title" placeholder="Nhập tiêu đề đánh giá">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="reviewComment">Nội dung đánh giá:</label>
                                        <textarea id="reviewComment" name="comment" rows="4" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."></textarea>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="tab-panel" id="shipping">
                    <div class="tab-panel-content">
                        <h3>Vận chuyển & Trả hàng</h3>
                        <div class="shipping-policy">
                            <div class="policy-item">
                                <h4>🚚 Vận chuyển</h4>
                                <ul>
                                    <li>Miễn phí vận chuyển cho đơn hàng từ 500.000₫</li>
                                    <li>Phí vận chuyển: 30.000₫ cho đơn hàng dưới 500.000₫</li>
                                    <li>Thời gian giao hàng: 1-2 ngày làm việc</li>
                                    <li>Giao hàng toàn quốc</li>
                                </ul>
                            </div>
                            <div class="policy-item">
                                <h4>↩️ Trả hàng & Đổi hàng</h4>
                                <ul>
                                    <li>Được phép trả hàng trong vòng 7 ngày</li>
                                    <li>Sản phẩm phải còn nguyên vẹn, không bị hỏng</li>
                                    <li>Hoàn tiền 100% nếu sản phẩm lỗi</li>
                                    <li>Miễn phí đổi hàng trong 30 ngày</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Related Products -->
        <section class="related-products">
            <h2>Sản phẩm liên quan</h2>
            <div class="products-grid" id="relatedProducts">
                <!-- Related products will be loaded here -->
            </div>
        </section>
    </div>
</main>
<?php include __DIR__.'/../../includes/footer.php'; ?>



