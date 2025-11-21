<?php 
$pageTitle='Đặt hàng thành công'; 
$extraCss=['../../assets/css/main.css', '../../assets/css/checkout.css', '../../assets/css/checkout-success.css']; 
$extraJs=['../../assets/js/main.js', '../../assets/js/api.js', '../../assets/js/pages/checkout-success.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="checkout-success-page">
    <div class="container">
        <div class="success-content">
            <div class="success-icon">
                <div class="icon-circle">
                    <span class="check-icon">✓</span>
                </div>
            </div>
            
            <h1>Đặt hàng thành công!</h1>
            <p class="success-message">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
            </p>
            
            <div class="order-info">
                <div class="info-card">
                    <h3>Thông tin đơn hàng</h3>
                    <div class="info-details">
                        <div class="detail-row">
                            <span class="label">Mã đơn hàng:</span>
                            <span class="value" id="orderId">#<?php echo $_GET['orderId'] ?? 'N/A'; ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ngày đặt:</span>
                            <span class="value" id="orderDate"><?php echo date('d/m/Y H:i'); ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Trạng thái:</span>
                            <span class="value status-pending">Đang xử lý</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <h3>Thông tin giao hàng</h3>
                    <div class="info-details" id="shippingInfo">
                        <!-- Shipping info will be populated here -->
                    </div>
                </div>
                
                <div class="info-card">
                    <h3>Phương thức thanh toán</h3>
                    <div class="info-details" id="paymentInfo">
                        <!-- Payment info will be populated here -->
                    </div>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>Bước tiếp theo</h3>
                <div class="steps-list">
                    <div class="step-item">
                        <div class="step-icon">📧</div>
                        <div class="step-content">
                            <h4>Xác nhận email</h4>
                            <p>Chúng tôi đã gửi email xác nhận đơn hàng đến hộp thư của bạn</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-icon">📦</div>
                        <div class="step-content">
                            <h4>Chuẩn bị hàng</h4>
                            <p>Đơn hàng của bạn đang được chuẩn bị và đóng gói</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-icon">🚚</div>
                        <div class="step-content">
                            <h4>Giao hàng</h4>
                            <p>Đơn hàng sẽ được giao trong 1-2 ngày làm việc</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <a href="../products/list.php" class="btn btn-primary btn-large">
                    <span class="btn-icon">🛍️</span>
                    <span>Tiếp tục mua sắm</span>
                </a>
                <a href="../account/orders.php" class="btn btn-outline btn-large">
                    <span class="btn-icon">📋</span>
                    <span>Xem đơn hàng</span>
                </a>
                <button class="btn btn-secondary btn-large" id="printOrderBtn">
                    <span class="btn-icon">🖨️</span>
                    <span>In hóa đơn</span>
                </button>
            </div>
            
            <div class="support-info">
                <h3>Cần hỗ trợ?</h3>
                <p>Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:</p>
                <div class="support-contacts">
                    <div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <span>Hotline: <a href="tel:19001234">1900 1234</a></span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        <span>Email: <a href="mailto:support@bookverse.vn">support@bookverse.vn</a></span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">💬</span>
                        <span>Chat: <a href="#" id="openChatLink">Mở chat</a></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<?php include __DIR__.'/../../includes/footer.php'; ?>
