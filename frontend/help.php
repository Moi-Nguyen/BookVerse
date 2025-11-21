<?php 
$pageTitle='Trợ giúp'; 
$extraCss=['assets/css/main.css', 'assets/css/responsive.css', 'assets/css/help.css']; 
$extraJs=['assets/js/main.js', 'assets/js/api.js', 'assets/js/pages/help.js'];
include 'includes/header.php'; 
?>

<main class="main" role="main">
    <!-- Hero Section -->
    <section class="hero hero-small" aria-labelledby="help-hero-title">
        <div class="container">
            <div class="hero-content">
                <h1 id="help-hero-title" class="hero-title">Trung tâm trợ giúp</h1>
                <p class="hero-subtitle">Tìm câu trả lời cho các câu hỏi thường gặp và hướng dẫn sử dụng</p>
            </div>
        </div>
    </section>

    <!-- Search Help -->
    <section class="help-search" aria-labelledby="help-search-title">
        <div class="container">
            <h2 id="help-search-title" class="section-title">Tìm kiếm trợ giúp</h2>
            <div class="search-wrapper">
                <form class="help-search-form" action="help.php" method="GET">
                    <div class="search-input-group">
                        <input type="text" name="q" placeholder="Nhập từ khóa tìm kiếm..." 
                               class="search-input" value="<?php echo htmlspecialchars($_GET['q'] ?? ''); ?>">
                        <button type="submit" class="search-btn">
                            <span class="search-icon">🔍</span>
                            Tìm kiếm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Quick Links -->
    <section class="quick-links-section" aria-labelledby="quick-links-title">
        <div class="container">
            <h2 id="quick-links-title" class="section-title">Liên kết nhanh</h2>
            <div class="quick-links-grid">
                <a href="#faq" class="quick-link-card">
                    <div class="quick-link-icon">❓</div>
                    <h3>Câu hỏi thường gặp</h3>
                    <p>Tìm câu trả lời cho các câu hỏi phổ biến</p>
                </a>
                
                <a href="#shipping" class="quick-link-card">
                    <div class="quick-link-icon">🚚</div>
                    <h3>Vận chuyển</h3>
                    <p>Thông tin về phí ship và thời gian giao hàng</p>
                </a>
                
                <a href="#returns" class="quick-link-card">
                    <div class="quick-link-icon">↩️</div>
                    <h3>Đổi trả</h3>
                    <p>Chính sách đổi trả và hoàn tiền</p>
                </a>
                
                <a href="#payment" class="quick-link-card">
                    <div class="quick-link-icon">💳</div>
                    <h3>Thanh toán</h3>
                    <p>Các phương thức thanh toán được chấp nhận</p>
                </a>
                
                <a href="#account" class="quick-link-card">
                    <div class="quick-link-icon">👤</div>
                    <h3>Tài khoản</h3>
                    <p>Quản lý tài khoản và thông tin cá nhân</p>
                </a>
                
                <a href="#seller" class="quick-link-card">
                    <div class="quick-link-icon">🏪</div>
                    <h3>Người bán</h3>
                    <p>Hướng dẫn cho người bán trên nền tảng</p>
                </a>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section" aria-labelledby="faq-title">
        <div class="container">
            <h2 id="faq-title" class="section-title">Câu hỏi thường gặp</h2>
            <div class="faq-categories">
                <button class="faq-category-btn active" data-category="general">Chung</button>
                <button class="faq-category-btn" data-category="ordering">Đặt hàng</button>
                <button class="faq-category-btn" data-category="shipping">Vận chuyển</button>
                <button class="faq-category-btn" data-category="returns">Đổi trả</button>
                <button class="faq-category-btn" data-category="payment">Thanh toán</button>
            </div>
            
            <div class="faq-list">
                <!-- General FAQ -->
                <div class="faq-category" data-category="general">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Bookverse là gì?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Bookverse là nền tảng thương mại điện tử chuyên về sách, nơi bạn có thể mua bán sách mới và cũ với giá cả hợp lý. Chúng tôi kết nối người mua và người bán sách trên toàn quốc.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để đăng ký tài khoản?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Bạn có thể đăng ký tài khoản bằng cách:</p>
                            <ol>
                                <li>Nhấn nút "Đăng ký" ở góc trên bên phải</li>
                                <li>Điền thông tin cá nhân</li>
                                <li>Xác nhận email</li>
                                <li>Hoàn tất đăng ký</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Tôi có thể bán sách trên Bookverse không?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Có, bạn hoàn toàn có thể bán sách trên Bookverse. Chỉ cần đăng ký tài khoản người bán, cung cấp thông tin kinh doanh và bắt đầu đăng sản phẩm.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Ordering FAQ -->
                <div class="faq-category" data-category="ordering" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để đặt hàng?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Quy trình đặt hàng rất đơn giản:</p>
                            <ol>
                                <li>Tìm kiếm sản phẩm mong muốn</li>
                                <li>Xem chi tiết sản phẩm</li>
                                <li>Thêm vào giỏ hàng</li>
                                <li>Kiểm tra giỏ hàng</li>
                                <li>Nhập thông tin giao hàng</li>
                                <li>Chọn phương thức thanh toán</li>
                                <li>Xác nhận đơn hàng</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Tôi có thể hủy đơn hàng không?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Bạn có thể hủy đơn hàng trong các trường hợp:</p>
                            <ul>
                                <li>Đơn hàng chưa được xác nhận</li>
                                <li>Đơn hàng chưa được đóng gói</li>
                                <li>Trong vòng 2 giờ kể từ khi đặt hàng</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Shipping FAQ -->
                <div class="faq-category" data-category="shipping" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Thời gian giao hàng là bao lâu?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Thời gian giao hàng tùy thuộc vào địa điểm:</p>
                            <ul>
                                <li><strong>Nội thành TP Hồ Chí Minh:</strong> 1-2 ngày làm việc</li>
                                <li><strong>Các tỉnh thành khác:</strong> 3-5 ngày làm việc</li>
                                <li><strong>Vùng sâu vùng xa:</strong> 5-7 ngày làm việc</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Phí vận chuyển được tính như thế nào?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Phí vận chuyển được tính dựa trên:</p>
                            <ul>
                                <li>Khoảng cách địa lý</li>
                                <li>Trọng lượng và kích thước sản phẩm</li>
                                <li>Phương thức vận chuyển</li>
                                <li>Đơn hàng từ 500.000đ được miễn phí ship</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Returns FAQ -->
                <div class="faq-category" data-category="returns" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Chính sách đổi trả như thế nào?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng với các điều kiện:</p>
                            <ul>
                                <li>Sản phẩm còn nguyên vẹn, không bị hư hỏng</li>
                                <li>Còn đầy đủ bao bì, tem mác</li>
                                <li>Có hóa đơn mua hàng</li>
                                <li>Không phải sản phẩm đặc biệt (sách ký tên, bản giới hạn)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để yêu cầu đổi trả?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Để yêu cầu đổi trả:</p>
                            <ol>
                                <li>Đăng nhập tài khoản</li>
                                <li>Vào "Đơn hàng của tôi"</li>
                                <li>Chọn đơn hàng cần đổi trả</li>
                                <li>Nhấn "Yêu cầu đổi trả"</li>
                                <li>Điền lý do và mô tả chi tiết</li>
                                <li>Chờ xác nhận từ hệ thống</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <!-- Payment FAQ -->
                <div class="faq-category" data-category="payment" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Những phương thức thanh toán nào được chấp nhận?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Chúng tôi chấp nhận các phương thức thanh toán:</p>
                            <ul>
                                <li><strong>COD:</strong> Thanh toán khi nhận hàng</li>
                                <li><strong>Chuyển khoản:</strong> Qua ngân hàng</li>
                                <li><strong>Thẻ tín dụng/ghi nợ:</strong> Visa, Mastercard</li>
                                <li><strong>Ví điện tử:</strong> MoMo, ZaloPay, ViettelPay</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Thanh toán có an toàn không?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Chúng tôi đảm bảo an toàn tuyệt đối cho giao dịch:</p>
                            <ul>
                                <li>Mã hóa SSL 256-bit</li>
                                <li>Không lưu trữ thông tin thẻ</li>
                                <li>Tuân thủ chuẩn PCI DSS</li>
                                <li>Bảo vệ thông tin cá nhân</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Support -->
    <section class="contact-support" aria-labelledby="contact-support-title">
        <div class="container">
            <h2 id="contact-support-title" class="section-title">Vẫn chưa tìm thấy câu trả lời?</h2>
            <p class="section-subtitle">Liên hệ với đội ngũ hỗ trợ của chúng tôi</p>
            
            <div class="support-options">
                <div class="support-option">
                    <div class="support-icon">📧</div>
                    <h3>Email hỗ trợ</h3>
                    <p>Gửi email cho chúng tôi</p>
                    <a href="mailto:support@bookverse.vn" class="support-link">support@bookverse.vn</a>
                </div>
                
                <div class="support-option">
                    <div class="support-icon">📞</div>
                    <h3>Hotline</h3>
                    <p>Gọi trực tiếp cho chúng tôi</p>
                    <a href="tel:19001234" class="support-link">1900 1234</a>
                </div>
                
                <div class="support-option">
                    <div class="support-icon">💬</div>
                    <h3>Chat trực tuyến</h3>
                    <p>Chat với nhân viên hỗ trợ</p>
                    <button class="support-link chat-btn">Bắt đầu chat</button>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'includes/footer.php'; ?>
