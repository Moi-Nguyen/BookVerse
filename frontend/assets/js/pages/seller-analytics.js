document.addEventListener('DOMContentLoaded', function() {
    let currentPeriod = 30;
    let startDate = null;
    let endDate = null;
    let chartInstances = {};
    
    // Initialize analytics
    initAnalytics();
    
    function initAnalytics() {
        setupEventListeners();
        loadAnalytics();
    }
    
    function setupEventListeners() {
        const dateRange = document.getElementById('dateRange');
        const customDateRange = document.getElementById('customDateRange');
        const applyCustomDate = document.getElementById('applyCustomDate');
        const exportBtn = document.getElementById('exportReportBtn');
        const topProductsLimit = document.getElementById('topProductsLimit');
        
        if (dateRange) {
            dateRange.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customDateRange.style.display = 'flex';
                } else {
                    customDateRange.style.display = 'none';
                    currentPeriod = parseInt(this.value);
                    startDate = null;
                    endDate = null;
                    loadAnalytics();
                }
            });
        }
        
        if (applyCustomDate) {
            applyCustomDate.addEventListener('click', function() {
                const start = document.getElementById('startDate').value;
                const end = document.getElementById('endDate').value;
                if (start && end) {
                    startDate = start;
                    endDate = end;
                    loadAnalytics();
                } else {
                    alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc');
                }
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                exportReport();
            });
        }
        
        if (topProductsLimit) {
            topProductsLimit.addEventListener('change', function() {
                loadTopProducts(parseInt(this.value));
            });
        }
        
        // Daily performance filters
        const dailyPerformanceLimit = document.getElementById('dailyPerformanceLimit');
        const dailyPerformanceSort = document.getElementById('dailyPerformanceSort');
        
        if (dailyPerformanceLimit) {
            dailyPerformanceLimit.addEventListener('change', function() {
                applyDailyPerformanceFilters();
            });
        }
        
        if (dailyPerformanceSort) {
            dailyPerformanceSort.addEventListener('change', function() {
                applyDailyPerformanceFilters();
            });
        }
    }
    
    async function loadAnalytics() {
        try {
            showLoading();
            
            // Build query params
            let params = {};
            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else {
                params.period = currentPeriod;
            }
            
            const queryString = new URLSearchParams(params).toString();
            const response = await api.request(`/seller/dashboard?${queryString}`);
            
            console.log('📊 Analytics data loaded:', response);
            
            if (response && response.success) {
                updateSummary(response.data);
                updateCharts(response.data);
                await loadTopProducts(10);
                updateDailyPerformance(response.data.salesChartData || []);
            } else {
                throw new Error('Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            showError('Không thể tải dữ liệu phân tích: ' + (error.message || 'Unknown error'));
        } finally {
            hideLoading();
        }
    }
    
    function updateSummary(data) {
        const stats = data.stats || {};
        const growth = data.growth || {};
        
        // Update revenue
        const revenueEl = document.getElementById('totalRevenue');
        const revenueChangeEl = document.getElementById('revenueChange');
        if (revenueEl) {
            revenueEl.textContent = formatPrice(stats.totalRevenue || 0);
        }
        if (revenueChangeEl) {
            const change = growth.revenue || 0;
            revenueChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            revenueChangeEl.className = `summary-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update orders
        const ordersEl = document.getElementById('totalOrders');
        const ordersChangeEl = document.getElementById('ordersChange');
        if (ordersEl) {
            ordersEl.textContent = stats.totalOrders || 0;
        }
        if (ordersChangeEl) {
            const change = growth.orders || 0;
            ordersChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            ordersChangeEl.className = `summary-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update products sold (not total products in inventory)
        const productsEl = document.getElementById('totalProducts');
        const productsChangeEl = document.getElementById('productsChange');
        if (productsEl) {
            productsEl.textContent = stats.totalProductsSold || 0;
        }
        if (productsChangeEl) {
            const change = growth.productsSold || 0;
            productsChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            productsChangeEl.className = `summary-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update customers
        const customersEl = document.getElementById('totalCustomers');
        const customersChangeEl = document.getElementById('customersChange');
        if (customersEl) {
            customersEl.textContent = stats.totalCustomers || 0;
        }
        if (customersChangeEl) {
            const change = growth.customers || 0;
            customersChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            customersChangeEl.className = `summary-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }
    
    function updateCharts(data) {
        const salesChartData = data.salesChartData || [];
        const categoryStats = data.categoryStats || [];
        const orderStatusStats = data.orderStatusStats || {};
        
        console.log('📈 Updating charts:', {
            salesChartData: salesChartData.length,
            categoryStats: categoryStats.length,
            orderStatusStats: Object.keys(orderStatusStats).length
        });
        
        // Revenue Chart
        if (salesChartData.length > 0) {
            updateRevenueChart(salesChartData);
        } else {
            showEmptyChart('revenueChart', 'Chưa có dữ liệu doanh thu');
        }
        
        // Orders Chart
        if (salesChartData.length > 0) {
            updateOrdersChart(salesChartData);
        } else {
            showEmptyChart('ordersChart', 'Chưa có dữ liệu đơn hàng');
        }
        
        // Category Chart
        if (categoryStats.length > 0) {
            updateCategoryChart(categoryStats);
        } else {
            showEmptyChart('categoryChart', 'Chưa có dữ liệu danh mục');
        }
        
        // Order Status Chart
        if (Object.keys(orderStatusStats).length > 0) {
            updateOrderStatusChart(orderStatusStats);
        } else {
            showEmptyChart('orderStatusChart', 'Chưa có dữ liệu trạng thái đơn hàng');
        }
    }
    
    function showEmptyChart(canvasId, message) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }
    
    function updateRevenueChart(data) {
        const canvas = document.getElementById('revenueChart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances.revenue) {
            chartInstances.revenue.destroy();
        }
        
        const labels = data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const revenues = data.map(d => d.revenue || 0);
        
        chartInstances.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (₫)',
                    data: revenues,
                    borderColor: '#5865f2',
                    backgroundColor: 'rgba(88, 101, 242, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatPrice(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateOrdersChart(data) {
        const canvas = document.getElementById('ordersChart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances.orders) {
            chartInstances.orders.destroy();
        }
        
        const labels = data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const orders = data.map(d => d.orders || 0);
        
        chartInstances.orders = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số đơn hàng',
                    data: orders,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    function updateCategoryChart(data) {
        const canvas = document.getElementById('categoryChart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances.category) {
            chartInstances.category.destroy();
        }
        
        const labels = data.map(d => d.category || 'Khác');
        const revenues = data.map(d => d.revenue || 0);
        
        chartInstances.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: revenues,
                    backgroundColor: [
                        '#5865f2',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#ec4899',
                        '#06b6d4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${formatPrice(context.parsed)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateOrderStatusChart(data) {
        const canvas = document.getElementById('orderStatusChart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances.orderStatus) {
            chartInstances.orderStatus.destroy();
        }
        
        const statusLabels = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'shipped': 'Đã gửi',
            'delivered': 'Đã giao',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        
        const labels = Object.keys(data).map(key => statusLabels[key] || key);
        const values = Object.values(data);
        
        chartInstances.orderStatus = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#f59e0b',
                        '#3b82f6',
                        '#8b5cf6',
                        '#10b981',
                        '#059669',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    async function loadTopProducts(limit = 10) {
        try {
            // Get all products first to sort by sales
            const response = await api.request(`/products/seller/my-products?limit=100`);
            
            if (response && response.success) {
                let products = response.data.products || [];
                
                // Sort by totalSold (sales) descending
                products.sort((a, b) => {
                    const salesA = a.totalSold || a.sales || 0;
                    const salesB = b.totalSold || b.sales || 0;
                    return salesB - salesA;
                });
                
                // Take top N
                products = products.slice(0, limit);
                
                console.log('📦 Top products loaded:', products.length);
                renderTopProducts(products);
            } else {
                throw new Error('Không thể tải sản phẩm');
            }
        } catch (error) {
            console.error('Error loading top products:', error);
            const tbody = document.getElementById('topProductsTable');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Không thể tải dữ liệu sản phẩm</td></tr>';
            }
        }
    }
    
    function renderTopProducts(products) {
        const tbody = document.getElementById('topProductsTable');
        if (!tbody) return;
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có dữ liệu</td></tr>';
            return;
        }
        
        // Calculate total revenue for percentage
        const totalRevenue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.totalSold || 0)), 0);
        
        tbody.innerHTML = products.map((product, index) => {
            const sold = product.totalSold || product.sales || 0;
            const revenue = (product.price || 0) * sold;
            const percentage = totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : 0;
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="product-info-cell">
                            <strong>${escapeHtml(product.title || 'N/A')}</strong>
                            <span class="product-author">${escapeHtml(product.author || '')}</span>
                        </div>
                    </td>
                    <td>${sold}</td>
                    <td><strong>${formatPrice(revenue)}</strong></td>
                    <td>
                        <div class="percentage-bar">
                            <div class="percentage-fill" style="width: ${percentage}%"></div>
                            <span class="percentage-text">${percentage}%</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    let dailyPerformanceData = [];
    
    function updateDailyPerformance(data) {
        dailyPerformanceData = data || [];
        applyDailyPerformanceFilters();
    }
    
    function applyDailyPerformanceFilters() {
        const tbody = document.getElementById('dailyPerformanceTable');
        if (!tbody) return;
        
        if (!dailyPerformanceData || dailyPerformanceData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có dữ liệu</td></tr>';
            return;
        }
        
        // Get filter values
        const limitSelect = document.getElementById('dailyPerformanceLimit');
        const sortSelect = document.getElementById('dailyPerformanceSort');
        const limitValue = limitSelect ? limitSelect.value : '30';
        const sortOrder = sortSelect ? sortSelect.value : 'desc';
        
        // Sort data
        let sortedData = [...dailyPerformanceData];
        if (sortOrder === 'desc') {
            sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        // Apply limit
        if (limitValue !== 'all' && !isNaN(parseInt(limitValue))) {
            sortedData = sortedData.slice(0, parseInt(limitValue));
        }
        
        // Render table
        tbody.innerHTML = sortedData.map(d => {
            const date = new Date(d.date);
            const dateStr = date.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            return `
                <tr>
                    <td><strong>${dateStr}</strong></td>
                    <td><span class="badge">${d.orders || 0}</span></td>
                    <td><strong>${formatPrice(d.revenue || 0)}</strong></td>
                    <td>${d.products || 0}</td>
                    <td>${d.customers || 0}</td>
                </tr>
            `;
        }).join('');
    }
    
    
    function exportReport() {
        alert('Tính năng xuất báo cáo sẽ được triển khai sớm!');
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showLoading() {
        // Show loading state
    }
    
    function hideLoading() {
        // Hide loading state
    }
    
    function showError(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        } else {
            alert(message);
        }
    }
});
