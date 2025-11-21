<?php 
// Optional authentication - allow guests to view cart
require_once __DIR__.'/../../includes/auth-check.php';

$pageTitle='Giỏ hàng'; 
$extraCss=['assets/css/cart.css']; 
$extraJs=['assets/js/cart.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li aria-current="page">Giỏ hàng</li>
        </ol>
    </div>
</nav>

<main class="cart-page">
    <div class="container">
        <div class="cart-header">
            <h1>Giỏ hàng của bạn</h1>
            <div class="cart-summary">
                <span class="item-count" id="itemCount">0 sản phẩm</span>
                <span class="total-price" id="totalPrice">0₫</span>
            </div>
        </div>

        <div class="cart-content">
            <!-- Cart Items -->
            <div class="cart-items-section">
                <div class="cart-items-header">
                    <h2>Sản phẩm trong giỏ</h2>
                    <button class="btn btn-outline btn-sm" id="clearCartBtn">
                        <span class="btn-icon">🗑️</span>
                        <span>Xóa tất cả</span>
                    </button>
                </div>

                <div class="cart-items" id="cartItems">
                    <!-- Cart items will be loaded here -->
                    <div class="empty-cart" id="emptyCart">
                        <div class="empty-cart-icon">🛒</div>
                        <h3>Giỏ hàng trống</h3>
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <a href="../products/list.php" class="btn btn-primary">
                            <span class="btn-icon">🛍️</span>
                            <span>Tiếp tục mua sắm</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary-section">
                <div class="summary-card">
                    <h3>Tóm tắt đơn hàng</h3>
                    
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Tạm tính:</span>
                            <span id="subtotal">0₫</span>
                        </div>
                        <div class="summary-row">
                            <span>Phí vận chuyển:</span>
                            <span id="shippingFee">0₫</span>
                        </div>
                        <div class="summary-row">
                            <span>Giảm giá:</span>
                            <span id="discount">-0₫</span>
                        </div>
                        <div class="summary-row total">
                            <span>Tổng cộng:</span>
                            <span id="grandTotal">0₫</span>
                        </div>
                    </div>

                    <div class="coupon-section">
                        <div class="coupon-input">
                            <input type="text" id="couponCode" placeholder="Nhập mã giảm giá">
                            <button class="btn btn-outline btn-sm" id="applyCouponBtn">Áp dụng</button>
                        </div>
                        <div class="coupon-message" id="couponMessage"></div>
                    </div>

                    <div class="checkout-actions">
                        <button class="btn btn-primary btn-large" id="checkoutBtn" disabled>
                            <span class="btn-icon">💳</span>
                            <span>Thanh toán</span>
                        </button>
                        <a href="../products/list.php" class="btn btn-outline btn-large">
                            <span class="btn-icon">🛍️</span>
                            <span>Tiếp tục mua sắm</span>
                        </a>
                    </div>

                    <div class="security-badges">
                        <div class="security-item">
                            <span class="security-icon">🔒</span>
                            <span>Thanh toán an toàn</span>
                        </div>
                        <div class="security-item">
                            <span class="security-icon">🚚</span>
                            <span>Miễn phí vận chuyển từ 500k</span>
                        </div>
                        <div class="security-item">
                            <span class="security-icon">↩️</span>
                            <span>Đổi trả trong 7 ngày</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommended Products -->
        <section class="recommended-products">
            <h2>Sản phẩm gợi ý</h2>
            <div class="products-grid" id="recommendedProducts">
                <!-- Recommended products will be loaded here -->
            </div>
        </section>
    </div>
</main>

<!-- Cart Item Template -->
<template id="cartItemTemplate">
    <div class="cart-item" data-product-id="">
        <div class="item-image">
            <img src="" alt="" class="product-image">
            <div class="item-badges">
                <!-- Badges will be added here -->
            </div>
        </div>
        
        <div class="item-details">
            <h3 class="item-title"></h3>
            <p class="item-author"></p>
            <div class="item-rating">
                <div class="stars"></div>
                <span class="rating-text"></span>
            </div>
            <div class="item-availability">
                <span class="availability-status available">Còn hàng</span>
            </div>
        </div>
        
        <div class="item-price">
            <div class="price-current"></div>
            <div class="price-original" style="display: none;"></div>
        </div>
        
        <div class="item-quantity">
            <div class="quantity-controls">
                <button type="button" class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="99">
                <button type="button" class="quantity-btn increase">+</button>
            </div>
        </div>
        
        <div class="item-total">
            <span class="total-price"></span>
        </div>
        
        <div class="item-actions">
            <button class="action-btn wishlist" title="Thêm vào yêu thích">
                <span class="btn-icon">❤️</span>
            </button>
            <button class="action-btn remove" title="Xóa khỏi giỏ">
                <span class="btn-icon">🗑️</span>
            </button>
        </div>
    </div>
</template>

<?php include __DIR__.'/../../includes/footer.php'; ?>