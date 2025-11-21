// Products List Page JavaScript for Bookverse

class ProductsListManager {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {
            search: '',
            categories: [],
            ratings: [],
            availability: [],
            sort: 'createdAt-desc'
        };
        this.products = [];
        this.totalProducts = 0;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.loadCategories();
        this.loadProducts();
        this.bindEvents();
        this.initializeFilters();
    }

    bindEvents() {
        // Search
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.currentPage = 1;
                this.loadProducts();
            }, 500));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadProducts();
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }


        // Rating filters
        const ratingFilters = document.querySelectorAll('.rating-filter input[type="checkbox"]');
        ratingFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.updateRatingFilters();
                this.currentPage = 1;
                this.loadProducts();
            });
        });

        // Availability filters
        const availabilityFilters = document.querySelectorAll('.availability-filter input[type="checkbox"]');
        availabilityFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.updateAvailabilityFilters();
                this.currentPage = 1;
                this.loadProducts();
            });
        });

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    initializeFilters() {
        // Load URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search');
        const category = urlParams.get('category');
        const sort = urlParams.get('sort');

        if (search) {
            this.currentFilters.search = search;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = search;
        }

        if (category) {
            this.currentFilters.categories = [category];
        }

        if (sort) {
            this.currentFilters.sort = sort;
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) sortSelect.value = sort;
        }
    }

    async loadCategories() {
        try {
            // Load categories from API
            const response = await window.api.getCategories();
            if (response.success && response.data.categories) {
                this.renderCategories(response.data.categories);
            } else {
                throw new Error('Failed to load categories');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback to mock data if API fails
            const mockCategories = [
                { _id: '1', name: 'Văn học' },
                { _id: '2', name: 'Kinh tế' },
                { _id: '3', name: 'Khoa học' },
                { _id: '4', name: 'Lịch sử' },
                { _id: '5', name: 'Tâm lý học' },
                { _id: '6', name: 'Công nghệ' },
                { _id: '7', name: 'Nghệ thuật' },
                { _id: '8', name: 'Thể thao' }
            ];
            this.renderCategories(mockCategories);
        }
    }

    renderCategories(categories) {
        const categoryFilters = document.getElementById('categoryFilters');
        if (!categoryFilters) return;

        const categoriesHTML = categories.map(category => `
            <label class="category-filter">
                <input type="checkbox" value="${category._id}" />
                <span>${this.escapeHtml(category.name)}</span>
            </label>
        `).join('');

        categoryFilters.innerHTML = categoriesHTML;

        // Bind category filter events
        const categoryCheckboxes = categoryFilters.querySelectorAll('input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
                this.currentPage = 1;
                this.loadProducts();
            });
        });
    }

    updateCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('.category-filter input[type="checkbox"]:checked');
        this.currentFilters.categories = Array.from(categoryCheckboxes).map(cb => cb.value);
    }

    updateRatingFilters() {
        const ratingCheckboxes = document.querySelectorAll('.rating-filter input[type="checkbox"]:checked');
        this.currentFilters.ratings = Array.from(ratingCheckboxes).map(cb => parseInt(cb.value));
    }

    updateAvailabilityFilters() {
        const availabilityCheckboxes = document.querySelectorAll('.availability-filter input[type="checkbox"]:checked');
        this.currentFilters.availability = Array.from(availabilityCheckboxes).map(cb => cb.value);
    }

    clearAllFilters() {
        this.currentFilters = {
            search: '',
            categories: [],
            ratings: [],
            availability: [],
            sort: 'createdAt-desc'
        };

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';


        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'createdAt-desc';

        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

        this.currentPage = 1;
        this.loadProducts();
    }

    async loadProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Build API query parameters
            const params = {
                page: this.currentPage,
                limit: 12
            };

            // Add search filter
            if (this.currentFilters.search) {
                params.search = this.currentFilters.search;
            }

            // Add category filter
            if (this.currentFilters.categories.length > 0) {
                params.category = this.currentFilters.categories[0]; // API expects single category
            }

            // Add price range (if implemented in filters)
            if (this.currentFilters.minPrice) {
                params.minPrice = this.currentFilters.minPrice;
            }
            if (this.currentFilters.maxPrice) {
                params.maxPrice = this.currentFilters.maxPrice;
            }

            // Add sort
            const [sortField, sortOrder] = this.currentFilters.sort.split('-');
            params.sort = sortField;
            params.order = sortOrder;

            // Call real API
            const response = await window.api.getProducts(params);
            
            if (response.success && response.data.products) {
                this.products = response.data.products;
                this.totalProducts = response.data.pagination.total;

                this.renderProducts();
                this.updateResultsCount();
                this.updatePagination();
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to mock data on error
            console.warn('Using mock data as fallback');
            const mockProducts = this.getMockProducts();
            let filteredProducts = this.applyFilters(mockProducts);
            const startIndex = (this.currentPage - 1) * 12;
            const endIndex = startIndex + 12;
            this.products = filteredProducts.slice(startIndex, endIndex);
            this.totalProducts = filteredProducts.length;
            this.renderProducts();
            this.updateResultsCount();
            this.updatePagination();
        } finally {
            this.isLoading = false;
        }
    }

    getMockProducts() {
        return [
            {
                _id: '1',
                name: 'Đắc Nhân Tâm',
                author: 'Dale Carnegie',
                price: 89000,
                originalPrice: 120000,
                averageRating: 4.8,
                reviewCount: 1250,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '1'
            },
            {
                _id: '2',
                name: 'Sapiens: Lược Sử Loài Người',
                author: 'Yuval Noah Harari',
                price: 195000,
                originalPrice: 250000,
                averageRating: 4.9,
                reviewCount: 890,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: true,
                inStock: true,
                category: '2'
            },
            {
                _id: '3',
                name: 'Atomic Habits',
                author: 'James Clear',
                price: 145000,
                originalPrice: null,
                averageRating: 4.7,
                reviewCount: 2100,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '5'
            },
            {
                _id: '4',
                name: 'Thinking, Fast and Slow',
                author: 'Daniel Kahneman',
                price: 220000,
                originalPrice: 280000,
                averageRating: 4.6,
                reviewCount: 1560,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '5'
            },
            {
                _id: '5',
                name: 'The Lean Startup',
                author: 'Eric Ries',
                price: 175000,
                originalPrice: null,
                averageRating: 4.5,
                reviewCount: 980,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: true,
                inStock: true,
                category: '2'
            },
            {
                _id: '6',
                name: 'Clean Code',
                author: 'Robert C. Martin',
                price: 250000,
                originalPrice: 300000,
                averageRating: 4.8,
                reviewCount: 3200,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '6'
            },
            {
                _id: '7',
                name: 'The Psychology of Money',
                author: 'Morgan Housel',
                price: 125000,
                originalPrice: null,
                averageRating: 4.7,
                reviewCount: 1800,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '2'
            },
            {
                _id: '8',
                name: 'Educated',
                author: 'Tara Westover',
                price: 165000,
                originalPrice: 200000,
                averageRating: 4.9,
                reviewCount: 2400,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '1'
            },
            {
                _id: '9',
                name: 'The 7 Habits of Highly Effective People',
                author: 'Stephen R. Covey',
                price: 195000,
                originalPrice: null,
                averageRating: 4.6,
                reviewCount: 3100,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '5'
            },
            {
                _id: '10',
                name: 'Sapiens: A Brief History of Tomorrow',
                author: 'Yuval Noah Harari',
                price: 210000,
                originalPrice: 260000,
                averageRating: 4.8,
                reviewCount: 1200,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: true,
                inStock: true,
                category: '2'
            },
            {
                _id: '11',
                name: 'The Subtle Art of Not Giving a F*ck',
                author: 'Mark Manson',
                price: 135000,
                originalPrice: null,
                averageRating: 4.4,
                reviewCount: 2800,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '5'
            },
            {
                _id: '12',
                name: 'The Power of Now',
                author: 'Eckhart Tolle',
                price: 155000,
                originalPrice: 190000,
                averageRating: 4.5,
                reviewCount: 1900,
                images: ['/assets/images/placeholder-book.svg'],
                isNew: false,
                inStock: true,
                category: '5'
            }
        ];
    }

    applyFilters(products) {
        let filtered = [...products];

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.author.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (this.currentFilters.categories.length > 0) {
            filtered = filtered.filter(product => 
                this.currentFilters.categories.includes(product.category)
            );
        }


        // Rating filter
        if (this.currentFilters.ratings.length > 0) {
            filtered = filtered.filter(product => 
                this.currentFilters.ratings.some(rating => product.averageRating >= rating)
            );
        }

        // Availability filter
        if (this.currentFilters.availability.includes('inStock')) {
            filtered = filtered.filter(product => product.inStock);
        }
        if (this.currentFilters.availability.includes('onSale')) {
            filtered = filtered.filter(product => product.originalPrice && product.originalPrice > product.price);
        }

        // Sort
        const [sortField, sortOrder] = this.currentFilters.sort.split('-');
        filtered.sort((a, b) => {
            let aVal = a[sortField] || a[sortField === 'name' ? 'title' : sortField] || 0;
            let bVal = b[sortField] || b[sortField === 'name' ? 'title' : sortField] || 0;
            
            // Handle name/title sorting
            if (sortField === 'name' || sortField === 'title') {
                aVal = (a.title || a.name || '').toLowerCase();
                bVal = (b.title || b.name || '').toLowerCase();
            }
            
            // Handle numeric fields
            if (sortField === 'price' || sortField === 'totalSold' || sortField === 'averageRating') {
                aVal = Number(aVal) || 0;
                bVal = Number(bVal) || 0;
            }
            
            // Handle date fields
            if (sortField === 'createdAt') {
                aVal = new Date(aVal || 0).getTime();
                bVal = new Date(bVal || 0).getTime();
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return filtered;
    }

    showLoadingState() {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Đang tải sản phẩm...</p>
                </div>
            `;
        }
    }

    showErrorState(message) {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Lỗi khi tải sản phẩm</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="productsListManager.loadProducts()">
                        Thử lại
                    </button>
                </div>
            `;
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (!this.products || this.products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        const productsHTML = this.products.map(product => this.createProductCard(product)).join('');
        productsGrid.innerHTML = productsHTML;

        // Bind product card events
        this.bindProductCardEvents();
    }

    createProductCard(product) {
        // Handle both API format and mock format
        const productName = product.title || product.name;
        const productId = product._id || product.id;
        const productImage = (product.images && product.images[0] && (product.images[0].url || product.images[0])) 
                             || '/assets/images/placeholder-book.svg';
        const productRating = product.rating ? (product.rating.average || 0) : (product.averageRating || 0);
        const productReviews = product.rating ? (product.rating.count || 0) : (product.reviewCount || 0);
        
        const discount = product.originalPrice && product.originalPrice > product.price 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        const badge = discount > 0 ? 'sale' : (product.isNew || product.isFeatured ? 'new' : '');
        const badgeText = discount > 0 ? `-${discount}%` : (product.isFeatured ? 'Nổi bật' : 'Mới');

        return `
            <div class="product-card" data-product-id="${productId}">
                <div class="product-image">
                    <img src="${productImage}" 
                         alt="${this.escapeHtml(productName)}" 
                         loading="lazy"
                         onerror="this.src='../../assets/images/placeholder-book.svg'" />
                    ${badge ? `<div class="product-badge ${badge}">${badgeText}</div>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${this.escapeHtml(productName)}</h3>
                    <p class="product-author">${this.escapeHtml(product.author || 'Tác giả không xác định')}</p>
                    <div class="product-rating">
                        <span class="product-stars">${this.renderStars(productRating)}</span>
                        <span class="product-rating-text">(${productReviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="product-current-price">${this.formatPrice(product.price)}</span>
                        ${product.originalPrice && product.originalPrice > product.price 
                            ? `<span class="product-original-price">${this.formatPrice(product.originalPrice)}</span>`
                            : ''}
                    </div>
                    <div class="product-card-actions">
                        <button class="add-to-cart-btn" data-product-id="${productId}">
                            <span class="icon">🛒</span>
                            <span class="text">Thêm vào giỏ</span>
                        </button>
                        <a class="view-detail-btn" href="detail.php?id=${productId}" data-product-id="${productId}">
                            <span class="icon">ℹ️</span>
                            <span class="text">Chi tiết</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    bindProductCardEvents() {
        // Product card click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-card-actions')) {
                    const productId = card.dataset.productId;
                    window.location.href = `detail.php?id=${productId}`;
                }
            });
        });

        // Add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            });
        });

        // View detail button
        document.querySelectorAll('.view-detail-btn').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    async addToCart(productId) {
        try {
            // Get product details from API
            const response = await window.api.getProduct(productId);
            if (response.success && response.data.product) {
                // Add to cart using API helper
                window.api.addToCart(response.data.product, 1);
                this.showToast('Đã thêm vào giỏ hàng', 'success');
                this.updateCartCount();
            } else {
                throw new Error('Failed to get product details');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showToast('Lỗi khi thêm vào giỏ hàng', 'error');
        }
    }

    async toggleWishlist(productId) {
        try {
            this.showToast('Đã thêm vào yêu thích', 'success');
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            this.showToast('Lỗi khi cập nhật yêu thích', 'error');
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Hiển thị ${this.products.length} trong ${this.totalProducts} sản phẩm`;
        }
    }

    updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.totalProducts / 12);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''} onclick="productsListManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
                Trước
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        paginationHTML += `<div class="pagination-numbers">`;

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-number" onclick="productsListManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" onclick="productsListManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button class="pagination-number" onclick="productsListManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        paginationHTML += `</div>`;

        // Next button
        paginationHTML += `
            <button class="pagination-btn next" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="productsListManager.goToPage(${this.currentPage + 1})">
                Sau
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async loadMoreProducts() {
        this.currentPage++;
        await this.loadProducts();
    }

    updateCartCount() {
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsListManager = new ProductsListManager();
});