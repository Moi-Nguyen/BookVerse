<?php 
$pageTitle='Quản lý sản phẩm'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/admin-products.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-products.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Products Management -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">📚</span>
                    Quản lý sản phẩm
                </h1>
                <p class="page-subtitle">Phê duyệt và quản lý sản phẩm trên hệ thống</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="exportProducts()">
                    <span class="btn-icon">📊</span>
                    Xuất Excel
                </button>
                <button class="btn btn-primary" onclick="showBulkActions()">
                    <span class="btn-icon">⚡</span>
                    Thao tác hàng loạt
                </button>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="filters-section">
            <div class="filters-grid">
                <div class="filter-group">
                    <label class="filter-label">Tìm kiếm</label>
                    <input type="text" id="searchInput" class="form-input" placeholder="Tìm theo tên sách, tác giả, ISBN...">
                </div>
                <div class="filter-group">
                    <label class="filter-label">Danh mục</label>
                    <select id="categoryFilter" class="form-select">
                        <option value="">Tất cả danh mục</option>
                        <!-- Categories will be loaded here -->
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Trạng thái</label>
                    <select id="statusFilter" class="form-select">
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Ngừng bán</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Người bán</label>
                    <select id="sellerFilter" class="form-select">
                        <option value="">Tất cả người bán</option>
                        <!-- Sellers will be loaded here -->
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Giá từ</label>
                    <input type="number" id="priceFrom" class="form-input" placeholder="0">
                </div>
                <div class="filter-group">
                    <label class="filter-label">Giá đến</label>
                    <input type="number" id="priceTo" class="form-input" placeholder="1000000">
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" onclick="applyFilters()">
                        <span class="btn-icon">🔍</span>
                        Lọc
                    </button>
                    <button class="btn btn-outline" onclick="clearFilters()">
                        <span class="btn-icon">🔄</span>
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="table-section">
            <div class="table-header">
                <div class="table-info">
                    <h3>Danh sách sản phẩm</h3>
                    <span class="table-count" id="productCount">0 sản phẩm</span>
                </div>
                <div class="table-actions">
                    <div class="bulk-actions">
                        <select id="bulkAction" class="form-select">
                            <option value="">Thao tác hàng loạt</option>
                            <option value="approve">Phê duyệt</option>
                            <option value="reject">Từ chối</option>
                            <option value="activate">Kích hoạt</option>
                            <option value="deactivate">Vô hiệu hóa</option>
                            <option value="delete">Xóa</option>
                        </select>
                        <button class="btn btn-outline" onclick="applyBulkAction()">
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table class="admin-table" id="productsTable">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                            </th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Người bán</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody">
                        <!-- Products will be loaded here -->
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="pagination" id="pagination">
                <!-- Pagination will be loaded here -->
            </div>
        </div>
    </div>
</main>

<!-- Product Detail Modal -->
<div id="productDetailModal" class="modal" style="display: none;">
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h3>Chi tiết sản phẩm</h3>
            <button class="modal-close" onclick="closeProductDetailModal()">&times;</button>
        </div>
        <div class="modal-body" id="productDetailContent">
            <!-- Product details will be loaded here -->
        </div>
    </div>
</div>

<!-- Approve/Reject Modal -->
<div id="approvalModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="approvalModalTitle">Phê duyệt sản phẩm</h3>
            <button class="modal-close" onclick="closeApprovalModal()">&times;</button>
        </div>
        <form id="approvalForm" class="modal-body">
            <input type="hidden" id="approvalProductId">
            <input type="hidden" id="approvalAction">
            
            <div class="form-group">
                <label class="form-label">Lý do (tùy chọn)</label>
                <textarea id="approvalReason" class="form-input" rows="4" 
                          placeholder="Nhập lý do phê duyệt hoặc từ chối..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeApprovalModal()">
                    Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                    <span class="btn-text">Xác nhận</span>
                    <span class="btn-loading" style="display: none;">⏳</span>
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Bulk Actions Modal -->
<div id="bulkActionsModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Thao tác hàng loạt</h3>
            <button class="modal-close" onclick="closeBulkActionsModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Chọn thao tác</label>
                <select id="bulkActionSelect" class="form-select">
                    <option value="">Chọn thao tác...</option>
                    <option value="approve">Phê duyệt tất cả</option>
                    <option value="reject">Từ chối tất cả</option>
                    <option value="activate">Kích hoạt tất cả</option>
                    <option value="deactivate">Vô hiệu hóa tất cả</option>
                    <option value="delete">Xóa tất cả</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Lý do (tùy chọn)</label>
                <textarea id="bulkReason" class="form-input" rows="3" 
                          placeholder="Nhập lý do thao tác..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeBulkActionsModal()">
                    Hủy
                </button>
                <button type="button" class="btn btn-primary" onclick="executeBulkAction()">
                    <span class="btn-text">Thực hiện</span>
                    <span class="btn-loading" style="display: none;">⏳</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Loading Overlay -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
    </div>
</div>

<!-- Toast Container -->
<div id="toastContainer" class="toast-container"></div>

<?php include __DIR__.'/../../includes/footer.php'; ?>


