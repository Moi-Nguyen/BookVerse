// ========================================
// BOOKVERSE ANALYTICS JAVASCRIPT
// Advanced analytics dashboard functionality
// ========================================

class AnalyticsManager {
    constructor() {
        this.charts = {};
        this.data = {};
        this.timeRange = '30d';
        this.initializeEventListeners();
        this.loadAnalyticsData();
    }

    initializeEventListeners() {
        // Time range change
        document.getElementById('timeRange')?.addEventListener('change', (e) => {
            this.timeRange = e.target.value;
            this.loadAnalyticsData();
        });

        // Chart type buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChartType(e.target.dataset.type);
            });
        });

        // Export analytics
        window.exportAnalytics = () => this.exportAnalytics();
        window.viewAllProducts = () => this.viewAllProducts();
        window.viewAllSellers = () => this.viewAllSellers();
    }

    async loadAnalyticsData() {
        try {
            this.showLoading();
            
            // Load all analytics data in parallel
            const [metrics, revenue, orders, products, sellers, activity, health] = await Promise.all([
                this.loadMetrics(),
                this.loadRevenueData(),
                this.loadOrdersData(),
                this.loadTopProducts(),
                this.loadTopSellers(),
                this.loadRecentActivity(),
                this.loadSystemHealth()
            ]);

            this.data = { metrics, revenue, orders, products, sellers, activity, health };
            
            this.updateMetrics();
            this.initializeCharts();
            this.updateLists();
            
        } catch (error) {
            console.error('Error loading analytics data:', error);
            this.showError('Không thể tải dữ liệu analytics');
        } finally {
            this.hideLoading();
        }
    }

    async loadMetrics() {
        try {
            const response = await adminAPI.getDashboardStats();
            return response.data;
        } catch (error) {
            console.error('Error loading metrics:', error);
            return this.getMockMetrics();
        }
    }

    async loadRevenueData() {
        try {
            const response = await adminAPI.getDashboardRevenue(this.timeRange);
            return response.data;
        } catch (error) {
            console.error('Error loading revenue data:', error);
            return this.getMockRevenueData();
        }
    }

    async loadOrdersData() {
        try {
            const response = await adminAPI.getDashboardOrders(this.timeRange);
            return response.data;
        } catch (error) {
            console.error('Error loading orders data:', error);
            return this.getMockOrdersData();
        }
    }

    async loadTopProducts() {
        try {
            const response = await adminAPI.getProducts({ limit: 5, sort: 'sales' });
            return response.data.products || [];
        } catch (error) {
            console.error('Error loading top products:', error);
            return this.getMockTopProducts();
        }
    }

    async loadTopSellers() {
        try {
            const response = await adminAPI.getSellers({ limit: 5, sort: 'revenue' });
            return response.data.sellers || [];
        } catch (error) {
            console.error('Error loading top sellers:', error);
            return this.getMockTopSellers();
        }
    }

    async loadRecentActivity() {
        try {
            const response = await adminAPI.getDashboardActivity();
            return response.data.activities || [];
        } catch (error) {
            console.error('Error loading recent activity:', error);
            return this.getMockRecentActivity();
        }
    }

    async loadSystemHealth() {
        try {
            const response = await adminAPI.getDashboardHealth();
            return response.data;
        } catch (error) {
            console.error('Error loading system health:', error);
            return this.getMockSystemHealth();
        }
    }

    updateMetrics() {
        const metrics = this.data.metrics;
        
        document.getElementById('totalRevenue').textContent = this.formatCurrency(metrics.totalRevenue || 0);
        document.getElementById('totalOrders').textContent = this.formatNumber(metrics.totalOrders || 0);
        document.getElementById('totalUsers').textContent = this.formatNumber(metrics.totalUsers || 0);
        document.getElementById('totalProducts').textContent = this.formatNumber(metrics.totalProducts || 0);
    }

    initializeCharts() {
        this.initializeRevenueChart();
        this.initializeOrdersStatusChart();
        this.initializeGeographicChart();
    }

    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const revenueData = this.data.revenue;

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: revenueData.labels || [],
                datasets: [{
                    label: 'Doanh thu',
                    data: revenueData.values || [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                return `Doanh thu: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initializeOrdersStatusChart() {
        const ctx = document.getElementById('ordersStatusChart');
        if (!ctx) return;

        const ordersData = this.data.orders;

        this.charts.ordersStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ordersData.statusLabels || ['Hoàn thành', 'Đang xử lý', 'Đã giao', 'Chờ xử lý', 'Đã hủy'],
                datasets: [{
                    data: ordersData.statusValues || [45, 25, 15, 10, 5],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    initializeGeographicChart() {
        const ctx = document.getElementById('geographicChart');
        if (!ctx) return;

        const geoData = this.data.orders.geographic || {};

        this.charts.geographic = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(geoData),
                datasets: [{
                    label: 'Đơn hàng',
                    data: Object.values(geoData),
                    backgroundColor: '#3b82f6',
                    borderColor: '#1d4ed8',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: (context) => {
                                return `Đơn hàng: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        });
    }

    switchChartType(type) {
        // Update active button
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        // Update chart data based on type
        const revenueChart = this.charts.revenue;
        if (revenueChart) {
            const data = this.data[type] || {};
            revenueChart.data.datasets[0].data = data.values || [];
            revenueChart.data.labels = data.labels || [];
            revenueChart.update();
        }
    }

    updateLists() {
        this.updateTopProducts();
        this.updateTopSellers();
        this.updateRecentActivity();
        this.updateSystemHealth();
        this.updateTopCities();
    }

    updateTopProducts() {
        const container = document.getElementById('topProductsList');
        if (!container) return;

        const products = this.data.products || [];
        
        container.innerHTML = products.map((product, index) => `
            <div class="top-product-item">
                <div class="item-rank">${index + 1}</div>
                <div class="item-info">
                    <div class="item-name">${this.escapeHtml(product.title)}</div>
                    <div class="item-meta">${this.escapeHtml(product.author)} • ${product.category}</div>
                </div>
                <div class="item-value">${this.formatNumber(product.salesCount || 0)} bán</div>
            </div>
        `).join('');
    }

    updateTopSellers() {
        const container = document.getElementById('topSellersList');
        if (!container) return;

        const sellers = this.data.sellers || [];
        
        container.innerHTML = sellers.map((seller, index) => `
            <div class="top-seller-item">
                <div class="item-rank">${index + 1}</div>
                <div class="item-info">
                    <div class="item-name">${this.escapeHtml(seller.businessName || seller.username)}</div>
                    <div class="item-meta">${seller.email}</div>
                </div>
                <div class="item-value">${this.formatCurrency(seller.totalRevenue || 0)}</div>
            </div>
        `).join('');
    }

    updateRecentActivity() {
        const container = document.getElementById('recentActivityList');
        if (!container) return;

        const activities = this.data.activity || [];
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <div class="activity-text">${this.escapeHtml(activity.message)}</div>
                    <div class="activity-time">${this.formatTimeAgo(activity.createdAt)}</div>
                </div>
            </div>
        `).join('');
    }

    updateSystemHealth() {
        const container = document.getElementById('systemHealth');
        if (!container) return;

        const health = this.data.health || {};
        
        container.innerHTML = `
            <div class="health-metric">
                <div class="health-status ${health.database ? 'healthy' : 'error'}"></div>
                <div class="health-label">Database</div>
            </div>
            <div class="health-metric">
                <div class="health-status ${health.redis ? 'healthy' : 'error'}"></div>
                <div class="health-label">Redis</div>
            </div>
            <div class="health-metric">
                <div class="health-status ${health.api ? 'healthy' : 'error'}"></div>
                <div class="health-label">API</div>
            </div>
            <div class="health-metric">
                <div class="health-status ${health.storage ? 'healthy' : 'warning'}"></div>
                <div class="health-label">Storage</div>
            </div>
        `;
    }

    updateTopCities() {
        const container = document.getElementById('topCitiesList');
        if (!container) return;

        const cities = this.data.orders.topCities || [];
        
        container.innerHTML = cities.map(city => `
            <div class="geo-item">
                <div class="geo-name">${this.escapeHtml(city.name)}</div>
                <div class="geo-value">${this.formatNumber(city.orders)} đơn</div>
            </div>
        `).join('');
    }

    // Mock data methods
    getMockMetrics() {
        return {
            totalRevenue: 125000000,
            totalOrders: 1250,
            totalUsers: 850,
            totalProducts: 320
        };
    }

    getMockRevenueData() {
        const days = this.timeRange === '7d' ? 7 : this.timeRange === '30d' ? 30 : 90;
        const labels = [];
        const values = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('vi-VN'));
            values.push(Math.floor(Math.random() * 5000000) + 1000000);
        }
        
        return { labels, values };
    }

    getMockOrdersData() {
        return {
            statusLabels: ['Hoàn thành', 'Đang xử lý', 'Đã giao', 'Chờ xử lý', 'Đã hủy'],
            statusValues: [45, 25, 15, 10, 5],
            geographic: {
                'Hà Nội': 120,
                'TP.HCM': 180,
                'Đà Nẵng': 45,
                'Cần Thơ': 30,
                'Khác': 25
            },
            topCities: [
                { name: 'TP.HCM', orders: 180 },
                { name: 'Hà Nội', orders: 120 },
                { name: 'Đà Nẵng', orders: 45 },
                { name: 'Cần Thơ', orders: 30 }
            ]
        };
    }

    getMockTopProducts() {
        return [
            { title: 'Sách lập trình JavaScript', author: 'Nguyễn Văn A', category: 'Công nghệ', salesCount: 150 },
            { title: 'Tiểu thuyết kinh điển', author: 'Tác giả B', category: 'Văn học', salesCount: 120 },
            { title: 'Sách kinh tế học', author: 'Tác giả C', category: 'Kinh tế', salesCount: 95 },
            { title: 'Sách nấu ăn', author: 'Tác giả D', category: 'Nấu ăn', salesCount: 80 },
            { title: 'Sách du lịch', author: 'Tác giả E', category: 'Du lịch', salesCount: 65 }
        ];
    }

    getMockTopSellers() {
        return [
            { businessName: 'Nhà sách ABC', username: 'seller1', email: 'seller1@example.com', totalRevenue: 25000000 },
            { businessName: 'Cửa hàng sách XYZ', username: 'seller2', email: 'seller2@example.com', totalRevenue: 18000000 },
            { businessName: 'Bookstore 123', username: 'seller3', email: 'seller3@example.com', totalRevenue: 15000000 },
            { businessName: 'Sách online', username: 'seller4', email: 'seller4@example.com', totalRevenue: 12000000 },
            { businessName: 'Thư viện sách', username: 'seller5', email: 'seller5@example.com', totalRevenue: 10000000 }
        ];
    }

    getMockRecentActivity() {
        return [
            { type: 'order', message: 'Đơn hàng mới #ORD001 từ Nguyễn Văn A', createdAt: new Date(Date.now() - 5 * 60 * 1000) },
            { type: 'user', message: 'Người dùng mới đăng ký: Trần Thị B', createdAt: new Date(Date.now() - 15 * 60 * 1000) },
            { type: 'product', message: 'Sản phẩm mới được thêm: "Sách lập trình Python"', createdAt: new Date(Date.now() - 30 * 60 * 1000) },
            { type: 'review', message: 'Đánh giá mới cho sản phẩm "Sách JavaScript"', createdAt: new Date(Date.now() - 45 * 60 * 1000) },
            { type: 'payment', message: 'Thanh toán thành công cho đơn hàng #ORD002', createdAt: new Date(Date.now() - 60 * 60 * 1000) }
        ];
    }

    getMockSystemHealth() {
        return {
            database: true,
            redis: true,
            api: true,
            storage: false
        };
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('vi-VN').format(number);
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }

    getActivityIcon(type) {
        const icons = {
            order: '📦',
            user: '👤',
            product: '📚',
            review: '⭐',
            payment: '💰'
        };
        return icons[type] || '📋';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        console.error('Analytics Error:', message);
        // You can implement a toast notification here
    }

    async exportAnalytics() {
        try {
            const response = await adminAPI.exportAnalytics(this.timeRange);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
            a.download = `analytics-${this.timeRange}-${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
            window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting analytics:', error);
            this.showError('Không thể xuất báo cáo');
        }
    }

    viewAllProducts() {
        window.location.href = 'products.php';
    }

    viewAllSellers() {
        window.location.href = 'users.php?role=seller';
    }
}

// Initialize analytics manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

// Export for global access
window.AnalyticsManager = AnalyticsManager;