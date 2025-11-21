<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle.' - ' : '';?>Bookverse - Nền tảng mua bán sách trực tuyến</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Đăng nhập/Đăng ký tài khoản Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam'; ?>">
    <meta name="keywords" content="đăng nhập bookverse, đăng ký bookverse, tài khoản bookverse, mua sách online">
    <meta name="author" content="Bookverse">
    <meta name="robots" content="noindex, nofollow">
    <meta name="language" content="Vietnamese">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bookversevn.store<?php echo $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:title" content="<?php echo isset($pageTitle) ? $pageTitle.' - ' : '';?>Bookverse">
    <meta property="og:description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Đăng nhập/Đăng ký tài khoản Bookverse'; ?>">
    <meta property="og:site_name" content="Bookverse">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://bookversevn.store<?php echo $_SERVER['REQUEST_URI']; ?>">
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="../../assets/css/main.css" as="style">
    <link rel="preload" href="../../assets/css/auth.css" as="style">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../assets/css/main.css">
    <link rel="stylesheet" href="../../assets/css/responsive.css">
    <link rel="stylesheet" href="../../assets/css/auth.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../../assets/images/favicon.svg">
    <link rel="icon" type="image/x-icon" href="../../assets/images/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/images/favicon.svg">
    
    <!-- Google Analytics -->
    <?php include __DIR__ . '/google-analytics.php'; ?>
    
    <?php if (!empty($extraCss)) { foreach ($extraCss as $css) { ?>
    <link rel="stylesheet" href="<?php echo $css; ?>">
    <?php }} ?>
    
    <?php if (!empty($extraJs)) { foreach ($extraJs as $js) { ?>
    <script src="<?php echo $js; ?>?v=<?php echo time(); ?>"></script>
    <?php }} ?>
    
    <!-- Google Sign-In API -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body class="auth-body">
    <!-- Auth Background -->
    <div class="auth-background">
        <!-- Animated Background Elements -->
        <div class="bg-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
        </div>
        
        <!-- Floating Books Animation -->
        <div class="floating-books">
            <div class="book book-1">📚</div>
            <div class="book book-2">📖</div>
            <div class="book book-3">📗</div>
            <div class="book book-4">📘</div>
            <div class="book book-5">📙</div>
        </div>
    </div>
    
    <!-- Back to Home Link -->
    <div class="auth-back-home">
        <a href="../../index.php" class="back-link">
            <span class="back-icon">←</span>
            <span>Về trang chủ</span>
        </a>
    </div>
