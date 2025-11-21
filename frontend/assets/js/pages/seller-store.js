// Seller Store Manager
class SellerStoreManager {
    constructor() {
        this.sellerId = this.getSellerIdFromURL();
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            search: '',
            category: '',
            sort: '-createdAt'
        };
        this.currentView = 'grid';
        this.seller = null;
        
        if (!this.sellerId) {
            this.showError('Không tìm thấy thông tin cửa hàng');
            return;
        }
        
        this.initializeEventListeners();
        this.loadSellerInfo();
        this.loadProducts();
    }
    
    getSellerIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || params.get('seller');
    }
    
    initializeEventListeners() {
        // Search
        const searchInput = document.getElementById('productSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.trim();
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentPage = 1;
                    this.loadProducts();
                }, 300);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(searchTimeout);
                    this.currentPage = 1;
                    this.loadProducts();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                clearTimeout(searchTimeout);
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
    }
    
    async loadSellerInfo() {
        try {
            console.log('Loading seller info for ID:', this.sellerId);
            const response = await api.getSellers({ limit: 100 });
            console.log('Sellers response:', response);
            
            if (response && response.success && response.data && response.data.sellers) {
                const sellers = response.data.sellers;
                console.log(`Found ${sellers.length} sellers, looking for ID: ${this.sellerId}`);
                
                // Try multiple ways to match seller ID
                this.seller = sellers.find(s => {
                    const sellerId = s._id?.toString() || s.id?.toString();
                    const targetId = this.sellerId.toString();
                    return sellerId === targetId;
                });
                
                if (this.seller) {
                    console.log('✅ Seller found:', {
                        id: this.seller._id,
                        username: this.seller.username,
                        totalOrders: this.seller.sellerProfile?.totalOrders,
                        totalRevenue: this.seller.sellerProfile?.totalRevenue
                    });
                    this.displaySellerInfo(this.seller);
                } else {
                    console.warn('❌ Seller not found in list');
                    console.log('Available seller IDs:', sellers.map(s => s._id?.toString() || s.id?.toString()));
                    console.log('Looking for:', this.sellerId.toString());
                    // Don't show error, just show default info
                    document.getElementById('sellerName').textContent = 'Đang tải...';
                }
            } else {
                console.warn('Invalid sellers response:', response);
            }
        } catch (error) {
            console.error('Error loading seller info:', error);
            // Don't block page load if seller info fails
        }
    }
    
    displaySellerInfo(seller) {
        const name = seller.profile?.firstName && seller.profile?.lastName 
            ? `${seller.profile.firstName} ${seller.profile.lastName}`
            : seller.username;
        
        // Log seller data for debugging
        console.log('Displaying seller info:', {
            name,
            sellerProfile: seller.sellerProfile,
            totalOrders: seller.sellerProfile?.totalOrders,
            totalRevenue: seller.sellerProfile?.totalRevenue,
            totalProducts: seller.sellerProfile?.totalProducts,
            rating: seller.sellerProfile?.rating
        });
        
        document.getElementById('sellerName').textContent = name;
        document.getElementById('sellerBusiness').textContent = seller.sellerProfile?.businessName || 'Người bán uy tín';
        
        // Rating
        const rating = parseFloat(seller.sellerProfile?.rating) || 0;
        document.getElementById('sellerRating').textContent = rating.toFixed(1);
        
        // Products
        const totalProducts = parseInt(seller.sellerProfile?.totalProducts) || 0;
        document.getElementById('sellerProducts').textContent = totalProducts;
        
        // Orders - ensure it's a number
        const totalOrders = parseInt(seller.sellerProfile?.totalOrders) || 0;
        document.getElementById('sellerOrders').textContent = totalOrders;
        
        // Revenue - ensure it's a number
        const totalRevenue = parseFloat(seller.sellerProfile?.totalRevenue) || 0;
        document.getElementById('sellerRevenue').textContent = this.formatCurrency(totalRevenue);
        
        // Location
        document.getElementById('locationText').textContent = seller.profile?.address?.city || 'Chưa cập nhật';
        
        // Avatar
        const initials = this.getInitials(name);
        document.getElementById('avatarInitials').textContent = initials;
        
        const avatarUrl = seller.profile?.avatar || seller.profile?.avatarUrl;
        if (avatarUrl) {
            const img = document.getElementById('avatarImage');
            img.src = this.getFullAvatarUrl(avatarUrl);
            img.style.display = 'block';
        }
    }
    
    getInitials(name) {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    getFullAvatarUrl(avatarUrl) {
        if (!avatarUrl) return '';
        if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
            return avatarUrl;
        }
        if (avatarUrl.startsWith('/')) {
            return avatarUrl;
        }
        return `../../assets/images/${avatarUrl}`;
    }
    
    getProductImageUrl(product) {
        // Handle images array - can be array of objects with url property or array of strings
        if (product.images && product.images.length > 0) {
            let imageUrl = null;
            const firstImage = product.images[0];
            
            // Check if it's an object with url property
            if (typeof firstImage === 'object' && firstImage !== null) {
                imageUrl = firstImage.url || firstImage.src || firstImage.path || null;
            } else if (typeof firstImage === 'string') {
                imageUrl = firstImage;
            }
            
            // If we have a valid imageUrl
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
                // If it's already a full URL, return as is
                if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                    return imageUrl;
                }
                
                // If it starts with /, it's an absolute path
                if (imageUrl.startsWith('/')) {
                    return imageUrl;
                }
                
                // If it starts with ../ or ./, return as is (relative path)
                if (imageUrl.startsWith('../') || imageUrl.startsWith('./')) {
                    return imageUrl;
                }
                
                // Otherwise, assume it's relative to assets/images/products
                return `../../assets/images/products/${imageUrl}`;
            }
        }
        
        // Return placeholder if no image found
        return '../../assets/images/placeholder-book.svg';
    }
    
    
    async loadProducts() {
        try {
            this.showLoading();
            
            if (!this.sellerId) {
                throw new Error('Seller ID is missing');
            }
            
            const params = new URLSearchParams({
                seller: this.sellerId,
                page: this.currentPage,
                limit: this.itemsPerPage
            });
            
            // Handle sort
            const sortValue = this.filters.sort || '-createdAt';
            if (sortValue.startsWith('-')) {
                params.append('sort', sortValue.substring(1));
                params.append('order', 'desc');
            } else {
                params.append('sort', sortValue);
                params.append('order', 'asc');
            }
            
            if (this.filters.search) {
                params.append('search', this.filters.search);
            }
            
            if (this.filters.category) {
                params.append('category', this.filters.category);
            }
            
            console.log('Loading products with params:', params.toString());
            console.log('Seller ID:', this.sellerId);
            
            const response = await api.request(`/products?${params.toString()}`);
            console.log('Products response:', response);
            
            if (response && response.success) {
                this.products = response.data?.products || response.products || [];
                const pagination = response.data?.pagination || response.pagination || {};
                
                console.log('Loaded products:', this.products.length);
                
                if (this.products.length === 0) {
                    console.warn('No products found for seller:', this.sellerId);
                }
                
                this.displayProducts();
                this.updatePagination(pagination);
                
                // Load categories only once
                if (this.currentPage === 1) {
                    this.loadCategories();
                }
            } else {
                const errorMsg = response?.message || response?.error || 'Failed to load products';
                console.error('API Error:', errorMsg, response);
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            const errorMessage = error.message || 'Không thể tải sản phẩm';
            this.showError(errorMessage);
            this.showEmptyState();
        } finally {
            this.hideLoading();
        }
    }
    
    async loadCategories() {
        try {
            const response = await api.request('/products/categories');
            if (response && response.success && response.data) {
                const categories = response.data.categories || response.data || [];
                const categoryFilter = document.getElementById('categoryFilter');
                
                if (categoryFilter && categories.length > 0) {
                    const currentValue = categoryFilter.value;
                    categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>' +
                        categories.map(cat => 
                            `<option value="${cat._id}">${this.escapeHtml(cat.name || cat.title || 'N/A')}</option>`
                        ).join('');
                    categoryFilter.value = currentValue;
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Don't show error for categories, it's not critical
        }
    }
    
    displayProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        if (this.products.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        
        grid.className = `products-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        grid.innerHTML = this.products.map(product => {
            try {
                const imageUrl = this.getProductImageUrl(product);
                const price = product.price || 0;
                const rating = product.rating?.average || 0;
                const sales = product.sales || product.totalSold || 0;
                const productId = product._id || product.id || '';
                
                return `
                    <div class="product-card ${this.currentView === 'list' ? 'list-view' : ''}" onclick="window.location.href='../products/detail.php?id=${productId}'">
                        <div class="product-image-wrapper">
                            <img src="${this.escapeHtml(imageUrl)}" 
                                 alt="${this.escapeHtml(product.title || 'Sản phẩm')}" 
                                 class="product-image" 
                                 loading="lazy"
                                 decoding="async"
                                 onload="this.classList.add('loaded');"
                                 onerror="this.onerror=null; this.src='../../assets/images/placeholder-book.svg'; this.classList.add('loaded');" />
                            <div class="image-placeholder"></div>
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${this.escapeHtml(product.title || 'N/A')}</h3>
                            <p class="product-author">${this.escapeHtml(product.author || 'N/A')}</p>
                            <div class="product-meta">
                                <div class="product-price">${this.formatCurrency(price)}</div>
                                <div class="product-rating">
                                    <span>⭐</span>
                                    <span>${rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error rendering product:', product, error);
                return '';
            }
        }).filter(html => html).join('');
    }
    
    switchView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        this.displayProducts();
    }
    
    updatePagination(pagination) {
        const section = document.getElementById('paginationSection');
        const info = document.getElementById('paginationInfo');
        const controls = document.getElementById('paginationControls');
        const countEl = document.getElementById('productsCount');
        
        const total = pagination.total || 0;
        const pages = pagination.pages || 1;
        const start = ((this.currentPage - 1) * this.itemsPerPage) + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, total);
        
        if (countEl) {
            countEl.textContent = `Tìm thấy ${total} sản phẩm`;
        }
        
        if (pages <= 1) {
            if (section) section.style.display = 'none';
            return;
        }
        
        if (section) section.style.display = 'flex';
        
        if (info) {
            info.textContent = `Hiển thị ${start}-${end} của ${total} sản phẩm`;
        }
        
        if (controls) {
            controls.innerHTML = this.generatePaginationHTML(pagination);
        }
    }
    
    generatePaginationHTML(pagination) {
        const currentPage = pagination.page || 1;
        const totalPages = pagination.pages || 1;
        let html = '';
        
        // Previous
        html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                 onclick="window.sellerStoreManager.goToPage(${currentPage - 1})">‹</button>`;
        
        // Pages
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            html += `<button class="pagination-btn" onclick="window.sellerStoreManager.goToPage(1)">1</button>`;
            if (startPage > 2) html += `<span class="pagination-btn" style="border: none; cursor: default;">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                     onclick="window.sellerStoreManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += `<span class="pagination-btn" style="border: none; cursor: default;">...</span>`;
            html += `<button class="pagination-btn" onclick="window.sellerStoreManager.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next
        html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                 onclick="window.sellerStoreManager.goToPage(${currentPage + 1})">›</button>`;
        
        return html;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    formatCurrency(amount) {
        if (!amount || amount === 0) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showLoading() {
        const loading = document.getElementById('loadingState');
        const grid = document.getElementById('productsGrid');
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
    }
    
    hideLoading() {
        const loading = document.getElementById('loadingState');
        const grid = document.getElementById('productsGrid');
        if (loading) loading.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }
    
    showEmptyState() {
        const empty = document.getElementById('emptyState');
        const grid = document.getElementById('productsGrid');
        if (empty) empty.style.display = 'block';
        if (grid) grid.style.display = 'none';
    }
    
    hideEmptyState() {
        const empty = document.getElementById('emptyState');
        const grid = document.getElementById('productsGrid');
        if (empty) empty.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }
    
    showError(message) {
        console.error('Store Error:', message);
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        } else {
            alert(message);
        }
        
        // Show empty state with error message
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
            const emptyText = emptyState.querySelector('.empty-text');
            if (emptyText) {
                emptyText.textContent = message;
            }
        }
    }
}

// Initialize store manager
document.addEventListener('DOMContentLoaded', () => {
    // Wait for API to be available
    function initStore() {
        if (typeof api !== 'undefined' && typeof window.api !== 'undefined') {
            window.sellerStoreManager = new SellerStoreManager();
            console.log('✅ Store Manager initialized');
        } else if (typeof window.api !== 'undefined') {
            // Use window.api if available
            window.api = window.api;
            window.sellerStoreManager = new SellerStoreManager();
            console.log('✅ Store Manager initialized');
        } else {
            console.warn('API not loaded, retrying...');
            setTimeout(initStore, 100);
        }
    }
    
    initStore();
});
