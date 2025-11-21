<?php 
// Require user authentication for checkout
require_once __DIR__.'/../../includes/auth-check.php';
requireAnyRole(['user', 'seller', 'admin']);

$pageTitle='Thanh toán'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/checkout.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js','../../assets/js/checkout.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="../cart/cart.php">Giỏ hàng</a></li>
            <li aria-current="page">Thanh toán</li>
        </ol>
    </div>
</nav>

<main class="checkout-page">
    <div class="container">
        <div class="checkout-header">
            <h1>Thanh toán</h1>
            <div class="checkout-steps">
                <div class="step active" data-step="1">
                    <span class="step-number">1</span>
                    <span class="step-label">Thông tin</span>
                </div>
                <div class="step" data-step="2">
                    <span class="step-number">2</span>
                    <span class="step-label">Thanh toán</span>
                </div>
                <div class="step" data-step="3">
                    <span class="step-number">3</span>
                    <span class="step-label">Hoàn thành</span>
                </div>
            </div>
        </div>

        <div class="checkout-content">
            <!-- Checkout Form -->
            <div class="checkout-form-section">
                <form id="checkoutForm" class="checkout-form">
                    <!-- Step 1: Customer Information -->
                    <div class="checkout-step active" id="step1">
                        <div class="step-header">
                            <h2>Thông tin giao hàng</h2>
                            <p>Vui lòng điền thông tin để chúng tôi có thể giao hàng cho bạn</p>
                        </div>

                        <div class="form-section">
                            <h3>Thông tin liên hệ</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">Họ *</label>
                                    <input type="text" id="firstName" name="firstName" required>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Tên *</label>
                                    <input type="text" id="lastName" name="lastName" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">Email *</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="phone">Số điện thoại *</label>
                                    <input type="tel" id="phone" name="phone" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Địa chỉ giao hàng</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">Tỉnh/Thành phố *</label>
                                    <select id="city" name="city" required>
                                        <option value="">Chọn tỉnh/thành phố</option>
                                        <option value="hanoi">TP Hồ Chí Minh</option>
                                        <option value="hcm">TP. Hồ Chí Minh</option>
                                        <option value="danang">Đà Nẵng</option>
                                        <option value="cantho">Cần Thơ</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="district">Quận/Huyện *</label>
                                    <select id="district" name="district" required>
                                        <option value="">Chọn quận/huyện</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="address">Địa chỉ chi tiết *</label>
                                <textarea id="address" name="address" rows="3" placeholder="Số nhà, tên đường, phường/xã..." required></textarea>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Phương thức giao hàng</h3>
                            <div class="shipping-methods">
                                <label class="shipping-option">
                                    <input type="radio" name="shippingMethod" value="standard" checked>
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-title">Giao hàng tiêu chuẩn</span>
                                            <span class="option-price">30.000₫</span>
                                        </div>
                                        <p class="option-description">Giao hàng trong 2-3 ngày làm việc</p>
                                    </div>
                                </label>
                                <label class="shipping-option">
                                    <input type="radio" name="shippingMethod" value="express">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-title">Giao hàng nhanh</span>
                                            <span class="option-price">50.000₫</span>
                                        </div>
                                        <p class="option-description">Giao hàng trong 1 ngày làm việc</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn btn-outline" id="backToCartBtn">
                                <span class="btn-icon">←</span>
                                <span>Quay lại giỏ hàng</span>
                            </button>
                            <button type="button" class="btn btn-primary" id="nextToPaymentBtn">
                                <span>Tiếp tục</span>
                                <span class="btn-icon">→</span>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Payment -->
                    <div class="checkout-step" id="step2">
                        <div class="step-header">
                            <h2>Phương thức thanh toán</h2>
                            <p>Chọn phương thức thanh toán phù hợp với bạn</p>
                        </div>

                        <div class="form-section">
                            <h3>Chọn phương thức thanh toán</h3>
                            <div class="payment-methods">
                                <label class="payment-option">
                                    <input type="radio" name="paymentMethod" value="cod" checked>
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-icon">💰</span>
                                            <span class="option-title">Thanh toán khi nhận hàng (COD)</span>
                                        </div>
                                        <p class="option-description">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                    </div>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="paymentMethod" value="bank">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-icon">🏦</span>
                                            <span class="option-title">Chuyển khoản ngân hàng</span>
                                        </div>
                                        <p class="option-description">Chuyển khoản qua ngân hàng</p>
                                    </div>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="paymentMethod" value="momo">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-icon">💳</span>
                                            <span class="option-title">Ví MoMo</span>
                                        </div>
                                        <p class="option-description">Thanh toán qua ví điện tử MoMo</p>
                                    </div>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="paymentMethod" value="zalopay">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-icon">💳</span>
                                            <span class="option-title">ZaloPay</span>
                                        </div>
                                        <p class="option-description">Thanh toán qua ZaloPay</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Ghi chú đơn hàng</h3>
                            <div class="form-group">
                                <label for="orderNotes">Ghi chú (tùy chọn)</label>
                                <textarea id="orderNotes" name="orderNotes" rows="3" placeholder="Ghi chú thêm cho đơn hàng..."></textarea>
                            </div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn btn-outline" id="backToInfoBtn">
                                <span class="btn-icon">←</span>
                                <span>Quay lại</span>
                            </button>
                            <button type="button" class="btn btn-primary" id="reviewOrderBtn">
                                <span>Xem lại đơn hàng</span>
                                <span class="btn-icon">→</span>
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Review & Complete -->
                    <div class="checkout-step" id="step3">
                        <div class="step-header">
                            <h2>Xác nhận đơn hàng</h2>
                            <p>Vui lòng kiểm tra lại thông tin trước khi đặt hàng</p>
                        </div>

                        <div class="order-summary">
                            <h3>Thông tin đơn hàng</h3>
                            <div class="summary-section">
                                <h4>Thông tin giao hàng</h4>
                                <div class="summary-content" id="shippingInfo">
                                    <!-- Shipping info will be populated here -->
                                </div>
                            </div>
                            <div class="summary-section">
                                <h4>Phương thức thanh toán</h4>
                                <div class="summary-content" id="paymentInfo">
                                    <!-- Payment info will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn btn-outline" id="backToPaymentBtn">
                                <span class="btn-icon">←</span>
                                <span>Quay lại</span>
                            </button>
                            <button type="submit" class="btn btn-primary btn-large" id="placeOrderBtn">
                                <span class="btn-icon">✅</span>
                                <span>Đặt hàng</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="order-summary-section">
                <div class="summary-card">
                    <h3>Đơn hàng của bạn</h3>
                    
                    <div class="order-items" id="orderItems">
                        <!-- Order items will be loaded here -->
                    </div>

                    <div class="order-totals">
                        <div class="total-row">
                            <span>Tạm tính:</span>
                            <span id="subtotal">0₫</span>
                        </div>
                        <div class="total-row">
                            <span>Phí vận chuyển:</span>
                            <span id="shippingCost">0₫</span>
                        </div>
                        <div class="total-row">
                            <span>Giảm giá:</span>
                            <span id="discount">-0₫</span>
                        </div>
                        <div class="total-row total">
                            <span>Tổng cộng:</span>
                            <span id="grandTotal">0₫</span>
                        </div>
                    </div>

                    <div class="security-info">
                        <div class="security-item">
                            <span class="security-icon">🔒</span>
                            <span>Thông tin được mã hóa SSL</span>
                        </div>
                        <div class="security-item">
                            <span class="security-icon">↩️</span>
                            <span>Đổi trả miễn phí trong 7 ngày</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Order Item Template -->
<template id="orderItemTemplate">
    <div class="order-item">
        <div class="item-image">
            <img src="" alt="" class="product-image">
        </div>
        <div class="item-details">
            <h4 class="item-title"></h4>
            <p class="item-author"></p>
            <div class="item-quantity">Số lượng: <span class="quantity"></span></div>
        </div>
        <div class="item-price"></div>
    </div>
</template>

<?php include __DIR__.'/../../includes/footer.php'; ?>
