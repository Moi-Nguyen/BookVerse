<?php 
$pageTitle='Hỗ trợ người bán'; 
$extraCss=['assets/css/main.css', 'assets/css/responsive.css', 'assets/css/seller.css', 'assets/css/seller-support.css']; 
$extraJs=['assets/js/main.js', 'assets/js/api.js', 'assets/js/pages/seller-support.js'];
include 'includes/header.php'; 
?>

<main class="main" role="main">
    <!-- Hero Section -->
    <section class="hero hero-small seller-hero" aria-labelledby="seller-support-hero-title">
        <div class="container">
            <div class="hero-content">
                <h1 id="seller-support-hero-title" class="hero-title">Hỗ trợ người bán</h1>
                <p class="hero-subtitle">Tài nguyên và hướng dẫn dành riêng cho người bán trên Bookverse</p>
                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-number">5,000+</span>
                        <span class="stat-label">Người bán</span>
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
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions" aria-labelledby="quick-actions-title">
        <div class="container">
            <h2 id="quick-actions-title" class="section-title">Hành động nhanh</h2>
            <div class="actions-grid">
                <a href="pages/seller/dashboard.php" class="action-card">
                    <div class="action-icon">📊</div>
                    <h3>Dashboard</h3>
                    <p>Xem thống kê bán hàng và doanh thu</p>
                </a>
                
                <a href="pages/seller/products.php" class="action-card">
                    <div class="action-icon">📚</div>
                    <h3>Quản lý sản phẩm</h3>
                    <p>Thêm, sửa, xóa sản phẩm</p>
                </a>
                
                <a href="pages/seller/orders.php" class="action-card">
                    <div class="action-icon">📦</div>
                    <h3>Đơn hàng</h3>
                    <p>Xử lý và theo dõi đơn hàng</p>
                </a>
                
                <a href="pages/seller/bank-account.php" class="action-card">
                    <div class="action-icon">🏦</div>
                    <h3>Tài khoản ngân hàng</h3>
                    <p>Cài đặt thông tin thanh toán</p>
                </a>
            </div>
        </div>
    </section>

    <!-- Getting Started -->
    <section class="getting-started" aria-labelledby="getting-started-title">
        <div class="container">
            <h2 id="getting-started-title" class="section-title">Bắt đầu bán hàng</h2>
            <div class="steps-wrapper">
                <div class="steps-timeline">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Đăng ký tài khoản người bán</h3>
                            <p>Cung cấp thông tin kinh doanh và xác minh danh tính để trở thành người bán chính thức trên Bookverse.</p>
                            <a href="pages/auth/seller-register.php" class="btn btn-primary">Đăng ký ngay</a>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Thiết lập tài khoản ngân hàng</h3>
                            <p>Liên kết tài khoản ngân hàng để nhận thanh toán từ các giao dịch bán hàng.</p>
                            <a href="pages/seller/bank-account.php" class="btn btn-outline">Thiết lập</a>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3>Đăng sản phẩm đầu tiên</h3>
                            <p>Tạo danh sách sản phẩm với thông tin chi tiết, hình ảnh chất lượng cao và giá cả cạnh tranh.</p>
                            <a href="pages/seller/products.php" class="btn btn-outline">Đăng sản phẩm</a>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h3>Bắt đầu bán hàng</h3>
                            <p>Xử lý đơn hàng, giao hàng và nhận thanh toán. Theo dõi hiệu suất bán hàng trên dashboard.</p>
                            <a href="pages/seller/dashboard.php" class="btn btn-outline">Xem dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Seller Resources -->
    <section class="seller-resources" aria-labelledby="seller-resources-title">
        <div class="container">
            <h2 id="seller-resources-title" class="section-title">Tài nguyên cho người bán</h2>
            <div class="resources-grid">
                <div class="resource-card">
                    <div class="resource-icon">📖</div>
                    <h3>Hướng dẫn bán hàng</h3>
                    <p>Hướng dẫn chi tiết về cách bán hàng hiệu quả trên Bookverse</p>
                    <ul class="resource-links">
                        <li><a href="#guide-1">Cách tạo danh sách sản phẩm</a></li>
                        <li><a href="#guide-2">Tối ưu hóa hình ảnh sản phẩm</a></li>
                        <li><a href="#guide-3">Đặt giá cạnh tranh</a></li>
                        <li><a href="#guide-4">Quản lý kho hàng</a></li>
                    </ul>
                </div>
                
                <div class="resource-card">
                    <div class="resource-icon">📊</div>
                    <h3>Phân tích và báo cáo</h3>
                    <p>Hiểu rõ hiệu suất bán hàng với các công cụ phân tích</p>
                    <ul class="resource-links">
                        <li><a href="#analytics-1">Báo cáo doanh thu</a></li>
                        <li><a href="#analytics-2">Thống kê sản phẩm</a></li>
                        <li><a href="#analytics-3">Phân tích khách hàng</a></li>
                        <li><a href="#analytics-4">Xu hướng bán hàng</a></li>
                    </ul>
                </div>
                
                <div class="resource-card">
                    <div class="resource-icon">🎯</div>
                    <h3>Marketing và quảng cáo</h3>
                    <p>Tăng doanh số với các công cụ marketing</p>
                    <ul class="resource-links">
                        <li><a href="#marketing-1">Quảng cáo sản phẩm</a></li>
                        <li><a href="#marketing-2">Chương trình khuyến mãi</a></li>
                        <li><a href="#marketing-3">Email marketing</a></li>
                        <li><a href="#marketing-4">Social media</a></li>
                    </ul>
                </div>
                
                <div class="resource-card">
                    <div class="resource-icon">⚖️</div>
                    <h3>Chính sách và quy định</h3>
                    <p>Hiểu rõ các chính sách và quy định dành cho người bán</p>
                    <ul class="resource-links">
                        <li><a href="#policy-1">Điều khoản người bán</a></li>
                        <li><a href="#policy-2">Chính sách hoa hồng</a></li>
                        <li><a href="#policy-3">Quy định sản phẩm</a></li>
                        <li><a href="#policy-4">Xử lý tranh chấp</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Seller FAQ -->
    <section class="seller-faq" aria-labelledby="seller-faq-title">
        <div class="container">
            <h2 id="seller-faq-title" class="section-title">Câu hỏi thường gặp cho người bán</h2>
            <div class="faq-categories">
                <button class="faq-category-btn active" data-category="registration">Đăng ký</button>
                <button class="faq-category-btn" data-category="products">Sản phẩm</button>
                <button class="faq-category-btn" data-category="orders">Đơn hàng</button>
                <button class="faq-category-btn" data-category="payments">Thanh toán</button>
                <button class="faq-category-btn" data-category="policies">Chính sách</button>
            </div>
            
            <div class="faq-content">
                <!-- Registration FAQ -->
                <div class="faq-category" data-category="registration">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để đăng ký trở thành người bán?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Để đăng ký trở thành người bán:</p>
                            <ol>
                                <li>Truy cập trang đăng ký người bán</li>
                                <li>Điền thông tin kinh doanh</li>
                                <li>Upload giấy phép kinh doanh (nếu có)</li>
                                <li>Xác minh danh tính</li>
                                <li>Chờ phê duyệt từ Bookverse</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Thời gian phê duyệt tài khoản người bán là bao lâu?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Thời gian phê duyệt thường là 1-3 ngày làm việc. Chúng tôi sẽ gửi email thông báo kết quả phê duyệt.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Products FAQ -->
                <div class="faq-category" data-category="products" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Loại sách nào được phép bán trên Bookverse?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Bạn có thể bán:</p>
                            <ul>
                                <li>Sách mới và sách cũ</li>
                                <li>Sách giáo khoa, tham khảo</li>
                                <li>Tiểu thuyết, truyện</li>
                                <li>Sách chuyên ngành</li>
                                <li>Tạp chí, báo</li>
                            </ul>
                            <p>Không được bán sách vi phạm bản quyền, nội dung không phù hợp.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để tối ưu hóa danh sách sản phẩm?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Để tối ưu hóa danh sách sản phẩm:</p>
                            <ul>
                                <li>Viết tiêu đề rõ ràng, hấp dẫn</li>
                                <li>Mô tả chi tiết sản phẩm</li>
                                <li>Upload hình ảnh chất lượng cao</li>
                                <li>Đặt giá cạnh tranh</li>
                                <li>Sử dụng từ khóa phù hợp</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Orders FAQ -->
                <div class="faq-category" data-category="orders" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Làm thế nào để xử lý đơn hàng?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Quy trình xử lý đơn hàng:</p>
                            <ol>
                                <li>Nhận thông báo đơn hàng mới</li>
                                <li>Kiểm tra thông tin đơn hàng</li>
                                <li>Xác nhận đơn hàng</li>
                                <li>Đóng gói sản phẩm</li>
                                <li>Giao cho đơn vị vận chuyển</li>
                                <li>Cập nhật trạng thái giao hàng</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Thời gian xử lý đơn hàng là bao lâu?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Thời gian xử lý đơn hàng:</p>
                            <ul>
                                <li>Xác nhận đơn hàng: 24 giờ</li>
                                <li>Đóng gói và giao hàng: 1-2 ngày</li>
                                <li>Tổng thời gian: 2-3 ngày</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Payments FAQ -->
                <div class="faq-category" data-category="payments" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Khi nào tôi nhận được thanh toán?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Thanh toán được chuyển vào tài khoản ngân hàng của bạn:</p>
                            <ul>
                                <li>Sau khi giao hàng thành công</li>
                                <li>Trong vòng 3-5 ngày làm việc</li>
                                <li>Trừ phí hoa hồng và phí dịch vụ</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Phí hoa hồng được tính như thế nào?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Phí hoa hồng được tính theo tỷ lệ:</p>
                            <ul>
                                <li>Sách mới: 5% giá trị đơn hàng</li>
                                <li>Sách cũ: 3% giá trị đơn hàng</li>
                                <li>Phí xử lý: 2,000đ/đơn hàng</li>
                                <li>Phí rút tiền: 1,000đ/giao dịch</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Policies FAQ -->
                <div class="faq-category" data-category="policies" style="display: none;">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Chính sách đổi trả cho người bán?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Khi khách hàng yêu cầu đổi trả:</p>
                            <ul>
                                <li>Người bán chịu trách nhiệm xử lý</li>
                                <li>Kiểm tra tình trạng sản phẩm</li>
                                <li>Hoàn tiền hoặc đổi sản phẩm khác</li>
                                <li>Chịu phí vận chuyển đổi trả</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Điều gì xảy ra nếu vi phạm chính sách?</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>Các hình thức xử phạt:</p>
                            <ul>
                                <li>Cảnh báo lần đầu</li>
                                <li>Tạm khóa tài khoản</li>
                                <li>Khóa vĩnh viễn</li>
                                <li>Không hoàn phí đã nộp</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Support Contact -->
    <section class="support-contact" aria-labelledby="support-contact-title">
        <div class="container">
            <h2 id="support-contact-title" class="section-title">Cần hỗ trợ thêm?</h2>
            <p class="section-subtitle">Đội ngũ hỗ trợ người bán luôn sẵn sàng giúp đỡ bạn</p>
            
            <div class="support-options">
                <div class="support-option">
                    <div class="support-icon">📧</div>
                    <h3>Email hỗ trợ</h3>
                    <p>Gửi email cho đội ngũ hỗ trợ người bán</p>
                    <a href="mailto:seller-support@bookverse.vn" class="support-link">seller-support@bookverse.vn</a>
                </div>
                
                <div class="support-option">
                    <div class="support-icon">📞</div>
                    <h3>Hotline người bán</h3>
                    <p>Gọi trực tiếp cho bộ phận hỗ trợ</p>
                    <a href="tel:19001234" class="support-link">1900 1234 (ext. 3)</a>
                </div>
                
                <div class="support-option">
                    <div class="support-icon">💬</div>
                    <h3>Chat trực tuyến</h3>
                    <p>Chat với chuyên viên hỗ trợ</p>
                    <button class="support-link chat-btn">Bắt đầu chat</button>
                </div>
                
                <div class="support-option">
                    <div class="support-icon">📅</div>
                    <h3>Đặt lịch tư vấn</h3>
                    <p>Đặt lịch tư vấn 1-1 với chuyên gia</p>
                    <button class="support-link consultation-btn">Đặt lịch</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Success Stories -->
    <section class="success-stories" aria-labelledby="success-stories-title">
        <div class="container">
            <h2 id="success-stories-title" class="section-title">Câu chuyện thành công</h2>
            <div class="stories-grid">
                <div class="story-card">
                    <div class="story-avatar">
                        <img src="assets/images/default-avatar.svg" alt="Nguyễn Văn A">
                    </div>
                    <div class="story-content">
                        <h3>Nguyễn Văn A</h3>
                        <p class="story-role">Người bán sách giáo khoa</p>
                        <p class="story-quote">"Bookverse giúp tôi bán được 500 cuốn sách trong tháng đầu tiên. Hệ thống dễ sử dụng và hỗ trợ rất tốt."</p>
                        <div class="story-stats">
                            <span class="stat">500+ sản phẩm</span>
                            <span class="stat">4.9★ đánh giá</span>
                        </div>
                    </div>
                </div>
                
                <div class="story-card">
                    <div class="story-avatar">
                        <img src="assets/images/default-avatar.svg" alt="Trần Thị B">
                    </div>
                    <div class="story-content">
                        <h3>Trần Thị B</h3>
                        <p class="story-role">Người bán sách cũ</p>
                        <p class="story-quote">"Từ một người bán nhỏ lẻ, giờ tôi đã có cửa hàng online ổn định với doanh thu 20 triệu/tháng."</p>
                        <div class="story-stats">
                            <span class="stat">1,000+ sản phẩm</span>
                            <span class="stat">20M VND/tháng</span>
                        </div>
                    </div>
                </div>
                
                <div class="story-card">
                    <div class="story-avatar">
                        <img src="assets/images/default-avatar.svg" alt="Lê Văn C">
                    </div>
                    <div class="story-content">
                        <h3>Lê Văn C</h3>
                        <p class="story-role">Nhà sách online</p>
                        <p class="story-quote">"Bookverse là nền tảng tốt nhất để mở rộng kinh doanh sách. Tôi đã tăng doanh số 300% sau 6 tháng."</p>
                        <div class="story-stats">
                            <span class="stat">2,000+ sản phẩm</span>
                            <span class="stat">300% tăng trưởng</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>





<?php include 'includes/footer.php'; ?>
