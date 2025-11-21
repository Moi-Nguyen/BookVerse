// Product detail rendering

// Ensure API is available
if (typeof api === 'undefined') {
    console.error('API not loaded. Make sure api.js is loaded before product.js');
}

// Get API base URL
const API_BASE_URL = window.appConfig?.getApiUrl() || 'http://localhost:5000/api';

// Helper function to render stars
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Toast notification function
function showToast(message, type = 'info') {
    // Try to use notificationManager if available
    if (typeof notificationManager !== 'undefined' && notificationManager) {
        if (type === 'success') {
            notificationManager.success(message);
        } else if (type === 'error') {
            notificationManager.error(message);
        } else {
            notificationManager.info(message);
        }
        return;
    }
    
    // Fallback: simple alert or console
    if (type === 'error') {
        console.error(message);
        alert(message);
    } else {
        console.log(message);
        // Create a simple toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 24px;
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
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        console.warn('No product ID in URL');
        return;
    }

    const reviewsEl = document.getElementById('reviewsList');

    // Check if API is available
    if (typeof api === 'undefined') {
        showToast('API chưa sẵn sàng. Vui lòng tải lại trang.', 'error');
        return;
    }

    try {
        const res = await api.getProduct(id);
        const product = res.data.product;

        // Populate existing DOM instead of replacing markup (keeps CSS layout)
        const mainImage = document.getElementById('mainImage');
        const zoomImage = document.getElementById('zoomImage');
        const titleEl = document.getElementById('productTitle');
        const authorEl = document.getElementById('productAuthor');
        const publisherEl = document.getElementById('productPublisher');
        const categoryEl = document.getElementById('productCategory');
        const descEl = document.getElementById('productDescription');
        const currentPriceEl = document.getElementById('currentPrice');
        const originalPriceEl = document.getElementById('originalPrice');
        const discountBadgeEl = document.getElementById('discountBadge');
        const priceValueEl = document.getElementById('priceValue');
        const thumbsEl = document.getElementById('thumbnailGallery');

        const firstImage = (product.images && (product.images[0]?.url || product.images[0])) || '';
        if (mainImage) mainImage.src = firstImage || '../../assets/images/no-image.jpg';
        if (zoomImage) zoomImage.src = firstImage || '';
        if (titleEl) titleEl.textContent = product.title || '';
        if (authorEl) authorEl.textContent = product.author || 'Không rõ';
        if (publisherEl) publisherEl.textContent = product.publisher || '—';
        if (categoryEl) categoryEl.textContent = product.category?.name || product.category || '—';
        if (descEl) descEl.textContent = product.description || '';

        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        if (currentPriceEl) currentPriceEl.textContent = api.formatPrice(product.price || 0);
        if (priceValueEl) priceValueEl.textContent = api.formatPrice(product.price || 0);
        if (originalPriceEl) {
            originalPriceEl.style.display = hasDiscount ? '' : 'none';
            if (hasDiscount) originalPriceEl.textContent = api.formatPrice(product.originalPrice);
        }
        if (discountBadgeEl) {
            discountBadgeEl.style.display = hasDiscount ? '' : 'none';
            if (hasDiscount) {
                const percent = Math.round((1 - (product.price / product.originalPrice)) * 100);
                discountBadgeEl.textContent = `-${percent}%`;
            }
        }

        // Update rating display
        const rating = product.rating?.average || product.averageRating || 0;
        const reviewCount = product.rating?.count || product.reviewCount || 0;
        
        // Update product stars in header
        const productStarsEl = document.getElementById('productStars');
        const ratingScoreEl = document.getElementById('ratingScore');
        const ratingCountEl = document.getElementById('ratingCount');
        
        if (productStarsEl) {
            productStarsEl.innerHTML = renderStars(rating);
        }
        if (ratingScoreEl) {
            ratingScoreEl.textContent = rating.toFixed(1);
        }
        if (ratingCountEl) {
            ratingCountEl.textContent = `(${reviewCount} đánh giá)`;
        }

        // Update overall rating in reviews tab
        const overallRatingEl = document.getElementById('overallRating');
        const overallStarsEl = document.getElementById('overallStars');
        const ratingTotalEl = document.querySelector('.rating-total');
        
        if (overallRatingEl) {
            overallRatingEl.textContent = rating.toFixed(1);
        }
        if (overallStarsEl) {
            overallStarsEl.innerHTML = renderStars(rating);
        }
        if (ratingTotalEl) {
            ratingTotalEl.textContent = `dựa trên ${reviewCount} đánh giá`;
        }

        // Update reviews tab button
        const reviewsTabBtn = document.querySelector('[data-tab="reviews"]');
        if (reviewsTabBtn) {
            reviewsTabBtn.textContent = `Đánh giá (${reviewCount})`;
        }

        if (thumbsEl) {
            const images = (product.images || []).map(img => (img.url || img)).filter(Boolean);
            thumbsEl.innerHTML = images.map((url, idx) => `
                <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-url="${url}">
                    <img src="${url}" alt="Thumb ${idx + 1}">
                </div>
            `).join('');
            thumbsEl.querySelectorAll('.thumbnail-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.getAttribute('data-url') || '';
                    if (mainImage) mainImage.src = url;
                    if (zoomImage) zoomImage.src = url;
                    thumbsEl.querySelectorAll('.thumbnail-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });
        }

        // Image zoom
        const overlay = document.getElementById('imageZoom');
        if (overlay && mainImage && zoomImage) {
            mainImage.addEventListener('click', () => overlay.classList.add('show'));
            overlay.addEventListener('click', () => overlay.classList.remove('show'));
        }

        // Quantity and cart actions
        const qtyInput = document.getElementById('quantity');
        document.getElementById('increaseQty')?.addEventListener('click', () => {
            if (!qtyInput) return; qtyInput.value = String(Math.min(99, Number(qtyInput.value || 1) + 1));
        });
        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            if (!qtyInput) return; qtyInput.value = String(Math.max(1, Number(qtyInput.value || 1) - 1));
        });
        document.getElementById('addToCartBtn')?.addEventListener('click', () => {
            try {
                const qty = Number(qtyInput?.value || 1) || 1;
                if (!product || !product._id) {
                    showToast('Thông tin sản phẩm không hợp lệ', 'error');
                    return;
                }
                
                // Add to cart using API
                if (typeof api !== 'undefined' && api.addToCart) {
                    api.addToCart(product, qty);
                    showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
                    
                    // Update cart count if available
                    if (api.updateCartUI) {
                        api.updateCartUI();
                    }
                } else {
                    showToast('Chức năng giỏ hàng chưa sẵn sàng', 'error');
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                showToast('Không thể thêm vào giỏ hàng. Vui lòng thử lại.', 'error');
            }
        });
        document.getElementById('buyNowBtn')?.addEventListener('click', () => {
            try {
                const qty = Number(qtyInput?.value || 1) || 1;
                if (!product || !product._id) {
                    showToast('Thông tin sản phẩm không hợp lệ', 'error');
                    return;
                }
                
                // Add to cart using API
                if (typeof api !== 'undefined' && api.addToCart) {
                    api.addToCart(product, qty);
                    showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
                    
                    // Update cart count if available
                    if (api.updateCartUI) {
                        api.updateCartUI();
                    }
                    
                    // Redirect to cart page after a short delay
                    setTimeout(() => {
                        window.location.href = '../../pages/cart/cart.php';
                    }, 300);
                } else {
                    showToast('Chức năng giỏ hàng chưa sẵn sàng', 'error');
                }
            } catch (error) {
                console.error('Buy now error:', error);
                showToast('Không thể thêm vào giỏ hàng. Vui lòng thử lại.', 'error');
            }
        });
        document.getElementById('addToWishlistBtn')?.addEventListener('click', async () => {
            try {
                if (!window.api || !window.api.token) {
                    showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
                    return;
                }
                const response = await window.api.addToWishlist(product._id);
                if (response.success) {
                    showToast('Đã thêm vào danh sách yêu thích', 'success');
                    // Update button state if needed
                    const btn = document.getElementById('addToWishlistBtn');
                    if (btn) {
                        btn.classList.add('added');
                        btn.innerHTML = '<span>❤️</span> Đã thêm';
                    }
                } else {
                    showToast(response.message || 'Không thể thêm vào yêu thích', 'error');
                }
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                showToast('Không thể thêm vào yêu thích', 'error');
            }
        });

        const messageSellerBtn = document.getElementById('messageSellerBtn');
        if (messageSellerBtn) {
            const sellerId = product.seller?._id || product.seller?.id;
            if (sellerId) {
                messageSellerBtn.style.display = 'flex';
                messageSellerBtn.addEventListener('click', async () => {
                    if (!window.api || !window.api.token) {
                        const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
                        window.location.href = `../auth/login.php?redirect=${redirectUrl}`;
                        return;
                    }
                    try {
                        messageSellerBtn.disabled = true;
                        const response = await window.api.createConversation({
                            sellerId,
                            productId: product._id || product.id,
                            subject: `Trao đổi sản phẩm: ${product.title}`
                        });
                        const conversationId = response?.data?._id || response?.data?.id;
                        if (conversationId) {
                            window.location.href = `../account/messages.php?conversationId=${conversationId}`;
                        } else {
                            showToast('Không thể mở cuộc trò chuyện', 'error');
                        }
                    } catch (error) {
                        window.api.handleError(error);
                    } finally {
                        messageSellerBtn.disabled = false;
                    }
                });
            } else {
                messageSellerBtn.style.display = 'none';
            }
        }

        // Load reviews
        const list = await fetch(`${API_BASE_URL}/reviews/product/${id}`).then(r => r.json());
        const reviews = list?.data?.reviews || [];
        const actualReviewCount = reviews.length;
        
        // Update review count if different from product data
        if (actualReviewCount > 0) {
            if (ratingCountEl) {
                ratingCountEl.textContent = `(${actualReviewCount} đánh giá)`;
            }
            if (ratingTotalEl) {
                ratingTotalEl.textContent = `dựa trên ${actualReviewCount} đánh giá`;
            }
            if (reviewsTabBtn) {
                reviewsTabBtn.textContent = `Đánh giá (${actualReviewCount})`;
            }
        }
        
        if (reviewsEl) {
            if (reviews.length === 0) {
                reviewsEl.innerHTML = '<p class="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>';
            } else {
                reviewsEl.innerHTML = reviews.map(rv => `
                    <div class="review">
                        <div class="review-header">
                            <strong>${rv.isAnonymous ? 'Ẩn danh' : (rv.customer?.username || 'Người dùng')}</strong>
                            <span class="review-rating-stars">${renderStars(rv.rating || 0)}</span>
                            <span class="review-rating-number">${rv.rating || 0}/5</span>
                        </div>
                        <div class="review-body">${rv.title ? `<p class="review-title"><em>${rv.title}</em></p>` : ''}<p>${rv.comment || ''}</p></div>
                    </div>
                `).join('');
            }
        }

        // Review form submit
        const reviewForm = document.getElementById('reviewForm');
        reviewForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(reviewForm);
            const payload = {
                product: id,
                rating: Number(formData.get('rating')),
                title: formData.get('title') || undefined,
                comment: formData.get('comment')
            };
            try {
                const resCreate = await fetch(`${API_BASE_URL}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api.token}` },
                    body: JSON.stringify(payload)
                }).then(r => r.json());
                if (!resCreate.success) throw new Error(resCreate.message || 'Tạo đánh giá thất bại');
                showToast('Đã gửi đánh giá thành công!', 'success');
                // Reload to update ratings
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } catch (err) { api.handleError(err); }
        });

        // Tab switching functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        // Load detailed description
        const detailedDescEl = document.getElementById('detailedDescription');
        if (detailedDescEl) {
            const detailedDesc = product.detailedDescription || product.fullDescription || product.description || '';
            if (detailedDesc) {
                detailedDescEl.innerHTML = detailedDesc.replace(/\n/g, '<br>');
            } else {
                detailedDescEl.innerHTML = '<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>';
            }
        }

        // Load specifications
        const specsTableEl = document.getElementById('specificationsTable');
        if (specsTableEl && product.specifications) {
            const specs = product.specifications;
            if (typeof specs === 'object' && Object.keys(specs).length > 0) {
                specsTableEl.innerHTML = `
                    <table class="specs-table">
                        <tbody>
                            ${Object.entries(specs).map(([key, value]) => `
                                <tr>
                                    <td class="spec-label">${key}</td>
                                    <td class="spec-value">${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                specsTableEl.innerHTML = '<p>Chưa có thông số kỹ thuật cho sản phẩm này.</p>';
            }
        } else if (specsTableEl) {
            // Try to build specs from product data
            const specs = [];
            if (product.pages) specs.push(['Số trang', product.pages]);
            if (product.dimensions) specs.push(['Kích thước', product.dimensions]);
            if (product.weight) specs.push(['Trọng lượng', product.weight]);
            if (product.language) specs.push(['Ngôn ngữ', product.language]);
            if (product.format) specs.push(['Định dạng', product.format]);
            if (product.isbn) specs.push(['ISBN', product.isbn]);
            if (product.publicationDate) specs.push(['Ngày xuất bản', product.publicationDate]);
            
            if (specs.length > 0) {
                specsTableEl.innerHTML = `
                    <table class="specs-table">
                        <tbody>
                            ${specs.map(([key, value]) => `
                                <tr>
                                    <td class="spec-label">${key}</td>
                                    <td class="spec-value">${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                specsTableEl.innerHTML = '<p>Chưa có thông số kỹ thuật cho sản phẩm này.</p>';
            }
        }

        // Load related products based on tags
        await loadRelatedProducts(product, id);
    } catch (err) {
        api.handleError(err);
    }
});

// Function to load related products based on tags
async function loadRelatedProducts(currentProduct, currentProductId) {
    try {
        const relatedProductsEl = document.getElementById('relatedProducts');
        if (!relatedProductsEl) return;

        // Get tags from current product
        const tags = currentProduct.tags || currentProduct.tag || [];
        const category = currentProduct.category?._id || currentProduct.category?.id || currentProduct.category;
        
        if (!tags || tags.length === 0) {
            // If no tags, try to get products from same category
            if (category) {
                const response = await api.getProducts({
                    category: typeof category === 'string' ? category : (category._id || category.id),
                    limit: 8
                });
                
                if (response && response.success) {
                    const products = response.data?.products || response.data?.items || response.data || [];
                    const relatedProducts = products.filter(p => {
                        const pId = p._id || p.id;
                        return pId !== currentProductId;
                    }).slice(0, 6);
                    
                    renderRelatedProducts(relatedProducts, relatedProductsEl);
                }
            } else {
                relatedProductsEl.innerHTML = '<p class="no-products">Không có sản phẩm liên quan.</p>';
            }
            return;
        }

        // Search products with similar tags
        const tagQuery = Array.isArray(tags) ? tags.join(',') : tags;
        const response = await api.getProducts({
            tags: tagQuery,
            limit: 12
        });

        if (response && response.success) {
            let products = response.data?.products || response.data?.items || response.data || [];
            
            // Filter out current product and limit to 6
            products = products.filter(p => {
                const pId = p._id || p.id;
                return pId !== currentProductId;
            }).slice(0, 6);

            if (products.length === 0) {
                // Fallback to category if no tag matches
                if (category) {
                    const categoryResponse = await api.getProducts({
                        category: typeof category === 'string' ? category : (category._id || category.id),
                        limit: 8
                    });
                    
                    if (categoryResponse && categoryResponse.success) {
                        const categoryProducts = categoryResponse.data?.products || categoryResponse.data?.items || categoryResponse.data || [];
                        const relatedProducts = categoryProducts.filter(p => {
                            const pId = p._id || p.id;
                            return pId !== currentProductId;
                        }).slice(0, 6);
                        
                        renderRelatedProducts(relatedProducts, relatedProductsEl);
                        return;
                    }
                }
                relatedProductsEl.innerHTML = '<p class="no-products">Không có sản phẩm liên quan.</p>';
            } else {
                renderRelatedProducts(products, relatedProductsEl);
            }
        } else {
            relatedProductsEl.innerHTML = '<p class="no-products">Không thể tải sản phẩm liên quan.</p>';
        }
    } catch (error) {
        console.error('Error loading related products:', error);
        const relatedProductsEl = document.getElementById('relatedProducts');
        if (relatedProductsEl) {
            relatedProductsEl.innerHTML = '<p class="no-products">Không thể tải sản phẩm liên quan.</p>';
        }
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to render related products
function renderRelatedProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">Không có sản phẩm liên quan.</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        const productId = product._id || product.id;
        const imageUrl = (product.images && product.images[0]?.url) || 
                        (product.images && product.images[0]) || 
                        (product.image) || 
                        '../../assets/images/no-image.jpg';
        const price = product.price || 0;
        const originalPrice = product.originalPrice || 0;
        const hasDiscount = originalPrice > price;
        const rating = product.rating?.average || product.averageRating || 0;
        const reviewCount = product.rating?.count || product.reviewCount || 0;
        const discountPercent = hasDiscount ? Math.round((1 - price/originalPrice) * 100) : 0;

        return `
            <div class="product-card">
                <a href="detail.php?id=${escapeHtml(String(productId))}" class="product-link">
                    <div class="product-image">
                        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.title || 'Product')}" 
                             onerror="this.src='../../assets/images/no-image.jpg'">
                        ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${escapeHtml(product.title || 'N/A')}</h3>
                        <p class="product-author">${escapeHtml(product.author || 'N/A')}</p>
                        <div class="product-rating">
                            <span class="stars">${renderStars(rating)}</span>
                            <span class="rating-count">(${reviewCount})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${api.formatPrice(price)}</span>
                            ${hasDiscount ? `<span class="original-price">${api.formatPrice(originalPrice)}</span>` : ''}
                        </div>
                    </div>
                </a>
            </div>
        `;
    }).join('');
}


