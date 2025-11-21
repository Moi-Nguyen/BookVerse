// Seller Dashboard functionality for Bookverse

class SellerDashboard {
    constructor() {
        this.chart = null;
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            category: '',
            status: '',
            sort: 'newest'
        };
        this.refreshInterval = null;
        this.refreshRate = 30000; // Refresh every 30 seconds
        
        this.initializeEventListeners();
        // Load dashboard data asynchronously to avoid blocking
        this.loadDashboardData().catch(err => {
            console.error('Failed to load dashboard data in constructor:', err);
        });
        this.initializeChart();
        // Don't load products on dashboard page - only on products page
        // this.loadProducts();
        this.startAutoRefresh();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add product modal
        const addProductBtn = document.getElementById('addProductBtn');
        console.log('🔘 Add Product Button:', addProductBtn);
        
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                console.log('✅ Add Product Button clicked!');
                this.openAddProductModal();
            });
        } else {
            console.error('❌ Add Product Button not found!');
        }

        document.getElementById('closeAddProductModal')?.addEventListener('click', () => {
            this.closeAddProductModal();
        });

        document.getElementById('cancelAddProduct')?.addEventListener('click', () => {
            this.closeAddProductModal();
        });

        // Add product form
        document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAddProduct();
        });

        // Image preview
        document.getElementById('productImages')?.addEventListener('change', (e) => {
            this.previewImages(e.target.files);
        });

        // Chart period change
        document.getElementById('chartPeriod')?.addEventListener('change', (e) => {
            this.updateChart(e.target.value);
        });

        // Analytics button
        document.getElementById('viewAnalyticsBtn')?.addEventListener('click', () => {
            window.location.href = 'analytics.php';
        });

        // Close modal on outside click
        document.getElementById('addProductModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'addProductModal') {
                this.closeAddProductModal();
            }
        });

        // Products page event listeners
        this.initializeProductsEventListeners();
    }

    // Initialize products page event listeners
    initializeProductsEventListeners() {
        // Search functionality
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.filterProducts();
        });

        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.filterProducts();
        });

        // Filter controls
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.filterProducts();
        });

        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.filterProducts();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.sortProducts();
        });

        // Product actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                const action = e.target.dataset.action;
                const productId = e.target.dataset.productId;
                this.handleProductAction(action, productId);
            }
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.goToPage(page);
                }
            }
        });

        // Batch operations
        document.getElementById('batchActionsBtn')?.addEventListener('click', () => {
            this.showBatchActions();
        });
    }

    // Load dashboard data
    async loadDashboardData() {
        console.log('🚀 Starting to load dashboard data...');
        
        try {
            // Show loading state
            this.showLoadingState();
            
            // Call real API
            console.log('📡 Calling api.getSellerDashboard()...');
            const response = await api.getSellerDashboard();
            console.log('📦 API Response:', response);
            
            // Handle response - check if it's successful or has data
            if (response && (response.success === true || response.data)) {
                console.log('✅ API call successful!');
                const { stats, growth, recentOrders, lowStockProducts, topProducts, quickStats, salesChartData } = response.data;
                
                // Update stats cards
                if (stats) {
                    console.log('📊 Updating stats cards with:', stats);
                    this.updateStatsCards(stats);
                } else {
                    console.warn('⚠️ No stats data received');
                }
                
                // Update growth percentages
                if (growth) {
                    this.updateGrowthIndicators(growth);
                }
                
                // Update quick stats
                if (quickStats) {
                    this.updateQuickStats(quickStats);
                }
                
                // Store dashboard data for later use
                this.dashboardData = response.data;
                
                // Update recent orders table (always update, even if empty)
                this.updateRecentOrdersTable(recentOrders || []);
                
                // Update low stock alerts (always update, even if empty)
                this.updateLowStockAlerts(lowStockProducts || []);
                
                // Update top products (always update, even if empty)
                this.displayTopProducts(topProducts || []);
                
                // Load recent reviews and notifications
                this.loadRecentReviews();
                this.loadNotifications();
                
                // Update sales chart
                if (salesChartData && salesChartData.length > 0) {
                    this.updateSalesChart(salesChartData);
                }
                
                console.log('✅ Dashboard data loaded successfully!');
            } else {
                // If response exists but no success/data, log warning but don't throw
                console.warn('⚠️ API response format unexpected:', response);
                // Try to use response.data if it exists even without success flag
                if (response && response.data) {
                    const { stats, growth, recentOrders, lowStockProducts, topProducts, quickStats, salesChartData } = response.data;
                    if (stats) this.updateStatsCards(stats);
                    if (growth) this.updateGrowthIndicators(growth);
                    if (quickStats) this.updateQuickStats(quickStats);
                    if (recentOrders) this.updateRecentOrdersTable(recentOrders);
                    if (topProducts) this.displayTopProducts(topProducts);
                    if (salesChartData && salesChartData.length > 0) this.updateSalesChart(salesChartData);
                    console.log('✅ Dashboard data loaded from response.data!');
                } else {
                    // Only throw if truly no data
                    throw new Error('API response was not successful and no data available');
                }
            }
            
            // Hide loading state
            this.hideLoadingState();
            
        } catch (error) {
            console.error('❌ Error loading dashboard data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            
            // Hide loading
            this.hideLoadingState();
            
            // Only show error toast if it's a real error (not just missing optional data)
            // Check if it's a network error or authentication error
            const isNetworkError = !navigator.onLine || error.message?.includes('fetch') || error.message?.includes('network');
            const isAuthError = error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('token');
            
            if (isNetworkError || isAuthError) {
                this.showToast('Không thể tải dữ liệu dashboard. Vui lòng thử lại.', 'error');
            this.showErrorState();
            } else {
                // For other errors, just log and try to show partial data
                console.warn('⚠️ Partial data load failed, continuing with available data');
                // Don't show error state, just continue
            }
        }
    }
    
    // Show loading state
    showLoadingState() {
        const statsCards = document.querySelectorAll('[data-stat]');
        statsCards.forEach(el => {
            el.textContent = '⏳';
        });
    }
    
    // Hide loading state
    hideLoadingState() {
        // Loading state will be replaced by actual data
    }
    
    // Show error state
    showErrorState() {
        const statsCards = document.querySelectorAll('[data-stat]');
        statsCards.forEach(el => {
            el.textContent = '❌';
        });
    }

    // Load dashboard stats
    async loadStats() {
        try {
            const response = await api.getSellerStats();
            if (response.success) {
                const stats = response.data;
                
                document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
                document.getElementById('totalRevenue').textContent = this.formatPrice(stats.totalRevenue || 0);
                document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
                document.getElementById('averageRating').textContent = (stats.averageRating || 0).toFixed(1);
                
                // Update quick stats
                document.getElementById('todaySales').textContent = this.formatPrice(stats.todaySales || 0);
                document.getElementById('weekSales').textContent = this.formatPrice(stats.weekSales || 0);
                document.getElementById('monthSales').textContent = this.formatPrice(stats.monthSales || 0);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // Load recent orders
    async loadRecentOrders() {
        try {
            const response = await api.getSellerOrders({ limit: 5 });
            if (response.success && response.data.orders) {
                this.displayRecentOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error loading recent orders:', error);
        }
    }

    // Display recent orders
    displayRecentOrders(orders) {
        const tableBody = document.getElementById('recentOrdersTable');
        if (!tableBody) return;

        if (orders.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">Chưa có đơn hàng nào</td>
                </tr>
            `;
            return;
        }

        const ordersHTML = orders.map(order => `
            <tr>
                <td>#${order.orderNumber}</td>
                <td>${this.escapeHtml(order.customer.name)}</td>
                <td>${order.items.length} sản phẩm</td>
                <td>${this.formatPrice(order.total)}</td>
                <td><span class="order-status ${order.status}">${this.getStatusText(order.status)}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="sellerDashboard.viewOrder('${order._id}')">
                        Xem
                    </button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = ordersHTML;
    }

    // Load top products
    async loadTopProducts() {
        try {
            const response = await api.getSellerProducts({ limit: 4, sort: 'sales' });
            if (response.success && response.data.products) {
                this.displayTopProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error loading top products:', error);
        }
    }

    // Display top products
    displayTopProducts(products) {
        const container = document.getElementById('topProductsGrid');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--text-secondary);">Chưa có sản phẩm nào</p>';
            return;
        }

        const productsHTML = products.map(product => {
            const imageUrl = product.images && product.images.length > 0 
                ? (product.images[0].url || product.images[0]) 
                : '../../assets/images/placeholder-book.svg';
            const soldCount = product.sales || product.soldCount || 0;
            const rating = product.rating?.average || 0;
            
            return `
                <div class="product-card" style="cursor: pointer;" onclick="window.location.href='products.php?id=${product._id}'">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.title || 'Sản phẩm')}" 
                         class="product-image"
                         onerror="this.src='../../assets/images/placeholder-book.svg'">
                    <h4 class="product-title">${this.escapeHtml(product.title || 'N/A')}</h4>
                    <p class="product-author">${this.escapeHtml(product.author || 'N/A')}</p>
                    <div class="product-price">${this.formatPrice(product.price || 0)}</div>
                <div class="product-stats">
                        <span>Đã bán: ${soldCount}</span>
                        ${rating > 0 ? `<span>⭐ ${rating.toFixed(1)}</span>` : ''}
                </div>
            </div>
            `;
        }).join('');

        container.innerHTML = productsHTML;
    }

    // Load recent reviews
    async loadRecentReviews() {
        try {
            // Try to get reviews from dashboard data first
            if (this.dashboardData && this.dashboardData.recentReviews) {
                this.displayRecentReviews(this.dashboardData.recentReviews);
                return;
            }
            
            // Fallback to API call
            const response = await api.getSellerReviews({ limit: 3 });
            if (response.success && response.data.reviews) {
                this.displayRecentReviews(response.data.reviews);
            }
        } catch (error) {
            console.error('Error loading recent reviews:', error);
            // Show empty state
            const container = document.getElementById('recentReviews');
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Chưa có đánh giá nào</p>';
            }
        }
    }

    // Display recent reviews
    displayRecentReviews(reviews) {
        const container = document.getElementById('recentReviews');
        if (!container) return;

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-center">Chưa có đánh giá nào</p>';
            return;
        }

        const reviewsHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-rating">${this.generateStars(review.rating)}</span>
                    <span class="review-customer">${this.escapeHtml(review.customer.name)}</span>
                </div>
                <p class="review-text">${this.escapeHtml(review.comment)}</p>
            </div>
        `).join('');

        container.innerHTML = reviewsHTML;
    }

    // Load notifications
    async loadNotifications() {
        try {
            const response = await api.getSellerNotifications({ limit: 5 });
            if (response.success && response.data.notifications) {
                this.displayNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Display notifications
    displayNotifications(notifications) {
        const container = document.getElementById('notificationsList');
        if (!container) return;

        if (notifications.length === 0) {
            container.innerHTML = '<p class="text-center">Không có thông báo mới</p>';
            return;
        }

        const notificationsHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}">
                <div class="notification-text">${this.escapeHtml(notification.message)}</div>
                <div class="notification-time">${this.formatDate(notification.createdAt)}</div>
			</div>
        `).join('');

        container.innerHTML = notificationsHTML;
    }

    // Initialize chart
    initializeChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;

        // This would typically use Chart.js or similar
        // For now, we'll create a simple placeholder
        const ctx = canvas.getContext('2d');
        this.drawSimpleChart(ctx);
    }

    // Draw simple chart
    drawSimpleChart(ctx) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw placeholder
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Biểu đồ doanh thu sẽ được hiển thị ở đây', width / 2, height / 2);
    }

    // Update chart
    async updateChart(period) {
        console.log('Updating chart for period:', period);
        try {
            // Reload dashboard data with new period
            const response = await api.getSellerDashboard({ period: parseInt(period) });
            if (response && response.success && response.data.salesChartData) {
                this.updateSalesChart(response.data.salesChartData);
            } else {
                // Fallback: reload all dashboard data
                this.loadDashboardData();
            }
        } catch (error) {
            console.error('Error updating chart:', error);
            // Fallback: reload all dashboard data
            this.loadDashboardData();
        }
    }

    // Open add product modal
    openAddProductModal() {
        console.log('📦 Opening Add Product Modal...');
        const modal = document.getElementById('addProductModal');
        console.log('Modal element:', modal);
        
        if (modal) {
            modal.classList.add('show');
            console.log('✅ Modal opened! Classes:', modal.className);
            this.loadCategories();
        } else {
            console.error('❌ Modal element not found!');
        }
    }

    // Close add product modal
    closeAddProductModal() {
        const modal = document.getElementById('addProductModal');
        if (modal) {
            modal.classList.remove('show');
            this.resetAddProductForm();
        }
    }

    // Load categories for product form
    async loadCategories() {
        try {
            const response = await api.getCategories();
            if (response.success && response.data.categories) {
                const categorySelect = document.getElementById('productCategory');
                if (categorySelect) {
                    categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
                    response.data.categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category._id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Preview images
    previewImages(files) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;

        preview.innerHTML = '';

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Submit add product form
    async submitAddProduct() {
        const form = document.getElementById('addProductForm');
        if (!form) return;

        const formData = new FormData(form);
        const productData = {
            title: formData.get('title'),
            author: formData.get('author'),
            publisher: formData.get('publisher'),
            price: parseFloat(formData.get('price')),
            originalPrice: parseFloat(formData.get('originalPrice')) || null,
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description')
        };

        try {
            const response = await api.createProduct(productData);
            if (response.success) {
                this.showToast('Sản phẩm đã được thêm thành công', 'success');
                this.closeAddProductModal();
                this.loadDashboardData(); // Refresh data
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            this.showToast(error.message || 'Không thể thêm sản phẩm', 'error');
        }
    }

    // Reset add product form
    resetAddProductForm() {
        const form = document.getElementById('addProductForm');
        if (form) {
            form.reset();
            document.getElementById('imagePreview').innerHTML = '';
        }
    }

    // View order details
    viewOrder(orderId) {
        window.location.href = `orders.php?id=${orderId}`;
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'shipped': 'Đã giao',
            'delivered': 'Đã nhận',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
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
    
    // Update stats cards with real data from API
    updateStatsCards(stats) {
        console.log('📊 Updating stats cards:', stats);
        
        // Update total products
        const totalProductsEl = document.querySelector('[data-stat="totalProducts"]');
        if (totalProductsEl) {
            const value = stats.totalProducts || 0;
            totalProductsEl.textContent = value;
            totalProductsEl.style.opacity = '1';
            console.log('✅ Total products updated:', value);
        } else {
            console.error('❌ Element [data-stat="totalProducts"] not found!');
        }
        
        // Update active products  
        const activeProductsEl = document.querySelector('[data-stat="activeProducts"]');
        if (activeProductsEl) {
            activeProductsEl.textContent = stats.activeProducts || 0;
        }
        
        // Update total orders
        const totalOrdersEl = document.querySelector('[data-stat="totalOrders"]');
        if (totalOrdersEl) {
            const value = stats.totalOrders || 0;
            totalOrdersEl.textContent = value;
            totalOrdersEl.style.opacity = '1';
            console.log('✅ Total orders updated:', value);
        } else {
            console.error('❌ Element [data-stat="totalOrders"] not found!');
        }
        
        // Update pending orders
        const pendingOrdersEl = document.querySelector('[data-stat="pendingOrders"]');
        if (pendingOrdersEl) {
            const value = stats.pendingOrders || 0;
            pendingOrdersEl.textContent = value;
            pendingOrdersEl.style.opacity = '1';
            console.log('✅ Pending orders updated:', value);
        } else {
            console.error('❌ Element [data-stat="pendingOrders"] not found!');
        }
        
        // Update total revenue
        const totalRevenueEl = document.querySelector('[data-stat="totalRevenue"]');
        if (totalRevenueEl) {
            const value = this.formatPrice(stats.totalRevenue || 0);
            totalRevenueEl.textContent = value;
            totalRevenueEl.style.opacity = '1';
            console.log('✅ Total revenue updated:', value);
        } else {
            console.error('❌ Element [data-stat="totalRevenue"] not found!');
        }
        
        // Update pending revenue
        const pendingRevenueEl = document.querySelector('[data-stat="pendingRevenue"]');
        if (pendingRevenueEl) {
            pendingRevenueEl.textContent = this.formatPrice(stats.pendingRevenue || 0);
        }
    }
    
    // Update recent orders table from API
    updateRecentOrdersTable(orders) {
        const tbody = document.getElementById('recentOrdersTable');
        if (!tbody) return;
        
        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Chưa có đơn hàng nào
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = orders.map(order => {
            const customerName = order.customer?.username || 
                                order.customer?.profile?.firstName || 
                                order.customer?.email || 
                                'Khách hàng';
            const orderNumber = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
            const statusClass = this.getStatusClass(order.status);
            const statusText = this.getStatusText(order.status);
            
            // Get product names from order items
            const productNames = order.items && order.items.length > 0
                ? order.items.slice(0, 2).map(item => item.product?.title || 'Sản phẩm').join(', ')
                : 'Sản phẩm';
            const productCount = order.items?.length || 1;
            const productDisplay = productCount > 2 
                ? `${productNames}... (+${productCount - 2})`
                : productNames;
            
            return `
                <tr>
                    <td><strong>${orderNumber}</strong></td>
                    <td>${this.escapeHtml(customerName)}</td>
                    <td title="${this.escapeHtml(productDisplay)}">${productCount} sản phẩm</td>
                    <td><strong>${this.formatPrice(order.total || 0)}</strong></td>
                    <td><span class="order-status ${statusClass}">${statusText}</span></td>
                    <td>${this.formatDate(order.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="window.location.href='orders.php?id=${order._id}'">
                            Xem
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        console.log('📦 Recent orders updated:', orders.length);
    }
    
    // Update low stock alerts from API
    updateLowStockAlerts(products) {
        const container = document.querySelector('#lowStockAlerts');
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="alert alert-warning">
                <strong>${product.title}</strong> - Còn ${product.stock} sản phẩm
                <a href="products.php?id=${product._id}" class="btn btn-sm">Nhập thêm</a>
            </div>
        `).join('');
    }
    
    // Helper: Format price
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
    
    // Helper: Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    // Helper: Get status badge class
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
    
    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        // Clear any existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set up new interval
        this.refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing dashboard data...');
            this.refreshDashboardData();
        }, this.refreshRate);
        
        console.log(`✅ Auto-refresh started (every ${this.refreshRate / 1000}s)`);
    }
    
    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('⏸️ Auto-refresh stopped');
        }
    }
    
    // Refresh dashboard data silently (no loading indicators)
    async refreshDashboardData() {
        try {
            const response = await api.getSellerDashboard();
            
            if (response.success) {
                const { stats, growth, recentOrders, lowStockProducts, topProducts, quickStats, salesChartData } = response.data;
                
                // Update stats with smooth animation
                this.updateStatsWithAnimation(stats);
                
                // Update growth percentages
                if (growth) {
                    this.updateGrowthIndicators(growth);
                }
                
                // Update quick stats
                if (quickStats) {
                    this.updateQuickStats(quickStats);
                }
                
                // Update recent orders if changed
                if (recentOrders && recentOrders.length > 0) {
                    this.updateRecentOrdersTable(recentOrders);
                }
                
                // Update low stock alerts if changed
                if (lowStockProducts && lowStockProducts.length > 0) {
                    this.updateLowStockAlerts(lowStockProducts);
                }
                
                // Update top products
                if (topProducts && topProducts.length > 0) {
                    this.updateTopProducts(topProducts);
                }
                
                // Update sales chart
                if (salesChartData && salesChartData.length > 0) {
                    this.updateSalesChart(salesChartData);
                }
                
                console.log('✅ Dashboard refreshed successfully');
            }
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            // Don't show error to user for background refresh
        }
    }
    
    // Update stats with smooth animation
    updateStatsWithAnimation(stats) {
        const statElements = {
            totalProducts: document.querySelector('[data-stat="totalProducts"]'),
            activeProducts: document.querySelector('[data-stat="activeProducts"]'),
            totalOrders: document.querySelector('[data-stat="totalOrders"]'),
            pendingOrders: document.querySelector('[data-stat="pendingOrders"]'),
            totalRevenue: document.querySelector('[data-stat="totalRevenue"]'),
            pendingRevenue: document.querySelector('[data-stat="pendingRevenue"]')
        };
        
        // Animate numbers
        Object.keys(statElements).forEach(key => {
            const el = statElements[key];
            if (!el) return;
            
            const newValue = stats[key] || 0;
            const isPrice = key.includes('Revenue');
            
            // Get current value
            const currentText = el.textContent;
            let currentValue = 0;
            
            if (currentText !== '⏳') {
                currentValue = isPrice 
                    ? parseFloat(currentText.replace(/[^\d]/g, '')) || 0
                    : parseInt(currentText) || 0;
            }
            
            // Skip if same value
            if (currentValue === newValue) return;
            
            // Add flash animation
            el.style.transition = 'all 0.3s ease';
            el.style.transform = 'scale(1.1)';
            el.style.color = '#10b981';
            
            // Animate number
            this.animateNumber(el, currentValue, newValue, isPrice);
            
            // Reset animation
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.color = '';
            }, 300);
        });
    }
    
    // Animate number change
    animateNumber(element, from, to, isPrice = false) {
        const duration = 500;
        const steps = 20;
        const stepValue = (to - from) / steps;
        const stepDuration = duration / steps;
        let current = from;
        let step = 0;
        
        const interval = setInterval(() => {
            current += stepValue;
            step++;
            
            if (step >= steps) {
                current = to;
                clearInterval(interval);
            }
            
            element.textContent = isPrice 
                ? this.formatPrice(Math.round(current))
                : Math.round(current);
        }, stepDuration);
    }
    
    // Update quick stats (Today/Week/Month)
    updateQuickStats(quickStats) {
        const todayEl = document.getElementById('todaySales');
        const weekEl = document.getElementById('weekSales');
        const monthEl = document.getElementById('monthSales');
        
        if (todayEl) todayEl.textContent = this.formatPrice(quickStats.todaySales || 0);
        if (weekEl) weekEl.textContent = this.formatPrice(quickStats.weekSales || 0);
        if (monthEl) monthEl.textContent = this.formatPrice(quickStats.monthSales || 0);
        
        console.log('📊 Quick stats updated:', quickStats);
    }
    
    // Update top products grid
    updateTopProducts(products) {
        const grid = document.getElementById('topProductsGrid');
        if (!grid) return;
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Chưa có sản phẩm bán chạy</p>';
            return;
        }
        
        grid.innerHTML = products.map(product => {
            const imageUrl = (product.images && product.images[0] && (product.images[0].url || product.images[0])) 
                || 'https://via.placeholder.com/200x300?text=No+Image';
            const soldCount = product.soldCount || product.totalSold || 0;
            
            return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.title)}" 
                         onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                </div>
                <div class="product-info">
                    <h4 class="product-title">${this.escapeHtml(product.title)}</h4>
                    <p class="product-price">${this.formatPrice(product.price || 0)}</p>
                    <div class="product-meta">
                        <span>Đã bán: ${soldCount}</span>
                        <span>Kho: ${product.stock || 0}</span>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        
        console.log('🛍️ Top products updated:', products.length);
    }
    
    // Update sales chart
    updateSalesChart(chartData) {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;
        
        // Destroy existing chart if any
        if (this.chart) {
            this.chart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const labels = chartData.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const revenues = chartData.map(d => d.revenue);
        const orderCounts = chartData.map(d => d.orders);
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (₫)',
                        data: revenues,
                        borderColor: '#5865f2',
                        backgroundColor: 'rgba(88, 101, 242, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Đơn hàng',
                        data: orderCounts,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.datasetIndex === 0) {
                                    label += new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(context.parsed.y);
                                } else {
                                    label += context.parsed.y + ' đơn';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('vi-VN') + '₫';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        
        console.log('📈 Sales chart updated with', chartData.length, 'days');
    }
    
    // Update growth indicators with real-time data
    updateGrowthIndicators(growth) {
        const growthMap = {
            products: growth.products,
            revenue: growth.revenue,
            orders: growth.orders,
            pendingOrders: growth.pendingOrders
        };
        
        Object.keys(growthMap).forEach(key => {
            const trendEl = document.querySelector(`[data-growth="${key}"]`);
            if (!trendEl) return;
            
            const value = growthMap[key];
            const icon = trendEl.querySelector('.trend-icon');
            const text = trendEl.querySelector('.trend-value');
            
            if (!icon || !text) return;
            
            // Determine trend direction and color
            let trendClass = 'neutral';
            let trendIcon = '→';
            
            if (value > 0) {
                trendClass = 'positive';
                trendIcon = '↗️';
            } else if (value < 0) {
                trendClass = 'negative';
                trendIcon = '↘️';
            }
            
            // Update classes
            trendEl.className = `stat-trend ${trendClass}`;
            
            // Update icon and text
            icon.textContent = trendIcon;
            text.textContent = value > 0 ? `+${value}%` : `${value}%`;
            
            // Add flash animation
            trendEl.style.transition = 'all 0.3s ease';
            trendEl.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                trendEl.style.transform = 'scale(1)';
            }, 300);
        });
        
        console.log('📊 Growth indicators updated:', growth);
    }
}

// Initialize seller dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sellerDashboard = new SellerDashboard();
});

// Export for global access
window.SellerDashboard = SellerDashboard;