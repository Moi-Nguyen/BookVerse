// Cart functionality for Bookverse

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.initializeEventListeners();
        this.renderCart();
        this.updateCartSummary();
        this.loadRecommendedProducts();
    }

    // Load cart from localStorage
    loadCart() {
        const cartData = localStorage.getItem('bookverse_cart');
        if (!cartData) return [];
        
        const rawCart = JSON.parse(cartData);
        // Convert from api.js format to cart.js format
        return rawCart.map(item => {
            // Check if it's in api.js format (has .product property)
            if (item.product) {
                return {
                    id: item.product.id || item.product._id,
                    title: item.product.title || item.product.name,
                    author: item.product.author || 'Không rõ',
                    price: item.product.price || 0,
                    originalPrice: item.product.originalPrice || null,
                    image: (item.product.images && item.product.images[0] && 
                           (item.product.images[0].url || item.product.images[0])) || 
                           '../../assets/images/no-image.jpg',
                    rating: item.product.rating || { average: 0, count: 0 },
                    isFeatured: item.product.isFeatured || false,
                    quantity: item.quantity || 1,
                    addedAt: item.addedAt || new Date().toISOString()
                };
            }
            // Already in cart.js format
            return item;
        });
    }

    // Save cart to localStorage
    saveCart() {
        // Convert back to api.js format for compatibility
        const apiFormatCart = this.cart.map(item => ({
            product: {
                id: item.id,
                _id: item.id,
                title: item.title,
                name: item.title,
                author: item.author,
                price: item.price,
                originalPrice: item.originalPrice,
                images: [{ url: item.image }],
                rating: item.rating,
                isFeatured: item.isFeatured
            },
            quantity: item.quantity,
            addedAt: item.addedAt
        }));
        localStorage.setItem('bookverse_cart', JSON.stringify(apiFormatCart));
        this.updateCartSummary();
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const productId = product._id || product.id || product.productId;
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                title: product.title || product.name,
                author: product.author || 'Không rõ',
                price: product.price || 0,
                originalPrice: product.originalPrice || null,
                image: (product.images && product.images[0] && 
                       (product.images[0].url || product.images[0])) || 
                       '../../assets/images/no-image.jpg',
                rating: product.rating || { average: 0, count: 0 },
                isFeatured: product.isFeatured || false,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = Math.min(quantity, 99);
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.showToast('Đã xóa tất cả sản phẩm khỏi giỏ hàng', 'info');
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Clear cart button
        document.getElementById('clearCartBtn')?.addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkoutBtn')?.addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Coupon application
        document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
            this.applyCoupon();
        });

        // Coupon input enter key
        document.getElementById('couponCode')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyCoupon();
            }
        });
    }

    // Render cart items
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart" id="emptyCart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Giỏ hàng trống</h3>
                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <a href="../products/list.php" class="btn btn-primary">
                        <span class="btn-icon">🛍️</span>
                        <span>Tiếp tục mua sắm</span>
                    </a>
                </div>
            `;
            return;
        }

        const cartItemsHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        cartItemsContainer.innerHTML = cartItemsHTML;

        // Add event listeners to cart items
        this.attachCartItemListeners();
    }

    // Create cart item HTML
    createCartItemHTML(item) {
        const discount = item.originalPrice && item.originalPrice > item.price 
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}" class="product-image">
                    <div class="item-badges">
                        ${item.isFeatured ? '<span class="badge featured">Nổi bật</span>' : ''}
                        ${discount > 0 ? `<span class="badge discount">-${discount}%</span>` : ''}
                    </div>
                </div>
                
                <div class="item-details">
                    <h3 class="item-title">${this.escapeHtml(item.title || 'Sản phẩm không tên')}</h3>
                    <p class="item-author">Tác giả: ${this.escapeHtml(item.author || 'Không rõ')}</p>
                    <div class="item-rating">
                        <div class="stars">${this.generateStars(item.rating?.average || item.rating || 0)}</div>
                        <span class="rating-text">(${item.rating?.count || 0} đánh giá)</span>
                    </div>
                    <div class="item-availability">
                        <span class="availability-status available">Còn hàng</span>
                    </div>
                </div>
                
                <div class="item-price">
                    <div class="price-current">${this.formatPrice(item.price)}</div>
                    ${item.originalPrice && item.originalPrice > item.price ? 
                        `<div class="price-original">${this.formatPrice(item.originalPrice)}</div>` : ''}
                </div>
                
                <div class="item-quantity">
                    <div class="quantity-controls">
                        <button type="button" class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                        <button type="button" class="quantity-btn increase">+</button>
                    </div>
                </div>
                
                <div class="item-total">
                    <span class="total-price">${this.formatPrice(item.price * item.quantity)}</span>
                </div>
                
                <div class="item-actions">
                    <button class="action-btn wishlist" title="Thêm vào yêu thích">
                        <span class="btn-icon">❤️</span>
                    </button>
                    <button class="action-btn remove" title="Xóa khỏi giỏ">
                        <span class="btn-icon">🗑️</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Attach event listeners to cart items
    attachCartItemListeners() {
        document.querySelectorAll('.cart-item').forEach(item => {
            const productId = item.dataset.productId;
            
            // Quantity controls
            const decreaseBtn = item.querySelector('.decrease');
            const increaseBtn = item.querySelector('.increase');
            const quantityInput = item.querySelector('.quantity-input');
            
            decreaseBtn?.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value);
                this.updateQuantity(productId, currentQuantity - 1);
            });
            
            increaseBtn?.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value);
                this.updateQuantity(productId, currentQuantity + 1);
            });
            
            quantityInput?.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0 && newQuantity <= 99) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    e.target.value = this.cart.find(cartItem => cartItem.id === productId)?.quantity || 1;
                }
            });
            
            // Remove button
            const removeBtn = item.querySelector('.remove');
            removeBtn?.addEventListener('click', () => {
                this.removeItem(productId);
            });
            
            // Wishlist button
            const wishlistBtn = item.querySelector('.wishlist');
            wishlistBtn?.addEventListener('click', () => {
                this.addToWishlist(productId);
            });
        });
    }

    // Update cart summary
    updateCartSummary() {
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const grandTotal = subtotal + shippingFee;

        // Update header summary
        document.getElementById('itemCount').textContent = `${itemCount} sản phẩm`;
        document.getElementById('totalPrice').textContent = this.formatPrice(grandTotal);

        // Update summary card
        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('shippingFee').textContent = this.formatPrice(shippingFee);
        document.getElementById('grandTotal').textContent = this.formatPrice(grandTotal);

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    // Apply coupon
    applyCoupon() {
        const couponCode = document.getElementById('couponCode').value.trim();
        const messageEl = document.getElementById('couponMessage');
        
        if (!couponCode) {
            messageEl.textContent = 'Vui lòng nhập mã giảm giá';
            messageEl.className = 'coupon-message error';
            return;
        }

        // Simulate coupon validation
        const validCoupons = {
            'WELCOME10': { discount: 0.1, type: 'percentage' },
            'SAVE50K': { discount: 50000, type: 'fixed' },
            'FREESHIP': { discount: 0, type: 'freeship' }
        };

        if (validCoupons[couponCode]) {
            const coupon = validCoupons[couponCode];
            messageEl.textContent = `Mã giảm giá "${couponCode}" đã được áp dụng!`;
            messageEl.className = 'coupon-message success';
            this.showToast('Mã giảm giá đã được áp dụng', 'success');
        } else {
            messageEl.textContent = 'Mã giảm giá không hợp lệ';
            messageEl.className = 'coupon-message error';
        }
    }

    // Proceed to checkout
    async proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Giỏ hàng trống', 'warning');
            return;
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Đang xử lý...</span>';
        }

        try {
            // Calculate totals
            const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shippingFee = subtotal >= 500000 ? 0 : 30000;
            const total = subtotal + shippingFee;

            // Prepare checkout data
            const checkoutData = {
                items: this.cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    // You can get this from user profile or form
                    fullName: '',
                    phone: '',
                    email: '',
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'Vietnam'
                },
                shippingFee: shippingFee
            };

            // Get API URL
            const apiBaseUrl = window.appConfig?.getApiUrl() || 'http://localhost:5000/api';
            const token = localStorage.getItem('bookverse_token');

            if (!token) {
                this.showToast('Vui lòng đăng nhập để thanh toán', 'error');
                window.location.href = '../auth/login.php';
                return;
            }

            // Call checkout API
            const response = await fetch(`${apiBaseUrl}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Show detailed error message
                const errorMsg = data.message || data.error?.message || 'Thanh toán thất bại';
                console.error('Checkout API error:', {
                    status: response.status,
                    data: data,
                    error: data.error
                });
                throw new Error(errorMsg);
            }

            if (data.success) {
                // Clear cart
                this.cart = [];
                this.saveCart();
                this.renderCart();

                // Show success message
                this.showToast(`Thanh toán thành công! Đơn hàng: ${data.data.order.orderNumber}`, 'success');

                // Redirect to order details or orders page
                setTimeout(() => {
                    window.location.href = '../account/orders.php';
                }, 2000);
            } else {
                throw new Error(data.message || 'Thanh toán thất bại');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showToast(error.message || 'Thanh toán thất bại. Vui lòng thử lại', 'error');
            
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '<span class="btn-icon">💳</span><span>Thanh toán</span>';
            }
        }
    }

    // Add to wishlist
    addToWishlist(productId) {
        // Get wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('bookverse_wishlist') || '[]');
        
        if (wishlist.includes(productId)) {
            this.showToast('Sản phẩm đã có trong danh sách yêu thích', 'info');
        } else {
            wishlist.push(productId);
            localStorage.setItem('bookverse_wishlist', JSON.stringify(wishlist));
            this.showToast('Đã thêm vào danh sách yêu thích', 'success');
        }
    }

    // Load recommended products
    async loadRecommendedProducts() {
        try {
            const response = await api.getProducts({ limit: 4, featured: true });
            if (response.success && response.data.products) {
                this.displayRecommendedProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error loading recommended products:', error);
        }
    }

    // Display recommended products
    displayRecommendedProducts(products) {
        const container = document.getElementById('recommendedProducts');
        if (!container) return;

        const productsHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.images[0]?.url || '../assets/images/no-image.jpg'}" 
                         alt="${this.escapeHtml(product.title)}" 
                         class="product-image">
                    <div class="product-badge">
                        ${product.isFeatured ? '<span class="badge featured">Nổi bật</span>' : ''}
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${this.escapeHtml(product.title)}</h3>
                    <p class="product-author">${this.escapeHtml(product.author)}</p>
                    <div class="product-price">
                        ${this.formatPrice(product.price)}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="cartManager.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            Thêm vào giỏ
                        </button>
                    </div>
			</div>
		</div>
	`).join('');

        container.innerHTML = productsHTML;
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
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

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Export for global access
window.CartManager = CartManager;