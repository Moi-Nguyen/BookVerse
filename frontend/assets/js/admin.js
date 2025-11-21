// ========================================
// BOOKVERSE ADMIN JAVASCRIPT
// Professional admin dashboard functionality
// ========================================

// Admin API Helper Class
class AdminAPI {
    constructor() {
        this.baseURL = window.appConfig ? window.appConfig.getApiUrl() + '/admin' : 'http://localhost:5000/api/admin';
        this.token = this.getStoredToken();
    }

    // Get stored token with error handling
    getStoredToken() {
        try {
            return localStorage.getItem('bookverse_token');
        } catch (error) {
            console.warn('Cannot access localStorage:', error);
            return null;
        }
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        try {
            localStorage.setItem('bookverse_token', token);
        } catch (error) {
            console.warn('Cannot store token in localStorage:', error);
        }
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        try {
            localStorage.removeItem('bookverse_token');
        } catch (error) {
            console.warn('Cannot remove token from localStorage:', error);
        }
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authentication token if available
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('Admin API Error:', error);
            throw error;
        }
    }

    // Dashboard APIs
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    async getDashboardRevenue(timeRange = '30d') {
        return this.request(`/dashboard/revenue?range=${timeRange}`);
    }

    async getDashboardOrders(timeRange = '30d') {
        return this.request(`/dashboard/orders?range=${timeRange}`);
    }

    async getDashboardActivity() {
        return this.request('/dashboard/activity');
    }

    async getSellers(params = {}) {
        // Get sellers from users with role='seller'
        const queryString = new URLSearchParams({ ...params, role: 'seller' }).toString();
        return this.request(`/users?${queryString}`);
    }

    async getDashboardPending() {
        return this.request('/dashboard/pending');
    }

    async getDashboardHealth() {
        return this.request('/dashboard/health');
    }

    async exportAnalytics(timeRange = '30d') {
        return this.request(`/analytics/export?range=${timeRange}`, {
            method: 'GET',
            responseType: 'blob'
        });
    }

    // Orders Management APIs
    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders?${queryString}`);
    }

    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async updateOrderStatus(orderId, status, note = '') {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, note })
        });
    }

    async bulkUpdateOrderStatus(orderIds, status, note = '') {
        return this.request('/orders/bulk-status', {
            method: 'PATCH',
            body: JSON.stringify({ orderIds, status, note })
        });
    }

    async exportOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders/export?${queryString}`, {
            method: 'GET',
            responseType: 'blob'
        });
    }

    // Settings APIs
    async getSettings() {
        return this.request('/settings');
    }

    async updateSettings(settings) {
        return this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    async testEmailConnection() {
        return this.request('/settings/test-email', {
            method: 'POST'
        });
    }

    async clearCache() {
        return this.request('/settings/clear-cache', {
            method: 'POST'
        });
    }

    async clearOldLogs() {
        return this.request('/settings/clear-logs', {
            method: 'POST'
        });
    }

    async optimizeDatabase() {
        return this.request('/settings/optimize-db', {
            method: 'POST'
        });
    }

    async toggleMaintenanceMode(enabled, message = '') {
        return this.request('/settings/maintenance', {
            method: 'POST',
            body: JSON.stringify({ enabled, message })
        });
    }

    // Users Management APIs
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users?${queryString}`);
    }

    async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(userId) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    async activateUser(userId) {
        return this.request(`/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ isActive: true })
        });
    }

    async deactivateUser(userId) {
        return this.request(`/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ isActive: false })
        });
    }

    async bulkUserAction(action, userIds) {
        return this.request('/users/bulk', {
            method: 'PUT',
            body: JSON.stringify({
                action: action,
                userIds: userIds
            })
        });
    }

    async approveSeller(userId, approved = true) {
        return this.request(`/sellers/${userId}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ approved })
        });
    }

    async addMoneyToUser(userId, amount, note = '') {
        return this.request(`/users/${userId}/add-money`, {
            method: 'POST',
            body: JSON.stringify({ amount, note })
        });
    }

    // Products Management APIs
    async getProducts(params = {}) {
        // Remove sort='sales' as backend doesn't support it, use default sort
        const cleanParams = { ...params };
        if (cleanParams.sort === 'sales') {
            delete cleanParams.sort;
        }
        const queryString = new URLSearchParams(cleanParams).toString();
        return this.request(`/products?${queryString}`);
    }

    async getProduct(productId) {
        return this.request(`/products/${productId}`);
    }

    async approveProduct(productId) {
        return this.request(`/products/${productId}/approve`, {
            method: 'PUT'
        });
    }

    async rejectProduct(productId, reason) {
        return this.request(`/products/${productId}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    }

    async updateProductStatus(productId, status = null, isActive = null) {
        const body = {};
        if (status !== null) body.status = status;
        if (isActive !== null) body.isActive = isActive;
        
        return this.request(`/products/${productId}/status`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // Categories Management APIs
    async getCategories() {
        return this.request('/categories');
    }

    async getCategory(categoryId) {
        return this.request(`/categories/${categoryId}`);
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    }

    async updateCategory(categoryId, categoryData) {
        return this.request(`/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    }

    async deleteCategory(categoryId) {
        return this.request(`/categories/${categoryId}`, {
            method: 'DELETE'
        });
    }

    // Payments Management APIs
    async getWithdrawals(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/payments/withdrawals?${queryString}`);
    }

    async getTransactions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/payments/transactions?${queryString}`);
    }

    async approveWithdrawal(paymentId, notes = '') {
        // Note: This endpoint is in payments.js, not admin.js
        // So we need to use the full path without /admin prefix
        const baseURL = window.appConfig ? window.appConfig.getApiUrl() : 'http://localhost:5000/api';
        const url = `${baseURL}/payments/admin/approve-withdrawal/${paymentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ notes })
        });
        return response.json();
    }

    async rejectWithdrawal(paymentId, reason = '') {
        // Note: This endpoint is in payments.js, not admin.js
        const baseURL = window.appConfig ? window.appConfig.getApiUrl() : 'http://localhost:5000/api';
        const url = `${baseURL}/payments/admin/reject-withdrawal/${paymentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ reason })
        });
        return response.json();
    }

    // Settings Management APIs
    async getSettings() {
        return this.request('/settings');
    }

    async updateSettings(settingsData) {
        return this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData)
        });
    }

    async resetSettings() {
        return this.request('/settings/reset', {
            method: 'POST'
        });
    }

    async testEmailConnection() {
        return this.request('/settings/test-email', {
            method: 'POST'
        });
    }

    async clearCache() {
        return this.request('/settings/clear-cache', {
            method: 'POST'
        });
    }

    // Analytics APIs
    async getAnalytics(period = '30d') {
        return this.request(`/analytics?period=${period}`);
    }

    async getRevenueAnalytics(period = '30d') {
        return this.request(`/analytics/revenue?period=${period}`);
    }

    async getUserAnalytics(period = '30d') {
        return this.request(`/analytics/users?period=${period}`);
    }

    async getProductAnalytics(period = '30d') {
        return this.request(`/analytics/products?period=${period}`);
    }

    // System Management APIs
    async getSystemHealth() {
        return this.request('/system/health');
    }

    async getSystemStats() {
        return this.request('/system/stats');
    }

    // Utility functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    }

    formatDateTime(date) {
        return new Date(date).toLocaleString('vi-VN');
    }

    formatTimeAgo(date) {
        const now = new Date();
        const activityDate = new Date(date);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }

    // Error handling
    handleError(error) {
        console.error('Admin API Error:', error);
        
        const errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
        
        // Show user-friendly error message
        this.showToast(errorMessage, 'error');
    }

    // Toast notification system
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        const container = document.getElementById('toastContainer') || this.createToastContainer();
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Create global admin API instance
const adminAPI = new AdminAPI();

// Export for use in other scripts
window.AdminAPI = AdminAPI;
window.adminAPI = adminAPI;

// Global utility functions
window.showLoading = function() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
};

window.hideLoading = function() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
};

window.showToast = function(message, type = 'info') {
    adminAPI.showToast(message, type);
};

// Orders Management Functions
class OrdersManager {
    constructor() {
        this.selectedOrders = new Set();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {};
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.loadOrders();
            });
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.loadOrders();
            });
        }

        // Global functions
        window.clearFilters = () => this.clearFilters();
        window.applyFilters = () => this.applyFilters();
        window.refreshOrders = () => this.loadOrders();
        window.exportOrders = () => this.exportOrders();
        window.showBulkActions = () => this.showBulkActions();
        window.toggleSelectAll = () => this.toggleSelectAll();
        window.viewOrderDetail = (orderId) => this.viewOrderDetail(orderId);
        window.updateOrderStatus = () => this.updateOrderStatus();
        window.bulkUpdateStatus = (status) => this.bulkUpdateStatus(status);
        window.closeOrderDetail = () => this.closeOrderDetail();
        window.closeBulkActions = () => this.closeBulkActions();
    }

    async loadOrders() {
        try {
            const params = {
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...this.filters
            };

            const response = await adminAPI.getOrders(params);
            this.displayOrders(response.data.orders);
            this.updatePagination(response.data.pagination);
            this.updateStats(response.data.stats);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Không thể tải danh sách đơn hàng');
        }
    }

    displayOrders(orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>
                    <input type="checkbox" class="order-checkbox" value="${order._id}" 
                           onchange="ordersManager.toggleOrderSelection('${order._id}')">
                </td>
                <td>
                    <a href="#" class="order-number" onclick="viewOrderDetail('${order._id}')">
                        ${order.orderNumber}
                    </a>
                </td>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${this.escapeHtml(
                            order.customer?.profile 
                                ? `${(order.customer.profile.firstName || '')} ${(order.customer.profile.lastName || '')}`.trim()
                                : order.customer?.username || 'N/A'
                        )}</div>
                        <div class="customer-email">${this.escapeHtml(order.customer?.email || 'N/A')}</div>
                    </div>
                </td>
                <td>
                    <div class="products-preview">
                        ${(order.items || []).slice(0, 2).map(item => `
                            <div class="product-item">
                                <span class="product-quantity">${item.quantity || 0}</span>
                                ${this.escapeHtml(item.product?.title || 'N/A')}
                            </div>
                        `).join('')}
                        ${(order.items || []).length > 2 ? `<div class="product-item">+${(order.items || []).length - 2} sản phẩm khác</div>` : ''}
                    </div>
                </td>
                <td class="order-total">${this.formatCurrency(order.totalAmount || order.total || 0)}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewOrderDetail('${order._id}')" title="Xem chi tiết">
                            👁️
                        </button>
                        <button class="action-btn edit" onclick="editOrder('${order._id}')" title="Chỉnh sửa">
                            ✏️
                        </button>
                        <button class="action-btn delete" onclick="deleteOrder('${order._id}')" title="Xóa">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePagination(pagination) {
        const info = document.getElementById('paginationInfo');
        const controls = document.getElementById('paginationControls');
        
        if (info) {
            info.textContent = `Hiển thị ${pagination.start}-${pagination.end} của ${pagination.total} đơn hàng`;
        }

        if (controls) {
            controls.innerHTML = this.generatePaginationHTML(pagination);
        }
    }

    updateStats(stats) {
        const pendingEl = document.getElementById('pendingOrders');
        const processingEl = document.getElementById('processingOrders');
        const shippedEl = document.getElementById('shippedOrders');
        const completedEl = document.getElementById('completedOrders');
        const cancelledEl = document.getElementById('cancelledOrders');

        if (pendingEl) pendingEl.textContent = stats.pending || 0;
        if (processingEl) processingEl.textContent = stats.processing || 0;
        if (shippedEl) shippedEl.textContent = stats.shipped || 0;
        if (completedEl) completedEl.textContent = stats.completed || 0;
        if (cancelledEl) cancelledEl.textContent = stats.cancelled || 0;
    }

    generatePaginationHTML(pagination) {
        let html = '';
        
        // Previous button
        html += `<button class="pagination-btn" ${pagination.currentPage === 1 ? 'disabled' : ''} 
                 onclick="ordersManager.goToPage(${pagination.currentPage - 1})">‹</button>`;
        
        // Page numbers
        for (let i = Math.max(1, pagination.currentPage - 2); i <= Math.min(pagination.totalPages, pagination.currentPage + 2); i++) {
            html += `<button class="pagination-btn ${i === pagination.currentPage ? 'active' : ''}" 
                     onclick="ordersManager.goToPage(${i})">${i}</button>`;
        }
        
        // Next button
        html += `<button class="pagination-btn" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''} 
                 onclick="ordersManager.goToPage(${pagination.currentPage + 1})">›</button>`;
        
        return html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadOrders();
    }

    toggleOrderSelection(orderId) {
        if (this.selectedOrders.has(orderId)) {
            this.selectedOrders.delete(orderId);
        } else {
            this.selectedOrders.add(orderId);
        }
        this.updateSelectAllCheckbox();
    }

    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const orderCheckboxes = document.querySelectorAll('.order-checkbox');
        
        orderCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            if (selectAllCheckbox.checked) {
                this.selectedOrders.add(checkbox.value);
            } else {
                this.selectedOrders.delete(checkbox.value);
            }
        });
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const orderCheckboxes = document.querySelectorAll('.order-checkbox');
        
        if (orderCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            return;
        }
        
        const checkedCount = Array.from(orderCheckboxes).filter(cb => cb.checked).length;
        selectAllCheckbox.checked = checkedCount === orderCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < orderCheckboxes.length;
    }

    clearFilters() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const paymentFilter = document.getElementById('paymentFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = '';
        if (paymentFilter) paymentFilter.value = '';
        if (dateFilter) dateFilter.value = '';
        
        this.filters = {};
        this.loadOrders();
    }

    applyFilters() {
        this.currentPage = 1;
        this.loadOrders();
    }

    async exportOrders() {
        try {
            const response = await adminAPI.exportOrders(this.filters);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting orders:', error);
            this.showError('Không thể xuất danh sách đơn hàng');
        }
    }

    showBulkActions() {
        if (this.selectedOrders.size === 0) {
            this.showError('Vui lòng chọn ít nhất một đơn hàng');
            return;
        }
        
        const modal = document.getElementById('bulkActionsModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    async bulkUpdateStatus(status) {
        try {
            const orderIds = Array.from(this.selectedOrders);
            await adminAPI.bulkUpdateOrderStatus(orderIds, status);
            
            this.showSuccess(`Đã cập nhật trạng thái ${orderIds.length} đơn hàng`);
            this.selectedOrders.clear();
            this.loadOrders();
            this.closeBulkActions();
        } catch (error) {
            console.error('Error bulk updating orders:', error);
            this.showError('Không thể cập nhật trạng thái đơn hàng');
        }
    }

    async viewOrderDetail(orderId) {
        try {
            const response = await adminAPI.getOrder(orderId);
            if (response && response.success) {
                // Handle both response.data.order and response.data
                const order = response.data.order || response.data;
                if (order) {
                    this.displayOrderDetail(order);
                    const modal = document.getElementById('orderDetailModal');
                    if (modal) {
                        modal.style.display = 'flex';
                    }
                } else {
                    throw new Error('Order data not found in response');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error loading order detail:', error);
            this.showError('Không thể tải chi tiết đơn hàng');
        }
    }

    displayOrderDetail(order) {
        const content = document.getElementById('orderDetailContent');
        if (!content) return;

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
        
        content.innerHTML = `
            <div class="order-detail">
                <div class="detail-section">
                    <h4>Thông tin đơn hàng</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Mã đơn hàng:</label>
                            <span>${this.escapeHtml(order.orderNumber || 'N/A')}</span>
                        </div>
                        <div class="detail-item">
                            <label>Ngày tạo:</label>
                            <span>${order.createdAt ? this.formatDate(order.createdAt) : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Trạng thái:</label>
                            <span class="status-badge status-${order.status || 'unknown'}">${this.getStatusText(order.status)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Tổng tiền:</label>
                            <span class="order-total">${this.formatCurrency(order.totalAmount || order.total || 0)}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Thông tin khách hàng</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Tên:</label>
                            <span>${this.escapeHtml(customerName)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${this.escapeHtml(customerEmail)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Điện thoại:</label>
                            <span>${this.escapeHtml(customerPhone)}</span>
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
                                        <div class="product-title">${this.escapeHtml(product.title || 'N/A')}</div>
                                        <div class="product-author">${this.escapeHtml(product.author || 'N/A')}</div>
                                    </div>
                                    <div class="product-quantity">x${item.quantity || 0}</div>
                                    <div class="product-price">${this.formatCurrency(item.price || item.unitPrice || 0)}</div>
                                </div>
                            `;
                        }).join('') : '<p>Không có sản phẩm nào</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    closeOrderDetail() {
        const modal = document.getElementById('orderDetailModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    closeBulkActions() {
        const modal = document.getElementById('bulkActionsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    }

    getStatusText(status) {
        const statusMap = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            shipped: 'Đã giao',
            delivered: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        console.error('Orders Error:', message);
        adminAPI.showToast(message, 'error');
    }

    showSuccess(message) {
        console.log('Orders Success:', message);
        adminAPI.showToast(message, 'success');
    }
}

// Settings Management Functions
class SettingsManager {
    constructor() {
        this.settings = {};
        this.initializeEventListeners();
        // Only load settings if we're on the settings page
        if (document.querySelector('.settings-tab')) {
            this.loadSettings();
        }
    }

    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Global functions
        window.resetSettings = () => this.resetSettings();
        window.saveAllSettings = () => this.saveAllSettings();
        window.testEmailConnection = () => this.testEmailConnection();
        window.clearCache = () => this.clearCache();
        window.clearOldLogs = () => this.clearOldLogs();
        window.optimizeDatabase = () => this.optimizeDatabase();
        window.toggleMaintenanceMode = () => this.toggleMaintenanceMode();
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async loadSettings() {
        try {
            const response = await adminAPI.getSettings();
            this.settings = response.data;
            this.populateSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showError('Không thể tải cài đặt');
        }
    }

    populateSettings() {
        // General settings
        const siteName = document.getElementById('siteName');
        const siteDescription = document.getElementById('siteDescription');
        const metaTitle = document.getElementById('metaTitle');
        const metaDescription = document.getElementById('metaDescription');
        const metaKeywords = document.getElementById('metaKeywords');

        if (siteName) siteName.value = this.settings.siteName || '';
        if (siteDescription) siteDescription.value = this.settings.siteDescription || '';
        if (metaTitle) metaTitle.value = this.settings.metaTitle || '';
        if (metaDescription) metaDescription.value = this.settings.metaDescription || '';
        if (metaKeywords) metaKeywords.value = this.settings.metaKeywords || '';

        // Security settings
        const tokenExpiry = document.getElementById('tokenExpiry');
        const maxLoginAttempts = document.getElementById('maxLoginAttempts');
        const lockoutDuration = document.getElementById('lockoutDuration');
        const minPasswordLength = document.getElementById('minPasswordLength');

        if (tokenExpiry) tokenExpiry.value = this.settings.tokenExpiry || 15;
        if (maxLoginAttempts) maxLoginAttempts.value = this.settings.maxLoginAttempts || 5;
        if (lockoutDuration) lockoutDuration.value = this.settings.lockoutDuration || 30;
        if (minPasswordLength) minPasswordLength.value = this.settings.minPasswordLength || 8;

        // Email settings
        const smtpHost = document.getElementById('smtpHost');
        const smtpPort = document.getElementById('smtpPort');
        const smtpUsername = document.getElementById('smtpUsername');
        const smtpPassword = document.getElementById('smtpPassword');
        const fromEmail = document.getElementById('fromEmail');
        const fromName = document.getElementById('fromName');

        if (smtpHost) smtpHost.value = this.settings.smtpHost || '';
        if (smtpPort) smtpPort.value = this.settings.smtpPort || 587;
        if (smtpUsername) smtpUsername.value = this.settings.smtpUsername || '';
        if (smtpPassword) smtpPassword.value = this.settings.smtpPassword || '';
        if (fromEmail) fromEmail.value = this.settings.fromEmail || '';
        if (fromName) fromName.value = this.settings.fromName || '';

        // Payment settings
        const defaultShippingFee = document.getElementById('defaultShippingFee');
        const freeShippingThreshold = document.getElementById('freeShippingThreshold');
        const processingFee = document.getElementById('processingFee');

        if (defaultShippingFee) defaultShippingFee.value = this.settings.defaultShippingFee || 30000;
        if (freeShippingThreshold) freeShippingThreshold.value = this.settings.freeShippingThreshold || 500000;
        if (processingFee) processingFee.value = this.settings.processingFee || 2.5;

        // Notification settings
        const notifyNewOrders = document.getElementById('notifyNewOrders');
        const notifyNewUsers = document.getElementById('notifyNewUsers');
        const notifyNewProducts = document.getElementById('notifyNewProducts');
        const notifyNewReviews = document.getElementById('notifyNewReviews');

        if (notifyNewOrders) notifyNewOrders.checked = this.settings.notifyNewOrders || false;
        if (notifyNewUsers) notifyNewUsers.checked = this.settings.notifyNewUsers || false;
        if (notifyNewProducts) notifyNewProducts.checked = this.settings.notifyNewProducts || false;
        if (notifyNewReviews) notifyNewReviews.checked = this.settings.notifyNewReviews || false;

        // Maintenance settings
        const maintenanceMode = document.getElementById('maintenanceMode');
        const maintenanceMessage = document.getElementById('maintenanceMessage');

        if (maintenanceMode) maintenanceMode.checked = this.settings.maintenanceMode || false;
        if (maintenanceMessage) maintenanceMessage.value = this.settings.maintenanceMessage || '';
    }

    async saveAllSettings() {
        try {
            const settings = this.collectSettings();
            await adminAPI.updateSettings(settings);
            this.showSuccess('Đã lưu cài đặt thành công');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showError('Không thể lưu cài đặt');
        }
    }

    collectSettings() {
        return {
            // General
            siteName: document.getElementById('siteName')?.value || '',
            siteDescription: document.getElementById('siteDescription')?.value || '',
            metaTitle: document.getElementById('metaTitle')?.value || '',
            metaDescription: document.getElementById('metaDescription')?.value || '',
            metaKeywords: document.getElementById('metaKeywords')?.value || '',

            // Security
            tokenExpiry: parseInt(document.getElementById('tokenExpiry')?.value || 15),
            maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts')?.value || 5),
            lockoutDuration: parseInt(document.getElementById('lockoutDuration')?.value || 30),
            minPasswordLength: parseInt(document.getElementById('minPasswordLength')?.value || 8),
            requireUppercase: document.getElementById('requireUppercase')?.checked || false,
            requireNumbers: document.getElementById('requireNumbers')?.checked || false,
            requireSpecialChars: document.getElementById('requireSpecialChars')?.checked || false,

            // Email
            smtpHost: document.getElementById('smtpHost')?.value || '',
            smtpPort: parseInt(document.getElementById('smtpPort')?.value || 587),
            smtpUsername: document.getElementById('smtpUsername')?.value || '',
            smtpPassword: document.getElementById('smtpPassword')?.value || '',
            fromEmail: document.getElementById('fromEmail')?.value || '',
            fromName: document.getElementById('fromName')?.value || '',

            // Payment
            defaultShippingFee: parseInt(document.getElementById('defaultShippingFee')?.value || 30000),
            freeShippingThreshold: parseInt(document.getElementById('freeShippingThreshold')?.value || 500000),
            processingFee: parseFloat(document.getElementById('processingFee')?.value || 2.5),

            // Notifications
            notifyNewOrders: document.getElementById('notifyNewOrders')?.checked || false,
            notifyNewUsers: document.getElementById('notifyNewUsers')?.checked || false,
            notifyNewProducts: document.getElementById('notifyNewProducts')?.checked || false,
            notifyNewReviews: document.getElementById('notifyNewReviews')?.checked || false,

            // Maintenance
            maintenanceMode: document.getElementById('maintenanceMode')?.checked || false,
            maintenanceMessage: document.getElementById('maintenanceMessage')?.value || ''
        };
    }

    async testEmailConnection() {
        try {
            await adminAPI.testEmailConnection();
            this.showSuccess('Kết nối email thành công');
        } catch (error) {
            console.error('Error testing email:', error);
            this.showError('Không thể kết nối email');
        }
    }

    async clearCache() {
        try {
            await adminAPI.clearCache();
            this.showSuccess('Đã xóa cache thành công');
        } catch (error) {
            console.error('Error clearing cache:', error);
            this.showError('Không thể xóa cache');
        }
    }

    async clearOldLogs() {
        try {
            await adminAPI.clearOldLogs();
            this.showSuccess('Đã xóa logs cũ thành công');
        } catch (error) {
            console.error('Error clearing logs:', error);
            this.showError('Không thể xóa logs');
        }
    }

    async optimizeDatabase() {
        try {
            await adminAPI.optimizeDatabase();
            this.showSuccess('Đã tối ưu database thành công');
        } catch (error) {
            console.error('Error optimizing database:', error);
            this.showError('Không thể tối ưu database');
        }
    }

    async toggleMaintenanceMode() {
        try {
            const enabled = document.getElementById('maintenanceMode')?.checked || false;
            const message = document.getElementById('maintenanceMessage')?.value || '';
            await adminAPI.toggleMaintenanceMode(enabled, message);
            
            if (enabled) {
                this.showSuccess('Đã bật chế độ bảo trì');
            } else {
                this.showSuccess('Đã tắt chế độ bảo trì');
            }
        } catch (error) {
            console.error('Error toggling maintenance mode:', error);
            this.showError('Không thể thay đổi chế độ bảo trì');
        }
    }

    resetSettings() {
        if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
            this.loadSettings();
            this.showSuccess('Đã khôi phục cài đặt mặc định');
        }
    }

    showError(message) {
        console.error('Settings Error:', message);
        adminAPI.showToast(message, 'error');
    }

    showSuccess(message) {
        console.log('Settings Success:', message);
        adminAPI.showToast(message, 'success');
    }
}

// Initialize admin functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Don't auto-check auth - let pages handle it themselves
    // checkAdminAuth();
    
    // Initialize admin features
    initializeAdminFeatures();
    
    // Initialize managers only if their containers exist
    if (document.getElementById('ordersTableBody')) {
        window.ordersManager = new OrdersManager();
    }
    
    if (document.querySelector('.settings-tab')) {
        window.settingsManager = new SettingsManager();
    }
});

// Check admin authentication
async function checkAdminAuth() {
    try {
        const response = await adminAPI.request('/auth/me');
        if (response.success && response.data.user.role !== 'admin') {
            // Redirect non-admin users
            window.location.href = '../../index.php';
        }
    } catch (error) {
        // Redirect to login if not authenticated
        window.location.href = '../../pages/auth/login.php';
    }
}

// Initialize admin features
function initializeAdminFeatures() {
    // Add global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + R to refresh dashboard
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (typeof refreshDashboard === 'function') {
                refreshDashboard();
            }
        }
        
        // Ctrl + K to focus search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    // Add confirmation dialogs for destructive actions
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-confirm]')) {
            const message = e.target.getAttribute('data-confirm');
            if (!confirm(message)) {
                e.preventDefault();
            }
        }
    });

    // Add auto-save functionality for forms
    const forms = document.querySelectorAll('form[data-autosave]');
    forms.forEach(form => {
        const formId = form.getAttribute('data-autosave');
        const savedData = localStorage.getItem(`form_${formId}`);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Failed to restore form data:', error);
            }
        }

        // Save form data on input
        form.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            localStorage.setItem(`form_${formId}`, JSON.stringify(data));
        });

        // Clear saved data on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(`form_${formId}`);
        });
    });
}

// Chart.js configuration for admin charts
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#6b7280';
    
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 20;
}

// Export functions for global use
window.adminAPI = adminAPI;