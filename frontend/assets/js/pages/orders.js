// Orders Page JavaScript
class OrdersManager {
    constructor() {
        // Ensure API is available
        if (typeof window.api === 'undefined' && typeof api !== 'undefined') {
            window.api = api;
        }
        
        if (!window.api) {
            console.error('API not available! Make sure api.js is loaded before orders.js');
            return;
        }
        
        this.api = window.api;
        this.orders = [];
        this.filteredOrders = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.ordersPerPage = 10;
        this.initializeEventListeners();
        this.loadOrders();
    }

    initializeEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Search box
        const orderSearch = document.getElementById('orderSearch');
        if (orderSearch) {
            orderSearch.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Sort select
        const sortOrders = document.getElementById('sortOrders');
        if (sortOrders) {
            sortOrders.addEventListener('change', (e) => this.handleSort(e));
        }
    }

    async loadOrders() {
        try {
            this.showLoading();
            
            const response = await this.api.getOrders({
                page: this.currentPage,
                limit: this.ordersPerPage
            });
            
            if (response.success) {
                this.orders = response.data.orders || [];
                this.filteredOrders = [...this.orders];
                this.renderOrders();
                this.renderPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        } finally {
            this.hideLoading();
        }
    }

    handleFilterChange(e) {
        const tab = e.target;
        const status = tab.dataset.status;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        this.currentFilter = status;
        this.filterOrders();
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        this.filterOrders(query);
    }

    handleSort(e) {
        const sortBy = e.target.value;
        this.sortOrders(sortBy);
    }

    filterOrders(searchQuery = '') {
        let filtered = [...this.orders];
        
        // Filter by status
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(order => order.status === this.currentFilter);
        }
        
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(order => 
                order.orderNumber.toLowerCase().includes(searchQuery) ||
                order.items.some(item => 
                    item.product.title.toLowerCase().includes(searchQuery)
                )
            );
        }
        
        this.filteredOrders = filtered;
        this.renderOrders();
    }

    sortOrders(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'price-high':
                this.filteredOrders.sort((a, b) => b.total - a.total);
                break;
            case 'price-low':
                this.filteredOrders.sort((a, b) => a.total - b.total);
                break;
        }
        
        this.renderOrders();
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        const ordersEmpty = document.getElementById('ordersEmpty');
        
        if (this.filteredOrders.length === 0) {
            ordersList.style.display = 'none';
            ordersEmpty.style.display = 'block';
            return;
        }
        
        ordersList.style.display = 'block';
        ordersEmpty.style.display = 'none';
        
        ordersList.innerHTML = this.filteredOrders.map(order => this.createOrderCard(order)).join('');
    }

    createOrderCard(order) {
        const statusInfo = this.getStatusInfo(order.status);
        const formattedDate = this.formatDate(order.createdAt);
        const formattedTotal = this.api.formatPrice(order.total);
        
        return `
            <div class="order-card" onclick="openOrderModal('${order._id}')">
                <div class="order-header">
                    <div class="order-info">
                        <h3 class="order-number">Đơn hàng #${order.orderNumber}</h3>
                        <p class="order-date">${formattedDate}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status}">${statusInfo.text}</span>
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.product.images[0]?.url || '../../assets/images/placeholder-book.svg'}" 
                                 alt="${item.product.title}" class="item-image" />
                            <div class="item-info">
                                <h4 class="item-title">${item.product.title}</h4>
                                <p class="item-author">${item.product.author}</p>
                                <p class="item-quantity">Số lượng: ${item.quantity}</p>
                            </div>
                            <div class="item-price">
                                <span class="price">${this.api.formatPrice(item.price)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <span class="total-label">Tổng cộng:</span>
                        <span class="total-amount">${formattedTotal}</span>
                    </div>
                    <div class="order-actions">
                        ${this.getOrderActions(order)}
                    </div>
                </div>
            </div>
        `;
    }

    getStatusInfo(status) {
        const statusMap = {
            'pending': { text: 'Chờ xử lý', color: '#f59e0b' },
            'processing': { text: 'Đang xử lý', color: '#3b82f6' },
            'shipped': { text: 'Đang giao', color: '#8b5cf6' },
            'delivered': { text: 'Đã giao', color: '#10b981' },
            'cancelled': { text: 'Đã hủy', color: '#ef4444' }
        };
        return statusMap[status] || { text: status, color: '#6b7280' };
    }

    getOrderActions(order) {
        let actions = '';
        
        if (order.status === 'pending') {
            actions += `<button class="btn btn-outline btn-sm" onclick="cancelOrder('${order._id}')">Hủy đơn</button>`;
        }
        
        if (order.status === 'delivered') {
            actions += `<button class="btn btn-primary btn-sm" onclick="reviewOrder('${order._id}')">Đánh giá</button>`;
        }
        
        actions += `<button class="btn btn-text btn-sm" onclick="openOrderModal('${order._id}')">Chi tiết</button>`;
        
        return actions;
    }

    renderPagination(pagination) {
        const paginationContainer = document.getElementById('ordersPagination');
        
        if (!pagination || pagination.pages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        
        let paginationHTML = '<div class="pagination-content">';
        
        // Previous button
        if (pagination.page > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${pagination.page - 1})">‹ Trước</button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, pagination.page - 2);
        const endPage = Math.min(pagination.pages, pagination.page + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === pagination.page;
            paginationHTML += `<button class="pagination-btn ${isActive ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
        
        // Next button
        if (pagination.page < pagination.pages) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${pagination.page + 1})">Tiếp ›</button>`;
        }
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    async openOrderModal(orderId) {
        try {
            const modal = document.getElementById('orderModal');
            if (!modal) {
                console.error('Order modal not found');
                return;
            }
            
            // Show loading state
            const modalBody = document.getElementById('orderModalBody');
            if (modalBody) {
                modalBody.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>Đang tải chi tiết đơn hàng...</p></div>';
            }
            modal.style.display = 'block';
            
            const response = await this.api.getOrder(orderId);
            console.log('Order response:', response);
            
            // Backend returns: { success: true, data: order }
            // Not: { success: true, data: { order: ... } }
            if (response.success && response.data) {
                // Handle both formats: response.data (direct) or response.data.order (nested)
                const order = response.data.order || response.data;
                if (order && order._id) {
                    this.renderOrderModal(order);
                } else {
                    throw new Error('Order data is invalid');
                }
            } else {
                throw new Error(response.message || 'Invalid response format');
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            const modalBody = document.getElementById('orderModalBody');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <p style="color: #ef4444;">Không thể tải chi tiết đơn hàng.</p>
                        <p style="color: #6b7280; font-size: 0.875rem;">${error.message || 'Vui lòng thử lại sau.'}</p>
                        <button onclick="closeOrderModal()" class="btn btn-outline" style="margin-top: 1rem;">Đóng</button>
                    </div>
                `;
            }
        }
    }

    renderOrderModal(order) {
        const modalBody = document.getElementById('orderModalBody');
        const statusInfo = this.getStatusInfo(order.status);
        
        // Safe access to nested properties
        const shippingAddress = order.shippingAddress || {};
        const payment = order.payment || {};
        const paymentMethod = payment.method || order.paymentMethod || 'Chưa xác định';
        const shippingMethod = order.shippingMethod || 'Giao hàng tiêu chuẩn';
        const statusHistory = order.statusHistory || [];
        const items = order.items || [];
        
        // Format payment method
        const paymentMethodText = {
            'wallet': 'Ví điện tử',
            'cod': 'Thanh toán khi nhận hàng',
            'bank': 'Chuyển khoản ngân hàng',
            'card': 'Thẻ tín dụng/Ghi nợ'
        }[paymentMethod] || paymentMethod;
        
        modalBody.innerHTML = `
            <div class="order-detail">
                <div class="order-header">
                    <h3>Đơn hàng #${order.orderNumber || order._id || 'N/A'}</h3>
                    <span class="status-badge status-${order.status}">${statusInfo.text}</span>
                </div>
                
                <div class="order-info-grid">
                    <div class="info-section">
                        <h4>Thông tin đơn hàng</h4>
                        <p><strong>Ngày đặt:</strong> ${this.formatDate(order.createdAt)}</p>
                        <p><strong>Tổng tiền:</strong> ${this.api.formatPrice ? this.api.formatPrice(order.total) : this.formatPrice(order.total)}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${paymentMethodText}</p>
                        <p><strong>Phương thức giao hàng:</strong> ${shippingMethod}</p>
                        ${order.trackingNumber ? `<p><strong>Mã vận đơn:</strong> ${order.trackingNumber}</p>` : ''}
                    </div>
                    
                    <div class="info-section">
                        <h4>Địa chỉ giao hàng</h4>
                        ${shippingAddress.street ? `<p>${shippingAddress.street}</p>` : ''}
                        ${shippingAddress.city || shippingAddress.state ? 
                            `<p>${[shippingAddress.city, shippingAddress.state].filter(Boolean).join(', ')}</p>` : ''}
                        ${shippingAddress.zipCode || shippingAddress.country ? 
                            `<p>${[shippingAddress.zipCode, shippingAddress.country].filter(Boolean).join(', ')}</p>` : ''}
                        ${!shippingAddress.street && !shippingAddress.city ? '<p>Chưa cập nhật địa chỉ</p>' : ''}
                    </div>
                </div>
                
                <div class="order-items-detail">
                    <h4>Sản phẩm</h4>
                    ${items.length > 0 ? items.map(item => {
                        const product = item.product || {};
                        const imageUrl = product.images && product.images[0] ? 
                            (product.images[0].url || product.images[0]) : 
                            '../../assets/images/placeholder-book.svg';
                        const price = this.api.formatPrice ? this.api.formatPrice(item.price) : this.formatPrice(item.price);
                        
                        return `
                        <div class="order-item-detail">
                            <img src="${imageUrl}" 
                                 alt="${product.title || 'Sản phẩm'}" 
                                 class="item-image"
                                 onerror="this.src='../../assets/images/placeholder-book.svg'" />
                            <div class="item-info">
                                <h5>${product.title || 'N/A'}</h5>
                                ${product.author ? `<p>Tác giả: ${product.author}</p>` : ''}
                                <p>Số lượng: ${item.quantity || 1}</p>
                                <p>Giá: ${price}</p>
                            </div>
                        </div>
                    `;
                    }).join('') : '<p>Không có sản phẩm</p>'}
                </div>
                
                ${statusHistory.length > 0 ? `
                <div class="order-timeline">
                    <h4>Lịch sử đơn hàng</h4>
                    ${statusHistory.map(status => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <p><strong>${this.getStatusInfo(status.status || status).text}</strong></p>
                                <p class="timeline-date">${this.formatDate(status.updatedAt || status.date || order.updatedAt)}</p>
                                ${status.note ? `<p class="timeline-note">${status.note}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }
    
    formatPrice(price) {
        if (!price || price === 0) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price);
    }

    async cancelOrder(orderId) {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }
        
        try {
            const response = await this.api.updateOrderStatus(orderId, 'cancelled');
            if (response.success) {
                this.showSuccess('Đơn hàng đã được hủy thành công!');
                this.loadOrders();
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            this.showError('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
    }

    reviewOrder(orderId) {
        // Redirect to review page
        window.location.href = `../../pages/products/review.php?order=${orderId}`;
    }

    showLoading() {
        document.getElementById('ordersLoading').style.display = 'block';
        document.getElementById('ordersList').style.display = 'none';
        document.getElementById('ordersEmpty').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('ordersLoading').style.display = 'none';
    }

    showError(message) {
        // Create toast notification
        this.createToast(message, 'error');
    }

    showSuccess(message) {
        this.createToast(message, 'success');
    }

    createToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global functions
function openOrderModal(orderId) {
    window.ordersManager.openOrderModal(orderId);
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function cancelOrder(orderId) {
    window.ordersManager.cancelOrder(orderId);
}

function reviewOrder(orderId) {
    window.ordersManager.reviewOrder(orderId);
}

function changePage(page) {
    window.ordersManager.currentPage = page;
    window.ordersManager.loadOrders();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for API to be available
    function initOrders() {
        if (typeof api !== 'undefined' && typeof window.api !== 'undefined') {
            window.ordersManager = new OrdersManager();
            console.log('✅ Orders Manager initialized');
        } else if (typeof window.api !== 'undefined') {
            window.ordersManager = new OrdersManager();
            console.log('✅ Orders Manager initialized');
        } else {
            console.warn('API not loaded, retrying...');
            setTimeout(initOrders, 100);
        }
    }
    
    initOrders();
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('orderModal');
            if (modal && modal.style.display !== 'none') {
                closeOrderModal();
            }
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);