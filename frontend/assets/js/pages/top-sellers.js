// Top Sellers Manager with Real API Integration
class TopSellersManager {
    constructor() {
        this.sellers = [];
        this.allSellers = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            search: '',
            sortBy: 'rating',
            location: '',
            rating: ''
        };
        this.currentView = 'grid';
        this.currentSellerId = null;
        this.initializeEventListeners();
        this.loadSellers();
    }

    initializeEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.debounceSearch();
            });
        }

        // Sort select
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Location filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.applyFilters();
            });
        }

        // Rating filter
        const ratingFilter = document.getElementById('ratingFilter');
        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                this.filters.rating = e.target.value;
                this.applyFilters();
            });
        }

        // Filters toggle
        const filtersToggle = document.getElementById('filtersToggle');
        if (filtersToggle) {
            filtersToggle.addEventListener('click', () => {
                const content = document.getElementById('filtersContent');
                content.classList.toggle('active');
                const icon = filtersToggle.querySelector('.toggle-icon');
                icon.textContent = content.classList.contains('active') ? '🔼' : '🔽';
            });
        }

        // Modal close on overlay click
        const modal = document.getElementById('sellerModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 500);
    }

    async loadSellers() {
        try {
            this.showLoading();
            
            // Call real API
            const response = await api.getSellers({
                limit: 100 // Get all sellers, we'll paginate client-side
            });

            if (response.success && response.data && response.data.sellers) {
                this.allSellers = this.processSellersData(response.data.sellers);
                this.applyFilters();
                this.updateHeroStats();
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error loading sellers:', error);
            this.showError('Không thể tải danh sách người bán. Vui lòng thử lại sau.');
        } finally {
            this.hideLoading();
        }
    }

    processSellersData(sellers) {
        return sellers.map(seller => ({
            id: seller._id,
            name: seller.profile?.firstName && seller.profile?.lastName 
                ? `${seller.profile.firstName} ${seller.profile.lastName}`
                : seller.username,
            username: seller.username,
            businessName: seller.sellerProfile?.businessName || seller.username,
            email: seller.email || '',
            avatar: this.getInitials(seller.profile?.firstName || seller.username),
            avatarUrl: seller.profile?.avatar || seller.profile?.avatarUrl || null,
            rating: parseFloat(seller.sellerProfile?.rating) || 0,
            totalOrders: parseInt(seller.sellerProfile?.totalOrders) || 0,
            totalRevenue: parseFloat(seller.sellerProfile?.totalRevenue) || 0,
            totalProducts: parseInt(seller.sellerProfile?.totalProducts) || 0,
            location: seller.profile?.address?.city || 'Chưa cập nhật',
            description: seller.sellerProfile?.description || 'Chưa có mô tả',
            joinDate: seller.createdAt || new Date(),
            isApproved: seller.sellerProfile?.isApproved || false
        }));
    }

    getInitials(name) {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    isValidUrl(url) {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch {
            // If it's a relative path, check if it's a valid string
            return typeof url === 'string' && url.trim().length > 0;
        }
    }

    getFullAvatarUrl(avatarUrl) {
        if (!avatarUrl) return '';
        // If it's already a full URL, return as is
        if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
            return avatarUrl;
        }
        // If it starts with /, it's an absolute path from root
        if (avatarUrl.startsWith('/')) {
            return avatarUrl;
        }
        // Otherwise, assume it's relative to assets/images
        return `../../assets/images/${avatarUrl}`;
    }

    applyFilters() {
        let filtered = [...this.allSellers];

        // Search filter
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(seller => 
                seller.name.toLowerCase().includes(search) ||
                seller.businessName.toLowerCase().includes(search) ||
                seller.username.toLowerCase().includes(search) ||
                seller.email.toLowerCase().includes(search)
            );
        }

        // Location filter
        if (this.filters.location) {
            filtered = filtered.filter(seller => 
                seller.location.toLowerCase().includes(this.filters.location.toLowerCase())
            );
        }

        // Rating filter
        if (this.filters.rating) {
            const minRating = parseFloat(this.filters.rating);
            filtered = filtered.filter(seller => seller.rating >= minRating);
        }

        // Sort
        switch (this.filters.sortBy) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        // Pagination
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.sellers = filtered.slice(start, end);

        this.displaySellers();
        this.updatePagination({
            currentPage: this.currentPage,
            totalPages: Math.ceil(filtered.length / this.itemsPerPage),
            total: filtered.length,
            start: start + 1,
            end: Math.min(end, filtered.length)
        });
    }

    displaySellers() {
        const grid = document.getElementById('sellersGrid');
        if (!grid) return;

        if (this.sellers.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        
        grid.className = `sellers-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        grid.innerHTML = this.sellers.map((seller, index) => `
            <div class="seller-card ${this.currentView === 'list' ? 'list-view' : ''}" style="animation-delay: ${index * 0.1}s">
                <div class="seller-header">
                    <div class="seller-avatar" data-initials="${this.escapeHtml(seller.avatar)}">
                        <span class="avatar-initials">${this.escapeHtml(seller.avatar)}</span>
                        ${seller.avatarUrl && this.isValidUrl(seller.avatarUrl)
                            ? `<img src="${this.escapeHtml(this.getFullAvatarUrl(seller.avatarUrl))}" alt="${this.escapeHtml(seller.name)}" onerror="this.onerror=null; this.style.display='none'; this.parentElement.classList.add('show-initials');" onload="this.parentElement.classList.add('has-image');">`
                            : ''
                        }
                    </div>
                    <div class="seller-info">
                        <h3 class="seller-name">${this.escapeHtml(seller.name)}</h3>
                        <p class="seller-business">${this.escapeHtml(seller.businessName || 'Người bán uy tín')}</p>
                        <div class="seller-rating">
                            <span>⭐</span>
                            <span>${Number(seller.rating || 0).toFixed(1)}</span>
                            <span style="color: #9ca3af; margin-left: 0.5rem;">${this.formatNumber(seller.totalOrders)}+ đơn</span>
                        </div>
                    </div>
                </div>
                
                <div class="seller-stats">
                    <div class="stat-item">
                        <div class="stat-value">${this.formatNumber(seller.totalOrders)}</div>
                        <div class="stat-label">Đơn hàng</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${this.formatCurrency(seller.totalRevenue)}</div>
                        <div class="stat-label">Doanh thu</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${this.formatNumber(seller.totalProducts)}</div>
                        <div class="stat-label">Sản phẩm</div>
                    </div>
                </div>
                
                <div class="seller-actions">
                    <button class="action-btn primary" onclick="sellersManager.viewSellerDetail('${seller.id}')">
                        <span class="btn-icon">👁️</span>
                        <span>Chi tiết</span>
                    </button>
                    <button class="action-btn secondary" onclick="sellersManager.viewSellerStore('${seller.id}')">
                        <span class="btn-icon">🏪</span>
                        <span>Xem cửa hàng</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateHeroStats() {
        const totalSellers = this.allSellers.length;
        
        // Calculate total products - ensure we're summing numbers
        const totalProducts = this.allSellers.reduce((sum, s) => {
            const products = parseInt(s.totalProducts) || 0;
            return sum + products;
        }, 0);
        
        // Calculate average rating - only count sellers with ratings > 0
        const sellersWithRatings = this.allSellers.filter(s => {
            const rating = parseFloat(s.rating) || 0;
            return rating > 0;
        });
        
        const avgRating = sellersWithRatings.length > 0
            ? (sellersWithRatings.reduce((sum, s) => {
                const rating = parseFloat(s.rating) || 0;
                return sum + rating;
            }, 0) / sellersWithRatings.length).toFixed(1)
            : '0.0';

        const totalSellersEl = document.getElementById('totalSellers');
        const totalProductsEl = document.getElementById('totalProducts');
        const avgRatingEl = document.getElementById('avgRating');

        if (totalSellersEl) totalSellersEl.textContent = this.formatNumber(totalSellers);
        if (totalProductsEl) totalProductsEl.textContent = this.formatNumber(totalProducts);
        if (avgRatingEl) avgRatingEl.textContent = avgRating;
    }

    updatePagination(pagination) {
        const section = document.getElementById('paginationSection');
        const info = document.getElementById('paginationInfo');
        const controls = document.getElementById('paginationControls');
        
        if (pagination.totalPages <= 1) {
            if (section) section.style.display = 'none';
            return;
        }
        
        if (section) section.style.display = 'flex';
        
        if (info) {
            info.textContent = `Hiển thị ${pagination.start}-${pagination.end} của ${pagination.total} người bán`;
        }

        const countEl = document.getElementById('sellersCount');
        if (countEl) {
            countEl.textContent = `Tìm thấy ${pagination.total} người bán`;
        }

        if (controls) {
            controls.innerHTML = this.generatePaginationHTML(pagination);
        }
    }

    generatePaginationHTML(pagination) {
        let html = '';
        
        // Previous button
        html += `<button class="pagination-btn" ${pagination.currentPage === 1 ? 'disabled' : ''} 
                 onclick="sellersManager.goToPage(${pagination.currentPage - 1})">‹</button>`;
        
        // Page numbers
        const startPage = Math.max(1, pagination.currentPage - 2);
        const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);
        
        if (startPage > 1) {
            html += `<button class="pagination-btn" onclick="sellersManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination-btn" style="border: none; cursor: default;">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination-btn ${i === pagination.currentPage ? 'active' : ''}" 
                     onclick="sellersManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < pagination.totalPages) {
            if (endPage < pagination.totalPages - 1) {
                html += `<span class="pagination-btn" style="border: none; cursor: default;">...</span>`;
            }
            html += `<button class="pagination-btn" onclick="sellersManager.goToPage(${pagination.totalPages})">${pagination.totalPages}</button>`;
        }
        
        // Next button
        html += `<button class="pagination-btn" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''} 
                 onclick="sellersManager.goToPage(${pagination.currentPage + 1})">›</button>`;
        
        return html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        this.displaySellers();
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('sortBy').value = 'rating';
        document.getElementById('locationFilter').value = '';
        document.getElementById('ratingFilter').value = '';
        
        this.filters = {
            search: '',
            sortBy: 'rating',
            location: '',
            rating: ''
        };
        this.currentPage = 1;
        this.applyFilters();
    }

    async viewSellerDetail(sellerId) {
        try {
            const seller = this.allSellers.find(s => s.id === sellerId);
            if (!seller) return;

            this.currentSellerId = sellerId;
            this.displaySellerDetail(seller);
            const modal = document.getElementById('sellerModal');
            if (modal) modal.style.display = 'flex';
        } catch (error) {
            console.error('Error loading seller detail:', error);
            this.showError('Không thể tải thông tin người bán');
        }
    }

    displaySellerDetail(seller) {
        const content = document.getElementById('sellerDetailContent');
        if (!content) return;

        content.innerHTML = `
            <div class="seller-detail">
                <div class="detail-header">
                    <div class="detail-avatar" data-initials="${this.escapeHtml(seller.avatar)}">
                        <span class="avatar-initials">${this.escapeHtml(seller.avatar)}</span>
                        ${seller.avatarUrl && this.isValidUrl(seller.avatarUrl)
                            ? `<img src="${this.escapeHtml(this.getFullAvatarUrl(seller.avatarUrl))}" alt="${this.escapeHtml(seller.name)}" onerror="this.onerror=null; this.style.display='none'; this.parentElement.classList.add('show-initials');" onload="this.parentElement.classList.add('has-image');">`
                            : ''
                        }
                    </div>
                    <div class="detail-info">
                        <h4>${this.escapeHtml(seller.name)}</h4>
                        <p>${this.escapeHtml(seller.businessName)}</p>
                        <div class="detail-rating">
                            <span>⭐ ${seller.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5>Thông tin liên hệ</h5>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${this.escapeHtml(seller.email || 'Chưa cập nhật')}</span>
                        </div>
                        <div class="detail-item">
                            <label>Khu vực:</label>
                            <span>${this.escapeHtml(seller.location)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Tham gia:</label>
                            <span>${this.formatDate(seller.joinDate)}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h5>Thống kê bán hàng</h5>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${this.formatNumber(seller.totalOrders)}</div>
                            <div class="stat-label">Tổng đơn hàng</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${this.formatCurrency(seller.totalRevenue)}</div>
                            <div class="stat-label">Tổng doanh thu</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${this.formatNumber(seller.totalProducts)}</div>
                            <div class="stat-label">Sản phẩm</div>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h5>Mô tả</h5>
                    <p>${this.escapeHtml(seller.description)}</p>
                </div>
            </div>
        `;
    }

    closeModal() {
        const modal = document.getElementById('sellerModal');
        if (modal) modal.style.display = 'none';
        this.currentSellerId = null;
    }

    viewSellerProducts(sellerId) {
        window.location.href = `store.php?id=${sellerId}`;
    }
    
    viewSellerStore(sellerId) {
        const id = sellerId || this.currentSellerId;
        if (id) {
            window.location.href = `store.php?id=${id}`;
        }
    }

    showLoading() {
        const loading = document.getElementById('loadingState');
        const grid = document.getElementById('sellersGrid');
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
    }

    hideLoading() {
        const loading = document.getElementById('loadingState');
        const grid = document.getElementById('sellersGrid');
        if (loading) loading.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }

    showEmptyState() {
        const empty = document.getElementById('emptyState');
        const grid = document.getElementById('sellersGrid');
        if (empty) empty.style.display = 'block';
        if (grid) grid.style.display = 'none';
    }

    hideEmptyState() {
        const empty = document.getElementById('emptyState');
        const grid = document.getElementById('sellersGrid');
        if (empty) empty.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }

    // Utility methods
    formatCurrency(amount) {
        if (!amount || amount === 0) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatNumber(number) {
        if (!number) return '0';
        return new Intl.NumberFormat('vi-VN').format(number);
    }

    formatDate(date) {
        if (!date) return 'Chưa cập nhật';
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        console.error('Sellers Error:', message);
        // You can implement a toast notification here
        alert(message);
    }
}

// Initialize sellers manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof api !== 'undefined') {
        window.sellersManager = new TopSellersManager();
    } else {
        console.error('API not loaded. Make sure api.js is included.');
    }
});
