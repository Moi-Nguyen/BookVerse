<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam</title>
    <meta name="description" content="Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam. Mua sách mới, sách cũ với giá tốt nhất. Hỗ trợ người bán tạo cửa hàng sách online.">
    <meta name="keywords" content="mua sách online, bán sách online, sách giá rẻ, sách cũ, sách mới, bookverse, thư viện sách, cửa hàng sách, bookversevn.store">
    <meta name="author" content="Bookverse">
    <meta name="robots" content="index, follow">
    <meta name="language" content="Vietnamese">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://bookversevn.store/">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam">
    <meta property="og:description" content="Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam. Mua sách mới, sách cũ với giá tốt nhất.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bookversevn.store">
    <meta property="og:image" content="https://bookversevn.store/assets/images/og-image.jpg">
    <meta property="og:site_name" content="Bookverse">
    <meta property="og:locale" content="vi_VN">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam">
    <meta name="twitter:description" content="Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam. Mua sách mới, sách cũ với giá tốt nhất.">
    <meta name="twitter:image" content="https://bookversevn.store/assets/images/og-image.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/favicon.svg">
    
    <!-- Google Analytics -->
    <?php include 'includes/google-analytics.php'; ?>
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="assets/css/main.css" as="style">
    <link rel="preload" href="assets/js/main.js" as="script">
    <link rel="preload" href="assets/js/api.js" as="script">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="assets/css/logo.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <!-- Logo -->
                       <div class="logo">
                           <a href="index.php" aria-label="Bookverse - Trang chủ">
                               <img src="assets/images/logo-new.svg" alt="Bookverse Logo" class="logo-img" width="200" height="60">
                           </a>
                       </div>

                <!-- Search Bar -->
                <div class="search-bar">
                    <form class="search-form" action="pages/products/list.php" method="GET" role="search">
                        <input type="text" name="search" placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..." 
                               class="search-input" aria-label="Tìm kiếm sách" autocomplete="off">
                        <button type="submit" class="search-btn" aria-label="Tìm kiếm">
                            <span class="search-icon">🔍</span>
                        </button>
                    </form>
                </div>

                <!-- Navigation -->
                <nav class="nav" role="navigation" aria-label="Menu chính">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="index.php" class="nav-link active" aria-current="page">Trang chủ</a>
                        </li>
                        <li class="nav-item">
                            <a href="pages/products/list.php" class="nav-link">Sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="about.php" class="nav-link">Giới thiệu</a>
                        </li>
                        <li class="nav-item">
                            <a href="blog.php" class="nav-link">Blog</a>
                        </li>
                    </ul>
                </nav>

                <!-- User Actions -->
                <div class="user-actions">
                    <a href="pages/cart/cart.php" class="cart-btn" aria-label="Giỏ hàng">
                        <span class="cart-icon">🛒</span>
                        <span class="cart-count" aria-live="polite">0</span>
                    </a>
                    <div class="user-menu">
                        <button class="user-btn" id="userBtn" aria-label="Menu tài khoản" aria-expanded="false">
                            <span class="user-icon">👤</span>
                            <span>Tài khoản</span>
                        </button>
                        <div class="user-dropdown" id="userDropdown" role="menu" aria-hidden="true">
                            <a href="pages/auth/login.php" class="dropdown-link" role="menuitem">Đăng nhập</a>
                            <a href="pages/auth/register.php" class="dropdown-link" role="menuitem">Đăng ký</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main" role="main">
        <!-- Hero Section -->
        <section class="hero" aria-labelledby="hero-title">
            <div class="container">
                <div class="hero-content">
                    <h1 id="hero-title" class="hero-title">Khám phá thế giới sách vô tận</h1>
                    <p class="hero-subtitle">Tìm kiếm, mua bán và chia sẻ niềm đam mê đọc sách cùng Bookverse</p>
                    <div class="hero-actions">
                        <a href="pages/products/list.php" class="btn btn-primary" aria-label="Khám phá danh mục sách">
                            <span>Khám phá ngay</span>
                            <span class="btn-icon">📚</span>
                        </a>
                        <a href="pages/forum/index.php" class="btn btn-secondary" aria-label="Tham gia diễn đàn cộng đồng">
                            <span>Diễn đàn</span>
                            <span class="btn-icon">💬</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Featured Categories -->
        <section class="featured-categories" aria-labelledby="categories-title">
            <div class="container">
                <h2 id="categories-title" class="section-title">Danh mục nổi bật</h2>
                <div class="categories-grid" id="categoriesGrid" role="grid" aria-label="Danh mục sách">
                    <!-- Categories will be loaded here -->
                </div>
            </div>
        </section>

        <!-- Featured Products -->
        <section class="featured-products" aria-labelledby="products-title">
            <div class="container">
                <h2 id="products-title" class="section-title">Sách nổi bật</h2>
                <div class="products-grid" id="productsGrid" role="grid" aria-label="Sách nổi bật">
                    <!-- Products will be loaded here -->
                </div>
                <div class="section-actions">
                    <a href="pages/products/list.php" class="btn btn-outline" aria-label="Xem tất cả sách">
                        <span>Xem tất cả sách</span>
                        <span class="btn-icon">→</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Top Sellers -->
        <section class="top-sellers" aria-labelledby="sellers-title">
            <div class="container">
                <h2 id="sellers-title" class="section-title">Người bán hàng đầu</h2>
                <div class="sellers-grid" id="sellersGrid" role="grid" aria-label="Người bán hàng đầu">
                    <!-- Sellers will be loaded here -->
                </div>
                <div class="section-actions">
                    <a href="pages/sellers/top-sellers.php" class="btn btn-outline" aria-label="Xem tất cả người bán">
                        <span>Xem tất cả người bán</span>
                        <span class="btn-icon">→</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Blog Teaser -->
        <section class="featured-products" aria-labelledby="blog-title">
            <div class="container">
                <h2 id="blog-title" class="section-title">Từ blog Bookverse</h2>
                <div class="products-grid" role="grid" aria-label="Bài viết mới">
                    <article class="product-card">
                        <img class="product-image" src="https://picsum.photos/seed/blog1/600/400" alt="SEO cho cửa hàng sách">
                        <h3 class="product-title">SEO cho cửa hàng sách: 7 mẹo tăng traffic</h3>
                        <p class="product-author">Ngày đăng: 04/11/2025</p>
                        <div class="product-actions">
                            <a href="blog.php" class="btn btn-outline">Đọc thêm</a>
                        </div>
                    </article>
                    <article class="product-card">
                        <img class="product-image" src="https://picsum.photos/seed/blog2/600/400" alt="Chọn ảnh bìa thu hút">
                        <h3 class="product-title">Cách chọn ảnh bìa sản phẩm thật thu hút</h3>
                        <p class="product-author">Ngày đăng: 01/11/2025</p>
                        <div class="product-actions">
                            <a href="blog.php" class="btn btn-outline">Đọc thêm</a>
                        </div>
                    </article>
                    <article class="product-card">
                        <img class="product-image" src="https://picsum.photos/seed/blog3/600/400" alt="Tối ưu mô tả sản phẩm">
                        <h3 class="product-title">Tối ưu mô tả sản phẩm để tăng chuyển đổi</h3>
                        <p class="product-author">Ngày đăng: 28/10/2025</p>
                        <div class="product-actions">
                            <a href="blog.php" class="btn btn-outline">Đọc thêm</a>
                        </div>
                    </article>
                </div>
                <div class="section-actions">
                    <a href="blog.php" class="btn btn-outline" aria-label="Xem tất cả bài viết">
                        <span>Xem tất cả bài viết</span>
                        <span class="btn-icon">→</span>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <img src="assets/images/logo-text-new.svg" alt="Bookverse Logo" class="footer-logo-img" width="150" height="40">
                    </div>
                    <p class="footer-text">Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam</p>
                    <div class="social-links">
                        <a href="https://facebook.com/bookverse" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://instagram.com/bookverse" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://t.me/bookverse" class="social-link" aria-label="Telegram" target="_blank" rel="noopener">
                            <i class="fab fa-telegram-plane"></i>
                        </a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 class="footer-subtitle">Liên kết nhanh</h4>
                    <ul class="footer-links">
                        <li><a href="about.php">Giới thiệu</a></li>
                        <li><a href="contact.php">Liên hệ</a></li>
                        <li><a href="help.php">Trợ giúp</a></li>
                        <li><a href="terms.php">Điều khoản</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 class="footer-subtitle">Dành cho người bán</h4>
                    <ul class="footer-links">
                        <li><a href="pages/auth/register.php">Đăng ký bán sách</a></li>
                        <li><a href="seller-guide.php">Hướng dẫn bán hàng</a></li>
                        <li><a href="seller-support.php">Hỗ trợ người bán</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 class="footer-subtitle">Liên hệ</h4>
                    <div class="contact-info">
                        <p>📧 Email: <a href="mailto:support@bookverse.vn">support@bookverse.vn</a></p>
                        <p>📞 Hotline: <a href="tel:19001234">1900 1234</a></p>
                        <p>📍 Địa chỉ: TP Hồ Chí Minh, Việt Nam</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Bookverse. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="assets/js/config.js"></script>
    <script src="assets/js/api.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/pages/index.js"></script>
    
</body>
</html>

