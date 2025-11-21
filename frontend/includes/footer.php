<?php /* Shared footer */ ?>

<!-- Core Scripts (loaded on all pages in correct order) -->
<script src="<?php echo $path ?? ''; ?>assets/js/config.js"></script>
<script src="<?php echo $path ?? ''; ?>assets/js/api.js"></script>
<script src="<?php echo $path ?? ''; ?>assets/js/navigation-simple.js"></script>

<!-- Page-specific scripts -->
<?php if (!empty($extraJs)) { foreach ($extraJs as $js) { 
    // Don't add path prefix for external URLs (http:// or https://)
    // Don't add path if already has relative path (starts with ../)
    if (strpos($js, 'http://') === 0 || strpos($js, 'https://') === 0) {
        $jsUrl = $js;
    } elseif (strpos($js, '../') === 0) {
        // Already has relative path, use as is
        $jsUrl = $js;
    } else {
        // Add path prefix
        $jsUrl = ($path ?? '') . $js;
    }
?>
<script src="<?php echo $jsUrl; ?>"></script>
<?php }} ?>

<!-- Main.js last to initialize after everything else -->
<script src="<?php echo $path ?? ''; ?>assets/js/main.js"></script>
</body>
</html>




