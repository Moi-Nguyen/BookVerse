// Orders Management for Seller
(function() {
    'use strict';
    
    // Wait for API to be available
    function initOrdersPage() {
        if (typeof api === 'undefined' && typeof window.api === 'undefined') {
            setTimeout(initOrdersPage, 100);
            return;
        }
        
        // Ensure api is available
        if (typeof api === 'undefined' && typeof window.api !== 'undefined') {
            window.api = window.api;
        }
        
        const ordersManager = new SellerOrdersManager();
        window.sellerOrdersManager = ordersManager;
        
        console.log('✅ Orders Manager initialized');
    }
    
    // Wait for DOM and scripts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOrdersPage);
    } else {
        // Small delay to ensure all scripts are loaded
        setTimeout(initOrdersPage, 100);
    }
    
    class SellerOrdersManager {
        constructor() {
            this.orders = [];
            this.filteredOrders = [];
            this.currentPage = 1;
            this.limit = 10;
            this.totalPages = 1;
            this.filters = {
                search: '',
                status: '',
                date: '',
                sort: '-createdAt'
            };
            this.selectedOrders = new Set();
            this.currentView = 'table';
            
            this.init();
        }
        
        init() {
            this.loadOrders();
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            // Search
            const searchInput = document.getElementById('orderSearch');
            const searchBtn = document.getElementById('searchBtn');
            
            // Debounce function for search
            let searchTimeout;
            const debouncedSearch = () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentPage = 1;
                    this.applyFilters();
                }, 300);
            };
            
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filters.search = e.target.value.trim();
                    debouncedSearch();
                });
                
                // Allow Enter key to search immediately
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        clearTimeout(searchTimeout);
                        this.currentPage = 1;
                        this.applyFilters();
                    }
                });
            }
            
            if (searchBtn) {
                searchBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    clearTimeout(searchTimeout);
                    this.currentPage = 1;
                    this.applyFilters();
                });
            }
            
            // Filters
            const statusFilter = document.getElementById('statusFilter');
            const dateFilter = document.getElementById('dateFilter');
            const sortFilter = document.getElementById('sortFilter');
            
            if (statusFilter) {
                statusFilter.addEventListener('change', (e) => {
                    this.filters.status = e.target.value;
                    this.currentPage = 1;
                    this.loadOrders();
                });
            }
            
            if (dateFilter) {
                dateFilter.addEventListener('change', (e) => {
                    this.filters.date = e.target.value;
                    this.currentPage = 1;
                    this.loadOrders();
                });
            }
            
            if (sortFilter) {
                sortFilter.addEventListener('change', (e) => {
                    this.filters.sort = e.target.value;
                    this.currentPage = 1;
                    this.loadOrders();
                });
            }
            
            // View toggle
            const viewButtons = document.querySelectorAll('.view-btn');
            if (viewButtons.length > 0) {
                viewButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const view = e.currentTarget.dataset.view;
                        if (view) {
                            this.switchView(view);
                        }
                    });
                });
            }
            
            // Refresh button
            const refreshBtn = document.getElementById('refreshOrdersBtn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadOrders());
            }
            
            // Select all
            const selectAll = document.getElementById('selectAllOrders');
            if (selectAll) {
                selectAll.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    document.querySelectorAll('.order-checkbox').forEach(cb => {
                        cb.checked = checked;
                        const orderId = cb.dataset.orderId;
                        if (checked) {
                            this.selectedOrders.add(orderId);
                        } else {
                            this.selectedOrders.delete(orderId);
                        }
                    });
                    this.updateBatchActions();
                });
            }
            
            // Batch actions
            document.getElementById('batchProcess')?.addEventListener('click', () => this.batchUpdateStatus('processing'));
            document.getElementById('batchShip')?.addEventListener('click', () => this.batchUpdateStatus('shipped'));
            document.getElementById('batchCancel')?.addEventListener('click', () => this.batchUpdateStatus('cancelled'));
            
            // Modal close
            document.getElementById('closeOrderModal')?.addEventListener('click', () => this.closeOrderModal());
            document.getElementById('closeOrderModalOverlay')?.addEventListener('click', () => this.closeOrderModal());
            document.getElementById('closeOrderDetail')?.addEventListener('click', () => this.closeOrderModal());
            document.getElementById('closeStatusModal')?.addEventListener('click', () => this.closeStatusModal());
            document.getElementById('cancelStatusUpdate')?.addEventListener('click', () => this.closeStatusModal());
            
            // Update status form
            document.getElementById('updateStatusForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateOrderStatus();
            });
        }
        
        async loadOrders() {
            try {
                this.showLoading();
                
                // Build query params
                const params = new URLSearchParams({
                    page: this.currentPage,
                    limit: this.limit,
                    sort: this.filters.sort.split('-')[1] || this.filters.sort,
                    order: this.filters.sort.startsWith('-') ? 'desc' : 'asc'
                });
                
                if (this.filters.status) {
                    params.append('status', this.filters.status);
                }
                
                // Date filter
                if (this.filters.date) {
                    const dateRange = this.getDateRange(this.filters.date);
                    if (dateRange.start) {
                        params.append('startDate', dateRange.start);
                    }
                    if (dateRange.end) {
                        params.append('endDate', dateRange.end);
                    }
                }
                
                const response = await api.request(`/orders/seller/my-orders?${params.toString()}`);
                
                if (response && response.success && response.data) {
                    this.orders = response.data.orders || [];
                    this.totalPages = response.data.pagination?.pages || 1;
                    
                    // Apply search filter
                    this.applyFilters();
                } else {
                    throw new Error('Failed to load orders');
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                this.showError('Không thể tải đơn hàng. Vui lòng thử lại.');
            } finally {
                this.hideLoading();
            }
        }
        
        applyFilters() {
            let filtered = [...this.orders];
            
            // Search filter
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase();
                filtered = filtered.filter(order => {
                    const orderNumber = order.orderNumber || order._id.toString();
                    const customerName = order.customer?.username || 
                                       order.customer?.profile?.firstName || 
                                       order.customer?.email || '';
                    return orderNumber.toLowerCase().includes(search) ||
                           customerName.toLowerCase().includes(search);
                });
            }
            
            this.filteredOrders = filtered;
            this.renderOrders();
        }
        
        renderOrders() {
            if (this.filteredOrders.length === 0) {
                this.showEmpty();
                return;
            }
            
            this.hideEmpty();
            
            if (this.currentView === 'table') {
                this.renderTableView();
            } else {
                this.renderCardsView();
            }
            
            this.renderPagination();
        }
        
        renderTableView() {
            const tbody = document.getElementById('ordersTableBody');
            if (!tbody) return;
            
            const tableContainer = document.getElementById('ordersTable');
            if (tableContainer) tableContainer.style.display = 'block';
            
            const cardsContainer = document.getElementById('ordersCards');
            if (cardsContainer) cardsContainer.style.display = 'none';
            
            tbody.innerHTML = this.filteredOrders.map(order => {
                const orderNumber = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
                const customerName = order.customer?.username || 
                                   order.customer?.profile?.firstName || 
                                   order.customer?.email || 
                                   'Khách hàng';
                const status = this.getStatusText(order.status);
                const statusClass = this.getStatusClass(order.status);
                
                // Calculate seller's total from items
                const sellerItems = order.items?.filter(item => 
                    item.seller && item.seller.toString() === (order.items[0]?.seller?.toString() || '')
                ) || [];
                const total = sellerItems.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0
                );
                
                const productCount = sellerItems.length;
                const productNames = sellerItems.slice(0, 2)
                    .map(item => item.product?.title || 'Sản phẩm')
                    .join(', ');
                const productDisplay = productCount > 2 
                    ? `${productNames}... (+${productCount - 2})`
                    : productNames;
                
                return `
                    <tr>
                        <td>
                            <input type="checkbox" class="order-checkbox" data-order-id="${order._id}" />
                        </td>
                        <td><strong>${orderNumber}</strong></td>
                        <td>${this.escapeHtml(customerName)}</td>
                        <td title="${this.escapeHtml(productDisplay)}">${productCount} sản phẩm</td>
                        <td><strong>${this.formatPrice(total)}</strong></td>
                        <td><span class="order-status ${statusClass}">${status}</span></td>
                        <td>${this.formatDate(order.createdAt)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="window.sellerOrdersManager.viewOrder('${order._id}')">
                                Xem
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            // Add checkbox listeners
            document.querySelectorAll('.order-checkbox').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const orderId = e.target.dataset.orderId;
                    if (e.target.checked) {
                        this.selectedOrders.add(orderId);
                    } else {
                        this.selectedOrders.delete(orderId);
                    }
                    this.updateBatchActions();
                });
            });
        }
        
        renderCardsView() {
            const container = document.getElementById('ordersCards');
            if (!container) return;
            
            const tableContainer = document.getElementById('ordersTable');
            if (tableContainer) tableContainer.style.display = 'none';
            
            container.style.display = 'grid';
            
            container.innerHTML = this.filteredOrders.map(order => {
                const orderNumber = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
                const customerName = order.customer?.username || 
                                   order.customer?.profile?.firstName || 
                                   order.customer?.email || 
                                   'Khách hàng';
                const status = this.getStatusText(order.status);
                const statusClass = this.getStatusClass(order.status);
                
                const sellerItems = order.items?.filter(item => 
                    item.seller && item.seller.toString() === (order.items[0]?.seller?.toString() || '')
                ) || [];
                const total = sellerItems.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0
                );
                
                return `
                    <div class="order-card">
                        <div class="order-card-header">
                            <div>
                                <h3>${orderNumber}</h3>
                                <p>${this.escapeHtml(customerName)}</p>
                            </div>
                            <span class="order-status ${statusClass}">${status}</span>
                        </div>
                        <div class="order-card-body">
                            <p><strong>Tổng tiền:</strong> ${this.formatPrice(total)}</p>
                            <p><strong>Ngày đặt:</strong> ${this.formatDate(order.createdAt)}</p>
                        </div>
                        <div class="order-card-footer">
                            <button class="btn btn-sm btn-primary" onclick="window.sellerOrdersManager.viewOrder('${order._id}')">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        renderPagination() {
            const container = document.getElementById('ordersPagination');
            if (!container || this.totalPages <= 1) {
                if (container) container.style.display = 'none';
                return;
            }
            
            container.style.display = 'flex';
            
            let html = '';
            
            // Previous button
            html += `
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="window.sellerOrdersManager.goToPage(${this.currentPage - 1})">
                    ← Trước
                </button>
            `;
            
            // Page numbers
            for (let i = 1; i <= this.totalPages; i++) {
                if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    html += `
                        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                                onclick="window.sellerOrdersManager.goToPage(${i})">
                            ${i}
                        </button>
                    `;
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    html += `<span class="pagination-ellipsis">...</span>`;
                }
            }
            
            // Next button
            html += `
                <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} 
                        onclick="window.sellerOrdersManager.goToPage(${this.currentPage + 1})">
                    Sau →
                </button>
            `;
            
            container.innerHTML = html;
        }
        
        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.loadOrders();
        }
        
        switchView(view) {
            if (!view) return;
            
            this.currentView = view;
            const viewButtons = document.querySelectorAll('.view-btn');
            viewButtons.forEach(btn => {
                if (btn.dataset.view === view) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            this.renderOrders();
        }
        
        async viewOrder(orderId) {
            try {
                const response = await api.request(`/orders/${orderId}`);
                if (response && response.success && response.data) {
                    this.showOrderDetail(response.data);
                } else {
                    throw new Error('Failed to load order details');
                }
            } catch (error) {
                console.error('Error loading order details:', error);
                const errorMsg = error.message?.includes('403') || error.message?.includes('Forbidden')
                    ? 'Bạn không có quyền xem đơn hàng này.'
                    : 'Không thể tải chi tiết đơn hàng.';
                this.showError(errorMsg);
            }
        }
        
        showOrderDetail(order) {
            const modal = document.getElementById('orderDetailModal');
            const content = document.getElementById('orderDetailContent');
            const orderNumber = document.getElementById('modalOrderNumber');
            const updateStatusBtn = document.getElementById('updateOrderStatus');
            
            if (!modal || !content || !orderNumber) return;
            
            // Store order ID in modal for status update
            if (modal) modal.dataset.orderId = order._id;
            
            const orderNumberText = order.orderNumber || `BV${order._id.toString().slice(-12).toUpperCase()}`;
            orderNumber.textContent = `Chi tiết đơn hàng ${orderNumberText}`;
            
            // Setup update status button
            if (updateStatusBtn) {
                updateStatusBtn.onclick = () => {
                    this.closeOrderModal();
                    this.openStatusModal(order);
                };
            }
            
            const sellerItems = order.items?.filter(item => 
                item.seller && item.seller.toString() === (order.items[0]?.seller?.toString() || '')
            ) || [];
            const total = sellerItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            
            // Format date for display
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Get customer info
            const customerName = order.customer?.username || 
                               order.customer?.profile?.firstName || 
                               order.customer?.email || 
                               'N/A';
            const customerEmail = order.shippingAddress?.email || 
                                order.customer?.email || 
                                'N/A';
            const customerAddress = order.shippingAddress?.address || 
                                  order.shippingAddress?.fullAddress || 
                                  'N/A';
            const customerPhone = order.shippingAddress?.phone || 
                                order.shippingAddress?.phoneNumber || 
                                customerEmail;
            
            content.innerHTML = `
                <div class="order-detail-grid">
                    <div class="order-detail-section">
                        <h3 class="section-title">Thông tin khách hàng</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Tên</span>
                                <span class="info-value">${this.escapeHtml(customerName)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Email</span>
                                <span class="info-value">${this.escapeHtml(customerEmail)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Địa chỉ</span>
                                <span class="info-value">${this.escapeHtml(customerAddress)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Số điện thoại</span>
                                <span class="info-value">${this.escapeHtml(customerPhone)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-detail-section">
                        <h3 class="section-title">Sản phẩm</h3>
                        <div class="order-items-wrapper">
                            <table class="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sellerItems.map(item => `
                                        <tr>
                                            <td class="product-name">${this.escapeHtml(item.product?.title || 'N/A')}</td>
                                            <td class="text-center">${item.quantity}</td>
                                            <td class="text-right">${this.formatPrice(item.price)}</td>
                                            <td class="text-right"><strong>${this.formatPrice(item.price * item.quantity)}</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr class="total-row">
                                        <td colspan="3" class="text-right"><strong>Tổng cộng</strong></td>
                                        <td class="text-right"><strong class="grand-total">${this.formatPrice(total)}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    
                    <div class="order-detail-section">
                        <h3 class="section-title">Trạng thái</h3>
                        <div class="status-info">
                            <div class="status-item">
                                <span class="status-label">Trạng thái hiện tại</span>
                                <span class="order-status-badge ${this.getStatusClass(order.status)}">${this.getStatusText(order.status)}</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Ngày đặt</span>
                                <span class="status-value">${formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
        
        closeOrderModal() {
            const modal = document.getElementById('orderDetailModal');
            if (modal) modal.style.display = 'none';
        }
        
        openStatusModal(order) {
            const modal = document.getElementById('updateStatusModal');
            const statusSelect = document.getElementById('newStatus');
            const notesTextarea = document.getElementById('statusNotes');
            const trackingInput = document.getElementById('trackingNumber');
            
            if (!modal) return;
            
            // Store order ID
            modal.dataset.orderId = order._id;
            
            // Set current status
            if (statusSelect) {
                statusSelect.value = '';
                // Disable current status option
                Array.from(statusSelect.options).forEach(opt => {
                    opt.disabled = opt.value === order.status;
                });
            }
            
            // Clear form
            if (notesTextarea) notesTextarea.value = '';
            if (trackingInput) trackingInput.value = '';
            
            modal.style.display = 'flex';
        }
        
        closeStatusModal() {
            const modal = document.getElementById('updateStatusModal');
            if (modal) {
                modal.style.display = 'none';
                delete modal.dataset.orderId;
            }
        }
        
        async updateOrderStatus() {
            const statusSelect = document.getElementById('newStatus');
            const notesTextarea = document.getElementById('statusNotes');
            const trackingInput = document.getElementById('trackingNumber');
            const saveBtn = document.getElementById('saveStatusUpdate');
            const btnText = saveBtn.querySelector('.btn-text');
            const btnLoading = saveBtn.querySelector('.btn-loading');
            
            if (!statusSelect || !statusSelect.value) {
                this.showError('Vui lòng chọn trạng thái mới');
                return;
            }
            
            const status = statusSelect.value;
            const note = notesTextarea?.value || '';
            const trackingNumber = trackingInput?.value || '';
            
            // Get current order ID from status modal
            const modal = document.getElementById('updateStatusModal');
            const orderId = modal?.dataset.orderId;
            
            if (!orderId) {
                this.showError('Không tìm thấy ID đơn hàng');
                return;
            }
            
            try {
                // Show loading
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                saveBtn.disabled = true;
                
                const response = await api.request(`/orders/${orderId}/status`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        status: status,
                        note: note,
                        trackingNumber: trackingNumber
                    })
                });
                
                if (response && response.success) {
                    this.showError('Cập nhật trạng thái thành công!', 'success');
                    this.closeStatusModal();
                    this.loadOrders(); // Reload orders
                } else {
                    throw new Error(response?.message || 'Failed to update status');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                this.showError(error.message || 'Không thể cập nhật trạng thái đơn hàng.');
            } finally {
                // Hide loading
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                saveBtn.disabled = false;
            }
        }
        
        async batchUpdateStatus(status) {
            if (this.selectedOrders.size === 0) {
                this.showError('Vui lòng chọn ít nhất một đơn hàng');
                return;
            }
            
            if (!confirm(`Bạn có chắc chắn muốn cập nhật ${this.selectedOrders.size} đơn hàng sang trạng thái "${this.getStatusText(status)}"?`)) {
                return;
            }
            
            try {
                const orderIds = Array.from(this.selectedOrders);
                let successCount = 0;
                let failCount = 0;
                
                for (const orderId of orderIds) {
                    try {
                        const response = await api.request(`/orders/${orderId}/status`, {
                            method: 'PUT',
                            body: JSON.stringify({ status: status })
                        });
                        
                        if (response && response.success) {
                            successCount++;
                        } else {
                            failCount++;
                        }
                    } catch (error) {
                        console.error(`Error updating order ${orderId}:`, error);
                        failCount++;
                    }
                }
                
                if (successCount > 0) {
                    this.showError(`Đã cập nhật ${successCount} đơn hàng thành công!`, 'success');
                    this.selectedOrders.clear();
                    this.updateBatchActions();
                    this.loadOrders(); // Reload orders
                }
                
                if (failCount > 0) {
                    this.showError(`${failCount} đơn hàng cập nhật thất bại.`);
                }
            } catch (error) {
                console.error('Error in batch update:', error);
                this.showError('Có lỗi xảy ra khi cập nhật đơn hàng.');
            }
        }
        
        updateBatchActions() {
            const batchActions = document.getElementById('batchActions');
            const selectedCount = document.getElementById('selectedCount');
            
            if (this.selectedOrders.size > 0) {
                if (batchActions) batchActions.style.display = 'flex';
                if (selectedCount) selectedCount.textContent = this.selectedOrders.size;
            } else {
                if (batchActions) batchActions.style.display = 'none';
            }
        }
        
        getDateRange(dateFilter) {
            const now = new Date();
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            
            switch (dateFilter) {
                case 'today':
                    return { start: start.toISOString(), end: now.toISOString() };
                case 'week':
                    start.setDate(start.getDate() - 7);
                    return { start: start.toISOString(), end: now.toISOString() };
                case 'month':
                    start.setMonth(start.getMonth() - 1);
                    return { start: start.toISOString(), end: now.toISOString() };
                case 'quarter':
                    start.setMonth(start.getMonth() - 3);
                    return { start: start.toISOString(), end: now.toISOString() };
                default:
                    return { start: null, end: null };
            }
        }
        
        getStatusText(status) {
            const statusMap = {
                'pending': 'Chờ xử lý',
                'processing': 'Đang xử lý',
                'shipped': 'Đã gửi',
                'delivered': 'Đã giao',
                'completed': 'Hoàn thành',
                'cancelled': 'Đã hủy'
            };
            return statusMap[status] || status;
        }
        
        getStatusClass(status) {
            const statusMap = {
                'pending': 'pending',
                'processing': 'processing',
                'shipped': 'shipped',
                'delivered': 'delivered',
                'completed': 'delivered',
                'cancelled': 'cancelled'
            };
            return statusMap[status] || 'pending';
        }
        
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price || 0);
        }
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        showLoading() {
            const loading = document.getElementById('ordersLoading');
            if (loading) loading.style.display = 'flex';
        }
        
        hideLoading() {
            const loading = document.getElementById('ordersLoading');
            if (loading) loading.style.display = 'none';
        }
        
        showEmpty() {
            const empty = document.getElementById('ordersEmpty');
            if (empty) empty.style.display = 'block';
        }
        
        hideEmpty() {
            const empty = document.getElementById('ordersEmpty');
            if (empty) empty.style.display = 'none';
        }
        
        showError(message, type = 'error') {
            if (typeof showToast === 'function') {
                showToast(message, type);
            } else {
                alert(message);
            }
        }
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }
})();
