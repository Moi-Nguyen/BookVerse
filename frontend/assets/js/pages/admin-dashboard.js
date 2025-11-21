// Dashboard initialization - wait for adminAPI to be available
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for scripts to load
    if (typeof adminAPI === 'undefined') {
        // Wait for admin.js to load
        let attempts = 0;
        const checkAdminAPI = setInterval(() => {
            attempts++;
            if (typeof adminAPI !== 'undefined') {
                clearInterval(checkAdminAPI);
                initializeDashboard();
            } else if (attempts > 20) {
                // After 2 seconds, try anyway with fallback
                clearInterval(checkAdminAPI);
                console.warn('adminAPI not loaded after timeout, using fallback');
                initializeDashboard();
            }
        }, 100);
    } else {
        initializeDashboard();
    }
});

// Initialize dashboard
async function initializeDashboard() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not defined. Make sure admin.js is loaded.');
            showStatsError();
            hideLoading();
            return;
        }
        
        showLoading();
        
        // Load dashboard data in parallel
        await Promise.all([
            loadStats(),
            loadCharts(),
            loadRecentActivity(),
            loadPendingApprovals(),
            loadSystemHealth()
        ]);
        
        hideLoading();
        
        // Start auto-refresh for real-time updates (every 30 seconds)
        startAutoRefresh();
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        showToast('Không thể tải dashboard', 'error');
        hideLoading();
        // Show stats error if stats failed to load
        showStatsError();
    }
}

// Auto-refresh real-time data
let refreshInterval = null;

function startAutoRefresh() {
    // Clear existing interval if any
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    // Refresh every 30 seconds
    refreshInterval = setInterval(async () => {
        try {
            // Refresh only real-time sections (not charts to avoid disruption)
            await Promise.all([
                refreshRecentActivity(),
                refreshPendingApprovals(),
                refreshSystemHealth(),
                refreshStats()
            ]);
            
            // Show subtle indicator that data was updated
            showUpdateIndicator();
        } catch (error) {
            console.error('Auto-refresh failed:', error);
        }
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

function showUpdateIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'update-indicator';
    indicator.innerHTML = '🟢 Đã cập nhật';
    indicator.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.style.opacity = '1', 100);
    
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
}

// Refresh functions for real-time sections
async function refreshStats() {
    await loadStats();
}

async function refreshRecentActivity() {
    await loadRecentActivity();
}

async function refreshPendingApprovals() {
    await loadPendingApprovals();
}

async function refreshSystemHealth() {
    await loadSystemHealth();
}

// Stop auto-refresh when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
    }
});

// Load statistics
async function loadStats() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not available');
            displayStats(getFallbackStats());
            return;
        }
        
        const response = await adminAPI.getDashboardStats();
        if (response && response.success && response.data) {
            displayStats(response.data);
        } else {
            // Use fallback data if API doesn't return success
            console.warn('API response not successful, using fallback data', response);
            displayStats(getFallbackStats());
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
        // Use fallback data on error instead of showing error state
        displayStats(getFallbackStats());
    }
}

// Fallback stats data
function getFallbackStats() {
    return {
        totalUsers: 0,
        totalSellers: 0,
        totalProducts: 0,
        totalOrders: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        usersChange: 0,
        sellersChange: 0,
        productsChange: 0,
        ordersChange: 0,
        revenueChange: 0,
        conversionChange: 0
    };
}

// Display statistics with smooth animation
function displayStats(data) {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) {
        console.error('Stats grid element not found');
        return;
    }
    
    // Ensure data exists
    if (!data) {
        data = getFallbackStats();
    }
    
    const stats = [
        {
            title: 'Tổng người dùng',
            value: data.totalUsers || 0,
            change: data.usersChange || 0,
            icon: '👥',
            color: 'blue',
            id: 'totalUsers'
        },
        {
            title: 'Người bán',
            value: data.totalSellers || 0,
            change: data.sellersChange || 0,
            icon: '🏪',
            color: 'green',
            id: 'totalSellers'
        },
        {
            title: 'Sản phẩm',
            value: data.totalProducts || 0,
            change: data.productsChange || 0,
            icon: '📚',
            color: 'purple',
            id: 'totalProducts'
        },
        {
            title: 'Đơn hàng',
            value: data.totalOrders || 0,
            change: data.ordersChange || 0,
            icon: '📦',
            color: 'orange',
            id: 'totalOrders'
        },
        {
            title: 'Doanh thu tháng',
            value: data.monthlyRevenue || 0,
            displayValue: formatCurrency(data.monthlyRevenue || 0),
            change: data.revenueChange || 0,
            icon: '💰',
            color: 'green',
            id: 'monthlyRevenue'
        },
        {
            title: 'Tỷ lệ chuyển đổi',
            value: data.conversionRate || 0,
            displayValue: (data.conversionRate || 0) + '%',
            change: data.conversionChange || 0,
            icon: '📈',
            color: 'blue',
            id: 'conversionRate'
        }
    ];

    // Check if this is an update (grid already has content)
    const isUpdate = statsGrid.children.length > 0;

    if (isUpdate) {
        // Update existing cards with animation
        stats.forEach(stat => {
            const card = document.querySelector(`[data-stat-id="${stat.id}"]`);
            if (card) {
                const valueEl = card.querySelector('.stat-value');
                const changeEl = card.querySelector('.stat-change');
                
                if (valueEl) {
                    // Animate value change
                    const oldValue = parseInt(valueEl.textContent.replace(/[^0-9]/g, '')) || 0;
                    const newValue = stat.value;
                    
                    if (oldValue !== newValue) {
                        valueEl.style.transform = 'scale(1.1)';
                        valueEl.style.color = '#10b981';
                        
                        animateNumber(valueEl, oldValue, newValue, 1000, stat.displayValue);
                        
                        setTimeout(() => {
                            valueEl.style.transform = 'scale(1)';
                            valueEl.style.color = '';
                        }, 1000);
                    }
                }
                
                if (changeEl) {
                    changeEl.className = `stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`;
                    changeEl.innerHTML = `${stat.change >= 0 ? '↗' : '↘'} ${Math.abs(stat.change)}%`;
                }
            }
        });
    } else {
        // Initial render
        statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card stat-${stat.color}" data-stat-id="${stat.id}">
                <div class="stat-header">
                    <div class="stat-icon">${stat.icon}</div>
                    <div class="stat-change ${stat.change >= 0 ? 'positive' : 'negative'}">
                        ${stat.change >= 0 ? '↗' : '↘'} ${Math.abs(stat.change)}%
                    </div>
                </div>
                <div class="stat-value">${stat.displayValue || stat.value}</div>
                <div class="stat-title">${stat.title}</div>
            </div>
        `).join('');
    }
}

// Animate number changes
function animateNumber(element, start, end, duration, displayFormat) {
    const startTime = performance.now();
    const isRevenue = displayFormat && displayFormat.includes('₫');
    const isPercentage = displayFormat && displayFormat.includes('%');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeProgress);
        
        if (isRevenue) {
            element.textContent = formatCurrency(current);
        } else if (isPercentage) {
            element.textContent = current + '%';
        } else {
            element.textContent = current.toLocaleString('vi-VN');
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (displayFormat) {
                element.textContent = displayFormat;
            }
        }
    }
    
    requestAnimationFrame(update);
}

// Original display logic (keeping for backwards compatibility)
function displayStatsOriginal(data) {
    const statsGrid = document.getElementById('statsGrid');
    const stats = [
        {
            title: 'Tổng người dùng',
            value: data.totalUsers || 0,
            change: data.usersChange || 0,
            icon: '👥',
            color: 'blue'
        },
        {
            title: 'Người bán',
            value: data.totalSellers || 0,
            change: data.sellersChange || 0,
            icon: '🏪',
            color: 'green'
        },
        {
            title: 'Sản phẩm',
            value: data.totalProducts || 0,
            change: data.productsChange || 0,
            icon: '📚',
            color: 'purple'
        },
        {
            title: 'Đơn hàng',
            value: data.totalOrders || 0,
            change: data.ordersChange || 0,
            icon: '📦',
            color: 'orange'
        },
        {
            title: 'Doanh thu tháng',
            value: formatCurrency(data.monthlyRevenue || 0),
            change: data.revenueChange || 0,
            icon: '💰',
            color: 'green'
        },
        {
            title: 'Tỷ lệ chuyển đổi',
            value: (data.conversionRate || 0) + '%',
            change: data.conversionChange || 0,
            icon: '📈',
            color: 'blue'
        }
    ];

    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card stat-${stat.color}">
            <div class="stat-header">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-change ${stat.change >= 0 ? 'positive' : 'negative'}">
                    ${stat.change >= 0 ? '↗' : '↘'} ${Math.abs(stat.change)}%
                </div>
            </div>
            <div class="stat-content">
                <h3 class="stat-value">${stat.value}</h3>
                <p class="stat-title">${stat.title}</p>
</div>
        </div>
    `).join('');
}

// Chart instances for updates
let revenueChartInstance = null;
let ordersChartInstance = null;

// Load charts with real data
async function loadCharts() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not available');
            showChartError('revenueChart', 'Không thể tải dữ liệu doanh thu');
            showChartError('ordersChart', 'Không thể tải dữ liệu đơn hàng');
            return;
        }
        
        // Show loading state
        const revenueContent = document.querySelector('#revenueChart')?.closest('.chart-content');
        const ordersContent = document.querySelector('#ordersChart')?.closest('.chart-content');
        
        if (revenueContent) revenueContent.classList.add('loading');
        if (ordersContent) ordersContent.classList.add('loading');
        
        // Get period values from dropdowns
        const revenuePeriod = document.getElementById('revenuePeriod')?.value || '6';
        const ordersPeriod = document.getElementById('ordersPeriod')?.value || '7';
        
        // Convert period to API format
        const revenueRange = revenuePeriod === '6' ? '30d' : revenuePeriod === '12' ? '90d' : '180d';
        const ordersRange = ordersPeriod === '7' ? '7d' : ordersPeriod === '30' ? '30d' : '90d';
        
        // Load data in parallel
        const [revenueResponse, ordersResponse] = await Promise.all([
            adminAPI.getDashboardRevenue(revenueRange).catch(err => {
                console.error('Error loading revenue data:', err);
                return null;
            }),
            adminAPI.getDashboardOrders(ordersRange).catch(err => {
                console.error('Error loading orders data:', err);
                return null;
            })
        ]);
        
        // Process revenue data
        if (revenueResponse && revenueResponse.success && revenueResponse.data) {
            const revenueData = revenueResponse.data;
            // Format labels for better display
            const formattedLabels = revenueData.labels?.map(label => {
                // If label is date format (YYYY-MM-DD), format it
                if (label.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    const date = new Date(label);
                    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                }
                // If label is month format (YYYY-MM), format it
                if (label.match(/^\d{4}-\d{2}$/)) {
                    const date = new Date(label + '-01');
                    return date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
                }
                return label;
            }) || [];
            
            createRevenueChart({
                labels: formattedLabels,
                values: revenueData.values || []
            });
        } else {
            showChartError('revenueChart', 'Không thể tải dữ liệu doanh thu');
        }
        
        // Process orders data
        if (ordersResponse && ordersResponse.success && ordersResponse.data) {
            const ordersData = ordersResponse.data;
            createOrdersChart({
                labels: ordersData.statusLabels || [],
                values: ordersData.statusValues || []
            });
        } else {
            showChartError('ordersChart', 'Không thể tải dữ liệu đơn hàng');
        }
        
    } catch (error) {
        console.error('Failed to load charts:', error);
        showChartError('revenueChart', 'Lỗi khi tải dữ liệu doanh thu');
        showChartError('ordersChart', 'Lỗi khi tải dữ liệu đơn hàng');
    }
}

// Show error message in chart
function showChartError(chartId, message) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    const chartContent = canvas.closest('.chart-content');
    if (chartContent) {
        chartContent.classList.remove('loading');
        chartContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
                <div style="font-size: 0.875rem; font-weight: 600;">${message}</div>
            </div>
        `;
    }
}

// Create revenue chart
function createRevenueChart(data) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartContent = canvas.closest('.chart-content');
    if (chartContent) {
        chartContent.classList.remove('loading');
        // Clear previous error message if any
        if (chartContent.querySelector('div')) {
            chartContent.innerHTML = '<canvas id="revenueChart"></canvas>';
        }
    }
    
    // Destroy existing chart if it exists
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    // If no data, show empty state
    if (!data || !data.values || data.values.length === 0) {
        showChartError('revenueChart', 'Chưa có dữ liệu doanh thu');
        return;
    }
    
    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: data.values || [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#4f46e5',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3
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
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Doanh thu: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11,
                            weight: '600',
                            family: 'Inter, system-ui, sans-serif'
                        },
                        padding: 8
                    },
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)',
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11,
                            weight: '600',
                            family: 'Inter, system-ui, sans-serif'
                        },
                        padding: 12,
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            } else if (value >= 1000) {
                                return (value / 1000).toFixed(0) + 'K';
                            }
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// Create orders chart
function createOrdersChart(data) {
    const canvas = document.getElementById('ordersChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartContent = canvas.closest('.chart-content');
    if (chartContent) {
        chartContent.classList.remove('loading');
        // Clear previous error message if any
        if (chartContent.querySelector('div')) {
            chartContent.innerHTML = '<canvas id="ordersChart"></canvas>';
        }
    }
    
    // Destroy existing chart if it exists
    if (ordersChartInstance) {
        ordersChartInstance.destroy();
    }
    
    // If no data, show empty state
    if (!data || !data.values || data.values.length === 0) {
        showChartError('ordersChart', 'Chưa có dữ liệu đơn hàng');
        return;
    }
    
    const colors = [
        '#6366f1', // Indigo
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#06b6d4'  // Cyan
    ];
    
    ordersChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels || [],
            datasets: [{
                data: data.values || [],
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#1f2937',
                        font: {
                            size: 12,
                            weight: '600',
                            family: 'Inter, system-ui, sans-serif'
                        },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' đơn (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Load recent activity
async function loadRecentActivity() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not available');
            displayRecentActivity([]);
            return;
        }
        
        const response = await adminAPI.getDashboardActivity();
        if (response && response.success && response.data) {
            // API returns activities with title, description, time, type, icon
            displayRecentActivity(response.data);
        } else {
            console.warn('Failed to load activity data, showing empty list');
            displayRecentActivity([]);
        }
    } catch (error) {
        console.error('Failed to load recent activity:', error);
        displayRecentActivity([]);
    }
}

// Display recent activity
function displayRecentActivity(activities) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (!activities || activities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item" style="text-align: center; padding: 2rem; color: #6b7280;">
                <p>Chưa có hoạt động nào gần đây</p>
            </div>
        `;
        return;
    }
    
    // Sort activities by time (newest first) - API should already sort, but ensure it
    const sortedActivities = [...activities].sort((a, b) => {
        const timeA = new Date(a.time || a.createdAt);
        const timeB = new Date(b.time || b.createdAt);
        return timeB - timeA;
    });
    
    activityList.innerHTML = sortedActivities.slice(0, 10).map(activity => {
        // Use icon from API or fallback to getActivityIcon
        const icon = activity.icon || getActivityIcon(activity.type);
        // Use title from API or fallback to description
        const title = activity.title || activity.description || 'Hoạt động mới';
        // Use description from API if available
        const description = activity.description || '';
        // Use time from API (can be Date object or ISO string)
        const time = activity.time || activity.createdAt;
        
        return `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <p class="activity-text">${escapeHtml(title)}</p>
                    ${description ? `<p class="activity-description" style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">${escapeHtml(description)}</p>` : ''}
                    <span class="activity-time">${formatTimeAgo(time)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load pending approvals
async function loadPendingApprovals() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not available');
            updatePendingApprovals({ sellers: 0, products: 0, reviews: 0, orders: 0 });
            return;
        }
        
        const response = await adminAPI.getDashboardPending();
        if (response && response.success && response.data) {
            updatePendingApprovals(response.data);
        } else {
            console.warn('Failed to load pending approvals, using fallback');
            updatePendingApprovals({ sellers: 0, products: 0, reviews: 0, orders: 0 });
        }
    } catch (error) {
        console.error('Failed to load pending approvals:', error);
        updatePendingApprovals({ sellers: 0, products: 0, reviews: 0, orders: 0 });
    }
}

// Update pending approvals display
function updatePendingApprovals(data) {
    const pendingSellersEl = document.getElementById('pendingSellers');
    const pendingProductsEl = document.getElementById('pendingProducts');
    const pendingReviewsEl = document.getElementById('pendingReviews');
    
    if (pendingSellersEl) {
        pendingSellersEl.textContent = data.sellers || 0;
    }
    if (pendingProductsEl) {
        pendingProductsEl.textContent = data.products || 0;
    }
    if (pendingReviewsEl) {
        pendingReviewsEl.textContent = data.reviews || 0;
    }
}

// Load system health
async function loadSystemHealth() {
    try {
        // Check if adminAPI is available
        if (typeof adminAPI === 'undefined') {
            console.error('adminAPI is not available');
            updateSystemHealth(null);
            return;
        }
        
        const response = await adminAPI.getDashboardHealth();
        if (response && response.success && response.data) {
            updateSystemHealth(response.data);
        } else {
            console.warn('Failed to load system health, using fallback');
            updateSystemHealth(null);
        }
    } catch (error) {
        console.error('Failed to load system health:', error);
        updateSystemHealth(null);
    }
}

// Update system health display
function updateSystemHealth(health) {
    if (!health) {
        // Show fallback/unknown status
        const healthCards = document.querySelectorAll('.health-card');
        healthCards.forEach((card) => {
            const icon = card.querySelector('.health-icon');
            const statusText = card.querySelector('.health-status');
            if (icon) icon.textContent = '🟡';
            if (statusText) statusText.textContent = 'Không xác định';
        });
        return;
    }
    
    // Update Database card
    if (health.database) {
        const dbCard = document.querySelector('.health-card[data-service="database"]');
        if (dbCard) {
            const icon = dbCard.querySelector('.health-icon');
            const statusText = dbCard.querySelector('.health-status');
            const metrics = dbCard.querySelector('.health-metrics');
            
            if (icon) {
                icon.textContent = health.database.status === 'healthy' ? '🟢' : '🔴';
            }
            if (statusText) {
                statusText.textContent = health.database.message || 'Không xác định';
            }
            if (metrics && health.database.collections) {
                const collections = health.database.collections;
                metrics.innerHTML = `
                    <span>Users: ${collections.users || 0}</span>
                    <span>Products: ${collections.products || 0}</span>
                    <span>Orders: ${collections.orders || 0}</span>
                `;
            }
        }
    }
    
    // Update Cache card (Redis)
    if (health.cache) {
        const cacheCard = document.querySelector('.health-card[data-service="cache"]');
        if (cacheCard) {
            const icon = cacheCard.querySelector('.health-icon');
            const statusText = cacheCard.querySelector('.health-status');
            const metrics = cacheCard.querySelector('.health-metrics');
            
            if (icon) {
                icon.textContent = health.cache.status === 'healthy' ? '🟢' : '🟡';
            }
            if (statusText) {
                statusText.textContent = health.cache.message || 'Không xác định';
            }
            if (metrics) {
                metrics.innerHTML = '<span>Hoạt động bình thường</span>';
            }
        }
    }
    
    // Update API Server card
    if (health.api) {
        const apiCard = document.querySelector('.health-card[data-service="api"]');
        if (apiCard) {
            const icon = apiCard.querySelector('.health-icon');
            const statusText = apiCard.querySelector('.health-status');
            const metrics = apiCard.querySelector('.health-metrics');
            
            if (icon) {
                icon.textContent = health.api.status === 'healthy' ? '🟢' : '🔴';
            }
            if (statusText) {
                statusText.textContent = health.api.message || 'Không xác định';
            }
            if (metrics && health.api.uptime !== undefined) {
                const hours = Math.floor(health.api.uptime / 3600);
                const minutes = Math.floor((health.api.uptime % 3600) / 60);
                metrics.innerHTML = `<span>Uptime: ${hours}h ${minutes}m</span>`;
            }
        }
    }
    
    // Update System card (CPU, Memory)
    if (health.system) {
        const systemCard = document.querySelector('.health-card[data-service="system"]');
        if (systemCard) {
            const icon = systemCard.querySelector('.health-icon');
            const statusText = systemCard.querySelector('.health-status');
            const metrics = systemCard.querySelector('.health-metrics');
            
            if (icon) icon.textContent = '🟢';
            if (statusText) statusText.textContent = 'Hoạt động bình thường';
            
            if (metrics && health.system.memory && health.system.cpu) {
                const mem = health.system.memory;
                const cpu = health.system.cpu;
                metrics.innerHTML = `
                    <span>Memory: ${mem.usage || 'N/A'}</span>
                    <span>CPU Load: ${cpu.load || 'N/A'}</span>
                `;
            }
        }
    }
}

// Utility functions
function getActivityIcon(type) {
    const icons = {
        // API types
        'user': '👤',
        'order': '📦',
        'product': '📚',
        'review': '⭐',
        // Legacy types
        'user_register': '👤',
        'seller_approve': '✅',
        'product_add': '📚',
        'order_create': '📦',
        'payment_received': '💰',
        'review_add': '⭐'
    };
    return icons[type] || '📝';
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function refreshDashboard() {
    initializeDashboard();
    showToast('Dashboard đã được làm mới', 'success');
}

function exportReport() {
    showToast('Tính năng xuất báo cáo đang được phát triển', 'info');
}

function loadMoreActivity() {
    window.location.href = 'activity.php';
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showStatsError() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    
    statsGrid.innerHTML = `
        <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(30px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
            <div class="error-icon" style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Không thể tải thống kê</p>
            <button class="btn btn-outline" onclick="loadStats()" style="margin-top: 1rem;">Thử lại</button>
        </div>
    `;
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

// Setup chart period change listeners
function setupChartListeners() {
    const revenuePeriodSelect = document.getElementById('revenuePeriod');
    const ordersPeriodSelect = document.getElementById('ordersPeriod');
    
    if (revenuePeriodSelect) {
        revenuePeriodSelect.addEventListener('change', function() {
            loadCharts();
        });
    }
    
    if (ordersPeriodSelect) {
        ordersPeriodSelect.addEventListener('change', function() {
            loadCharts();
        });
    }
}
