// Use window.api directly, don't redeclare
if (typeof window.api === 'undefined') {
    console.error('API not loaded. Make sure api.js is loaded before wishlist.js');
}

class WishlistManager {
    constructor() {
        this.wishlistItems = [];
        this.currentView = 'grid';
        this.currentFilters = {
            search: '',
            category: '',
            sort: '-createdAt',
            page: 1,
            limit: 12
        };
        this.selectedItems = new Set();
        this.currentQuickViewProduct = null;
        this.currentRemoveItemId = null;
        this.initializeEventListeners();
        this.loadWishlist();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Check authentication - don't redirect immediately, let the page handle it
        if (!window.api?.token) {
            const token = localStorage.getItem('bookverse_token');
            if (!token) {
                // Only redirect if really no token
                const currentPath = window.location.pathname;
                const redirectUrl = encodeURIComponent(currentPath);
                window.location.href = '../../pages/auth/login.php?redirect=' + redirectUrl;
                return;
            }
        }

        // Load sidebar user info
        this.loadSidebarUserInfo();

        // Search functionality
        document.getElementById('wishlistSearch')?.addEventListener('input', debounce(() => {
            this.currentFilters.search = document.getElementById('wishlistSearch').value;
            this.currentFilters.page = 1;
            this.loadWishlist();
        }, 300));

        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.loadWishlist();
        });

        // Filter controls
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.currentFilters.page = 1;
            this.loadWishlist();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.currentFilters.page = 1;
            this.loadWishlist();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view || e.target.closest('.view-btn')?.dataset.view;
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Batch actions - selectAllWishlist will be added dynamically if needed
        // Use event delegation for dynamically created checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-select')) {
                const itemId = e.target.dataset.id;
                if (e.target.checked) {
                    this.selectedItems.add(itemId);
                } else {
                    this.selectedItems.delete(itemId);
                }
                this.updateItemSelections();
                this.updateBatchActions();
            }
        });

        document.getElementById('batchAddToCart')?.addEventListener('click', () => {
            this.batchAddToCart();
        });

        document.getElementById('batchRemove')?.addEventListener('click', () => {
            this.batchRemoveFromWishlist();
        });

        document.getElementById('clearWishlistBtn')?.addEventListener('click', () => {
            this.clearWishlist();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Modal close buttons
        document.getElementById('closeQuickView')?.addEventListener('click', () => {
            this.closeQuickViewModal();
        });

        document.getElementById('closeQuickViewBtn')?.addEventListener('click', () => {
            this.closeQuickViewModal();
        });

        document.getElementById('closeRemoveModal')?.addEventListener('click', () => {
            this.closeRemoveModal();
        });

        document.getElementById('cancelRemove')?.addEventListener('click', () => {
            this.closeRemoveModal();
        });

        document.getElementById('confirmRemove')?.addEventListener('click', () => {
            this.confirmRemoveFromWishlist();
        });

        document.getElementById('addToCartFromQuickView')?.addEventListener('click', () => {
            if (this.currentQuickViewProduct) {
                this.addToCartFromQuickView();
            }
        });

        // Close modals on outside click
        const quickViewModal = document.getElementById('quickViewModal');
        if (quickViewModal) {
            quickViewModal.addEventListener('click', (e) => {
                if (e.target.id === 'quickViewModal' || e.target.classList.contains('modal-overlay')) {
                    this.closeQuickViewModal();
                }
            });
        }

        const removeConfirmModal = document.getElementById('removeConfirmModal');
        if (removeConfirmModal) {
            removeConfirmModal.addEventListener('click', (e) => {
                if (e.target.id === 'removeConfirmModal' || e.target.classList.contains('modal-overlay')) {
                    this.closeRemoveModal();
                }
            });
        }
    }

    // Load sidebar user info
    async loadSidebarUserInfo() {
        try {
            const response = await window.api.getCurrentUser();
            if (response && response.success) {
                const user = response.data?.user || response.data;
                if (user) {
                    const userNameEl = document.getElementById('userName');
                    const userEmailEl = document.getElementById('userEmail');
                    const userAvatarEl = document.getElementById('userAvatar');
                    
                    if (userNameEl) {
                        userNameEl.textContent = 
                            (user.profile?.firstName && user.profile?.lastName) ? 
                            `${user.profile.firstName} ${user.profile.lastName}` : 
                            (user.username || user.email || 'User');
                    }
                    if (userEmailEl && user.email) {
                        userEmailEl.textContent = user.email;
                    }
                    if (userAvatarEl && user.profile?.avatar) {
                        userAvatarEl.src = user.profile.avatar;
                    }
                }
            }
        } catch (error) {
            // Silently fail - user info is optional
            console.warn('User info not available:', error);
        }
    }

    // Load wishlist items
    async loadWishlist() {
        try {
            this.showLoadingState();
            
            const params = {
                page: this.currentFilters.page,
                limit: this.currentFilters.limit,
                sort: this.currentFilters.sort
            };
            
            if (this.currentFilters.search) {
                params.search = this.currentFilters.search;
            }
            if (this.currentFilters.category) {
                params.category = this.currentFilters.category;
            }

            const response = await window.api.getWishlist(params);
            this.hideLoadingState();

            if (response && response.success) {
                // Handle different response structures
                const items = response.data?.items || response.data?.wishlist || response.data || [];
                
                if (Array.isArray(items) && items.length > 0) {
                    this.wishlistItems = items;
                    this.displayWishlistItems();
                    
                    if (response.data?.pagination) {
                        this.renderPagination(response.data.pagination);
                    }
                    this.hideEmptyState();
                } else {
                    this.showEmptyState();
                }
            } else {
                console.error('Invalid response:', response);
                this.showEmptyState();
            }
        } catch (error) {
            this.hideLoadingState();
            console.error('Error loading wishlist:', error);
            if (typeof showToast === 'function') {
                showToast('Không thể tải danh sách yêu thích', 'error');
            } else if (window.showToast) {
                window.showToast('Không thể tải danh sách yêu thích', 'error');
            }
        }
    }

    // Display wishlist items
    displayWishlistItems() {
        if (this.currentView === 'grid') {
            this.displayGridView();
        } else {
            this.displayListView();
        }
    }

    // Display grid view
    displayGridView() {
        const container = document.getElementById('wishlistGrid');
        const listContainer = document.getElementById('wishlistList');
        
        if (container) {
            container.style.display = 'grid';
            if (listContainer) listContainer.style.display = 'none';
            
            const itemsHTML = this.wishlistItems.map(item => this.createWishlistItemCard(item)).join('');
            container.innerHTML = itemsHTML;
            
            // Update selections after rendering
            this.updateItemSelections();
        }
    }

    // Display list view
    displayListView() {
        const container = document.getElementById('wishlistList');
        const gridContainer = document.getElementById('wishlistGrid');
        
        if (container) {
            container.style.display = 'block';
            if (gridContainer) gridContainer.style.display = 'none';
            
            const itemsHTML = this.wishlistItems.map(item => this.createWishlistItemRow(item)).join('');
            container.innerHTML = itemsHTML;
            
            // Update selections after rendering
            this.updateItemSelections();
        }
    }

    // Create wishlist item card
    createWishlistItemCard(item) {
        if (!item || !item.product) {
            console.warn('Invalid wishlist item:', item);
            return '';
        }
        
        const isSelected = this.selectedItems.has(item._id);
        const product = item.product;
        const isInStock = (product.stock || 0) > 0;
        const productId = product._id || product.id;
        const itemId = item._id || item.id;
        const imageUrl = (product.images && product.images[0]?.url) || 
                        (product.image) || 
                        'https://via.placeholder.com/200x250?text=Book';
        
        return `
            <div class="wishlist-item-card ${isSelected ? 'selected' : ''}" data-id="${itemId}">
                <div class="item-checkbox">
                    <input type="checkbox" class="item-select" data-id="${itemId}" ${isSelected ? 'checked' : ''} />
                </div>
                <div class="item-image">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.title || 'Product')}" 
                         onerror="this.src='https://via.placeholder.com/200x250?text=Book'" />
                    <div class="item-overlay">
                        <button class="btn btn-sm btn-primary" onclick="wishlistManager.quickView('${productId}')">
                            👁️ Xem nhanh
                        </button>
                    </div>
                </div>
                <div class="item-content">
                    <h3 class="item-title">${this.escapeHtml(product.title || 'N/A')}</h3>
                    <p class="item-author">${this.escapeHtml(product.author || 'N/A')}</p>
                    <div class="item-price">
                        ${this.formatPrice(product.price || 0)}
                        ${product.originalPrice && product.originalPrice > product.price ? 
                            `<span class="original-price">${this.formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="item-rating">
                        ${this.generateStars(product.rating?.average || product.rating || 0)}
                        <span class="rating-count">(${product.rating?.count || 0})</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-sm" 
                                onclick="wishlistManager.addToCart('${productId}')"
                                ${!isInStock ? 'disabled' : ''}>
                            <span class="btn-icon">🛒</span>
                            ${isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                        <button class="btn btn-outline btn-sm" 
                                onclick="wishlistManager.removeFromWishlist('${itemId}')">
                            <span class="btn-icon">❤️</span>
                            Bỏ yêu thích
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <span class="added-date">Thêm ngày: ${this.formatDate(item.createdAt || item.created_at || new Date())}</span>
                </div>
            </div>
        `;
    }

    // Create wishlist item row
    createWishlistItemRow(item) {
        if (!item || !item.product) {
            console.warn('Invalid wishlist item:', item);
            return '';
        }
        
        const product = item.product;
        const isSelected = this.selectedItems.has(item._id || item.id);
        const isInStock = (product.stock || 0) > 0;
        const productId = product._id || product.id;
        const itemId = item._id || item.id;
        const imageUrl = (product.images && product.images[0]?.url) || 
                        (product.image) || 
                        'https://via.placeholder.com/80x100?text=Book';
        
        return `
            <div class="wishlist-item-row ${isSelected ? 'selected' : ''}" data-id="${itemId}">
                <div class="item-checkbox">
                    <input type="checkbox" class="item-select" data-id="${itemId}" ${isSelected ? 'checked' : ''} />
                </div>
                <div class="item-image">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.title || 'Product')}"
                         onerror="this.src='https://via.placeholder.com/80x100?text=Book'" />
                </div>
                <div class="item-info">
                    <h3 class="item-title">${this.escapeHtml(product.title || 'N/A')}</h3>
                    <p class="item-author">${this.escapeHtml(product.author || 'N/A')}</p>
                    <div class="item-rating">
                        ${this.generateStars(product.rating?.average || product.rating || 0)}
                        <span class="rating-count">(${product.rating?.count || 0})</span>
                    </div>
                </div>
                <div class="item-price">
                    <div class="current-price">${this.formatPrice(product.price || 0)}</div>
                    ${product.originalPrice && product.originalPrice > product.price ? 
                        `<div class="original-price">${this.formatPrice(product.originalPrice)}</div>` : ''}
                </div>
                <div class="item-stock">
                    <span class="stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}">
                        ${isInStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" 
                            onclick="wishlistManager.addToCart('${productId}')"
                            ${!isInStock ? 'disabled' : ''}>
                        <span class="btn-icon">🛒</span>
                        Thêm vào giỏ
                    </button>
                    <button class="btn btn-outline btn-sm" 
                            onclick="wishlistManager.quickView('${productId}')">
                        <span class="btn-icon">👁️</span>
                        Xem nhanh
                    </button>
                    <button class="btn btn-outline btn-sm" 
                            onclick="wishlistManager.removeFromWishlist('${itemId}')">
                        <span class="btn-icon">❤️</span>
                        Bỏ yêu thích
                    </button>
                </div>
            </div>
        `;
    }

    // Switch view
    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update display
        this.displayWishlistItems();
    }

    // Toggle select all
    toggleSelectAll(checked) {
        this.selectedItems.clear();
        
        if (checked) {
            this.wishlistItems.forEach(item => {
                this.selectedItems.add(item._id);
            });
        }
        
        this.updateItemSelections();
        this.updateBatchActions();
    }

    // Update item selections
    updateItemSelections() {
        document.querySelectorAll('.item-select').forEach(checkbox => {
            const itemId = checkbox.dataset.id;
            if (itemId) {
                checkbox.checked = this.selectedItems.has(itemId);
                
                const itemElement = checkbox.closest('[data-id]') || document.querySelector(`[data-id="${itemId}"]`);
                if (itemElement) {
                    itemElement.classList.toggle('selected', this.selectedItems.has(itemId));
                }
            }
        });
    }

    // Update batch actions
    updateBatchActions() {
        const batchActions = document.getElementById('batchActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedItems.size > 0) {
            batchActions.style.display = 'flex';
            selectedCount.textContent = this.selectedItems.size;
        } else {
            batchActions.style.display = 'none';
        }
    }

    // Add to cart
    async addToCart(productId) {
        try {
            // Find product from wishlist items
            const wishlistItem = this.wishlistItems.find(item => {
                const pId = item.product?._id || item.product?.id;
                return pId === productId;
            });
            
            if (wishlistItem && wishlistItem.product) {
                window.api.addToCart(wishlistItem.product, 1);
                if (typeof showToast === 'function') {
                    showToast('Đã thêm vào giỏ hàng', 'success');
                } else if (window.showToast) {
                    window.showToast('Đã thêm vào giỏ hàng', 'success');
                }
            } else {
                // If product not in wishlist, fetch it
                const response = await window.api.getProduct(productId);
                if (response && response.success) {
                    const product = response.data?.product || response.data;
                    if (product) {
                        window.api.addToCart(product, 1);
                        if (typeof showToast === 'function') {
                            showToast('Đã thêm vào giỏ hàng', 'success');
                        } else if (window.showToast) {
                            window.showToast('Đã thêm vào giỏ hàng', 'success');
                        }
                    } else {
                        throw new Error('Không tìm thấy sản phẩm');
                    }
                } else {
                    throw new Error('Không thể tải thông tin sản phẩm');
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMsg = error.message || 'Không thể thêm vào giỏ hàng';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Batch add to cart
    async batchAddToCart() {
        if (this.selectedItems.size === 0) return;
        
        try {
            let addedCount = 0;
            for (const itemId of this.selectedItems) {
                const item = this.wishlistItems.find(i => {
                    const id = i._id || i.id;
                    return id === itemId;
                });
                if (item && item.product) {
                    window.api.addToCart(item.product, 1);
                    addedCount++;
                }
            }
            
            if (addedCount > 0) {
                const msg = `Đã thêm ${addedCount} sản phẩm vào giỏ hàng`;
                if (typeof showToast === 'function') {
                    showToast(msg, 'success');
                } else if (window.showToast) {
                    window.showToast(msg, 'success');
                }
                this.selectedItems.clear();
                this.updateBatchActions();
                this.updateItemSelections();
            }
        } catch (error) {
            console.error('Error batch adding to cart:', error);
            const errorMsg = error.message || 'Không thể thêm vào giỏ hàng';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Remove from wishlist
    removeFromWishlist(itemId) {
        const item = this.wishlistItems.find(i => {
            const id = i._id || i.id;
            return id === itemId;
        });
        if (!item) {
            console.warn('Item not found:', itemId);
            return;
        }
        
        // Show confirmation modal
        this.showRemoveConfirmation(item);
    }

    // Show remove confirmation
    showRemoveConfirmation(item) {
        if (!item || !item.product) {
            console.warn('Invalid item for removal:', item);
            return;
        }
        
        const modal = document.getElementById('removeConfirmModal');
        const preview = document.getElementById('removeProductPreview');
        
        if (!modal || !preview) {
            console.error('Modal elements not found');
            return;
        }
        
        const product = item.product;
        const imageUrl = (product.images && product.images[0]?.url) || 
                        (product.image) || 
                        'https://via.placeholder.com/60x80?text=Book';
        
        preview.innerHTML = `
            <div class="product-preview-item">
                <img src="${imageUrl}" 
                     alt="${this.escapeHtml(product.title || 'Product')}"
                     onerror="this.src='https://via.placeholder.com/60x80?text=Book'" />
                <div class="product-info">
                    <h4>${this.escapeHtml(product.title || 'N/A')}</h4>
                    <p>${this.escapeHtml(product.author || 'N/A')}</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        this.currentRemoveItemId = item._id || item.id;
    }

    // Close remove modal
    closeRemoveModal() {
        const modal = document.getElementById('removeConfirmModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentRemoveItemId = null;
    }

    // Confirm remove from wishlist
    async confirmRemoveFromWishlist() {
        if (!this.currentRemoveItemId) return;
        
        try {
            const response = await window.api.removeFromWishlist(this.currentRemoveItemId);
            if (response.success) {
                if (typeof showToast === 'function') {
                    showToast('Đã xóa khỏi danh sách yêu thích', 'success');
                } else if (window.showToast) {
                    window.showToast('Đã xóa khỏi danh sách yêu thích', 'success');
                }
                this.closeRemoveModal();
                this.loadWishlist(); // Reload wishlist
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            const errorMsg = error.message || 'Không thể xóa khỏi danh sách yêu thích';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Batch remove from wishlist
    async batchRemoveFromWishlist() {
        if (this.selectedItems.size === 0) return;
        
        if (!confirm(`Bạn có chắc chắn muốn xóa ${this.selectedItems.size} sản phẩm khỏi danh sách yêu thích?`)) {
            return;
        }
        
        try {
            const itemIds = Array.from(this.selectedItems);
            const response = await window.api.batchRemoveFromWishlist(itemIds);
            if (response.success) {
                const msg = `Đã xóa ${this.selectedItems.size} sản phẩm khỏi danh sách yêu thích`;
                if (typeof showToast === 'function') {
                    showToast(msg, 'success');
                } else if (window.showToast) {
                    window.showToast(msg, 'success');
                }
                this.selectedItems.clear();
                this.updateBatchActions();
                this.loadWishlist(); // Reload wishlist
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error batch removing from wishlist:', error);
            const errorMsg = error.message || 'Không thể xóa khỏi danh sách yêu thích';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Clear wishlist
    async clearWishlist() {
        if (this.wishlistItems.length === 0) return;
        
        if (!confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
            return;
        }
        
        try {
            const response = await window.api.clearWishlist();
            if (response.success) {
                if (typeof showToast === 'function') {
                    showToast('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích', 'success');
                } else if (window.showToast) {
                    window.showToast('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích', 'success');
                }
                this.loadWishlist(); // Reload wishlist
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            const errorMsg = error.message || 'Không thể xóa danh sách yêu thích';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Quick view product
    async quickView(productId) {
        try {
            // Try to find product in wishlist first
            const wishlistItem = this.wishlistItems.find(item => {
                const pId = item.product?._id || item.product?.id;
                return pId === productId;
            });
            
            if (wishlistItem && wishlistItem.product) {
                this.showQuickViewModal(wishlistItem.product);
                return;
            }
            
            // If not found, fetch from API
            const response = await window.api.getProduct(productId);
            if (response && response.success) {
                const product = response.data?.product || response.data;
                if (product) {
                    this.showQuickViewModal(product);
                } else {
                    throw new Error('Không tìm thấy sản phẩm');
                }
            } else {
                throw new Error(response?.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            const errorMsg = error.message || 'Không thể tải thông tin sản phẩm';
            if (typeof showToast === 'function') {
                showToast(errorMsg, 'error');
            } else if (window.showToast) {
                window.showToast(errorMsg, 'error');
            }
        }
    }

    // Show quick view modal
    showQuickViewModal(product) {
        if (!product) {
            console.error('Product is required for quick view');
            return;
        }
        
        const modal = document.getElementById('quickViewModal');
        const title = document.getElementById('quickViewTitle');
        const content = document.getElementById('quickViewContent');
        
        if (!modal || !title || !content) {
            console.error('Modal elements not found');
            return;
        }
        
        // Store current product for add to cart
        this.currentQuickViewProduct = product;
        
        const productId = product._id || product.id;
        const imageUrl = (product.images && product.images[0]?.url) || 
                        (product.image) || 
                        'https://via.placeholder.com/300x400?text=Book';
        const isInStock = (product.stock || 0) > 0;
        
        title.textContent = this.escapeHtml(product.title || 'Sản phẩm');
        content.innerHTML = `
            <div class="product-quick-view-content">
                <div class="product-image">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.title || 'Product')}"
                         onerror="this.src='https://via.placeholder.com/300x400?text=Book'" />
                </div>
                <div class="product-details">
                    <h3>${this.escapeHtml(product.title || 'N/A')}</h3>
                    <p class="product-author">Tác giả: ${this.escapeHtml(product.author || 'N/A')}</p>
                    <div class="product-price">
                        ${this.formatPrice(product.price || 0)}
                        ${product.originalPrice && product.originalPrice > product.price ? 
                            `<span class="original-price">${this.formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${this.generateStars(product.rating?.average || product.rating || 0)}
                        <span class="rating-count">(${product.rating?.count || 0} đánh giá)</span>
                    </div>
                    <div class="product-stock">
                        <span class="stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}">
                            ${isInStock ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                    </div>
                    <div class="product-description">
                        <p>${this.escapeHtml(product.description || 'Không có mô tả')}</p>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" 
                                onclick="wishlistManager.addToCart('${productId}')"
                                ${!isInStock ? 'disabled' : ''}>
                            <span class="btn-icon">🛒</span>
                            ${isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                        <a href="../../pages/products/detail.php?id=${productId}" class="btn btn-outline">
                            <span class="btn-icon">👁️</span>
                            Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // Close quick view modal
    closeQuickViewModal() {
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentQuickViewProduct = null;
    }

    // Add to cart from quick view
    addToCartFromQuickView() {
        if (this.currentQuickViewProduct) {
            window.api.addToCart(this.currentQuickViewProduct, 1);
            if (typeof showToast === 'function') {
                showToast('Đã thêm vào giỏ hàng', 'success');
            } else if (window.showToast) {
                window.showToast('Đã thêm vào giỏ hàng', 'success');
            }
        }
    }

    // Render pagination
    renderPagination(pagination) {
        const container = document.getElementById('wishlistPagination');
        if (!container) return;
        
        if (pagination.pages <= 1) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        container.innerHTML = '';
        
        const paginationContent = document.createElement('div');
        paginationContent.className = 'pagination-content';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = 'Trước';
        prevBtn.disabled = pagination.page === 1;
        prevBtn.addEventListener('click', () => {
            this.currentFilters.page--;
            this.loadWishlist();
        });
        paginationContent.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= pagination.pages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === pagination.page ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.currentFilters.page = i;
                this.loadWishlist();
            });
            paginationContent.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = 'Sau';
        nextBtn.disabled = pagination.page === pagination.pages;
        nextBtn.addEventListener('click', () => {
            this.currentFilters.page++;
            this.loadWishlist();
        });
        paginationContent.appendChild(nextBtn);
        
        container.appendChild(paginationContent);
    }

    // Show loading state
    showLoadingState() {
        document.getElementById('wishlistLoading').style.display = 'flex';
        document.getElementById('wishlistGrid').style.display = 'none';
        document.getElementById('wishlistList').style.display = 'none';
        document.getElementById('wishlistEmpty').style.display = 'none';
    }

    // Hide loading state
    hideLoadingState() {
        document.getElementById('wishlistLoading').style.display = 'none';
    }

    // Show empty state
    showEmptyState() {
        document.getElementById('wishlistEmpty').style.display = 'flex';
        document.getElementById('wishlistGrid').style.display = 'none';
        document.getElementById('wishlistList').style.display = 'none';
    }

    // Hide empty state
    hideEmptyState() {
        document.getElementById('wishlistEmpty').style.display = 'none';
    }

    // Logout
    async logout() {
        try {
            await window.api.logout();
            window.api?.clearToken();
            window.location.href = '../../pages/auth/login.php';
        } catch (error) {
            console.error('Error logging out:', error);
            if (typeof showToast === 'function') {
                showToast('Đăng xuất thất bại', 'error');
            } else if (window.showToast) {
                window.showToast('Đăng xuất thất bại', 'error');
            }
        }
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Debounce function
function debounce(func, wait) {
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

// Initialize wishlist manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for API to be available
    if (typeof window.api === 'undefined') {
        console.error('API not loaded. Make sure api.js is loaded before wishlist.js');
        // Try to wait a bit for API to load
        setTimeout(() => {
            if (typeof window.api !== 'undefined') {
                window.wishlistManager = new WishlistManager();
            } else {
                console.error('API still not available after delay');
            }
        }, 500);
    } else {
        window.wishlistManager = new WishlistManager();
    }
});

// Export for global access
window.WishlistManager = WishlistManager;
