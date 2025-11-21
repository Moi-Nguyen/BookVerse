<?php 
$pageTitle='Quản lý danh mục'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-categories.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-categories.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Categories Management -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">📂</span>
                    Quản lý danh mục
                </h1>
                <p class="page-subtitle">Quản lý danh mục sản phẩm</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="showAddCategoryModal()">
                    <span class="btn-icon">➕</span>
                    Thêm danh mục
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📂</div>
                <div class="stat-content">
                    <h3 id="totalCategories">0</h3>
                    <p>Tổng danh mục</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <h3 id="activeCategories">0</h3>
                    <p>Đang hoạt động</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-content">
                    <h3 id="totalProducts">0</h3>
                    <p>Tổng sản phẩm</p>
                </div>
            </div>
        </div>

        <!-- Categories Table -->
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tên danh mục</th>
                        <th>Slug</th>
                        <th>Số sản phẩm</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="categoriesTableBody">
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="loading">Đang tải dữ liệu...</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</main>

<!-- Add/Edit Category Modal -->
<div id="categoryModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modalTitle">Thêm danh mục mới</h3>
            <button class="modal-close" onclick="closeCategoryModal()">&times;</button>
        </div>
        <form id="categoryForm" class="modal-body">
            <input type="hidden" id="categoryId">
            <div class="form-group">
                <label for="categoryName">Tên danh mục *</label>
                <input type="text" id="categoryName" required>
            </div>
            <div class="form-group">
                <label for="categorySlug">Slug</label>
                <input type="text" id="categorySlug">
            </div>
            <div class="form-group">
                <label for="categoryDescription">Mô tả</label>
                <textarea id="categoryDescription" rows="3"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeCategoryModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
        </form>
    </div>
</div>



<?php include __DIR__.'/../../includes/footer.php'; ?>

