(() => {
    const state = {
        currentPage: 1,
        filters: {},
        selected: new Set(),
        categories: [],
        sellers: [],
        api: null,
        initialized: false,
        perPage: 20,
    };

    const getAdminAPI = () => window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);

    function waitForAdminAPI(method) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxRetries = 40;

            const check = () => {
                const api = getAdminAPI();
                if (api && (!method || typeof api[method] === 'function')) {
                    resolve(api);
                } else if (attempts < maxRetries) {
                    attempts += 1;
                    setTimeout(check, 150);
                } else {
                    reject(new Error('Admin API unavailable'));
                }
            };

            check();
        });
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) return '';
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0);
    }

    function formatDate(value) {
        if (!value) return 'N/A';
        return new Date(value).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function getStatusLabel(status) {
        const labels = {
            pending: '⏳ Chờ phê duyệt',
            approved: '✅ Đã phê duyệt',
            rejected: '❌ Đã từ chối',
            active: '🟢 Đang bán',
            inactive: '⚪ Ngừng bán',
        };
        return labels[status] || status || 'N/A';
    }

    async function initializeProductsPage() {
        if (state.initialized) {
            return;
        }

        try {
            state.api = await waitForAdminAPI('getProducts');
            setupEventListeners();
            await Promise.all([loadCategories(), loadSellers()]);
            await loadProducts();
            state.initialized = true;
        } catch (error) {
            console.error('Unable to initialize products page', error);
            window.showToast?.('Không thể tải dữ liệu sản phẩm', 'error');
        }
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(applyFilters, 400);
            });
        }

        ['categoryFilter', 'statusFilter', 'sellerFilter', 'priceFrom', 'priceTo'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', applyFilters);
            }
        });

        const approvalForm = document.getElementById('approvalForm');
        approvalForm?.addEventListener('submit', handleApprovalSubmit);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeProductDetailModal();
                closeApprovalModal();
                closeBulkActionsModal();
            }
        });
    }

    async function loadProducts() {
        try {
            window.showLoading?.();
            const params = new URLSearchParams({
                page: state.currentPage,
                limit: state.perPage,
                ...state.filters,
            });

            const response = await state.api.getProducts(params);
            const products = response?.data?.products || response?.data || [];
            renderProductsTable(Array.isArray(products) ? products : []);
            updatePagination(response?.data?.pagination);
            updateProductCount(response?.data?.pagination?.total ?? products.length);
        } catch (error) {
            console.error('loadProducts failed', error);
            renderProductsError();
        } finally {
            window.hideLoading?.();
        }
    }

    function renderProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        if (!products.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center; padding:40px;">
                        <div style="font-size:48px; margin-bottom:16px;">📦</div>
                        <h3>Không có sản phẩm nào</h3>
                        <p>Vui lòng điều chỉnh bộ lọc và thử lại</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products
            .map((product, index) => {
                const id = product._id || product.id || `product-${index}`;
                const title = escapeHtml(product.title || 'N/A');
                const author = escapeHtml(product.author || 'N/A');
                const sellerName = escapeHtml(
                    ((product.seller?.profile?.firstName || '') + ' ' + (product.seller?.profile?.lastName || '')).trim() ||
                        product.seller?.username ||
                        'N/A',
                );
                const categoryName = escapeHtml(product.category?.name || 'Chưa phân loại');
                const status = product.status || 'pending';
                const isActive = product.isActive !== false;
                const price = formatCurrency(product.price || 0);
                const originalPrice =
                    product.originalPrice && product.originalPrice > product.price
                        ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>`
                        : '';

                return `
                    <tr data-product-id="${id}">
                        <td>
                            <input type="checkbox" class="product-checkbox" value="${id}" onchange="toggleProductSelection('${id}')">
                        </td>
                        <td>
                            <div class="product-title-cell">
                                <strong class="product-title">${title}</strong>
                            </div>
                        </td>
                        <td><span class="product-author">${author}</span></td>
                        <td>
                            <div class="seller-info">
                                <span class="seller-name">${sellerName}</span>
                                ${product.seller?.username ? `<span class="seller-username">@${escapeHtml(product.seller.username)}</span>` : ''}
                            </div>
                        </td>
                        <td><span class="category-badge">${categoryName}</span></td>
                        <td>
                            <div class="price-cell">
                                <span class="price-value">${price}</span>
                                ${originalPrice}
                            </div>
                        </td>
                        <td>
                            <span class="status-badge status-${status}">${getStatusLabel(status)}</span>
                            ${!isActive ? '<span class="status-badge status-inactive">Không hoạt động</span>' : ''}
                        </td>
                        <td>${formatDate(product.createdAt)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-primary" onclick="viewProductDetail('${id}')" title="Xem chi tiết">
                                    <span class="btn-icon">👁️</span>
                                    <span class="btn-text">Xem</span>
                                </button>
                                ${
                                    status === 'pending'
                                        ? `
                                    <button class="btn btn-sm btn-success" onclick="showApprovalModal('${id}', 'approve')" title="Phê duyệt">
                                        <span class="btn-icon">✅</span>
                                        <span class="btn-text">Duyệt</span>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="showApprovalModal('${id}', 'reject')" title="Từ chối">
                                        <span class="btn-icon">❌</span>
                                        <span class="btn-text">Từ chối</span>
                                    </button>`
                                        : ''
                                }
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join('');
    }

    function renderProductsError() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="error-state">
                    <div class="error-icon">⚠️</div>
                    <p>Không thể tải danh sách sản phẩm. Vui lòng thử lại.</p>
                    <button class="btn btn-outline" onclick="loadProducts()">Thử lại</button>
                </td>
            </tr>
        `;
    }

    function updatePagination(pagination) {
        const container = document.getElementById('pagination');
        if (!container) return;

        if (!pagination) {
            container.innerHTML = '';
            return;
        }

        const { totalPages = 1, page = 1 } = pagination;
        state.currentPage = page;

        const buildButton = (label, targetPage, disabled = false, active = false) => `
            <button class="page-btn ${active ? 'active' : ''}" ${
            disabled ? 'disabled' : `onclick="changeProductsPage(${targetPage})"`
        }>${label}</button>
        `;

        let html = buildButton('«', page - 1, page <= 1);

        for (let p = 1; p <= totalPages; p += 1) {
            if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                html += buildButton(p, p, false, p === page);
            } else if (Math.abs(p - page) === 2) {
                html += '<span class="page-ellipsis">…</span>';
            }
        }

        html += buildButton('»', page + 1, page >= totalPages);
        container.innerHTML = html;
    }

    function updateProductCount(total) {
        const el = document.getElementById('productCount');
        if (el) {
            el.textContent = `${total} sản phẩm`;
        }
    }

    async function loadCategories() {
        try {
            const response = await state.api.request('/categories');
            state.categories = response?.data?.categories || [];
            const select = document.getElementById('categoryFilter');
            if (select) {
                select.innerHTML = '<option value="">Tất cả danh mục</option>';
                state.categories.forEach((category) => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.warn('loadCategories failed', error);
        }
    }

    async function loadSellers() {
        try {
            const response = await state.api.request('/users?seller=true');
            state.sellers = response?.data?.users || [];
            const select = document.getElementById('sellerFilter');
            if (select) {
                select.innerHTML = '<option value="">Tất cả người bán</option>';
                state.sellers.forEach((seller) => {
                    const option = document.createElement('option');
                    option.value = seller._id;
                    option.textContent =
                        `${seller.profile?.firstName || ''} ${seller.profile?.lastName || ''}`.trim() ||
                        seller.username ||
                        'Người bán';
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.warn('loadSellers failed', error);
        }
    }

    function collectFilters() {
        state.filters = {
            search: document.getElementById('searchInput')?.value || '',
            category: document.getElementById('categoryFilter')?.value || '',
            status: document.getElementById('statusFilter')?.value || '',
            seller: document.getElementById('sellerFilter')?.value || '',
            priceFrom: document.getElementById('priceFrom')?.value || '',
            priceTo: document.getElementById('priceTo')?.value || '',
        };

        Object.keys(state.filters).forEach((key) => {
            if (!state.filters[key]) {
                delete state.filters[key];
            }
        });
    }

    window.applyFilters = function applyFilters() {
        collectFilters();
        state.currentPage = 1;
        loadProducts();
    };

    window.clearFilters = function clearFilters() {
        ['searchInput', 'categoryFilter', 'statusFilter', 'sellerFilter', 'priceFrom', 'priceTo'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        state.filters = {};
        state.currentPage = 1;
        loadProducts();
    };

    window.changeProductsPage = function changeProductsPage(page) {
        if (page < 1) return;
        state.currentPage = page;
        loadProducts();
    };

    window.toggleSelectAll = function toggleSelectAll() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = selectAll.checked;
            if (selectAll.checked) {
                state.selected.add(checkbox.value);
            } else {
                state.selected.delete(checkbox.value);
            }
        });
    };

    window.toggleProductSelection = function toggleProductSelection(productId) {
        const checkbox = document.querySelector(`input.product-checkbox[value="${productId}"]`);
        if (checkbox?.checked) {
            state.selected.add(productId);
        } else {
            state.selected.delete(productId);
        }

        const total = document.querySelectorAll('.product-checkbox').length;
        const checked = document.querySelectorAll('.product-checkbox:checked').length;
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = total > 0 && total === checked;
        }
    };

    window.viewProductDetail = async function viewProductDetail(productId) {
        try {
            window.showLoading?.();
            const response = await state.api.getProduct(productId);
            if (response?.success) {
                populateProductDetail(response.data.product || response.data);
                const modal = document.getElementById('productDetailModal');
                if (modal) modal.style.display = 'flex';
            } else {
                throw new Error(response?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('viewProductDetail failed', error);
            window.showToast?.('Không thể tải chi tiết sản phẩm', 'error');
        } finally {
            window.hideLoading?.();
        }
    };

    function populateProductDetail(product = {}) {
        const container = document.getElementById('productDetailContent');
        if (!container) return;

        const images = (product.images || []).map((img) => `<img src="${img}" alt="${escapeHtml(product.title || '')}" class="product-detail-image">`).join('');

        container.innerHTML = `
            <div class="product-detail-grid">
                <div class="detail-section">
                    <h4>Thông tin cơ bản</h4>
                    <div class="product-images">
                        ${images || '<p>Không có hình ảnh</p>'}
                    </div>
                    <div class="detail-info">
                        <div class="info-row">
                            <span class="info-label">Tên sách:</span>
                            <span class="info-value">${escapeHtml(product.title || 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Tác giả:</span>
                            <span class="info-value">${escapeHtml(product.author || 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Danh mục:</span>
                            <span class="info-value">${escapeHtml(product.category?.name || 'Chưa phân loại')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Giá bán:</span>
                            <span class="info-value">${formatCurrency(product.price)}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Thông tin người bán</h4>
                    <div class="detail-info">
                        <div class="info-row">
                            <span class="info-label">Tên:</span>
                            <span class="info-value">${escapeHtml(product.seller?.profile?.firstName || '')} ${escapeHtml(product.seller?.profile?.lastName || '')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${escapeHtml(product.seller?.email || 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Trạng thái:</span>
                            <span class="info-value">${getStatusLabel(product.status)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    window.closeProductDetailModal = function closeProductDetailModal() {
        const modal = document.getElementById('productDetailModal');
        if (modal) modal.style.display = 'none';
    };

    window.showApprovalModal = function showApprovalModal(productId, action = 'approve') {
        const modal = document.getElementById('approvalModal');
        if (!modal) return;

        document.getElementById('approvalProductId').value = productId;
        document.getElementById('approvalAction').value = action;
        document.getElementById('approvalModalTitle').textContent =
            action === 'approve' ? 'Phê duyệt sản phẩm' : 'Từ chối sản phẩm';
        modal.style.display = 'flex';
    };

    window.closeApprovalModal = function closeApprovalModal() {
        const modal = document.getElementById('approvalModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('approvalForm');
        form?.reset();
    };

    async function handleApprovalSubmit(event) {
        event.preventDefault();
        const productId = document.getElementById('approvalProductId').value;
        const action = document.getElementById('approvalAction').value;
        const reason = document.getElementById('approvalReason').value;

        if (!productId || !action) return;

        try {
            window.showLoading?.();
            if (action === 'approve') {
                await state.api.approveProduct(productId);
            } else {
                await state.api.rejectProduct(productId, reason);
            }
            window.showToast?.('Đã cập nhật trạng thái sản phẩm', 'success');
            closeApprovalModal();
            loadProducts();
        } catch (error) {
            console.error('handleApprovalSubmit failed', error);
            window.showToast?.('Không thể cập nhật sản phẩm', 'error');
        } finally {
            window.hideLoading?.();
        }
    }

    window.showBulkActions = function showBulkActions() {
        const modal = document.getElementById('bulkActionsModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeBulkActionsModal = function closeBulkActionsModal() {
        const modal = document.getElementById('bulkActionsModal');
        if (modal) modal.style.display = 'none';
        const select = document.getElementById('bulkActionSelect');
        const reason = document.getElementById('bulkReason');
        if (select) select.value = '';
        if (reason) reason.value = '';
    };

    async function performBulkAction(action, reason = '') {
        if (!state.selected.size) {
            window.showToast?.('Vui lòng chọn ít nhất một sản phẩm', 'warning');
            return;
        }

        const ids = Array.from(state.selected);
        const tasks = ids.map((id) => {
            switch (action) {
                case 'approve':
                    return state.api.approveProduct(id);
                case 'reject':
                    return state.api.rejectProduct(id, reason);
                case 'activate':
                    return state.api.updateProductStatus(id, 'approved', true);
                case 'deactivate':
                    return state.api.updateProductStatus(id, null, false);
                case 'delete':
                    return state.api.request(`/products/${id}`, { method: 'DELETE' });
                default:
                    return Promise.resolve();
            }
        });

        try {
            window.showLoading?.();
            await Promise.allSettled(tasks);
            window.showToast?.('Đã thực hiện thao tác hàng loạt', 'success');
            state.selected.clear();
            loadProducts();
        } catch (error) {
            console.error('performBulkAction failed', error);
            window.showToast?.('Không thể hoàn thành thao tác hàng loạt', 'error');
        } finally {
            window.hideLoading?.();
        }
    }

    window.applyBulkAction = function applyBulkAction() {
        const select = document.getElementById('bulkAction');
        const action = select?.value;
        if (!action) {
            window.showToast?.('Vui lòng chọn thao tác', 'warning');
            return;
        }
        performBulkAction(action);
    };

    window.executeBulkAction = function executeBulkAction() {
        const action = document.getElementById('bulkActionSelect')?.value;
        const reason = document.getElementById('bulkReason')?.value || '';
        if (!action) {
            window.showToast?.('Vui lòng chọn thao tác', 'warning');
            return;
        }
        closeBulkActionsModal();
        performBulkAction(action, reason);
    };

    window.exportProducts = function exportProducts() {
        window.showToast?.('Tính năng xuất báo cáo sẽ sớm có mặt', 'info');
    };

    document.addEventListener('DOMContentLoaded', initializeProductsPage);
})();

