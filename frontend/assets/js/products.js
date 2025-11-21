// Products Management functionality for Bookverse

class ProductsManager {
    constructor() {
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            category: '',
            status: '',
            sort: 'newest'
        };
        this.initializeEventListeners();
        this.loadProducts();
    }

    // Initialize event listeners
    initializeEventListeners() {
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

        // Add product button
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.showAddProductModal();
        });
    }

    // Load products data
    async loadProducts() {
        try {
            // Build query parameters
            const params = {
                page: this.currentPage,
                limit: this.itemsPerPage
            };

            // Add status filter
            if (this.filters.status) {
                params.status = this.filters.status;
            }

            // Add sort
            params.sort = this.filters.sort === 'newest' ? 'createdAt' : this.filters.sort;
            params.order = 'desc';

            // Call real API using window.api
            const response = await window.api.request('/seller/products', {
                method: 'GET'
            });
            
            if (response.success && response.data.products) {
                this.products = response.data.products;
                this.renderProducts();
                this.updateProductCount();
            } else {
                throw new Error('Failed to load products from API');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            // Use mock data as fallback
            console.warn('Using mock data as fallback');
            this.products = this.getMockProducts();
            this.renderProducts();
            this.updateProductCount();
        }
    }

    // Get mock products data
    getMockProducts() {
        return [
            {
                id: 1,
                title: 'Sách lập trình JavaScript',
                author: 'Nguyễn Văn A',
                category: 'Công nghệ',
                price: 299000,
                originalPrice: 399000,
                stock: 50,
                sold: 25,
                rating: 4.5,
                status: 'active',
                image: '../../assets/images/placeholder-book.svg',
                badges: ['featured'],
                dateAdded: '2024-01-15'
            },
            {
                id: 2,
                title: 'Tiểu thuyết kinh điển',
                author: 'Tác giả B',
                category: 'Văn học',
                price: 199000,
                originalPrice: null,
                stock: 0,
                sold: 100,
                rating: 4.8,
                status: 'out-of-stock',
                image: '../../assets/images/placeholder-book.svg',
                badges: [],
                dateAdded: '2024-01-10'
            },
            {
                id: 3,
                title: 'Sách kinh tế học',
                author: 'Tác giả C',
                category: 'Kinh tế',
                price: 250000,
                originalPrice: null,
                stock: 30,
                sold: 15,
                rating: 4.2,
                status: 'active',
                image: '../../assets/images/placeholder-book.svg',
                badges: [],
                dateAdded: '2024-01-12'
            }
        ];
    }

    // Filter products
    filterProducts() {
        let filteredProducts = [...this.products];

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.author.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (this.filters.category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.filters.category
            );
        }

        // Status filter
        if (this.filters.status) {
            filteredProducts = filteredProducts.filter(product => 
                product.status === this.filters.status
            );
        }

        this.filteredProducts = filteredProducts;
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    // Sort products
    sortProducts() {
        if (!this.filteredProducts) {
            this.filteredProducts = [...this.products];
        }

        switch (this.filters.sort) {
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'oldest':
                this.filteredProducts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.renderProducts();
    }

    // Render products table
    renderProducts() {
        const productsContainer = document.getElementById('productsTableBody');
        if (!productsContainer) return;

        const products = this.filteredProducts || this.products;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = products.slice(startIndex, endIndex);

        if (pageProducts.length === 0) {
            productsContainer.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <div class="empty-state-icon">📚</div>
                        <h3>Chưa có sản phẩm nào</h3>
                        <p>Hãy thêm sản phẩm đầu tiên của bạn</p>
                        <button class="btn btn-primary" onclick="document.getElementById('addProductBtn').click()">
                            Thêm sản phẩm
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        productsContainer.innerHTML = pageProducts.map(product => `
            <tr>
                <td>
                    <div class="product-info">
                        <img src="${product.image}" alt="${product.title}" class="product-image">
                        <div class="product-details">
                            <div class="product-title">${product.title}</div>
                            <div class="product-author">${product.author}</div>
                            <div class="product-meta">
                                <div class="product-id">ID: ${product.id}</div>
                                <div class="product-date">${this.formatDate(product.dateAdded)}</div>
                            </div>
                            <div class="product-badges">
                                ${product.badges.map(badge => `<span class="badge ${badge}">${badge === 'featured' ? 'Nổi bật' : badge}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-badge">${product.category}</span>
                </td>
                <td>
                    <div class="product-price">
                        <div class="price-current">${this.formatPrice(product.price)}</div>
                        ${product.originalPrice ? `<div class="price-original">${this.formatPrice(product.originalPrice)}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div class="product-stock">
                        <div class="stock-count">${product.stock}</div>
                        <div class="stock-status">${product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</div>
                    </div>
                </td>
                <td>
                    <div class="product-sales">
                        <div class="sales-count">${product.sold}</div>
                    </div>
                </td>
                <td>
                    <div class="product-rating">
                        <div class="rating-stars">${this.renderStars(product.rating)}</div>
                        <div class="rating-count">${product.rating}/5</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${product.status}">${this.getStatusText(product.status)}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-action="view" data-product-id="${product.id}" title="Xem">
                            👁️
                        </button>
                        <button class="action-btn edit" data-action="edit" data-product-id="${product.id}" title="Sửa">
                            ✏️
                        </button>
                        <button class="action-btn duplicate" data-action="duplicate" data-product-id="${product.id}" title="Nhân bản">
                            📋
                        </button>
                        <button class="action-btn delete" data-action="delete" data-product-id="${product.id}" title="Xóa">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.renderPagination();
    }

    // Update product count
    updateProductCount() {
        const productCount = document.getElementById('productCount');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (productCount) {
            const total = this.filteredProducts ? this.filteredProducts.length : this.products.length;
            productCount.textContent = `${total} sản phẩm`;
        }

        if (paginationInfo) {
            const total = this.filteredProducts ? this.filteredProducts.length : this.products.length;
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(startIndex + this.itemsPerPage - 1, total);
            paginationInfo.textContent = `Hiển thị ${startIndex}-${endIndex} của ${total} sản phẩm`;
        }
    }

    // Render pagination
    renderPagination() {
        const paginationContainer = document.getElementById('paginationControls');
        if (!paginationContainer) return;

        const total = this.filteredProducts ? this.filteredProducts.length : this.products.length;
        const totalPages = Math.ceil(total / this.itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn" data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
                ‹ Trước
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn" data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                Sau ›
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    // Go to specific page
    goToPage(page) {
        const total = this.filteredProducts ? this.filteredProducts.length : this.products.length;
        const totalPages = Math.ceil(total / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            this.updateProductCount();
        }
    }

    // Handle product actions
    handleProductAction(action, productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        switch (action) {
            case 'view':
                window.open(`../products/detail.php?id=${productId}`, '_blank');
                break;
            case 'edit':
                this.editProduct(productId);
                break;
            case 'duplicate':
                this.duplicateProduct(productId);
                break;
            case 'delete':
                this.deleteProduct(productId);
                break;
        }
    }

    // Edit product
    editProduct(productId) {
        // TODO: Implement edit product functionality
        alert(`Chỉnh sửa sản phẩm ${productId}`);
    }

    // Duplicate product
    duplicateProduct(productId) {
        // TODO: Implement duplicate product functionality
        alert(`Nhân bản sản phẩm ${productId}`);
    }

    // Delete product
    deleteProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.title}"?`)) {
            // TODO: Implement delete product functionality
            this.products = this.products.filter(p => p.id !== productId);
            this.renderProducts();
            this.updateProductCount();
        }
    }

    // Show batch actions
    showBatchActions() {
        // TODO: Implement batch actions
        alert('Thao tác hàng loạt');
    }

    // Show add product modal
    showAddProductModal() {
        // TODO: Implement add product modal
        alert('Thêm sản phẩm mới');
    }

    // Render stars
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    // Get status text
    getStatusText(status) {
        const statusMap = {
            'active': 'Hoạt động',
            'inactive': 'Không hoạt động',
            'out-of-stock': 'Hết hàng',
            'pending': 'Chờ duyệt'
        };
        return statusMap[status] || status;
    }

    // Format price
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN');
    }
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});

// Export for global access
window.ProductsManager = ProductsManager;
