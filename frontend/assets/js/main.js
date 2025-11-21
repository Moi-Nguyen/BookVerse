// Enhanced Main JavaScript functionality for Bookverse

// Performance optimization
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

performanceObserver.observe({ entryTypes: ['navigation'] });

// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.01
});

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application with error handling
    try {
        initializeApp();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        // Show error using console or toast if available
        if (typeof showToast === 'function') {
            showToast('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.', 'error');
        } else {
            console.error('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }
});

function initializeApp() {
    // Load initial data with loading states
    Promise.allSettled([
        loadCategories(),
        loadFeaturedProducts(),
        loadTopSellers()
    ]).then(results => {
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to load data ${index}:`, result.reason);
            }
        });
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize user interface
    initializeUI();
    
    // Initialize performance optimizations (if function exists)
    if (typeof initializePerformanceOptimizations === 'function') {
    initializePerformanceOptimizations();
    }
}

// Enhanced load categories with better error handling
async function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    try {
        // Show loading state
        showLoadingState(categoriesGrid, 'Đang tải danh mục...');
        
        const response = await api.getCategories();
        if (response.success && response.data.categories) {
            displayCategories(response.data.categories);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showErrorState(categoriesGrid, 'Không thể tải danh mục sách', () => loadCategories());
    }
}

// Enhanced display categories with animations
function displayCategories(categories) {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categoriesHTML = categories.slice(0, 6).map((category, index) => `
        <div class="category-card animate-in" style="animation-delay: ${index * 100}ms">
            <div class="category-icon">${getCategoryIcon(category.name)}</div>
            <h3 class="category-name">${escapeHtml(category.name)}</h3>
            <p class="category-description">${escapeHtml(category.description || 'Khám phá bộ sưu tập sách đa dạng')}</p>
            <a href="pages/products/list.php?category=${category._id}" class="category-link">
                Xem sách
                <span class="arrow">→</span>
            </a>
        </div>
    `).join('');

    categoriesGrid.innerHTML = categoriesHTML;
    
    // Add intersection observer for animations
    const cards = categoriesGrid.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

// Get appropriate icon for category
function getCategoryIcon(categoryName) {
    const iconMap = {
        'Văn học': '📖',
        'Khoa học': '🔬',
        'Lịch sử': '📜',
        'Kinh tế': '💰',
        'Công nghệ': '💻',
        'Nghệ thuật': '🎨',
        'Thể thao': '⚽',
        'Du lịch': '✈️',
        'Nấu ăn': '🍳',
        'Sức khỏe': '💊',
        'Kỹ năng sống': '🌟',
        'Kỹ năng': '🌟',
        'Tâm lý': '💭',
        'Tình cảm': '💭',
        'Tâm lý - Tình cảm': '💭',
        'Thiếu nhi': '🧸',
        'Trẻ em': '🧸',
        'Giáo khoa': '📘',
        'Tham khảo': '📘',
        'Giáo khoa - Tham khảo': '📘',
        'Sách giáo khoa': '📘'
    };
    
    // Check exact match first
    if (iconMap[categoryName]) {
        return iconMap[categoryName];
    }
    
    // Check partial match
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
            return icon;
        }
    }
    
    return '📚'; // Default icon
}

// Enhanced load featured products with better error handling
async function loadFeaturedProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    // If a page manages the products grid manually (e.g., products list mockup), skip
    if (productsGrid.dataset && productsGrid.dataset.managed === 'manual') return;

    try {
        // Show loading state
        showLoadingState(productsGrid, 'Đang tải sách nổi bật...');
        
        const response = await api.getFeaturedProducts();
        if (response.success && response.data.products) {
            displayProducts(response.data.products);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        showErrorState(productsGrid, 'Không thể tải sách nổi bật', () => loadFeaturedProducts());
    }
}

// Enhanced display products with lazy loading and animations
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const productsHTML = products.map((product, index) => `
        <div class="product-card animate-in" style="animation-delay: ${index * 100}ms">
            <div class="product-image-container">
                <img data-src="${(product.images && product.images[0] && (product.images[0].url || product.images[0])) || 'assets/images/placeholder-book.svg'}" 
                     alt="${escapeHtml(product.title)}" 
                     class="product-image lazy"
                     onerror="this.src='assets/images/placeholder-book.svg'">
                <div class="product-badge">
                    ${product.isFeatured ? '<span class="badge featured">Nổi bật</span>' : ''}
                    ${product.originalPrice && product.originalPrice > product.price ? 
                        `<span class="badge discount">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>` : ''}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(product.title)}</h3>
                <p class="product-author">Tác giả: ${escapeHtml(product.author)}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating.average)}</div>
                    <span class="rating-text">(${product.rating.count} đánh giá)</span>
                </div>
                <div class="product-price">
                    ${api.formatPrice(product.price)}
                    ${product.originalPrice && product.originalPrice > product.price ? 
                        `<span class="original-price">${api.formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart('${product._id}')" data-product-id="${product._id}">
                        <span class="btn-text">Thêm vào giỏ</span>
                        <span class="btn-icon">🛒</span>
                    </button>
                    <a href="pages/products/detail.php?id=${product._id}" class="btn btn-outline">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;
    
    // Setup lazy loading for images
    const lazyImages = productsGrid.querySelectorAll('.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Add intersection observer for animations
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

// Load top sellers from API
async function loadTopSellers() {
    try {
        const response = await api.getSellers({ limit: 6 });
        if (response.success) {
            displaySellers(response.data.sellers);
        }
    } catch (error) {
        console.error('Error loading top sellers:', error);
        // Error is logged, no need to show user-facing error for optional content
    }
}

// Display sellers in the grid
function displaySellers(sellers) {
    const sellersGrid = document.getElementById('sellersGrid');
    if (!sellersGrid) return;

    const sellersHTML = sellers.map(seller => {
        const sellerId = seller._id || seller.id;
        const storeUrl = `pages/sellers/store.php?id=${sellerId}`;
        
        return `
        <div class="seller-card">
            <div class="seller-avatar">
                <img src="${seller.profile?.avatar || 'assets/images/default-avatar.svg'}" 
                     alt="${seller.username}" 
                     class="avatar-image"
                     onerror="this.src='assets/images/default-avatar.svg'">
            </div>
            <div class="seller-info">
                <h3 class="seller-name">${seller.sellerProfile?.businessName || seller.username}</h3>
                <p class="seller-description">${seller.sellerProfile?.description || 'Người bán uy tín'}</p>
                <div class="seller-stats">
                    <span class="stat">⭐ 4.8/5</span>
                    <span class="stat">📦 100+ sản phẩm</span>
                </div>
                <a href="${storeUrl}" class="btn btn-outline btn-center">
                    Xem cửa hàng
                </a>
            </div>
        </div>
    `;
    }).join('');

    sellersGrid.innerHTML = sellersHTML;
}

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Enhanced add product to cart with better UX
async function addToCart(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (!button) return;

    try {
        // Show loading state on button
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="btn-text">Đang thêm...</span><span class="btn-icon">⏳</span>';
        button.disabled = true;

        // Get product details first
        const response = await api.getProduct(productId);
        if (response.success) {
            api.addToCart(response.data.product);
            
            // Show success animation
            button.innerHTML = '<span class="btn-text">Đã thêm!</span><span class="btn-icon">✅</span>';
            button.classList.add('success');
            
            // Show toast notification
            showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
            
            // Reset button after animation
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.classList.remove('success');
            }, 2000);
        } else {
            throw new Error('Failed to get product details');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        
        // Show error state
        button.innerHTML = '<span class="btn-text">Lỗi!</span><span class="btn-icon">❌</span>';
        button.classList.add('error');
        
        showToast('Không thể thêm sản phẩm vào giỏ hàng', 'error');
        
        // Reset button after error
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('error');
        }, 2000);
    }
}

// Setup user menu with hover and click logic
function setupUserMenu() {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const userMenu = userBtn?.closest('.user-menu');
    
    if (!userBtn || !userDropdown) return;
    
    let isClicked = false; // Track if menu is pinned by click
    
    // Show dropdown
    function showDropdown() {
                userBtn.setAttribute('aria-expanded', 'true');
                userDropdown.setAttribute('aria-hidden', 'false');
                userDropdown.classList.add('show');
                userDropdown.style.display = 'block';
            }

    // Hide dropdown
    function hideDropdown() {
        if (!isClicked) { // Only hide if not clicked (pinned)
                userBtn.setAttribute('aria-expanded', 'false');
                userDropdown.setAttribute('aria-hidden', 'true');
                userDropdown.classList.remove('show');
                userDropdown.style.display = 'none';
            }
    }
    
    // Click on button - toggle pinned state
    userBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isClicked = !isClicked;
        
        if (isClicked) {
            showDropdown();
        } else {
            hideDropdown();
        }
    }, true);

    // Hover on user menu - show dropdown (if not clicked)
    if (userMenu) {
        userMenu.addEventListener('mouseenter', function() {
            if (!isClicked) {
                showDropdown();
            }
        });
        
        userMenu.addEventListener('mouseleave', function() {
            if (!isClicked) {
                hideDropdown();
            }
        });
    }

    // Click outside - unpin and hide
    document.addEventListener('click', function(e) {
        if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            isClicked = false;
            hideDropdown();
        }
    });
    
    // Escape key - unpin and hide
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            isClicked = false;
            hideDropdown();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // User dropdown toggle with hover and click logic
    setupUserMenu();

    // Search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-input');
            const query = searchInput.value.trim();
            
            if (query) {
                window.location.href = `pages/products/list.php?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Check authentication status
    checkAuthStatus();
}

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await api.getCurrentUser();
        if (response.success) {
            updateUserInterface(response.data.user);
        }
    } catch (error) {
        // User is not authenticated
        console.log('User not authenticated');
    }
}

// Update user interface based on authentication status
function updateUserInterface(user) {
    const userDropdown = document.getElementById('userDropdown');
    const userBtn = document.getElementById('userBtn');
    if (userBtn && user) {
        const labelSpan = userBtn.querySelector('span:nth-child(2)');
        if (labelSpan) {
            const displayName = (user.profile?.firstName || user.profile?.lastName)
                ? `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
                : (user.username || 'Tài khoản');
            labelSpan.textContent = displayName;
        }
    }
    if (userDropdown && user) {
        const balance = user.wallet?.balance ?? 0;
        const fmt = (window.api && typeof window.api.formatPrice === 'function')
            ? window.api.formatPrice(balance)
            : `${balance} VND`;
        // Determine URLs based on current path - use absolute paths from frontend root
        const currentPath = window.location.pathname;
        const basePath = '/Bookverse/frontend/';
        
        // Always use absolute paths from frontend root
        const walletUrl = basePath + 'pages/account/wallet.php';
        const profileUrl = basePath + 'pages/account/profile.php';
        const ordersUrl = basePath + 'pages/account/orders.php';
        const wishlistUrl = basePath + 'pages/account/wishlist.php';
        const settingsUrl = basePath + 'pages/account/settings.php';
        
        userDropdown.innerHTML = `
            <div class="dropdown-balance">Số dư ví: <strong>${fmt}</strong></div>
            <a href="${walletUrl}" class="dropdown-link" style="color: #6366f1; font-weight: 500;">💳 Nạp tiền</a>
            <hr>
            <a href="${profileUrl}" class="dropdown-link">Hồ sơ cá nhân</a>
            <a href="${ordersUrl}" class="dropdown-link">Đơn hàng</a>
            <a href="${wishlistUrl}" class="dropdown-link">Yêu thích</a>
            <a href="${settingsUrl}" class="dropdown-link">Cài đặt</a>
            <hr>
            <a href="#" class="dropdown-link" onclick="logout()">Đăng xuất</a>
        `;
    }
}

// Logout function
async function logout() {
    try {
        await api.logout();
        api.clearToken();
        location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        // Clear token anyway
        api.clearToken();
        location.reload();
    }
}

// Initialize UI components
function initializeUI() {
    // Add loading states
    addLoadingStates();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize animations
    initializeAnimations();
}

// Add loading states to dynamic content
function addLoadingStates() {
    const grids = ['categoriesGrid', 'productsGrid', 'sellersGrid'];
    
    grids.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (grid) {
            if (grid.dataset && grid.dataset.managed === 'manual') return;
            grid.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            `;
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltip functionality if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize animations
function initializeAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.category-card, .product-card, .seller-card');
    animateElements.forEach(el => observer.observe(el));
}

// Enhanced utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoadingState(container, message = 'Đang tải...') {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p class="loading-text">${message}</p>
        </div>
    `;
}

function showErrorState(container, message, retryCallback = null) {
	container.innerHTML = `
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<p class="error-text">${message}</p>
			${retryCallback ? `<button class="btn btn-outline" onclick="(${retryCallback.toString()})()">Thử lại</button>` : ''}
		</div>
	`;
}

// Global function to load user info in navigation (used across all pages)
window.loadUserInfo = async function() {
    try {
        const token = localStorage.getItem('bookverse_token');
        if (!token) return;
        
        const response = await api.getUserProfile();
        if (response.success && response.data.user) {
            const user = response.data.user;
            const username = user.username || user.profile?.firstName || user.email?.split('@')[0] || 'User';
            
            // Update user button text
            const userBtn = document.getElementById('userBtn');
            if (userBtn) {
                const span = userBtn.querySelector('span');
                if (span && (span.textContent === 'User' || span.textContent === 'Tài khoản')) {
                    span.textContent = username;
                    console.log('✅ User info loaded:', username);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error loading user info:', error);
    }
}

// Global showToast function (fallback if not available from api.js)
if (typeof showToast === 'undefined') {
    window.showToast = function(message, type = 'info') {
        // Try to use api.showToast if available
        if (typeof api !== 'undefined' && typeof api.showToast === 'function') {
            api.showToast(message, type);
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
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}

// Auto-load user info on all pages
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('bookverse_token')) {
        window.loadUserInfo();
    }
});