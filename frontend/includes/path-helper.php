<?php
/**
 * Path Helper - Tính toán path prefix chính xác
 */

function getBasePath() {
    $scriptPath = dirname($_SERVER['SCRIPT_NAME']);
    $parts = array_filter(explode('/', trim($scriptPath, '/')));
    $parts = array_values($parts);
    
    // Find 'frontend' in path
    $frontendIndex = -1;
    foreach ($parts as $index => $part) {
        if ($part === 'frontend') {
            $frontendIndex = $index;
            break;
        }
    }
    
    if ($frontendIndex !== -1) {
        // Count directories after 'frontend'
        $depth = count($parts) - $frontendIndex - 1;
        return str_repeat('../', $depth);
    }
    
    // Fallback: count from 'pages'
    $pagesIndex = -1;
    foreach ($parts as $index => $part) {
        if ($part === 'pages') {
            $pagesIndex = $index;
            break;
        }
    }
    
    if ($pagesIndex !== -1) {
        $depth = count($parts) - $pagesIndex - 1;
        return str_repeat('../', $depth + 1);
    }
    
    return '../../'; // Default
}
?>

