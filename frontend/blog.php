<?php 
$pageTitle='Blog - Bookverse'; 
$extraCss=['assets/css/main.css', 'assets/css/responsive.css']; 
$extraJs=['assets/js/main.js'];
include 'includes/header.php'; 
?>

<main class="main" role="main">
	<section class="featured-products" aria-labelledby="blog-page-title">
		<div class="container">
			<h2 id="blog-page-title" class="section-title">Blog Bookverse</h2>
			<p style="text-align:center; color: var(--text-secondary); margin:-16px 0 24px;">Chia sẻ kiến thức về sách, bán hàng và SEO.</p>
			<div class="products-grid">
				<article class="product-card">
					<img class="product-image" src="https://picsum.photos/seed/seo-books/800/500" alt="Hướng dẫn SEO cho cửa hàng sách">
					<h3 class="product-title">Hướng dẫn SEO cho cửa hàng sách: từ A đến Z</h3>
					<p class="product-author">04/11/2025 • 6 phút đọc</p>
					<p class="product-author" style="margin-top:-6px; color: var(--text-secondary);">Tối ưu tiêu đề, mô tả, tốc độ tải, dữ liệu cấu trúc...</p>
					<div class="product-actions">
						<a href="#" class="btn btn-outline">Đọc bài</a>
					</div>
				</article>
				<article class="product-card">
					<img class="product-image" src="https://picsum.photos/seed/cover-photo/800/500" alt="Ảnh bìa sản phẩm">
					<h3 class="product-title">Chọn ảnh bìa sản phẩm như thế nào để tăng CTR?</h3>
					<p class="product-author">01/11/2025 • 4 phút đọc</p>
					<p class="product-author" style="margin-top:-6px; color: var(--text-secondary);">Nguyên tắc bố cục, ánh sáng, kích thước và tỉ lệ.</p>
					<div class="product-actions">
						<a href="#" class="btn btn-outline">Đọc bài</a>
					</div>
				</article>
				<article class="product-card">
					<img class="product-image" src="https://picsum.photos/seed/description/800/500" alt="Mô tả sản phẩm">
					<h3 class="product-title">Viết mô tả sản phẩm thuyết phục trong 5 bước</h3>
					<p class="product-author">28/10/2025 • 5 phút đọc</p>
					<p class="product-author" style="margin-top:-6px; color: var(--text-secondary);">Cấu trúc AIDA, lợi ích, bằng chứng xã hội, CTA.</p>
					<div class="product-actions">
						<a href="#" class="btn btn-outline">Đọc bài</a>
					</div>
				</article>
			</div>
		</div>
	</section>
</main>

<?php include 'includes/footer.php'; ?>
