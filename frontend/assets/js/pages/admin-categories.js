// Category management
let categories = [];

// Load categories
async function loadCategories() {
    try {
        const tbody = document.getElementById('categoriesTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="loading">Đang tải dữ liệu...</div></td></tr>';
        }
        
        // Wait for adminAPI to be available
        let retryCount = 0;
        const maxRetries = 20;
        
        function checkAdminAPI() {
            const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
            
            if (api && typeof api.getCategories === 'function') {
                api.getCategories().then(response => {
                    if (response && response.success && response.data) {
                        categories = response.data.categories || [];
                        const stats = response.data.stats || {};
                        renderCategoriesTable();
                        updateStats(stats);
                    } else {
                        showCategoriesError();
                    }
                }).catch(error => {
                    console.error('Error loading categories:', error);
                    showCategoriesError();
                });
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(checkAdminAPI, 200);
            } else {
                console.error('adminAPI not available after', maxRetries, 'retries');
                showCategoriesError();
            }
        }
        
        setTimeout(checkAdminAPI, 100);
    } catch (error) {
        console.error('Error loading categories:', error);
        showCategoriesError();
    }
}

function showCategoriesError() {
    const tbody = document.getElementById('categoriesTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center error-state">
                    <div class="error-icon">⚠️</div>
                    <p>Không thể tải danh sách danh mục. Vui lòng tải lại trang.</p>
                    <button class="btn btn-outline" onclick="location.reload()">Tải lại</button>
                </td>
            </tr>
        `;
    }
}

// Render table
function renderCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;
    
    if (!categories || categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có danh mục nào</td></tr>';
        return;
    }
    
    // Escape HTML helper
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    // Format date helper
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    
    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${escapeHtml(cat.name || 'N/A')}</td>
            <td>${escapeHtml(cat.slug || '-')}</td>
            <td>${cat.productCount || 0}</td>
            <td>
                <span class="badge ${cat.isActive ? 'badge-success' : 'badge-danger'}">
                    ${cat.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            </td>
            <td>${formatDate(cat.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editCategory('${cat._id || cat.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory('${cat._id || cat.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Update stats
function updateStats(stats) {
    if (!stats) {
        // Fallback: calculate from categories array
        const totalEl = document.getElementById('totalCategories');
        const activeEl = document.getElementById('activeCategories');
        const productsEl = document.getElementById('totalProducts');
        
        if (totalEl) totalEl.textContent = categories.length || 0;
        if (activeEl) activeEl.textContent = categories.filter(cat => cat.isActive).length || 0;
        if (productsEl) {
            const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
            productsEl.textContent = totalProducts || 0;
        }
        return;
    }
    
    const totalEl = document.getElementById('totalCategories');
    const activeEl = document.getElementById('activeCategories');
    const productsEl = document.getElementById('totalProducts');
    
    if (totalEl) totalEl.textContent = stats.totalCategories || 0;
    if (activeEl) activeEl.textContent = stats.activeCategories || 0;
    if (productsEl) productsEl.textContent = stats.totalProducts || 0;
}

// Show add modal
function showAddCategoryModal() {
    document.getElementById('modalTitle').textContent = 'Thêm danh mục mới';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModal').style.display = 'flex';
}

// Close modal
function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

// Edit category
function editCategory(id) {
    const cat = categories.find(c => c._id === id);
    if (!cat) return;
    
    document.getElementById('modalTitle').textContent = 'Sửa danh mục';
    document.getElementById('categoryId').value = cat._id;
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categorySlug').value = cat.slug || '';
    document.getElementById('categoryDescription').value = cat.description || '';
    document.getElementById('categoryModal').style.display = 'flex';
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        const response = await api.deleteCategory(id);
        if (response && response.success) {
            alert('Xóa danh mục thành công!');
            loadCategories();
        } else {
            alert('Xóa danh mục thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Xóa danh mục thất bại: ' + error.message);
    }
}

// Handle form submit
document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
    if (!api) {
        alert('Admin API không khả dụng');
        return;
    }
    
    const id = document.getElementById('categoryId').value;
    const data = {
        name: document.getElementById('categoryName').value,
        slug: document.getElementById('categorySlug').value,
        description: document.getElementById('categoryDescription').value
    };
    
    try {
        let response;
        if (id) {
            response = await api.updateCategory(id, data);
        } else {
            response = await api.createCategory(data);
        }
        
        if (response && response.success) {
            alert(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            closeCategoryModal();
            loadCategories();
        } else {
            alert((id ? 'Cập nhật' : 'Thêm mới') + ' thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving category:', error);
        alert((id ? 'Cập nhật' : 'Thêm mới') + ' thất bại: ' + error.message);
    }
});

// Auto-refresh every 30 seconds
setInterval(loadCategories, 30000);

// Initial load
document.addEventListener('DOMContentLoaded', loadCategories);
