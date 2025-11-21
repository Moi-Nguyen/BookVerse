// Orders management variables
let currentPage = 1;
let currentFilters = {};
let selectedOrders = new Set();

// Initialize orders management
document.addEventListener('DOMContentLoaded', function() {
    // Wait for adminAPI to be available
    let retryCount = 0;
    const maxRetries = 20;
    
    function checkAdminAPI() {
        // Check both window.adminAPI and adminAPI (in case it's in global scope)
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        
        if (api && typeof api.getOrders === 'function') {
            console.log('adminAPI loaded successfully');
            initializeOrdersManagement();
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkAdminAPI, 200);
        } else {
            console.error('adminAPI not available after', maxRetries, 'retries');
            console.error('window.adminAPI:', window.adminAPI);
            console.error('typeof adminAPI:', typeof adminAPI);
            const tbody = document.getElementById('ordersTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="error-state">
                            <div class="error-icon">⚠️</div>
                            <p>Không thể khởi tạo admin API. Vui lòng tải lại trang.</p>
                            <button class="btn btn-outline" onclick="location.reload()">Tải lại</button>
                        </td>
                    </tr>
                `;
            }
        }
    }
    
    // Start checking after a short delay to ensure scripts are loaded
    setTimeout(checkAdminAPI, 100);
});

// Initialize orders management
async function initializeOrdersManagement() {
    try {
        showLoading();
        await Promise.all([
            loadOrders(),
            loadOrderStats()
        ]);
        setupEventListeners();
        hideLoading();
    } catch (error) {
        console.error('Orders management initialization failed:', error);
        showToast('Không thể tải danh sách đơn hàng: ' + error.message, 'error');
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500);
        });
    }

    // Filter changes
    const statusFilter = document.getElementById('statusFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (paymentFilter) paymentFilter.addEventListener('change', applyFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyFilters);
}

// Load order statistics
async function loadOrderStats() {
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            console.error('adminAPI not available for stats');
            return;
        }
        const response = await api.request('/dashboard');
        if (response && response.success && response.data) {
            const stats = response.data.stats || {};
            console.log('Order stats loaded:', stats);
            updateOrderStats(stats);
        } else {
            console.error('Invalid response from dashboard API:', response);
        }
    } catch (error) {
        console.error('Failed to load order stats:', error);
    }
}

// Update order statistics
function updateOrderStats(stats) {
    if (!stats) {
        console.warn('No stats provided to updateOrderStats');
        return;
    }
    
    const pendingEl = document.getElementById('pendingOrders');
    const processingEl = document.getElementById('processingOrders');
    const shippedEl = document.getElementById('shippedOrders');
    const completedEl = document.getElementById('completedOrders');
    const cancelledEl = document.getElementById('cancelledOrders');
    
    if (pendingEl) pendingEl.textContent = stats.pendingOrders || 0;
    if (processingEl) processingEl.textContent = stats.processingOrders || 0;
    if (shippedEl) shippedEl.textContent = stats.shippedOrders || 0;
    if (completedEl) completedEl.textContent = stats.completedOrders || 0;
    if (cancelledEl) cancelledEl.textContent = stats.cancelledOrders || 0;
}

// Load orders (expose globally)
window.loadOrders = async function loadOrders() {
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        
        if (!api || typeof api.getOrders !== 'function') {
            console.error('adminAPI.getOrders is not available');
            showOrdersError();
            return;
        }
        
        const params = new URLSearchParams({
            page: currentPage,
            limit: 10,
            ...currentFilters
        });
        
        const response = await api.getOrders(params);
        
        if (response && response.success) {
            const orders = response.data.orders || [];
            
            if (orders.length > 0) {
                displayOrders(orders);
                updatePagination(response.data.pagination);
                updateOrdersCount(response.data.pagination);
            } else {
                const tbody = document.getElementById('ordersTableBody');
                if (tbody) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 40px;">
                                <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
                                <h3>Không có đơn hàng nào</h3>
                                <p>Chưa có đơn hàng nào trong hệ thống</p>
                            </td>
                        </tr>
                    `;
                }
                updateOrdersCount(response.data.pagination || { total: 0, page: 1, limit: 10 });
            }
        } else {
            showOrdersError();
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        showOrdersError();
    }
}

// Display orders
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    // Escape HTML
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    tbody.innerHTML = orders.map(order => {
        const orderId = order._id || order.id;
        const orderNumber = order.orderNumber || `#${orderId.toString().slice(-8)}`;
        const customer = order.customer || {};
        const customerName = escapeHtml(
            (customer.profile?.firstName || '') + ' ' + 
            (customer.profile?.lastName || '')
        ).trim() || escapeHtml(customer.username || 'N/A');
        const customerEmail = escapeHtml(customer.email || '');
        const items = order.items || [];
        const total = order.total || 0;
        const status = order.status || 'pending';
        const createdAt = order.createdAt || new Date();
        const paymentMethod = order.payment?.method || 'cod';

        // Products preview (first 2 items)
        const productsPreview = items.slice(0, 2).map(item => {
            const product = item.product || {};
            const productTitle = escapeHtml(product.title || 'Sản phẩm');
            const quantity = item.quantity || 0;
            return `
                <div class="product-item">
                    <span class="product-quantity">${quantity}x</span>
                    <span>${productTitle}</span>
                </div>
            `;
        }).join('');
        
        const moreProducts = items.length > 2 ? `<div class="product-item" style="color: #6b7280; font-size: 0.75rem;">+${items.length - 2} sản phẩm khác</div>` : '';

        return `
            <tr data-order-id="${orderId}">
                <td>
                    <input type="checkbox" class="order-checkbox" value="${orderId}" 
                           onchange="toggleOrderSelection('${orderId}')">
                </td>
                <td>
                    <a href="#" class="order-number" onclick="viewOrderDetail('${orderId}'); return false;">
                        ${orderNumber}
                    </a>
                </td>
                <td>
                    <div class="customer-info">
                        <span class="customer-name">${customerName}</span>
                        ${customerEmail ? `<span class="customer-email">${customerEmail}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="products-preview">
                        ${productsPreview}
                        ${moreProducts}
                    </div>
                </td>
                <td>
                    <span class="order-total">${formatCurrency(total)}</span>
                </td>
                <td>
                    <span class="status-badge status-${status}">
                        ${getStatusLabel(status)}
                    </span>
                </td>
                <td>${formatDate(createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="viewOrderDetail('${orderId}')" title="Xem chi tiết">
                            <span class="btn-icon">👁️</span>
                            <span class="btn-text">Xem</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Apply filters (expose globally)
window.applyFilters = function applyFilters() {
    const search = document.getElementById('searchInput')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const paymentMethod = document.getElementById('paymentFilter')?.value || '';
    const dateRange = document.getElementById('dateFilter')?.value || '';
    
    currentFilters = {};
    
    if (search) {
        currentFilters.search = search;
    }
    if (status) {
        currentFilters.status = status;
    }
    if (paymentMethod) {
        currentFilters.paymentMethod = paymentMethod;
    }
    if (dateRange) {
        const now = new Date();
        let dateFrom = new Date();
        
        switch(dateRange) {
            case 'today':
                dateFrom.setHours(0, 0, 0, 0);
                break;
            case 'week':
                dateFrom.setDate(now.getDate() - 7);
                break;
            case 'month':
                dateFrom.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                dateFrom.setMonth(now.getMonth() - 3);
                break;
        }
        
        currentFilters.dateFrom = dateFrom.toISOString();
    }
    
    currentPage = 1;
    loadOrders();
}

// Clear filters (expose globally)
window.clearFilters = function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (paymentFilter) paymentFilter.value = '';
    if (dateFilter) dateFilter.value = '';
    
    currentFilters = {};
    currentPage = 1;
    loadOrders();
}

// Refresh orders (expose globally)
window.refreshOrders = function refreshOrders() {
    loadOrders();
    loadOrderStats();
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.order-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        if (selectAll.checked) {
            selectedOrders.add(checkbox.value);
        } else {
            selectedOrders.delete(checkbox.value);
        }
    });
}

// Toggle order selection
function toggleOrderSelection(orderId) {
    const checkbox = document.querySelector(`input[value="${orderId}"]`);
    if (checkbox.checked) {
        selectedOrders.add(orderId);
    } else {
        selectedOrders.delete(orderId);
    }
    
    const totalCheckboxes = document.querySelectorAll('.order-checkbox').length;
    const checkedCheckboxes = document.querySelectorAll('.order-checkbox:checked').length;
    document.getElementById('selectAll').checked = totalCheckboxes === checkedCheckboxes;
}

// View order detail
async function viewOrderDetail(orderId) {
    try {
        // Use OrdersManager if available, otherwise use direct API call
        if (window.ordersManager && typeof window.ordersManager.viewOrderDetail === 'function') {
            await window.ordersManager.viewOrderDetail(orderId);
        } else {
            showLoading();
            const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
            if (!api) {
                showToast('Admin API không khả dụng', 'error');
                return;
            }
            const response = await api.getOrder(orderId);
            if (response && response.success) {
                displayOrderDetail(response.data.order || response.data);
                const modal = document.getElementById('orderDetailModal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            } else {
                showToast('Không thể tải chi tiết đơn hàng', 'error');
            }
        }
    } catch (error) {
        console.error('Failed to load order detail:', error);
        showToast('Không thể tải chi tiết đơn hàng', 'error');
    } finally {
        hideLoading();
    }
}

// Display order detail
function displayOrderDetail(order) {
    const content = document.getElementById('orderDetailContent');
    if (!content || !order) {
        console.error('Invalid order data or content element');
        return;
    }
    
    // Safely get customer name
    const customer = order.customer || {};
    const customerName = customer.profile 
        ? `${(customer.profile.firstName || '')} ${(customer.profile.lastName || '')}`.trim()
        : customer.username || 'N/A';
    
    // Safely get customer email
    const customerEmail = customer.email || 'N/A';
    
    // Safely get customer phone
    const customerPhone = customer.profile?.phone || customer.phone || 'N/A';

    // Safely get order items
    const items = order.items || [];
    
    // Escape HTML helper
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };
    
    // Format date helper
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Get status text helper
    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'confirmed': 'Đã xác nhận',
            'processing': 'Đang xử lý',
            'shipped': 'Đã giao hàng',
            'delivered': 'Đã giao',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status || 'N/A';
    };
    
    content.innerHTML = `
        <div class="order-detail">
            <div class="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Mã đơn hàng:</label>
                        <span>${escapeHtml(order.orderNumber || 'N/A')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Ngày tạo:</label>
                        <span>${formatDate(order.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Trạng thái:</label>
                        <span class="status-badge status-${order.status || 'unknown'}">${getStatusText(order.status)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Tổng tiền:</label>
                        <span class="order-total">${formatCurrency(order.totalAmount || order.total || 0)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Thông tin khách hàng</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Tên:</label>
                        <span>${escapeHtml(customerName)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${escapeHtml(customerEmail)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Điện thoại:</label>
                        <span>${escapeHtml(customerPhone)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Sản phẩm</h4>
                <div class="products-list">
                    ${items.length > 0 ? items.map(item => {
                        const product = item.product || {};
                        return `
                            <div class="product-detail-item">
                                <div class="product-info">
                                    <div class="product-title">${escapeHtml(product.title || 'N/A')}</div>
                                    <div class="product-author">${escapeHtml(product.author || 'N/A')}</div>
                                </div>
                                <div class="product-quantity">x${item.quantity || 0}</div>
                                <div class="product-price">${formatCurrency(item.price || item.unitPrice || 0)}</div>
                            </div>
                        `;
                    }).join('') : '<p>Không có sản phẩm nào</p>'}
                </div>
            </div>
        </div>
    `;
}

// Close order detail
function closeOrderDetail() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

// Update pagination
function updatePagination(pagination) {
    const container = document.getElementById('paginationControls');
    if (!container) return;
    
    if (pagination.pages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    if (pagination.page > 1) {
        html += `<button class="pagination-btn" onclick="changePage(${pagination.page - 1})">‹</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === pagination.page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // Next button
    if (pagination.page < pagination.pages) {
        html += `<button class="pagination-btn" onclick="changePage(${pagination.page + 1})">›</button>`;
    }
    
    container.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadOrders();
}

// Update orders count
function updateOrdersCount(pagination) {
    const countEl = document.getElementById('ordersCount');
    const infoEl = document.getElementById('paginationInfo');
    
    if (countEl) {
        countEl.textContent = `${pagination.total} đơn hàng`;
    }
    
    if (infoEl) {
        const start = (pagination.page - 1) * pagination.limit + 1;
        const end = Math.min(pagination.page * pagination.limit, pagination.total);
        infoEl.textContent = `Hiển thị ${start}-${end} của ${pagination.total} đơn hàng`;
    }
}

// Show orders error
function showOrdersError() {
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="error-state">
                    <div class="error-icon">⚠️</div>
                    <p>Không thể tải danh sách đơn hàng</p>
                    <button class="btn btn-outline" onclick="loadOrders()">Thử lại</button>
                </td>
            </tr>
        `;
    }
}

// Utility functions
function getStatusLabel(status) {
    const labels = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Đã nhận',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    // Simple loading indicator
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 1rem; color: #6b7280;">Đang tải dữ liệu...</p>
                </td>
            </tr>
        `;
    }
}

function hideLoading() {
    // Loading will be replaced by actual data
}

function showToast(message, type = 'info') {
    // Avoid recursion - use a different name for the global function
    if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(message, type);
    } else {
        // Simple fallback
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Bulk actions
function showBulkActions() {
    if (selectedOrders.size === 0) {
        showToast('Vui lòng chọn đơn hàng để thực hiện thao tác', 'warning');
        return;
    }
    document.getElementById('bulkActionsModal').style.display = 'flex';
}

function closeBulkActions() {
    document.getElementById('bulkActionsModal').style.display = 'none';
}

function bulkUpdateStatus(status) {
    // TODO: Implement bulk update
    showToast('Tính năng đang được phát triển', 'info');
}

function exportOrders() {
    showToast('Tính năng xuất Excel đang được phát triển', 'info');
}
