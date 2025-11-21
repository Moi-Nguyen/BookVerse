// API Helper Functions
class BookverseAPI {
    constructor() {
        // Ensure appConfig is available
        if (!window.appConfig) {
            console.error('[API] appConfig not found! Make sure config.js is loaded before api.js');
            // Fallback config for development
            this.config = {
                getApiUrl: () => 'http://localhost:5000/api',
                get: (key) => {
                    const defaults = {
                        'REQUEST_TIMEOUT': 10000,
                        'RETRY_ATTEMPTS': 3
                    };
                    return defaults[key];
                },
                isDevelopment: () => true
            };
        } else {
            this.config = window.appConfig;
        }
        this.baseURL = this.config.getApiUrl();
        this.token = this.getStoredToken();
        this.requestQueue = [];
        this.isOnline = navigator.onLine;
        this.setupOfflineHandling();
    }

    getStoredToken() {
        try {
            return localStorage.getItem('bookverse_token');
        } catch (error) {
            console.warn('Cannot access localStorage:', error);
            return null;
        }
    }

    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processRequestQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        try {
            localStorage.setItem('bookverse_token', token);
            // Sync cookie for PHP (24h)
            document.cookie = `bookverse_token=${token}; path=/; max-age=${24 * 60 * 60}`;
        } catch (error) {
            console.warn('Cannot persist auth token:', error);
        }
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        try {
            localStorage.removeItem('bookverse_token');
            // Clear cookie
            document.cookie = 'bookverse_token=; path=/; max-age=0';
        } catch (error) {
            console.warn('Cannot clear auth token:', error);
        }
    }

    // Make API request with retry logic and offline support
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            ...options,
            timeout: this.config.get('REQUEST_TIMEOUT')
        };

        if (config.body instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (config.headers['Content-Type'] === undefined) {
            delete config.headers['Content-Type'];
        }

        // Add authentication token if available
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add environment headers
        if (this.config.isDevelopment()) {
            config.headers['X-Debug-Mode'] = 'true';
        }

        // Handle offline requests
        if (!this.isOnline && !options.allowOffline) {
            return this.queueOfflineRequest(url, config);
        }

        return this.executeRequest(url, config, options);
    }

    async executeRequest(url, config, options = {}) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.config.get('RETRY_ATTEMPTS'); attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);

                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const contentType = response.headers.get('content-type') || '';
                    const errorData = contentType.includes('application/json')
                        ? await response.json().catch(() => ({}))
                        : { message: await response.text().catch(() => `HTTP ${response.status}`) };
                    throw new APIError(
                        errorData.message || `HTTP ${response.status}`,
                        response.status,
                        errorData
                    );
                }

                const contentType = response.headers.get('content-type') || '';
                const data = contentType.includes('application/json')
                    ? await response.json()
                    : {};
                return this.validateResponse(data);

            } catch (error) {
                lastError = error;
                
                if (error.name === 'AbortError') {
                    throw new APIError('Request timeout', 408);
                }

                if (attempt < this.config.get('RETRY_ATTEMPTS')) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
        }

        throw lastError;
    }

    validateResponse(data) {
        if (!data || typeof data !== 'object') {
            throw new APIError('Invalid response format', 500);
        }

        if (data.success === false) {
            throw new APIError(data.message || 'Request failed', 400, data);
        }

        return data;
    }

    queueOfflineRequest(url, config) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ url, config, resolve, reject });
            
            // Show offline notification
            this.showOfflineNotification();
            
            reject(new APIError('No internet connection', 0));
        });
    }

    async processRequestQueue() {
        if (this.requestQueue.length === 0) return;

        const queue = [...this.requestQueue];
        this.requestQueue = [];

        for (const { url, config, resolve, reject } of queue) {
            try {
                const result = await this.executeRequest(url, config);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    }

    showOfflineNotification() {
        if (this.config.isDevelopment()) {
            console.warn('Request queued for offline processing');
        }
    }

    // Authentication APIs
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            // Force attempt even if navigator.onLine is false
            allowOffline: true
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // Password reset APIs
    async forgotPassword(email) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async verifyOTP(email, otp) {
        return this.request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
        });
    }

    async resetPasswordWithOtp(email, otp, newPassword) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, otp, newPassword })
        });
    }

    // Google OAuth login
    async loginWithGoogle(idToken) {
        return this.request('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ idToken })
        });
    }

    // Product APIs
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async getFeaturedProducts() {
        return this.request('/products/featured');
    }

    // Create new product (for sellers)
    async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    // Update product (for sellers)
    async updateProduct(productId, productData) {
        return this.request(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    // Delete product (for sellers)
    async deleteProduct(productId) {
        return this.request(`/products/${productId}`, {
            method: 'DELETE'
        });
    }

    // Get seller's own products
    async getSellerProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products/my-products?${queryString}`);
    }

    // Upload product images
    async uploadProductImages(productId, images) {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        return this.request(`/products/${productId}/images`, {
            method: 'POST',
            headers: {
                // Remove Content-Type to let browser set it with boundary
                'Content-Type': undefined
            },
            body: formData
        });
    }

    async getCategories() {
        return this.request('/products/categories');
    }

    // User APIs
    async getUserProfile() {
        return this.request('/users/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Seller APIs
    async getSellerDashboard(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/seller/dashboard${queryString ? '?' + queryString : ''}`);
    }

    async getSellers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users/sellers?${queryString}`);
    }

    // Order APIs
    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders?${queryString}`);
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Messaging APIs
    async getConversations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const qs = queryString ? `?${queryString}` : '';
        return this.request(`/messages/conversations${qs}`);
    }

    async createConversation(payload) {
        return this.request('/messages/conversations', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async getConversationMessages(conversationId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const qs = queryString ? `?${queryString}` : '';
        return this.request(`/messages/conversations/${conversationId}/messages${qs}`);
    }

    async sendConversationMessage(conversationId, { body: messageBody, attachments = [] } = {}) {
        const formData = new FormData();
        if (messageBody) {
            formData.append('body', messageBody);
        }
        attachments.forEach(file => formData.append('attachments', file));

        return this.request(`/messages/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            body: formData
        });
    }

    async markConversationRead(conversationId) {
        return this.request(`/messages/conversations/${conversationId}/read`, {
            method: 'PATCH'
        });
    }

    async deleteMessage(messageId) {
        return this.request(`/messages/messages/${messageId}`, {
            method: 'DELETE'
        });
    }

    async deleteConversation(conversationId) {
        return this.request(`/messages/conversations/${conversationId}`, {
            method: 'DELETE'
        });
    }

    // Cart Management (Local Storage)
    getCart() {
        const cart = localStorage.getItem('bookverse_cart');
        return cart ? JSON.parse(cart) : [];
    }

    addToCart(product, quantity = 1) {
        const cart = this.getCart();
        const productId = product._id || product.id || product.productId;
        const existingItem = cart.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                product: {
                    id: productId,
                    title: product.title,
                    price: product.price,
                    images: Array.isArray(product.images) ? product.images : [],
                    author: product.author
                },
                quantity: quantity
            });
        }

        localStorage.setItem('bookverse_cart', JSON.stringify(cart));
        this.updateCartUI();
        return cart;
    }

    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.product.id !== productId);
        localStorage.setItem('bookverse_cart', JSON.stringify(updatedCart));
        this.updateCartUI();
        return updatedCart;
    }

    updateCartQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.product.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
            }
        }

        localStorage.setItem('bookverse_cart', JSON.stringify(cart));
        this.updateCartUI();
        return cart;
    }

    clearCart() {
        localStorage.removeItem('bookverse_cart');
        this.updateCartUI();
    }

    updateCartUI() {
        const cart = this.getCart();
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    // Search functionality
    async searchProducts(query, filters = {}) {
        return this.getProducts({
            search: query,
            ...filters
        });
    }

    // Wishlist APIs
    async getWishlist(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users/wishlist${queryString ? '?' + queryString : ''}`);
    }

    async addToWishlist(productId) {
        return this.request('/users/wishlist', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
    }

    async removeFromWishlist(itemId) {
        return this.request(`/users/wishlist/${itemId}`, {
            method: 'DELETE'
        });
    }

    async batchRemoveFromWishlist(itemIds) {
        return this.request('/users/wishlist/batch', {
            method: 'DELETE',
            body: JSON.stringify({ itemIds })
        });
    }

    async clearWishlist() {
        return this.request('/users/wishlist', {
            method: 'DELETE'
        });
    }

    // Forum APIs
    async getForumPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/forum/posts${queryString ? '?' + queryString : ''}`);
    }

    async getForumPost(postId) {
        return this.request(`/forum/posts/${postId}`);
    }

    async createForumPost(data) {
        return this.request('/forum/posts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async likeForumPost(postId) {
        return this.request(`/forum/posts/${postId}/like`, {
            method: 'POST'
        });
    }

    async addForumComment(postId, content) {
        return this.request(`/forum/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    }

    async getForumStats() {
        return this.request('/forum/stats');
    }

    async getForumModerators() {
        return this.request('/forum/moderators');
    }

    async getForumFeatured() {
        return this.request('/forum/featured');
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    }

    // Enhanced error handling
    handleError(error) {
        console.error('API Error:', error);
        
        let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
        let errorType = 'error';

        if (error instanceof APIError) {
            errorMessage = error.message;
            errorType = this.getErrorType(error.status);
        } else if (error.name === 'NetworkError') {
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.';
            errorType = 'network';
        } else if (error.name === 'AbortError') {
            errorMessage = 'Yêu cầu bị hủy do timeout. Vui lòng thử lại.';
            errorType = 'timeout';
        }

        // Show user-friendly error message
        this.showErrorNotification(errorMessage, errorType);
        
        // Log error for debugging in development
        if (this.config.isDevelopment()) {
            console.error('Full error details:', error);
        }
    }

    getErrorType(status) {
        if (status >= 500) return 'server';
        if (status === 401) return 'auth';
        if (status === 403) return 'permission';
        if (status === 404) return 'notfound';
        if (status === 429) return 'ratelimit';
        return 'error';
    }

    showErrorNotification(message, type = 'error') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `api-notification api-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getErrorIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getErrorIcon(type) {
        const icons = {
            error: '❌',
            server: '🔧',
            auth: '🔐',
            permission: '🚫',
            notfound: '🔍',
            ratelimit: '⏱️',
            network: '📡',
            timeout: '⏰'
        };
        return icons[type] || icons.error;
    }
}

// Custom API Error class
class APIError extends Error {
    constructor(message, status = 500, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Create global API instance
const api = new BookverseAPI();

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
    api.updateCartUI();
});

// Global showToast function
window.showToast = function(message, type = 'info') {
    if (typeof api !== 'undefined' && typeof api.showErrorNotification === 'function') {
        api.showErrorNotification(message, type);
        return;
    }
    
    // Fallback: create simple toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Export for use in other scripts
window.BookverseAPI = BookverseAPI;
window.APIError = APIError;
window.api = api;

