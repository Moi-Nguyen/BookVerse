// Users management variables
let currentPage = 1;
let currentFilters = {};
let selectedUsers = new Set();

// Initialize users management
document.addEventListener('DOMContentLoaded', function() {
    initializeUsersManagement();
});

// Initialize users management
async function initializeUsersManagement() {
    try {
        showLoading();
        await loadUsers();
        setupEventListeners();
        hideLoading();
    } catch (error) {
        console.error('Users management initialization failed:', error);
        showToast('Không thể tải danh sách người dùng', 'error');
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
    try {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        } else {
            console.warn('searchInput element not found');
        }

        // Filter changes
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        
        if (roleFilter) {
            roleFilter.addEventListener('change', applyFilters);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', applyFilters);
        }
        if (dateFrom) {
            dateFrom.addEventListener('change', applyFilters);
        }
        if (dateTo) {
            dateTo.addEventListener('change', applyFilters);
        }
        
        console.log('Event listeners setup completed');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }

    // Add user form
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    
    // Modal close on overlay click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                if (modal.id === 'addUserModal') {
                    closeAddUserModal();
                } else if (modal.id === 'userDetailModal') {
                    closeUserDetailModal();
                }
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const addModal = document.getElementById('addUserModal');
            const detailModal = document.getElementById('userDetailModal');
            if (addModal && addModal.style.display === 'flex') {
                closeAddUserModal();
            }
            if (detailModal && detailModal.style.display === 'flex') {
                closeUserDetailModal();
            }
        }
    });
}

// Load users
async function loadUsers() {
    try {
        showLoading();
        const params = {
            page: currentPage,
            limit: 20,
            ...currentFilters
        };

        console.log('Loading users with params:', params);
        
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not defined');
            showToast('API không khả dụng. Vui lòng tải lại trang.', 'error');
            hideLoading();
            return;
        }

        const response = await adminAPI.getUsers(params);
        console.log('API response:', response);
        
        if (response && response.success && response.data) {
            displayUsers(response.data.users || []);
            updatePagination(response.data.pagination || {});
            updateUserCount(response.data.pagination?.total || 0);
        } else {
            console.warn('API response not successful:', response);
            showUsersError();
            showToast(response?.message || 'Không thể tải danh sách người dùng', 'error');
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        showUsersError();
        showToast('Không thể tải danh sách người dùng: ' + (error.message || 'Lỗi không xác định'), 'error');
    } finally {
        hideLoading();
    }
}

// Display users
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = users.map(user => `
        <tr data-user-id="${user._id}">
            <td>
                <input type="checkbox" class="user-checkbox" value="${user._id}" 
                       onchange="toggleUserSelection('${user._id}')">
            </td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <img src="${user.profile?.avatar || '../../assets/images/default-avatar.svg'}" 
                             alt="${user.username}" 
                             onerror="this.src='../../assets/images/default-avatar.svg'">
                    </div>
                    <div class="user-details">
                        <h4 class="user-name">${user.profile?.firstName || ''} ${user.profile?.lastName || ''}</h4>
                        <p class="user-username">@${user.username}</p>
                        <p class="user-email">${user.email}</p>
                    </div>
                </div>
            </td>
            <td>
                <span class="role-badge role-${user.role}">
                    ${getRoleLabel(user.role)}
                </span>
            </td>
            <td>
                ${user.role === 'seller' && user.sellerProfile?.isApproved === false ? 
                    '<span class="status-badge status-pending">Chờ phê duyệt seller</span>' :
                    (user.isActive ? 
                        '<span class="status-badge status-active">Hoạt động</span>' : 
                        '<span class="status-badge status-inactive">Không hoạt động</span>'
                    )
                }
            </td>
            <td>
                <span class="wallet-balance-display">
                    ${formatCurrency(user.wallet?.balance || 0)}
                </span>
            </td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Chưa đăng nhập'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="viewUserDetail('${user._id}')" title="Xem chi tiết">
                        👁️
                    </button>
                    ${user.role === 'seller' && user.sellerProfile?.isApproved === false ? `
                        <button class="btn btn-sm btn-success" onclick="approveSeller('${user._id}')" title="Phê duyệt seller">
                            ✅
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline" onclick="editUser('${user._id}')" title="Chỉnh sửa">
                        ✏️
                    </button>
                    <button class="btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleUserStatus('${user._id}', ${user.isActive})" 
                            title="${user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}">
                        ${user.isActive ? '⏸️' : '▶️'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')" title="Xóa">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Apply filters - make it globally accessible
window.applyFilters = function applyFilters() {
    try {
        console.log('applyFilters called');
        const searchValue = document.getElementById('searchInput')?.value?.trim() || '';
        const roleValue = document.getElementById('roleFilter')?.value || '';
        const statusValue = document.getElementById('statusFilter')?.value || '';
        const dateFromValue = document.getElementById('dateFrom')?.value || '';
        const dateToValue = document.getElementById('dateTo')?.value || '';
        
        currentFilters = {};
        
        // Only add non-empty filters
        if (searchValue) {
            currentFilters.search = searchValue;
        }
        if (roleValue) {
            currentFilters.role = roleValue;
        }
        if (statusValue) {
            currentFilters.status = statusValue;
        }
        if (dateFromValue) {
            currentFilters.dateFrom = dateFromValue;
        }
        if (dateToValue) {
            currentFilters.dateTo = dateToValue;
        }

        console.log('Current filters:', currentFilters);
        currentPage = 1;
        loadUsers();
    } catch (error) {
        console.error('Error in applyFilters:', error);
        showToast('Lỗi khi áp dụng bộ lọc', 'error');
    }
}

// Clear filters - make it globally accessible
window.clearFilters = function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('roleFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    
    currentFilters = {};
    currentPage = 1;
    loadUsers();
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.user-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        if (selectAll.checked) {
            selectedUsers.add(checkbox.value);
        } else {
            selectedUsers.delete(checkbox.value);
        }
    });
}

// Toggle user selection
function toggleUserSelection(userId) {
    const checkbox = document.querySelector(`input[value="${userId}"]`);
    if (checkbox.checked) {
        selectedUsers.add(userId);
    } else {
        selectedUsers.delete(userId);
    }
    
    // Update select all checkbox
    const totalCheckboxes = document.querySelectorAll('.user-checkbox').length;
    const checkedCheckboxes = document.querySelectorAll('.user-checkbox:checked').length;
    document.getElementById('selectAll').checked = totalCheckboxes === checkedCheckboxes;
}

// View user detail
async function viewUserDetail(userId) {
    try {
        showLoading();
        const response = await adminAPI.getUser(userId);
        if (response.success) {
            displayUserDetail(response.data.user);
            const modal = document.getElementById('userDetailModal');
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load user detail:', error);
        showToast('Không thể tải chi tiết người dùng', 'error');
    } finally {
        hideLoading();
    }
}

// Display user detail
function displayUserDetail(user) {
    const content = document.getElementById('userDetailContent');
    content.innerHTML = `
        <div class="user-detail-grid">
            <div class="detail-section">
                <h4>Thông tin cơ bản</h4>
                <div class="detail-info">
                    <div class="info-row">
                        <span class="info-label">Tên đăng nhập:</span>
                        <span class="info-value">${user.username}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${user.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Họ tên:</span>
                        <span class="info-value">${user.profile?.firstName || ''} ${user.profile?.lastName || ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Số điện thoại:</span>
                        <span class="info-value">${user.profile?.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Vai trò:</span>
                        <span class="role-badge role-${user.role}">${getRoleLabel(user.role)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Trạng thái:</span>
                        <span class="status-badge status-${user.isActive ? 'active' : 'inactive'}">
                            ${user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Số dư ví:</span>
                        <span class="info-value wallet-balance-display" style="font-weight: 600; color: #10b981; font-size: 1.1rem;">${formatCurrency(user.wallet?.balance || 0)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Cộng tiền vào ví</h4>
                <div class="detail-info">
                    <form id="addMoneyForm" onsubmit="handleAddMoney(event, '${user._id}')">
                        <div class="form-group">
                            <label class="form-label">Số tiền cộng (VND) *</label>
                            <input type="number" name="amount" class="form-input" min="1000" step="1000" required placeholder="Nhập số tiền (tối thiểu 1,000 VND)">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Ghi chú (tùy chọn)</label>
                            <input type="text" name="note" class="form-input" placeholder="Ghi chú cho giao dịch">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">
                                <span class="btn-text">💰 Cộng tiền</span>
                                <span class="btn-loading" style="display: none;">⏳</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            ${user.sellerProfile ? `
            <div class="detail-section">
                <h4>Thông tin người bán</h4>
                <div class="detail-info">
                    <div class="info-row">
                        <span class="info-label">Tên doanh nghiệp:</span>
                        <span class="info-value">${user.sellerProfile.businessName || 'Chưa cập nhật'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Loại hình:</span>
                        <span class="info-value">${user.sellerProfile.businessType === 'individual' ? 'Cá nhân' : 'Doanh nghiệp'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Trạng thái phê duyệt:</span>
                        <span class="status-badge status-${user.sellerProfile.isApproved ? 'active' : 'pending'}">
                            ${user.sellerProfile.isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
                        </span>
                    </div>
                    ${!user.sellerProfile.isApproved ? `
                    <div class="info-row">
                        <button class="btn btn-success" onclick="approveSeller('${user._id}'); closeUserDetailModal();">
                            ✅ Phê duyệt seller
                        </button>
                    </div>
                    ` : ''}
                    <div class="info-row">
                        <span class="info-label">Mô tả:</span>
                        <span class="info-value">${user.sellerProfile.description || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>Thống kê hoạt động</h4>
                <div class="detail-info">
                    <div class="info-row">
                        <span class="info-label">Ngày đăng ký:</span>
                        <span class="info-value">${formatDate(user.createdAt)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Đăng nhập cuối:</span>
                        <span class="info-value">${user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Chưa đăng nhập'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Xác thực email:</span>
                        <span class="status-badge status-${user.isEmailVerified ? 'active' : 'inactive'}">
                            ${user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Edit user
async function editUser(userId) {
    try {
        showLoading();
        const response = await adminAPI.getUser(userId);
        if (response.success) {
            showEditUserModal(response.data.user);
        }
    } catch (error) {
        console.error('Failed to load user for editing:', error);
        showToast('Không thể tải thông tin người dùng', 'error');
    } finally {
        hideLoading();
    }
}

// Show edit user modal
function showEditUserModal(user) {
    const modal = document.getElementById('addUserModal');
    const form = document.getElementById('addUserForm');
    const modalTitle = modal.querySelector('.modal-header h3');
    
    // Change modal title
    modalTitle.textContent = 'Chỉnh sửa người dùng';
    
    // Fill form with user data
    form.querySelector('[name="username"]').value = user.username || '';
    form.querySelector('[name="email"]').value = user.email || '';
    form.querySelector('[name="firstName"]').value = user.profile?.firstName || '';
    form.querySelector('[name="lastName"]').value = user.profile?.lastName || '';
    form.querySelector('[name="phone"]').value = user.profile?.phone || '';
    form.querySelector('[name="role"]').value = user.role || 'user';
    
    // Remove password requirement for edit
    const passwordField = form.querySelector('[name="password"]');
    passwordField.required = false;
    passwordField.parentElement.querySelector('.form-label').innerHTML = 
        passwordField.parentElement.querySelector('.form-label').textContent.replace('*', '') + ' (Để trống nếu không đổi)';
    
    // Store user ID for update
    form.dataset.userId = user._id;
    form.dataset.isEdit = 'true';
    
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// Reset edit modal to add mode
function resetEditModal() {
    const form = document.getElementById('addUserForm');
    const modal = document.getElementById('addUserModal');
    const modalTitle = modal.querySelector('.modal-header h3');
    
    modalTitle.textContent = 'Thêm người dùng mới';
    delete form.dataset.userId;
    delete form.dataset.isEdit;
    
    const passwordField = form.querySelector('[name="password"]');
    passwordField.required = true;
    passwordField.parentElement.querySelector('.form-label').innerHTML = 
        passwordField.parentElement.querySelector('.form-label').textContent + ' *';
}

// Toggle user status
async function toggleUserStatus(userId, currentStatus) {
    try {
        const response = currentStatus 
            ? await adminAPI.deactivateUser(userId)
            : await adminAPI.activateUser(userId);
        
        if (response.success) {
            showToast(`Đã ${currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} người dùng`, 'success');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to toggle user status:', error);
        showToast('Không thể thay đổi trạng thái người dùng', 'error');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        return;
    }
    
    try {
        const response = await adminAPI.deleteUser(userId);
        
        if (response.success) {
            showToast('Đã xóa người dùng', 'success');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
        showToast('Không thể xóa người dùng', 'error');
    }
}

// Approve seller
async function approveSeller(userId) {
    if (!confirm('Bạn có chắc chắn muốn phê duyệt seller này?')) {
        return;
    }
    
    try {
        const response = await adminAPI.approveSeller(userId, true);
        
        if (response.success) {
            showToast('Đã phê duyệt seller thành công', 'success');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to approve seller:', error);
        showToast('Không thể phê duyệt seller', 'error');
    }
}

// Show add user modal
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// Close add user modal
function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.getElementById('addUserForm').reset();
    resetEditModal();
}

// Close user detail modal
function closeUserDetailModal() {
    const modal = document.getElementById('userDetailModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// Handle add/edit user
async function handleAddUser(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    
    // Remove empty password for edit
    if (form.dataset.isEdit === 'true' && !userData.password) {
        delete userData.password;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    const isEdit = form.dataset.isEdit === 'true';
    const userId = form.dataset.userId;
    
    try {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        
        let response;
        if (isEdit && userId) {
            // Update existing user
            response = await adminAPI.updateUser(userId, userData);
            if (response.success) {
                showToast('Đã cập nhật người dùng thành công', 'success');
            }
        } else {
            // Create new user
            response = await adminAPI.createUser(userData);
            if (response.success) {
                showToast('Đã thêm người dùng thành công', 'success');
            }
        }
        
        if (response.success) {
            closeAddUserModal();
            loadUsers();
        }
    } catch (error) {
        console.error(`Failed to ${isEdit ? 'update' : 'add'} user:`, error);
        showToast(`Không thể ${isEdit ? 'cập nhật' : 'thêm'} người dùng`, 'error');
    } finally {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Apply bulk action
async function applyBulkAction() {
    const action = document.getElementById('bulkAction').value;
    if (!action || selectedUsers.size === 0) {
        showToast('Vui lòng chọn thao tác và người dùng', 'warning');
        return;
    }
    
    if (!confirm(`Bạn có chắc chắn muốn ${action} ${selectedUsers.size} người dùng?`)) {
        return;
    }
    
    try {
        const response = await adminAPI.bulkUserAction(action, Array.from(selectedUsers));
        
        if (response.success) {
            showToast(`Đã ${action} ${selectedUsers.size} người dùng`, 'success');
            selectedUsers.clear();
            document.getElementById('selectAll').checked = false;
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to apply bulk action:', error);
        showToast('Không thể thực hiện thao tác hàng loạt', 'error');
    }
}

// Export users
function exportUsers() {
    showToast('Tính năng xuất Excel đang được phát triển', 'info');
}

// Update pagination
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    
    if (pagination.pages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-content">';
    
    // Previous button
    if (pagination.page > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${pagination.page - 1})">‹</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === pagination.page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // Next button
    if (pagination.page < pagination.pages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${pagination.page + 1})">›</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadUsers();
}

// Update user count
function updateUserCount(total) {
    document.getElementById('userCount').textContent = `${total} người dùng`;
}

// Show users error
function showUsersError() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="error-state">
                <div class="error-icon">⚠️</div>
                <p>Không thể tải danh sách người dùng</p>
                <button class="btn btn-outline" onclick="loadUsers()">Thử lại</button>
            </td>
        </tr>
    `;
}

// Utility functions
function getRoleLabel(role) {
    const labels = {
        'user': 'Người dùng',
        'seller': 'Người bán',
        'admin': 'Quản trị viên'
    };
    return labels[role] || role;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Handle add money to user wallet
window.handleAddMoney = async function handleAddMoney(e, userId) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount'));
    const note = formData.get('note') || '';
    
    if (!amount || amount < 1000) {
        showToast('Số tiền phải lớn hơn hoặc bằng 1,000 VND', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    try {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        
        const response = await adminAPI.addMoneyToUser(userId, amount, note);
        
        if (response && response.success) {
            showToast(`Đã cộng ${formatCurrency(amount)} vào ví người dùng`, 'success');
            // Reload user detail to show updated balance
            viewUserDetail(userId);
            // Reload users list to show updated balance
            loadUsers();
            // Reset form
            form.reset();
        } else {
            showToast(response?.message || 'Không thể cộng tiền', 'error');
        }
    } catch (error) {
        console.error('Failed to add money:', error);
        showToast('Không thể cộng tiền: ' + (error.message || 'Lỗi không xác định'), 'error');
    } finally {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}
