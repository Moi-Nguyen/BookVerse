(function() {
    function initDashboard() {
        console.log('🚀 Dashboard page loaded, initializing...');
        console.log('📦 Checking dependencies...');
        console.log('- api available?', typeof api !== 'undefined');
        console.log('- SellerDashboard available?', typeof SellerDashboard !== 'undefined');
        console.log('- sellerDashboard instance?', typeof window.sellerDashboard !== 'undefined');

        if (typeof api === 'undefined') {
            console.log('⏳ Waiting for api.js to load...');
            setTimeout(initDashboard, 100);
            return;
        }

        if (typeof SellerDashboard !== 'undefined') {
            if (!window.sellerDashboard) {
                console.log('✅ Initializing SellerDashboard...');
                try {
                    window.sellerDashboard = new SellerDashboard();
                    console.log('✅ SellerDashboard initialized successfully');
                } catch (error) {
                    console.error('❌ Error initializing SellerDashboard:', error);
                    loadDashboardDataDirectly();
                }
            } else {
                console.log('✅ SellerDashboard already initialized, reloading data...');
                window.sellerDashboard.loadDashboardData();
            }
        } else {
            console.log('⚠️ SellerDashboard class not found, loading data directly...');
            loadDashboardDataDirectly();
        }
    }

    window.addEventListener('load', () => {
        setTimeout(initDashboard, 100);
    });
})();

async function loadDashboardDataDirectly() {
    try {
        console.log('📡 Loading dashboard data directly...');
        const response = await api.getSellerDashboard();
        console.log('📦 API Response:', response);

        if (response && response.success) {
            const { stats, growth, recentOrders, lowStockProducts, topProducts, quickStats, salesChartData } = response.data;

            if (stats) updateStatsDirectly(stats);
            if (growth) updateGrowthDirectly(growth);
            if (quickStats) updateQuickStatsDirectly(quickStats);
            if (recentOrders) updateRecentOrdersDirectly(recentOrders);
            if (topProducts) updateTopProductsDirectly(topProducts);
            if (salesChartData && salesChartData.length > 0) {
                updateSalesChartDirectly(salesChartData);
            }

            console.log('✅ Dashboard data loaded directly!');
        } else {
            console.warn('⚠️ API response was not successful:', response);
        }
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        const isNetworkError = !navigator.onLine || error.message?.includes('fetch') || error.message?.includes('network');
        const isAuthError = error.message?.includes('401') || error.message?.includes('Unauthorized');

        if (isNetworkError || isAuthError) {
            if (typeof showToast === 'function') {
                showToast('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối mạng.', 'error');
            }
        }
    }
}

function updateStatsDirectly(stats) {
    const formatPrice = amount => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount || 0);

    document.querySelector('[data-stat=\"totalProducts\"]')?.textContent = stats.totalProducts || 0;
    const revenueEl = document.querySelector('[data-stat=\"totalRevenue\"]');
    if (revenueEl) revenueEl.textContent = formatPrice(stats.totalRevenue || 0);
    document.querySelector('[data-stat=\"totalOrders\"]')?.textContent = stats.totalOrders || 0;
    document.querySelector('[data-stat=\"pendingOrders\"]')?.textContent = stats.pendingOrders || 0;
}

function updateGrowthDirectly(growth) {
    const applyGrowth = (key, value) => {
        const trendEl = document.querySelector(`[data-growth=\"${key}\"]`);
        if (!trendEl) return;

        const icon = trendEl.querySelector('.trend-icon');
        const text = trendEl.querySelector('.trend-value');

        if (!icon || !text) return;

        let trendIcon = '→';
        if (value > 0) trendIcon = '↗️';
        if (value < 0) trendIcon = '↘️';

        icon.textContent = trendIcon;
        text.textContent = value > 0 ? `+${value}%` : `${value}%`;
    };

    Object.entries(growth || {}).forEach(([key, value]) => applyGrowth(key, value));
}

function updateQuickStatsDirectly(quickStats) {
    const formatPrice = amount => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount || 0);

    const mapping = {
        todaySales: 'todaySales',
        weekSales: 'weekSales',
        monthSales: 'monthSales',
    };

    Object.entries(mapping).forEach(([dataKey, elementId]) => {
        const el = document.getElementById(elementId);
        if (el) el.textContent = formatPrice(quickStats[dataKey] || 0);
    });
}

function updateRecentOrdersDirectly(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;

    if (!orders.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan=\"7\" style=\"text-align: center; padding: 2rem; color: #6b7280;\">
                    Chưa có đơn hàng nào
                </td>
            </tr>
        `;
        return;
    }

    const formatPrice = amount => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount || 0);

    const formatDate = value => new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const statusMap = {
        pending: { text: 'Chờ xử lý', class: 'pending' },
        processing: { text: 'Đang xử lý', class: 'processing' },
        shipped: { text: 'Đã gửi', class: 'shipped' },
        delivered: { text: 'Đã giao', class: 'delivered' },
        completed: { text: 'Hoàn thành', class: 'delivered' },
        cancelled: { text: 'Đã hủy', class: 'cancelled' },
    };

    tbody.innerHTML = orders.map(order => {
        const status = statusMap[order.status] || { text: order.status, class: '' };
        const customer = order.customer || {};
        const name = customer.profile
            ? `${customer.profile.firstName || ''} ${customer.profile.lastName || ''}`.trim()
            : (customer.username || 'Khách hàng');

        return `
            <tr>
                <td>#${order.orderNumber || order._id?.slice(-6) || ''}</td>
                <td>
                    <div class=\"customer-info\">
                        <strong>${name || 'Khách hàng'}</strong>
                        <small>${customer.email || ''}</small>
                    </div>
                </td>
                <td>${order.items?.length || 0} sản phẩm</td>
                <td>${formatPrice(order.total || 0)}</td>
                <td>
                    <span class=\"status-badge ${status.class}\">
                        ${status.text}
                    </span>
                </td>
                <td>${formatDate(order.createdAt)}</td>
                <td>
                    <button class=\"btn btn-text btn-sm\" data-order-id=\"${order._id || ''}\">Chi tiết</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateTopProductsDirectly(products) {
    const list = document.querySelector('.top-products .items-list');
    if (!list) return;

    if (!products.length) {
        list.innerHTML = '<li class=\"empty-state\">Chưa có sản phẩm nào</li>';
        return;
    }

    list.innerHTML = products.map(product => `
        <li class=\"item\">
            <div class=\"item-info\">
                <h4>${product.title || 'Sản phẩm'}</h4>
                <div class=\"item-meta\">${product.category || 'Đang cập nhật'}</div>
            </div>
            <div class=\"item-value\">${product.sales || 0} đơn</div>
        </li>
    `).join('');
}

function updateSalesChartDirectly(salesData) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available for direct update');
        return;
    }

    const ctx = document.getElementById('salesChart');
    if (!ctx) {
        console.warn('salesChart canvas not found');
        return;
    }

    const labels = salesData.map(item => item.label || item.date || 'N/A');
    const values = salesData.map(item => item.value || 0);

    if (window.directSalesChart) {
        window.directSalesChart.data.labels = labels;
        window.directSalesChart.data.datasets[0].data = values;
        window.directSalesChart.update();
        return;
    }

    window.directSalesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0,
                        }).format(value),
                    },
                },
            },
        },
    });
}

