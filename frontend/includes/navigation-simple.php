<?php
/**
 * Simple Navigation System for Bookverse
 */

// Include safe auth checker (no redirects)
require_once __DIR__.'/auth-check-safe.php';

// Determine current page context
$currentPath = $_SERVER['REQUEST_URI'];
$isAuthPage = strpos($currentPath, '/auth/') !== false;
$isSellerPage = strpos($currentPath, '/seller/') !== false;
$isAdminPage = strpos($currentPath, '/admin/') !== false;
$isAccountPage = strpos($currentPath, '/account/') !== false;
$isForumPage = strpos($currentPath, '/forum/') !== false;
$isProductsPage = strpos($currentPath, '/products/') !== false;
$isCartPage = strpos($currentPath, '/cart/') !== false;
$isSellersPage = strpos($currentPath, '/sellers/') !== false;
$isCheckoutPage = strpos($currentPath, '/checkout/') !== false;
$isPagesSubdir = strpos($currentPath, '/pages/') !== false && !$isAuthPage && !$isSellerPage && !$isAdminPage && !$isAccountPage && !$isForumPage;
$isPublicPage = !$isAuthPage && !$isSellerPage && !$isAdminPage && !$isAccountPage && !$isForumPage && !$isProductsPage && !$isCartPage && !$isSellersPage && !$isCheckoutPage;

// Check authentication status (safe - no redirects)
$isAuthenticated = isAuthenticatedSafe();
$userRole = getCurrentUserRoleSafe();
$currentUser = getCurrentUserSafe();

// Determine navigation type
$navType = 'public';
if ($isSellerPage) $navType = 'seller';
if ($isAdminPage) $navType = 'admin';
if ($isAccountPage) $navType = 'account';
if ($isAuthPage) $navType = 'auth';
if ($isProductsPage) $navType = 'public'; // Products pages use public navigation
?>

<!-- Simple Navigation Header -->
<header class="header">
    <div class="container">
        <div class="header-content">
            <!-- Logo -->
            <div class="logo">
                <a href="<?php 
                    if ($navType === 'seller' || $navType === 'admin' || $navType === 'account') {
                        echo '../../index.php';
                    } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                        echo '../../index.php';
                    } else {
                        echo 'index.php';
                    }
                ?>" aria-label="Bookverse - Trang chủ">
                    <img src="<?php 
                        if ($navType === 'seller' || $navType === 'admin' || $navType === 'account') {
                            echo '../../';
                        } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                            echo '../../';
                        } else {
                            echo '';
                        }
                    ?>assets/images/logo-text-new.svg" 
                         alt="Bookverse Logo" class="logo-img" width="150" height="40">
                </a>
            </div>

            <!-- Navigation -->
            <nav class="nav" role="navigation" aria-label="Menu chính">
                <ul class="nav-list">
                    <?php if ($navType === 'public'): ?>
                        <li class="nav-item">
                            <a href="<?php 
                                if ($isPublicPage) {
                                    echo 'index.php';
                                } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                                    echo '../../index.php';
                                } else {
                                    echo '../index.php';
                                }
                            ?>" class="nav-link">Trang chủ</a>
                        </li>
                        <li class="nav-item">
                            <a href="<?php 
                                if ($isPublicPage) {
                                    echo 'pages/products/list.php';
                                } elseif ($isProductsPage) {
                                    echo 'list.php';
                                } elseif ($isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                                    echo '../../pages/products/list.php';
                                } else {
                                    echo '../pages/products/list.php';
                                }
                            ?>" class="nav-link">Sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="<?php 
                                if ($isPublicPage) {
                                    echo 'about.php';
                                } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                                    echo '../../about.php';
                                } else {
                                    echo '../about.php';
                                }
                            ?>" class="nav-link">Giới thiệu</a>
                        </li>
                        <li class="nav-item">
                            <a href="<?php 
                                if ($isPublicPage) {
                                    echo 'blog.php';
                                } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir || $isForumPage) {
                                    echo '../../blog.php';
                                } else {
                                    echo '../blog.php';
                                }
                            ?>" class="nav-link">Blog</a>
                        </li>
                        <li class="nav-item">
                            <a href="<?php 
                                if ($isPublicPage) {
                                    echo 'pages/forum/index.php';
                                } elseif ($isForumPage) {
                                    echo 'index.php';
                                } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                                    echo '../../pages/forum/index.php';
                                } else {
                                    echo '../pages/forum/index.php';
                                }
                            ?>" class="nav-link <?php echo $isForumPage ? 'active' : ''; ?>">Diễn đàn</a>
                        </li>
                    <?php elseif ($navType === 'seller'): ?>
                        <li class="nav-item">
                            <a href="dashboard.php" class="nav-link">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a href="products.php" class="nav-link">Sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="orders.php" class="nav-link">Đơn hàng</a>
                        </li>
                        <li class="nav-item">
                            <a href="messages.php" class="nav-link">Tin nhắn</a>
                        </li>
                        <li class="nav-item">
                            <a href="bank-account.php" class="nav-link">Ngân hàng</a>
                        </li>
                        <li class="nav-item">
                            <a href="withdrawal.php" class="nav-link">Rút tiền</a>
                        </li>
                    <?php elseif ($navType === 'admin'): ?>
                        <li class="nav-item">
                            <a href="dashboard.php" class="nav-link">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a href="users.php" class="nav-link">Người dùng</a>
                        </li>
                        <li class="nav-item">
                            <a href="products.php" class="nav-link">Sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="orders.php" class="nav-link">Đơn hàng</a>
                        </li>
                        <li class="nav-item">
                            <a href="payments.php" class="nav-link">Thanh toán</a>
                        </li>
                    <?php elseif ($navType === 'account'): ?>
                        <li class="nav-item">
                            <a href="profile.php" class="nav-link">Hồ sơ</a>
                        </li>
                        <li class="nav-item">
                            <a href="orders.php" class="nav-link">Đơn hàng</a>
                        </li>
                        <li class="nav-item">
                            <a href="wishlist.php" class="nav-link">Yêu thích</a>
                        </li>
                        <li class="nav-item">
                            <a href="messages.php" class="nav-link">Tin nhắn</a>
                        </li>
                        <li class="nav-item">
                            <a href="wallet.php" class="nav-link">Ví điện tử</a>
                        </li>
                    <?php elseif ($navType === 'auth'): ?>
                        <li class="nav-item">
                            <a href="../index.php" class="nav-link">Trang chủ</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </nav>

            <!-- User Actions -->
            <div class="user-actions">
                <?php if ($navType === 'public' || $navType === 'account'): ?>
                <a href="<?php 
                    if ($isPublicPage) {
                        echo 'pages/cart/cart.php';
                    } elseif ($isAccountPage) {
                        echo '../cart/cart.php';
                    } elseif ($isForumPage) {
                        echo '../cart/cart.php';
                    } elseif ($isProductsPage) {
                        echo '../../pages/cart/cart.php';
                    } elseif ($isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                        echo '../../pages/cart/cart.php';
                    } else {
                        echo '../pages/cart/cart.php';
                    }
                ?>" class="cart-btn" aria-label="Giỏ hàng">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-count" aria-live="polite">0</span>
                </a>
                <?php endif; ?>

                <div class="user-menu">
                    <button class="user-btn" id="userBtn" type="button" aria-label="Menu tài khoản" aria-expanded="false" aria-controls="userDropdown">
                        <span class="user-icon">👤</span>
                        <span id="userDisplayName">Tài khoản</span>
                    </button>
                    <div class="user-dropdown" id="userDropdown" role="menu" aria-hidden="true">
                        <?php if ($navType === 'public'): ?>
                            <?php if ($isAuthenticated): ?>
                                <?php
                                // Use absolute paths from frontend root
                                $basePath = '/Bookverse/frontend/';
                                $walletUrl = $basePath . 'pages/account/wallet.php';
                                $profileUrl = $basePath . 'pages/account/profile.php';
                                $ordersUrl = $basePath . 'pages/account/orders.php';
                                $wishlistUrl = $basePath . 'pages/account/wishlist.php';
                                $settingsUrl = $basePath . 'pages/account/settings.php';
                                $messagesUrl = $basePath . 'pages/account/messages.php';
                                ?>
                                <div class="dropdown-balance" id="dropdownBalance" style="padding: 8px 16px; border-bottom: 1px solid #eee; font-size: 14px;">
                                    Số dư ví: <strong id="walletBalanceDisplay">0 ₫</strong>
                                </div>
                                <a href="<?php echo $walletUrl; ?>" class="dropdown-link" role="menuitem" style="color: #6366f1; font-weight: 500;">💳 Nạp tiền</a>
                                <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
                                <a href="<?php echo $profileUrl; ?>" class="dropdown-link" role="menuitem">Hồ sơ cá nhân</a>
                                <a href="<?php echo $ordersUrl; ?>" class="dropdown-link" role="menuitem">Đơn hàng</a>
                                <a href="<?php echo $messagesUrl; ?>" class="dropdown-link" role="menuitem">Tin nhắn</a>
                                <a href="<?php echo $wishlistUrl; ?>" class="dropdown-link" role="menuitem">Yêu thích</a>
                                <?php if ($userRole === 'admin'): ?>
                                    <a href="<?php 
                                        if ($isPublicPage) {
                                            echo 'pages/admin/dashboard.php';
                                        } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                                            echo '../../pages/admin/dashboard.php';
                                        } else {
                                            echo '../pages/admin/dashboard.php';
                                        }
                                    ?>" class="dropdown-link" role="menuitem">Admin</a>
                                <?php elseif ($userRole === 'seller'): ?>
                                    <a href="<?php 
                                        if ($isPublicPage) {
                                            echo 'pages/seller/dashboard.php';
                                        } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                                            echo '../../pages/seller/dashboard.php';
                                        } else {
                                            echo '../pages/seller/dashboard.php';
                                        }
                                    ?>" class="dropdown-link" role="menuitem">Seller</a>
                                <?php endif; ?>
                                <a href="#" class="dropdown-link" role="menuitem" onclick="logout()">Đăng xuất</a>
                            <?php else: ?>
                                <a href="<?php 
                                    if ($isPublicPage) {
                                        echo 'pages/auth/login.php';
                                    } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                                        echo '../../pages/auth/login.php';
                                    } else {
                                        echo '../pages/auth/login.php';
                                    }
                                ?>" class="dropdown-link" role="menuitem">Đăng nhập</a>
                                <a href="<?php 
                                    if ($isPublicPage) {
                                        echo 'pages/auth/register.php';
                                    } elseif ($isProductsPage || $isCartPage || $isSellersPage || $isCheckoutPage || $isPagesSubdir) {
                                        echo '../../pages/auth/register.php';
                                    } else {
                                        echo '../pages/auth/register.php';
                                    }
                                ?>" class="dropdown-link" role="menuitem">Đăng ký</a>
                            <?php endif; ?>
                        <?php elseif ($navType === 'account'): ?>
                            <?php
                            // Use relative paths since we're already in account directory
                            $walletUrl = 'wallet.php';
                            $profileUrl = 'profile.php';
                            $ordersUrl = 'orders.php';
                            $wishlistUrl = 'wishlist.php';
                            $settingsUrl = 'settings.php';
                            $messagesUrl = 'messages.php';
                            $indexUrl = '../../index.php';
                            ?>
                            <div class="dropdown-balance" id="dropdownBalance" style="padding: 8px 16px; border-bottom: 1px solid #eee; font-size: 14px;">
                                Số dư ví: <strong id="walletBalanceDisplay">0 ₫</strong>
                            </div>
                            <a href="<?php echo $walletUrl; ?>" class="dropdown-link" role="menuitem" style="color: #6366f1; font-weight: 500;">💳 Nạp tiền</a>
                            <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
                            <a href="<?php echo $profileUrl; ?>" class="dropdown-link" role="menuitem">Hồ sơ cá nhân</a>
                            <a href="<?php echo $ordersUrl; ?>" class="dropdown-link" role="menuitem">Đơn hàng</a>
                            <a href="<?php echo $messagesUrl; ?>" class="dropdown-link" role="menuitem">Tin nhắn</a>
                            <a href="<?php echo $wishlistUrl; ?>" class="dropdown-link" role="menuitem">Yêu thích</a>
                            <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
                            <a href="<?php echo $indexUrl; ?>" class="dropdown-link" role="menuitem">Về trang chủ</a>
                            <a href="#" class="dropdown-link" role="menuitem" onclick="logout()">Đăng xuất</a>
                        <?php elseif ($navType === 'seller'): ?>
                            <a href="dashboard.php" class="dropdown-link" role="menuitem">Dashboard</a>
                            <a href="../index.php" class="dropdown-link" role="menuitem">Về trang chủ</a>
                            <a href="#" class="dropdown-link" role="menuitem" onclick="logout()">Đăng xuất</a>
                        <?php elseif ($navType === 'admin'): ?>
                            <a href="dashboard.php" class="dropdown-link" role="menuitem">Dashboard</a>
                            <a href="../index.php" class="dropdown-link" role="menuitem">Về trang chủ</a>
                            <a href="#" class="dropdown-link" role="menuitem" onclick="logout()">Đăng xuất</a>
                        <?php elseif ($navType === 'auth'): ?>
                            <a href="login.php" class="dropdown-link" role="menuitem">Đăng nhập</a>
                            <a href="register.php" class="dropdown-link" role="menuitem">Đăng ký</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>


