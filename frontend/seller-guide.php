<?php 
$pageTitle='Hướng dẫn bán hàng - Bookverse'; 
$extraCss=['assets/css/main.css', 'assets/css/seller-guide.css']; 
$extraJs=['assets/js/main.js', 'assets/js/pages/seller-guide.js'];
include 'includes/header.php'; 
?>

<main class="seller-guide-main">
    <!-- Hero Section -->
    <section class="guide-hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">Hướng dẫn bán sách trên Bookverse</h1>
                <p class="hero-subtitle">Trở thành người bán thành công với những bí quyết và kinh nghiệm từ chuyên gia</p>
                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-number">10,000+</span>
                        <span class="stat-label">Người bán</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">50,000+</span>
                        <span class="stat-label">Sách đã bán</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">98%</span>
                        <span class="stat-label">Hài lòng</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Quick Start Section -->
    <section class="quick-start">
        <div class="container">
            <h2 class="section-title">Bắt đầu bán sách trong 3 bước</h2>
            <div class="steps-grid">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Đăng ký tài khoản</h3>
                        <p>Tạo tài khoản người bán và xác thực thông tin cá nhân</p>
                        <a href="pages/auth/seller-register.php" class="btn btn-primary">Đăng ký ngay</a>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Thêm sách vào cửa hàng</h3>
                        <p>Upload thông tin sách, hình ảnh và mô tả chi tiết</p>
                        <a href="pages/seller/products.php" class="btn btn-outline">Quản lý sách</a>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Bắt đầu bán hàng</h3>
                        <p>Nhận đơn hàng, đóng gói và giao hàng cho khách</p>
                        <a href="pages/seller/orders.php" class="btn btn-outline">Xem đơn hàng</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Guide Sections -->
    <section class="guide-sections">
        <div class="container">
            <div class="guide-tabs">
                <button class="tab-btn active" data-tab="getting-started">Bắt đầu</button>
                <button class="tab-btn" data-tab="product-management">Quản lý sản phẩm</button>
                <button class="tab-btn" data-tab="order-management">Xử lý đơn hàng</button>
                <button class="tab-btn" data-tab="marketing">Marketing</button>
                <button class="tab-btn" data-tab="tips">Mẹo hay</button>
            </div>

            <!-- Getting Started Tab -->
            <div class="tab-content active" id="getting-started">
                <div class="guide-content">
                    <h3>Bắt đầu bán sách</h3>
                    <div class="content-grid">
                        <div class="content-card">
                            <div class="card-icon">📝</div>
                            <h4>Chuẩn bị thông tin</h4>
                            <ul>
                                <li>Thông tin cá nhân đầy đủ</li>
                                <li>Giấy tờ tùy thân hợp lệ</li>
                                <li>Thông tin ngân hàng</li>
                                <li>Địa chỉ cửa hàng</li>
                            </ul>
                        </div>
                        <div class="content-card">
                            <div class="card-icon">📚</div>
                            <h4>Chuẩn bị sách</h4>
                            <ul>
                                <li>Sách còn mới, không bị rách</li>
                                <li>Hình ảnh chất lượng cao</li>
                                <li>Mô tả chi tiết sách</li>
                                <li>Giá bán hợp lý</li>
                            </ul>
                        </div>
                        <div class="content-card">
                            <div class="card-icon">📦</div>
                            <h4>Chuẩn bị đóng gói</h4>
                            <ul>
                                <li>Hộp carton chắc chắn</li>
                                <li>Băng keo, giấy bọc</li>
                                <li>Nhãn vận chuyển</li>
                                <li>Bảo hiểm hàng hóa</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Management Tab -->
            <div class="tab-content" id="product-management">
                <div class="guide-content">
                    <h3>Quản lý sản phẩm hiệu quả</h3>
                    <div class="steps-list">
                        <div class="step-item">
                            <div class="step-icon">📸</div>
                            <div class="step-text">
                                <h4>Chụp ảnh sách</h4>
                                <p>Chụp ảnh rõ nét, đủ ánh sáng, nhiều góc độ. Ảnh đẹp sẽ thu hút khách hàng hơn.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">📝</div>
                            <div class="step-text">
                                <h4>Viết mô tả chi tiết</h4>
                                <p>Mô tả tình trạng sách, nội dung, tác giả, nhà xuất bản. Thông tin càng chi tiết càng tốt.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">💰</div>
                            <div class="step-text">
                                <h4>Định giá hợp lý</h4>
                                <p>Nghiên cứu giá thị trường, tình trạng sách để định giá cạnh tranh.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">🏷️</div>
                            <div class="step-text">
                                <h4>Chọn danh mục phù hợp</h4>
                                <p>Chọn đúng danh mục để khách hàng dễ tìm thấy sách của bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Management Tab -->
            <div class="tab-content" id="order-management">
                <div class="guide-content">
                    <h3>Xử lý đơn hàng chuyên nghiệp</h3>
                    <div class="process-flow">
                        <div class="flow-step">
                            <div class="flow-icon">🔔</div>
                            <h4>Nhận thông báo</h4>
                            <p>Hệ thống sẽ gửi thông báo khi có đơn hàng mới</p>
                        </div>
                        <div class="flow-arrow">→</div>
                        <div class="flow-step">
                            <div class="flow-icon">📦</div>
                            <h4>Chuẩn bị hàng</h4>
                            <p>Kiểm tra sách, đóng gói cẩn thận</p>
                        </div>
                        <div class="flow-arrow">→</div>
                        <div class="flow-step">
                            <div class="flow-icon">🚚</div>
                            <h4>Giao hàng</h4>
                            <p>Giao hàng đúng thời gian cam kết</p>
                        </div>
                        <div class="flow-arrow">→</div>
                        <div class="flow-step">
                            <div class="flow-icon">✅</div>
                            <h4>Hoàn thành</h4>
                            <p>Xác nhận giao hàng thành công</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Marketing Tab -->
            <div class="tab-content" id="marketing">
                <div class="guide-content">
                    <h3>Marketing hiệu quả</h3>
                    <div class="marketing-tips">
                        <div class="tip-card">
                            <div class="tip-icon">⭐</div>
                            <h4>Xây dựng đánh giá tốt</h4>
                            <p>Chất lượng sách tốt, giao hàng nhanh sẽ nhận được đánh giá cao từ khách hàng.</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">💬</div>
                            <h4>Tương tác với khách hàng</h4>
                            <p>Trả lời tin nhắn nhanh chóng, tư vấn nhiệt tình sẽ tăng tỷ lệ mua hàng.</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">🎯</div>
                            <h4>Đăng sách thường xuyên</h4>
                            <p>Đăng sách mới thường xuyên để tăng khả năng hiển thị trên trang chủ.</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">📱</div>
                            <h4>Chia sẻ mạng xã hội</h4>
                            <p>Chia sẻ sách lên Facebook, Instagram để tiếp cận nhiều khách hàng hơn.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tips Tab -->
            <div class="tab-content" id="tips">
                <div class="guide-content">
                    <h3>Mẹo hay từ chuyên gia</h3>
                    <div class="tips-grid">
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Chụp ảnh sách đẹp</h4>
                            <p>Sử dụng ánh sáng tự nhiên, chụp nhiều góc độ, đảm bảo ảnh rõ nét và đẹp mắt.</p>
                        </div>
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Mô tả chi tiết</h4>
                            <p>Viết mô tả đầy đủ thông tin: tác giả, nhà xuất bản, năm xuất bản, tình trạng sách.</p>
                        </div>
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Đóng gói cẩn thận</h4>
                            <p>Sử dụng hộp carton chắc chắn, bọc sách bằng giấy bóng, dán băng keo kỹ lưỡng.</p>
                        </div>
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Giao hàng nhanh</h4>
                            <p>Giao hàng trong 24-48h để tăng trải nghiệm khách hàng và nhận đánh giá tốt.</p>
                        </div>
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Giá cạnh tranh</h4>
                            <p>Nghiên cứu giá thị trường, định giá hợp lý để cạnh tranh với người bán khác.</p>
                        </div>
                        <div class="tip-item">
                            <div class="tip-number">💡</div>
                            <h4>Chăm sóc khách hàng</h4>
                            <p>Trả lời tin nhắn nhanh chóng, tư vấn nhiệt tình, xử lý khiếu nại kịp thời.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <div class="container">
            <h2 class="section-title">Câu hỏi thường gặp</h2>
            <div class="faq-list">
                <div class="faq-item">
                    <button class="faq-question">
                        <span>Tôi cần chuẩn bị gì để bắt đầu bán sách?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Bạn cần chuẩn bị: thông tin cá nhân, giấy tờ tùy thân, thông tin ngân hàng, địa chỉ cửa hàng và sách muốn bán.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-question">
                        <span>Phí bán hàng trên Bookverse là bao nhiêu?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Bookverse chỉ thu phí hoa hồng 5% trên mỗi đơn hàng thành công. Không có phí đăng ký hay phí duy trì.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-question">
                        <span>Làm sao để tăng doanh số bán hàng?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Chụp ảnh đẹp, mô tả chi tiết, giá cạnh tranh, giao hàng nhanh, chăm sóc khách hàng tốt và đăng sách thường xuyên.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <button class="faq-question">
                        <span>Khi nào tôi nhận được tiền từ đơn hàng?</span>
                        <span class="faq-icon">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Sau khi giao hàng thành công và khách hàng xác nhận nhận hàng, bạn sẽ nhận được tiền trong vòng 3-5 ngày làm việc.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Sẵn sàng bắt đầu bán sách?</h2>
                <p>Tham gia cộng đồng người bán thành công trên Bookverse</p>
                <div class="cta-buttons">
                    <a href="pages/auth/seller-register.php" class="btn btn-primary btn-large">
                        <span>Đăng ký ngay</span>
                        <span class="btn-icon">🚀</span>
                    </a>
                    <a href="pages/seller/dashboard.php" class="btn btn-outline btn-large">
                        <span>Xem dashboard</span>
                        <span class="btn-icon">📊</span>
                    </a>
                </div>
            </div>
        </div>
    </section>
</main>



<?php include 'includes/footer.php'; ?>
