<?php 
$pageTitle='Liên hệ'; 
$extraCss=['assets/css/main.css', 'assets/css/responsive.css', 'assets/css/contact.css']; 
$extraJs=['assets/js/main.js', 'assets/js/api.js', 'assets/js/pages/contact.js'];
include 'includes/header.php'; 
?>

<main class="main" role="main">
    <!-- Hero Section -->
    <section class="hero hero-small" aria-labelledby="contact-hero-title">
        <div class="container">
            <div class="hero-content">
                <h1 id="contact-hero-title" class="hero-title">Liên hệ với chúng tôi</h1>
                <p class="hero-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây</p>
            </div>
        </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info" aria-labelledby="contact-info-title">
        <div class="container">
            <h2 id="contact-info-title" class="section-title">Thông tin liên hệ</h2>
            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-icon">📧</div>
                    <h3>Email</h3>
                    <p>Gửi email cho chúng tôi bất cứ lúc nào</p>
                    <a href="mailto:support@bookverse.vn" class="contact-link">support@bookverse.vn</a>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">📞</div>
                    <h3>Điện thoại</h3>
                    <p>Gọi cho chúng tôi trong giờ hành chính</p>
                    <a href="tel:19001234" class="contact-link">1900 1234</a>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">📍</div>
                    <h3>Địa chỉ</h3>
                    <p>Văn phòng chính của chúng tôi</p>
                    <address class="contact-address">
                        123 Đường ABC, Quận XYZ<br>
                        TP Hồ Chí Minh, Việt Nam
                    </address>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">⏰</div>
                    <h3>Giờ làm việc</h3>
                    <p>Thời gian hỗ trợ khách hàng</p>
                    <div class="contact-hours">
                        <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                        <p>Thứ 7: 8:00 - 12:00</p>
                        <p>Chủ nhật: Nghỉ</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Form -->
    <section class="contact-form-section" aria-labelledby="contact-form-title">
        <div class="container">
            <div class="contact-form-wrapper">
                <div class="contact-form-content">
                    <h2 id="contact-form-title" class="section-title">Gửi tin nhắn cho chúng tôi</h2>
                    <p class="section-subtitle">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                    
                    <form id="contactForm" class="contact-form" action="contact.php" method="POST">
                        <div id="contactError" class="error-message" style="display: none;"></div>
                        <div id="contactSuccess" class="success-message" style="display: none;"></div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contactName">Họ và tên *</label>
                                <input type="text" id="contactName" name="name" required 
                                       placeholder="Nhập họ và tên của bạn">
                            </div>
                            
                            <div class="form-group">
                                <label for="contactEmail">Email *</label>
                                <input type="email" id="contactEmail" name="email" required 
                                       placeholder="Nhập email của bạn">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contactPhone">Số điện thoại</label>
                                <input type="tel" id="contactPhone" name="phone" 
                                       placeholder="Nhập số điện thoại">
                            </div>
                            
                            <div class="form-group">
                                <label for="contactSubject">Chủ đề *</label>
                                <select id="contactSubject" name="subject" required>
                                    <option value="">Chọn chủ đề</option>
                                    <option value="general">Câu hỏi chung</option>
                                    <option value="technical">Hỗ trợ kỹ thuật</option>
                                    <option value="billing">Thanh toán</option>
                                    <option value="seller">Hỗ trợ người bán</option>
                                    <option value="complaint">Khiếu nại</option>
                                    <option value="suggestion">Góp ý</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="contactMessage">Tin nhắn *</label>
                            <textarea id="contactMessage" name="message" required rows="6" 
                                      placeholder="Nhập tin nhắn của bạn..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="newsletter" value="1">
                                <span class="checkmark"></span>
                                Tôi muốn nhận thông tin về sản phẩm và dịch vụ mới
                            </label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block" id="submitBtn">
                            <span class="btn-text">Gửi tin nhắn</span>
                            <span class="btn-loading" style="display: none;">⏳</span>
                        </button>
                    </form>
                </div>
                
                <div class="contact-sidebar">
                    <div class="sidebar-card">
                        <h3>Hỗ trợ nhanh</h3>
                        <ul class="quick-links">
                            <li><a href="help.php#faq">Câu hỏi thường gặp</a></li>
                            <li><a href="help.php#shipping">Chính sách vận chuyển</a></li>
                            <li><a href="help.php#returns">Chính sách đổi trả</a></li>
                            <li><a href="help.php#payment">Phương thức thanh toán</a></li>
                        </ul>
                    </div>
                    
                    <div class="sidebar-card">
                        <h3>Mạng xã hội</h3>
                        <div class="social-links">
                            <a href="https://facebook.com/bookverse" class="social-link facebook" target="_blank" rel="noopener">
                                <span class="social-icon">📘</span>
                                Facebook
                            </a>
                            <a href="https://instagram.com/bookverse" class="social-link instagram" target="_blank" rel="noopener">
                                <span class="social-icon">📷</span>
                                Instagram
                            </a>
                            <a href="https://twitter.com/bookverse" class="social-link twitter" target="_blank" rel="noopener">
                                <span class="social-icon">🐦</span>
                                Twitter
                            </a>
                        </div>
                    </div>
                    
                    <div class="sidebar-card">
                        <h3>Thống kê</h3>
                        <div class="stats">
                            <div class="stat-item">
                                <span class="stat-number">10,000+</span>
                                <span class="stat-label">Khách hàng</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">50,000+</span>
                                <span class="stat-label">Sản phẩm</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">99%</span>
                                <span class="stat-label">Hài lòng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" aria-labelledby="faq-title">
        <div class="container">
            <h2 id="faq-title" class="section-title">Câu hỏi thường gặp</h2>
            <div class="faq-grid">
                <div class="faq-item">
                    <h3 class="faq-question">Làm thế nào để đặt hàng?</h3>
                    <div class="faq-answer">
                        <p>Bạn có thể đặt hàng bằng cách:</p>
                        <ol>
                            <li>Tìm kiếm sản phẩm mong muốn</li>
                            <li>Thêm vào giỏ hàng</li>
                            <li>Tiến hành thanh toán</li>
                            <li>Xác nhận đơn hàng</li>
                        </ol>
                    </div>
                </div>
                
                <div class="faq-item">
                    <h3 class="faq-question">Thời gian giao hàng là bao lâu?</h3>
                    <div class="faq-answer">
                        <p>Thời gian giao hàng tùy thuộc vào địa điểm:</p>
                        <ul>
                            <li>Nội thành TP Hồ Chí Minh: 1-2 ngày</li>
                            <li>Các tỉnh thành khác: 3-5 ngày</li>
                            <li>Vùng sâu vùng xa: 5-7 ngày</li>
                        </ul>
                    </div>
                </div>
                
                <div class="faq-item">
                    <h3 class="faq-question">Có thể đổi trả sản phẩm không?</h3>
                    <div class="faq-answer">
                        <p>Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng với điều kiện:</p>
                        <ul>
                            <li>Sản phẩm còn nguyên vẹn</li>
                            <li>Có hóa đơn mua hàng</li>
                            <li>Không phải sản phẩm đặc biệt</li>
                        </ul>
                    </div>
                </div>
                
                <div class="faq-item">
                    <h3 class="faq-question">Phương thức thanh toán nào được chấp nhận?</h3>
                    <div class="faq-answer">
                        <p>Chúng tôi chấp nhận các phương thức thanh toán:</p>
                        <ul>
                            <li>Thanh toán khi nhận hàng (COD)</li>
                            <li>Chuyển khoản ngân hàng</li>
                            <li>Thẻ tín dụng/ghi nợ</li>
                            <li>Ví điện tử (MoMo, ZaloPay)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>





<?php include 'includes/footer.php'; ?>
