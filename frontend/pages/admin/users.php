<?php 
$pageTitle='Qu???n l?? ng?????i d??ng'; 
$extraCss=['assets/css/admin-improved.css']; 
$extraJs=[
    'assets/js/pages/admin-auth-guard.js',
    'assets/js/admin.js',
    'assets/js/pages/admin-users.js'
];
include '../../includes/header.php'; 
?>

<!-- Users Management -->
<main class="admin-main">
    <div class="admin-container">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">👥</span>
                    Quản lý người dùng
                </h1>
                <p class="page-subtitle">Quản lý tài khoản người dùng và người bán</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="exportUsers()">
                    <span class="btn-icon">📊</span>
                    Xuất Excel
                </button>
                <button class="btn btn-primary" onclick="showAddUserModal()">
                    <span class="btn-icon">➕</span>
                    Thêm người dùng
                </button>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="filters-section">
            <div class="filters-grid">
                <div class="filter-group">
                    <label class="filter-label">Tìm kiếm</label>
                    <input type="text" id="searchInput" class="form-input" placeholder="Tìm theo tên, email, username...">
                </div>
                <div class="filter-group">
                    <label class="filter-label">Vai trò</label>
                    <select id="roleFilter" class="form-select">
                        <option value="">Tất cả vai trò</option>
                        <option value="user">Người dùng</option>
                        <option value="seller">Người bán</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Trạng thái</label>
                    <select id="statusFilter" class="form-select">
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="pending">Chờ phê duyệt</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Ngày đăng ký</label>
                    <input type="date" id="dateFrom" class="form-input">
                    <input type="date" id="dateTo" class="form-input">
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

        <!-- Users Table -->
        <div class="table-section">
            <div class="table-header">
                <div class="table-info">
                    <h3>Danh sách người dùng</h3>
                    <span class="table-count" id="userCount">0 người dùng</span>
                </div>
                <div class="table-actions">
                    <div class="bulk-actions">
                        <select id="bulkAction" class="form-select">
                            <option value="">Thao tác hàng loạt</option>
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
                <table class="admin-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                            </th>
                            <th>Người dùng</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Số dư ví</th>
                            <th>Ngày đăng ký</th>
                            <th>Hoạt động cuối</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- Users will be loaded here -->
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

<!-- Add User Modal -->
<div id="addUserModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Thêm người dùng mới</h3>
            <button class="modal-close" onclick="closeAddUserModal()">&times;</button>
        </div>
        <form id="addUserForm" class="modal-body">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Tên đăng nhập *</label>
                    <input type="text" name="username" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" name="email" class="form-input" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Họ *</label>
                    <input type="text" name="firstName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Tên *</label>
                    <input type="text" name="lastName" class="form-input" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Mật khẩu *</label>
                    <input type="password" name="password" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Vai trò *</label>
                    <select name="role" class="form-select" required>
                        <option value="user">Người dùng</option>
                        <option value="seller">Người bán</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <input type="tel" name="phone" class="form-input">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeAddUserModal()">
                    Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                    <span class="btn-text">Thêm người dùng</span>
                    <span class="btn-loading" style="display: none;">⏳</span>
                </button>
            </div>
        </form>
    </div>
</div>

<!-- User Detail Modal -->
<div id="userDetailModal" class="modal" style="display: none;">
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h3>Chi tiết người dùng</h3>
            <button class="modal-close" onclick="closeUserDetailModal()">&times;</button>
        </div>
        <div class="modal-body" id="userDetailContent">
            <!-- User details will be loaded here -->
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
