document.addEventListener('DOMContentLoaded', function() {
        var userBtn = document.getElementById('userBtn');
        var userDropdown = document.getElementById('userDropdown');
        var userMenu = userBtn?.closest('.user-menu');
        
        if (userBtn && userDropdown) {
            var isClicked = false; // Track if menu is pinned by click
            
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
                var isLoggedIn = !!(window.api && window.api.token);
                if (!isLoggedIn) {
                    window.location.href = 'pages/auth/login.php';
                    return;
                }
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
    });
    
    // ========== FEATURED PRODUCTS - MOCK DATA ==========
    function loadFeaturedProducts() {
        console.log('📦 Loading featured products (mock data)...');
        
        // Mock data - 5 cuốn sách hay nhất
        const featuredProducts = [
            {
                _id: '6904d0f940058752c12385d6',
                title: 'Đắc Nhân Tâm',
                author: 'Dale Carnegie',
                price: 86000,
                originalPrice: 108000,
                averageRating: 4.8,
                totalReviews: 15234,
                totalSold: 8765,
                images: [{
                    url: 'https://nhasachmienphi.com/wp-content/uploads/dac-nhan-tam.jpg'
                }]
            },
            {
                _id: '6904d1c740058752c1238618',
                title: 'Nhà Giả Kim',
                author: 'Paulo Coelho',
                price: 67150,
                originalPrice: 79000,
                averageRating: 4.7,
                totalReviews: 12456,
                totalSold: 7234,
                images: [{
                    url: 'https://bizweb.dktcdn.net/thumb/grande/100/363/455/products/nhagiakimnew03.jpg?v=1705552576547'
                }]
            },
            {
                _id: '691694089171b9edfe4f2709',
                title: 'Sapiens: Lược Sử Loài Người',
                author: 'Yuval Noah Harari',
                price: 188650,
                originalPrice: 269500,
                averageRating: 4.9,
                totalReviews: 9876,
                totalSold: 5432,
                images: [{
                    url: 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/sapiens_luoc_su_loai_nguoi/2023_03_21_16_35_44_6-390x510.jpg'
                }]
            },
            {
                _id: '6916954a9171b9edfe4f277b',
                title: 'Atomic Habits - Thay Đổi Tí Hon',
                author: 'James Clear',
                price: 164500,
                originalPrice: 235000,
                averageRating: 4.9,
                totalReviews: 8234,
                totalSold: 4567,
                images: [{
                    url: 'data:image/png;base64,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'
                }]
            },
            {
                _id: '691696129171b9edfe4f2791',
                title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
                author: 'Rosie Nguyễn',
                price: 66400,
                originalPrice: 80000,
                averageRating: 4.6,
                totalReviews: 11234,
                totalSold: 6789,
                images: [{
                    url: 'data:image/jpeg;base64,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'
                }]
            }
        ];
        
        console.log(`📊 Loaded ${featuredProducts.length} featured products`);
        displayFeaturedProducts(featuredProducts);
    }
    
    function displayFeaturedProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        grid.innerHTML = products.map(product => {
            const discount = product.originalPrice > product.price ? 
                Math.round((1 - product.price / product.originalPrice) * 100) : 0;
            
            return `
            <div class="product-card" role="gridcell" style="position: relative; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;">
                <a href="pages/products/detail.php?id=${product._id}" class="product-link" aria-label="${product.title}" style="text-decoration: none; display: block;">
                    <div class="product-image" style="position: relative; width: 100%; padding-top: 133%; overflow: hidden;">
                        <img src="${product.images && product.images[0] && product.images[0].url ? product.images[0].url : 'https://via.placeholder.com/300x400?text=No+Image'}" 
                             alt="${product.title}"
                             onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'"
                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                        ${discount > 0 ? `
                            <div style="position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
                                -${discount}%
                            </div>
                        ` : ''}
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); padding: 20px 0; opacity: 0; transition: opacity 0.3s ease;" class="image-overlay"></div>
                    </div>
                    <div class="product-info" style="padding: 20px;">
                        <h3 class="product-title" style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 50px;">${product.title}</h3>
                        <p class="product-author" style="color: #94a3b8; font-size: 14px; margin: 0 0 12px 0; font-weight: 500;">✍️ ${product.author}</p>
                        <div class="product-rating" aria-label="Đánh giá ${product.averageRating || 0} sao" style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                            <div style="color: #fbbf24; font-size: 16px; letter-spacing: 2px;">${generateStars(product.averageRating || 0)}</div>
                            <span class="rating-count" style="color: #64748b; font-size: 13px; font-weight: 500;">(${(product.totalReviews || 0).toLocaleString('vi-VN')})</span>
                        </div>
                        <div class="product-price" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <span class="current-price" style="color: #ef4444; font-size: 22px; font-weight: 800;">${formatPrice(product.price)}</span>
                            ${product.originalPrice && product.originalPrice > product.price ? 
                                `<span class="original-price" style="color: #64748b; font-size: 15px; text-decoration: line-through; font-weight: 500;">${formatPrice(product.originalPrice)}</span>` 
                                : ''}
                        </div>
                        ${product.totalSold > 0 ? `
                            <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; width: fit-content;">
                                <span style="color: #22c55e; font-size: 14px; font-weight: 600;">🔥 Đã bán: ${product.totalSold.toLocaleString('vi-VN')}</span>
                            </div>
                        ` : ''}
                    </div>
                </a>
            </div>
        `}).join('');
        
        // Add hover effects
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.02)';
                this.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                const img = this.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
                const overlay = this.querySelector('.image-overlay');
                if (overlay) overlay.style.opacity = '1';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                const img = this.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
                const overlay = this.querySelector('.image-overlay');
                if (overlay) overlay.style.opacity = '0';
            });
        });
        
        console.log('✅ Featured products displayed with enhanced styling');
    }
    
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<span class="star filled" aria-hidden="true">★</span>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<span class="star half" aria-hidden="true">⯨</span>';
            } else {
                stars += '<span class="star" aria-hidden="true">☆</span>';
            }
        }
        
        return stars;
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
    
    function showEmptyFeaturedState() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
                <h3>Chưa có sản phẩm nổi bật</h3>
                <p>Các sản phẩm sẽ được cập nhật sớm!</p>
            </div>
        `;
    }
    
    // Load featured products on page load
    document.addEventListener('DOMContentLoaded', loadFeaturedProducts);
