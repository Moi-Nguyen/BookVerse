// Main script
document.addEventListener('DOMContentLoaded', function() {
    // Modal handlers
    const modal = document.getElementById('addProductModal');
    const closeBtn = document.getElementById('closeAddProductModal');
    const cancelBtn = document.getElementById('cancelProduct');
    
    if (modal) {
        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
        }
        
        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
        }
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        });
    }
    
    // Global state
    let currentPage = 1;
    let currentView = 'grid'; // 'grid' or 'list'
    let totalPages = 1;
    let allProducts = [];
    let currentFilters = {
        search: '',
        category: '',
        status: '',
        sort: 'newest'
    };
    let searchTimeout = null;
    
    // View toggle handlers
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            switchView(view);
        });
    });
    
    function switchView(view) {
        currentView = view;
        
        // Update button states
        viewButtons.forEach(btn => {
            if (btn.dataset.view === view) {
                btn.classList.add('active');
    } else {
                btn.classList.remove('active');
            }
        });
        
        // Show/hide containers
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (view === 'grid') {
            if (productsGrid) productsGrid.style.display = 'grid';
            if (productsList) productsList.style.display = 'none';
            renderProductsGrid(allProducts);
        } else {
            if (productsGrid) productsGrid.style.display = 'none';
            if (productsList) productsList.style.display = 'block';
            renderProductsList(allProducts);
        }
    }
    
    // Load products
    async function loadProducts(page = 1) {
        const productsLoading = document.getElementById('productsLoading');
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        const productsEmpty = document.getElementById('productsEmpty');
        const productsPagination = document.getElementById('productsPagination');
        
        try {
            console.log('📦 Loading products...', 'Page:', page, 'Filters:', currentFilters);
            
            // Show loading
            if (productsLoading) productsLoading.style.display = 'flex';
            if (productsGrid) productsGrid.style.display = 'none';
            if (productsList) productsList.style.display = 'none';
            if (productsEmpty) productsEmpty.style.display = 'none';
            if (productsPagination) productsPagination.style.display = 'none';
            
            // Build query string
            let queryParams = `page=${page}&limit=12`;
            
            // Add filters
            if (currentFilters.search) {
                queryParams += `&search=${encodeURIComponent(currentFilters.search)}`;
            }
            if (currentFilters.category) {
                queryParams += `&category=${encodeURIComponent(currentFilters.category)}`;
            }
            if (currentFilters.status) {
                queryParams += `&status=${encodeURIComponent(currentFilters.status)}`;
            }
            
            // Add sort
            const sortMap = {
                'newest': { sort: 'createdAt', order: 'desc' },
                'oldest': { sort: 'createdAt', order: 'asc' },
                'price-high': { sort: 'price', order: 'desc' },
                'price-low': { sort: 'price', order: 'asc' },
                'sales': { sort: 'totalSold', order: 'desc' },
                'rating': { sort: 'rating.average', order: 'desc' }
            };
            
            const sortConfig = sortMap[currentFilters.sort] || sortMap['newest'];
            queryParams += `&sort=${sortConfig.sort}&order=${sortConfig.order}`;
            
            // Get seller's products with pagination and filters
            const response = await api.request(`/products/seller/my-products?${queryParams}`);
            console.log('✅ Products loaded:', response);
            
            // Hide loading
            if (productsLoading) productsLoading.style.display = 'none';
            
            if (response.success && response.data) {
                const products = response.data.products || [];
                const pagination = response.data.pagination || {};
                
                currentPage = pagination.page || page;
                totalPages = pagination.pages || 1;
                allProducts = products;
                
                if (products.length === 0) {
                    // Show empty state
                    if (productsEmpty) productsEmpty.style.display = 'flex';
                } else {
                    // Render products based on current view
                    if (currentView === 'grid') {
                        if (productsGrid) productsGrid.style.display = 'grid';
                        renderProductsGrid(products);
                    } else {
                        if (productsList) productsList.style.display = 'block';
                        renderProductsList(products);
                    }
                    
                    // Show pagination if needed
                    if (totalPages > 1 && productsPagination) {
                        productsPagination.style.display = 'flex';
                        renderPagination(pagination);
                    }
                }
            } else {
                throw new Error('Không thể tải sản phẩm');
            }
        } catch (error) {
            console.error('❌ Failed to load products:', error);
            
            // Hide loading
            if (productsLoading) productsLoading.style.display = 'none';
            
            // Show empty state with error
            if (productsEmpty) {
                productsEmpty.style.display = 'flex';
                productsEmpty.innerHTML = `
                    <div class="empty-icon">📦</div>
                    <h3>Không thể tải sản phẩm</h3>
                    <p>Có lỗi xảy ra: ${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        🔄 Thử lại
                    </button>
                `;
            }
        }
    }
    
    function renderProductsGrid(products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
                        productsGrid.innerHTML = products.map(product => {
                            const productImage = (product.images && product.images[0] && (product.images[0].url || product.images[0])) 
                                || 'https://via.placeholder.com/300x400?text=No+Image';
                            const rating = product.rating?.average || product.averageRating || 0;
                            const reviewCount = product.rating?.count || product.reviewCount || 0;
                            
                            return `
                            <div class="product-card" data-product-id="${product._id}">
                                <div class="product-image">
                                    <img src="${productImage}" 
                                         alt="${product.title || 'Sản phẩm'}" 
                                         onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'" />
                                    <div class="product-status status-${product.status || 'pending'}">
                                        ${getStatusText(product.status || 'pending')}
                                    </div>
                                </div>
                                <div class="product-info">
                                    <h3 class="product-title">${product.title || 'Chưa có tên'}</h3>
                                    <p class="product-author">${product.author || 'Tác giả không xác định'}</p>
                                    <div class="product-meta">
                                        <span class="product-price">${formatPrice(product.price || 0)}</span>
                                        <span class="product-stock">Tồn: ${product.stock || 0}</span>
                                    </div>
                                    <div class="product-stats">
                                        <span title="Lượt xem">👁️ ${product.viewCount || 0}</span>
                                        <span title="Đánh giá">⭐ ${rating.toFixed(1)} (${reviewCount})</span>
                                        <span title="Đã bán">📦 ${product.totalSold || 0}</span>
                                    </div>
                                    <div class="product-actions">
                                        <button class="btn btn-sm btn-outline" onclick="viewProduct('${product._id}')" title="Xem chi tiết">
                                            👁️
                                        </button>
                                        <button class="btn btn-sm btn-outline" onclick="editProduct('${product._id}')" title="Chỉnh sửa">
                                            ✏️
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')" title="Xóa">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                        }).join('');
                    }
    
    function renderProductsList(products) {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;
        
        productsList.innerHTML = products.map(product => {
            const productImage = (product.images && product.images[0] && (product.images[0].url || product.images[0])) 
                || 'https://via.placeholder.com/150x200?text=No+Image';
            const rating = product.rating?.average || product.averageRating || 0;
            const reviewCount = product.rating?.count || product.reviewCount || 0;
            
            return `
                <div class="product-list-item" data-product-id="${product._id}">
                    <div class="product-list-image">
                        <img src="${productImage}" 
                             alt="${product.title || 'Sản phẩm'}" 
                             onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'" />
                        <div class="product-status status-${product.status || 'pending'}">
                            ${getStatusText(product.status || 'pending')}
                        </div>
                    </div>
                    <div class="product-list-info">
                        <h3 class="product-title">${product.title || 'Chưa có tên'}</h3>
                        <p class="product-author">${product.author || 'Tác giả không xác định'}</p>
                        <div class="product-list-meta">
                            <span class="product-price">${formatPrice(product.price || 0)}</span>
                            <span class="product-stock">Tồn: ${product.stock || 0}</span>
                            <span title="Lượt xem">👁️ ${product.viewCount || 0}</span>
                            <span title="Đánh giá">⭐ ${rating.toFixed(1)} (${reviewCount})</span>
                            <span title="Đã bán">📦 ${product.totalSold || 0}</span>
                        </div>
                    </div>
                    <div class="product-list-actions">
                        <button class="btn btn-sm btn-outline" onclick="viewProduct('${product._id}')" title="Xem chi tiết">
                            👁️ Xem
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="editProduct('${product._id}')" title="Chỉnh sửa">
                            ✏️ Sửa
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')" title="Xóa">
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function renderPagination(pagination) {
        const productsPagination = document.getElementById('productsPagination');
        if (!productsPagination) return;
        
        const { page, pages, total } = pagination;
        
        let paginationHTML = '<div class="pagination-info">';
        paginationHTML += `Hiển thị ${((page - 1) * 12) + 1}-${Math.min(page * 12, total)} trong tổng số ${total} sản phẩm`;
        paginationHTML += '</div>';
        paginationHTML += '<div class="pagination-controls">';
        
        // Previous button
        if (page > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(${page - 1})">‹ Trước</button>`;
            } else {
            paginationHTML += `<button class="pagination-btn disabled" disabled>‹ Trước</button>`;
            }
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(pages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === page) {
                paginationHTML += `<button class="pagination-btn active">${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
            }
        }
        
        if (endPage < pages) {
            if (endPage < pages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(${pages})">${pages}</button>`;
        }
        
        // Next button
        if (page < pages) {
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(${page + 1})">Sau ›</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn disabled" disabled>Sau ›</button>`;
        }
        
        paginationHTML += '</div>';
        
        productsPagination.innerHTML = paginationHTML;
    }
    
    window.goToPage = function(page) {
        if (page >= 1 && page <= totalPages) {
            loadProducts(page);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Helper functions
    function getStatusText(status) {
        const statusMap = {
            'pending': '⏳ Chờ duyệt',
            'approved': '✅ Đã duyệt',
            'rejected': '❌ Bị từ chối',
            'inactive': '⏸️ Không hoạt động'
        };
        return statusMap[status] || status;
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
    
    // Product actions
    window.viewProduct = function(productId) {
        console.log('View product:', productId);
        // Open product detail page
        window.open(`../../pages/products/detail.php?id=${productId}`, '_blank');
    };
    
    window.editProduct = function(productId) {
        console.log('Edit product:', productId);
        // Find product in allProducts
        const product = allProducts.find(p => p._id === productId);
        if (!product) {
            alert('Không tìm thấy sản phẩm');
            return;
        }
        
        // Open edit modal with product data
        const modal = document.getElementById('addProductModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('addProductForm');
        
        if (modal && modalTitle && form) {
            modalTitle.textContent = 'Chỉnh sửa sản phẩm';
            modal.style.display = 'flex';
            modal.classList.add('show');
            
            // Populate form with product data
            document.getElementById('productTitle').value = product.title || '';
            document.getElementById('productAuthor').value = product.author || '';
            document.getElementById('productPublisher').value = product.publisher || '';
            document.getElementById('productIsbn').value = product.isbn || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productOriginalPrice').value = product.originalPrice || '';
            document.getElementById('productStock').value = product.stock || '';
            document.getElementById('productCondition').value = product.condition || 'new';
            document.getElementById('productCategory').value = product.category?._id || product.category || '';
            document.getElementById('productPublishYear').value = product.publishYear || '';
            document.getElementById('productPages').value = product.pages || '';
            document.getElementById('productTags').value = product.tags?.join(', ') || '';
            document.getElementById('productMetaTitle').value = product.metaTitle || '';
            document.getElementById('productMetaDescription').value = product.metaDescription || '';
            
            // Store product ID for update
            form.dataset.productId = productId;
        }
    };
    
    window.deleteProduct = async function(productId) {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
            return;
        }
        
        try {
            const response = await api.request(`/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response && response.success) {
                if (typeof showToast === 'function') {
                    showToast('✅ Đã xóa sản phẩm thành công', 'success');
                } else {
                alert('✅ Đã xóa sản phẩm thành công');
                }
                // Reload products
                loadProducts(currentPage);
            } else {
                throw new Error(response?.message || 'Không thể xóa sản phẩm');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            const errorMsg = error.message || 'Không thể xóa sản phẩm';
            if (typeof showToast === 'function') {
                showToast('❌ ' + errorMsg, 'error');
            } else {
                alert('❌ ' + errorMsg);
            }
        }
    };
    
    // Filter and search handlers
    function setupFilters() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        // Search input with debounce
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentFilters.search = this.value.trim();
                    currentPage = 1;
                    loadProducts(currentPage);
                }, 500);
            });
            
            // Enter key to search
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(searchTimeout);
                    currentFilters.search = this.value.trim();
                    currentPage = 1;
                    loadProducts(currentPage);
                }
            });
        }
        
        // Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                if (searchInput) {
                    currentFilters.search = searchInput.value.trim();
                    currentPage = 1;
                    loadProducts(currentPage);
                }
            });
        }
        
        // Category filter
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentFilters.category = this.value;
                currentPage = 1;
                loadProducts(currentPage);
            });
        }
        
        // Status filter
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                currentFilters.status = this.value;
                currentPage = 1;
                loadProducts(currentPage);
            });
        }
        
        // Sort filter
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                currentFilters.sort = this.value;
                currentPage = 1;
                loadProducts(currentPage);
            });
        }
    }
    
    // Setup filters on page load
    setupFilters();
    
    // Add product button - open modal and reset form
    const addProductBtn = document.getElementById('addProductBtn');
    const addFirstProductBtn = document.getElementById('addFirstProduct');
    
    function openAddProductModal() {
        const modal = document.getElementById('addProductModal');
        const form = document.getElementById('addProductForm');
        const modalTitle = document.getElementById('modalTitle');
        const errorEl = document.getElementById('productError');
        const successEl = document.getElementById('productSuccess');
        
        if (modal) {
            // Reset form
            if (form) {
                form.reset();
                delete form.dataset.productId;
            }
            
            // Reset modal title
            if (modalTitle) {
                modalTitle.textContent = 'Thêm sản phẩm mới';
            }
            
            // Hide error/success messages
            if (errorEl) errorEl.style.display = 'none';
            if (successEl) successEl.style.display = 'none';
            
            // Show modal
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openAddProductModal();
        });
    }
    
    if (addFirstProductBtn) {
        addFirstProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openAddProductModal();
        });
    }
    
    // Load products on page load
    loadProducts(1);
    
    // Load categories for the form
    if (typeof api !== 'undefined' && api.getCategories) {
        api.getCategories().then(response => {
            console.log('📂 Categories loaded:', response);
            if (response.success && response.data) {
                // Backend returns data.categories (nested structure)
                const categories = response.data.categories || response.data;
                const categorySelect = document.getElementById('productCategory');
                const categoryFilter = document.getElementById('categoryFilter');
                
                if (categorySelect && Array.isArray(categories)) {
                    categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
                    categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat._id;
                        option.textContent = cat.name;
                        categorySelect.appendChild(option);
                    });
                    console.log(`✅ Loaded ${categories.length} categories into select`);
                }
                
                // Also populate filter dropdown
                if (categoryFilter && Array.isArray(categories)) {
                    categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>';
                    categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat._id;
                        option.textContent = cat.name;
                        categoryFilter.appendChild(option);
                    });
                }
            }
        }).catch(err => {
            console.error('❌ Failed to load categories:', err);
            // Show error in console for debugging
            console.error('Error details:', err);
            
            // Add fallback placeholder option
            const categorySelect = document.getElementById('productCategory');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Không thể tải danh mục - Vui lòng refresh trang</option>';
            }
        });
    } else {
        console.error('❌ api.getCategories not available');
        console.log('Available api methods:', Object.keys(api || {}));
    }
    
    // Handle form submission
    const form = document.getElementById('addProductForm');
    const saveBtn = document.getElementById('saveProduct');
    
    if (form && saveBtn) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📝 Form submitted');
            
            // Show loading state
            const btnText = saveBtn.querySelector('.btn-text');
            const btnLoading = saveBtn.querySelector('.btn-loading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            saveBtn.disabled = true;
            
            const isEdit = form.dataset.productId;
            const productId = isEdit ? form.dataset.productId : null;
            
            try {
                const formData = new FormData(form);
                
                // Build product data object
                const productData = {
                    title: formData.get('title'),
                    author: formData.get('author'),
                    description: formData.get('description') || 'Chưa có mô tả chi tiết.',
                    price: parseFloat(formData.get('price')),
                    stock: parseInt(formData.get('stock')),
                    category: formData.get('category'),
                    condition: formData.get('condition') || 'new'
                };
                
                // Add optional fields if they have values
                const optionalFields = {
                    publisher: formData.get('publisher'),
                    isbn: formData.get('isbn'),
                    metaTitle: formData.get('metaTitle'),
                    metaDescription: formData.get('metaDescription')
                };
                
                Object.keys(optionalFields).forEach(key => {
                    if (optionalFields[key]) {
                        productData[key] = optionalFields[key];
                    }
                });
                
                // Add numeric fields if they have values
                const originalPrice = formData.get('originalPrice');
                if (originalPrice && parseFloat(originalPrice) > 0) {
                    productData.originalPrice = parseFloat(originalPrice);
                }
                
                const publishYear = formData.get('publishYear');
                if (publishYear && parseInt(publishYear) > 0) {
                    productData.publishYear = parseInt(publishYear);
                }
                
                const pages = formData.get('pages');
                if (pages && parseInt(pages) > 0) {
                    productData.pages = parseInt(pages);
                }
                
                // Process tags
                const tagsInput = formData.get('tags');
                if (tagsInput) {
                    productData.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                }
                
                // Process images (only for new products)
                if (!productId) {
                productData.images = [{
                    url: 'https://via.placeholder.com/300x400?text=Book+Cover',
                    alt: productData.title,
                    isPrimary: true
                }];
                }
                
                console.log('📦 Product data:', productData);
                
                // Validate required fields
                if (!productData.title || !productData.author || !productData.category) {
                    throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên sản phẩm, Tác giả, Danh mục)');
                }
                
                if (productData.price <= 0) {
                    throw new Error('Giá bán phải lớn hơn 0');
                }
                
                if (productData.stock < 0) {
                    throw new Error('Số lượng tồn kho không thể âm');
                }
                
                // Call API
                let response;
                if (productId) {
                    // Update existing product
                    response = await api.request(`/products/${productId}`, {
                        method: 'PUT',
                        body: JSON.stringify(productData)
                    });
                } else {
                    // Create new product
                    response = await api.createProduct(productData);
                }
                
                console.log('✅ Product saved:', response);
                    
                if (response && response.success) {
                        // Show success message
                        const successEl = document.getElementById('productSuccess');
                    const modal = document.getElementById('addProductModal');
                    const modalTitle = document.getElementById('modalTitle');
                    
                        if (successEl) {
                        successEl.textContent = productId 
                            ? '✅ Sản phẩm đã được cập nhật thành công!' 
                            : '✅ Sản phẩm đã được thêm thành công! Đang chờ admin phê duyệt.';
                            successEl.style.display = 'block';
                        }
                        
                        // Close modal after 2 seconds
                        setTimeout(() => {
                        if (modal) {
                            modal.style.display = 'none';
                            modal.classList.remove('show');
                        }
                            form.reset();
                        delete form.dataset.productId;
                            if (successEl) successEl.style.display = 'none';
                        if (modalTitle) modalTitle.textContent = 'Thêm sản phẩm mới';
                            
                        // Reload products
                        loadProducts(currentPage);
                        }, 2000);
                    } else {
                    throw new Error(response?.message || 'Không thể lưu sản phẩm');
                }
            } catch (error) {
                console.error('❌ Error:', error);
                console.error('❌ Error data:', error.data);
                
                // Show detailed error message
                const errorEl = document.getElementById('productError');
                if (errorEl) {
                    let errorMessage = '❌ ' + error.message;
                    
                    // If error has data with validation errors (from APIError)
                    if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
                        errorMessage += '\n\nChi tiết lỗi:';
                        error.data.errors.forEach(err => {
                            errorMessage += `\n• ${err.field}: ${err.message}`;
                        });
                    }
                    
                    errorEl.textContent = errorMessage;
                    errorEl.style.display = 'block';
                    errorEl.style.whiteSpace = 'pre-line'; // Allow line breaks
                }
                
                // Hide error after 15 seconds
                setTimeout(() => {
                    if (errorEl) errorEl.style.display = 'none';
                }, 15000);
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                saveBtn.disabled = false;
            }
        });
    }
    
    // Load user info
    if (typeof window.loadUserInfo === 'function') {
        window.loadUserInfo();
    }
});
