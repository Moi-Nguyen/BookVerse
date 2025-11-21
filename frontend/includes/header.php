<?php 
/* Shared header with smart navigation system */
// Determine path prefix based on current location
$path = '';
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
// Example: /Bookverse/frontend/pages/sellers/top-sellers.php -> /Bookverse/frontend/pages/sellers

// Count directories after 'frontend' to calculate relative path
$parts = array_filter(explode('/', trim($scriptDir, '/')));
$parts = array_values($parts);

// Find 'frontend' directory
$frontendIndex = array_search('frontend', $parts);

if ($frontendIndex !== false) {
    // Calculate depth: directories after 'frontend'
    // Example: [Bookverse, frontend, pages, sellers]
    // frontendIndex = 1, total = 4
    // Directories after frontend: pages, sellers = 2
    // Need: ../../ to go from sellers -> pages -> frontend
    $depth = count($parts) - $frontendIndex - 1;
    $path = str_repeat('../', $depth);
} else {
    // Fallback: count from 'pages'
    $pagesIndex = array_search('pages', $parts);
    if ($pagesIndex !== false) {
        $depth = count($parts) - $pagesIndex - 1;
        $path = str_repeat('../', $depth + 1); // +1 for pages -> frontend
    } else {
        // Default fallback
        $path = '../../';
    }
}

// Debug path calculation (uncomment to debug)
// echo "<!-- DEBUG: Script=" . $_SERVER['SCRIPT_NAME'] . " | ScriptDir=" . $scriptDir . " | Path=" . $path . " -->";
?>
<!DOCTYPE html>
<html lang="vi">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?php echo isset($pageTitle) ? $pageTitle.' - ' : '';?>Bookverse - Nền tảng mua bán sách trực tuyến</title>
	
	<!-- SEO Meta Tags -->
	<meta name="description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam. Mua sách mới, sách cũ với giá tốt nhất. Hỗ trợ người bán tạo cửa hàng sách online.'; ?>">
	<meta name="keywords" content="mua sách online, bán sách online, sách giá rẻ, sách cũ, sách mới, bookverse, thư viện sách, cửa hàng sách">
	<meta name="author" content="Bookverse">
	<meta name="robots" content="index, follow">
	<meta name="language" content="Vietnamese">
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://bookversevn.store<?php echo $_SERVER['REQUEST_URI']; ?>">
	<meta property="og:title" content="<?php echo isset($pageTitle) ? $pageTitle.' - ' : '';?>Bookverse">
	<meta property="og:description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam'; ?>">
	<meta property="og:image" content="https://bookversevn.store/assets/images/og-image.jpg">
	<meta property="og:site_name" content="Bookverse">
	<meta property="og:locale" content="vi_VN">
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:url" content="https://bookversevn.store<?php echo $_SERVER['REQUEST_URI']; ?>">
	<meta name="twitter:title" content="<?php echo isset($pageTitle) ? $pageTitle.' - ' : '';?>Bookverse">
	<meta name="twitter:description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Bookverse - Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam'; ?>">
	<meta name="twitter:image" content="https://bookversevn.store/assets/images/og-image.jpg">
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://bookversevn.store<?php echo $_SERVER['REQUEST_URI']; ?>">
	
	<!-- Favicon -->
	<link rel="icon" type="image/svg+xml" href="<?php echo $path; ?>assets/images/favicon.svg">
	<link rel="icon" type="image/x-icon" href="<?php echo $path; ?>assets/images/favicon.ico">
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $path; ?>assets/images/favicon.svg">
	
	<!-- Google Analytics -->
	<?php include __DIR__ . '/google-analytics.php'; ?>
	
	<!-- Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer">
	<link rel="stylesheet" href="<?php echo $path; ?>assets/css/main.css">
	<link rel="stylesheet" href="<?php echo $path; ?>assets/css/global.css">
	<link rel="stylesheet" href="<?php echo $path; ?>assets/css/responsive.css">
	<link rel="stylesheet" href="<?php echo $path; ?>assets/css/logo.css">
	<link rel="stylesheet" href="<?php echo $path; ?>assets/css/notifications.css">
<?php if (!empty($extraCss)) { foreach ($extraCss as $css) { 
	// Don't add path prefix for external URLs (http:// or https://)
	// Don't add path if already has relative path (starts with ../)
	if (strpos($css, 'http://') === 0 || strpos($css, 'https://') === 0) {
		$cssUrl = $css;
	} elseif (strpos($css, '../') === 0) {
		// Already has relative path, use as is
		$cssUrl = $css;
	} else {
		// Add path prefix
		$cssUrl = $path . $css;
	}
?>
	<link rel="stylesheet" href="<?php echo $cssUrl; ?>">
<?php }} ?>
</head>
<body data-base-path="<?php echo htmlspecialchars($path, ENT_QUOTES); ?>">
	<?php include 'navigation-simple.php'; ?>


