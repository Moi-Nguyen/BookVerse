<?php
/**
 * Seller Pages Index - Should not be accessed directly
 * This file exists to prevent directory listing
 * All seller pages should be accessed directly (dashboard.php, products.php, etc.)
 */

// If someone accesses /seller/ or /seller/index.php, show a proper page
header('HTTP/1.1 200 OK');
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seller Dashboard - Bookverse</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../../assets/images/favicon.svg">
    <link rel="icon" type="image/x-icon" href="../../assets/images/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/images/favicon.svg">
    <link rel="stylesheet" href="../../assets/css/seller-index.css">
</head>
<body>
    <div class="seller-index">
        <h1>🏪 Seller Dashboard</h1>
        <p>Chọn trang bạn muốn truy cập:</p>
        <div class="seller-links">
            <a href="dashboard.php">📊 Dashboard</a>
            <a href="products.php">📦 Quản lý Sản phẩm</a>
            <a href="orders.php">🛒 Quản lý Đơn hàng</a>
            <a href="settings.php">⚙️ Cài đặt</a>
            <a href="bank-account.php">🏦 Tài khoản Ngân hàng</a>
            <a href="../../index.php">🏠 Về Trang chủ</a>
        </div>
    </div>
</body>
</html>

