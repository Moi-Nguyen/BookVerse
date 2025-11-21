// Checkout functionality for Bookverse

class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.cart = this.loadCart();
        this.formData = {};
        this.initializeEventListeners();
        this.renderOrderSummary();
        this.validateStep1();
    }

    // Load cart from session storage
    loadCart() {
        const cartData = sessionStorage.getItem('checkout_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Step navigation
        document.getElementById('nextToPaymentBtn')?.addEventListener('click', () => {
            if (this.validateStep1()) {
                this.goToStep(2);
            }
        });

        document.getElementById('backToInfoBtn')?.addEventListener('click', () => {
            this.goToStep(1);
        });

        document.getElementById('reviewOrderBtn')?.addEventListener('click', () => {
            if (this.validateStep2()) {
                this.goToStep(3);
                this.populateReviewData();
            }
        });

        document.getElementById('backToPaymentBtn')?.addEventListener('click', () => {
            this.goToStep(2);
        });

        // Back to cart
        document.getElementById('backToCartBtn')?.addEventListener('click', () => {
            window.location.href = '../cart/cart.php';
        });

        // Form submission
        document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });

        // City/District selection
        document.getElementById('city')?.addEventListener('change', (e) => {
            this.updateDistricts(e.target.value);
        });

        // Shipping method change
        document.querySelectorAll('input[name="shippingMethod"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateOrderSummary();
            });
        });

        // Payment method change
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateOrderSummary();
            });
        });

        // Form validation
        this.setupFormValidation();
    }

    // Go to specific step
    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show target step
        document.getElementById(`step${step}`).classList.add('active');

        // Update step indicators
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });

        this.currentStep = step;
    }

    // Validate step 1 (customer information)
    validateStep1() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'district', 'address'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !field.value.trim()) {
                this.showFieldError(field, 'Trường này là bắt buộc');
                isValid = false;
            } else if (field) {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const email = document.getElementById('email');
        if (email && email.value && !this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Email không hợp lệ');
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('phone');
        if (phone && phone.value && !this.isValidPhone(phone.value)) {
            this.showFieldError(phone, 'Số điện thoại không hợp lệ');
            isValid = false;
        }

        if (isValid) {
            this.collectFormData();
        }

        return isValid;
    }

    // Validate step 2 (payment)
    validateStep2() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!paymentMethod) {
            this.showToast('Vui lòng chọn phương thức thanh toán', 'warning');
            return false;
        }
        return true;
    }

    // Setup form validation
    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Trường này là bắt buộc');
            return false;
        }

        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Email không hợp lệ');
            return false;
        }

        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Số điện thoại không hợp lệ');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    // Show field error
    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = 'var(--error-color)';
        
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.color = 'var(--error-color)';
        errorEl.style.fontSize = 'var(--font-size-xs)';
        errorEl.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorEl);
    }

    // Clear field error
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Update districts based on city
    updateDistricts(city) {
        const districtSelect = document.getElementById('district');
        if (!districtSelect) return;

        const districts = {
            'hanoi': [
                'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy',
                'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân'
            ],
            'hcm': [
                'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
                'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10'
            ],
            'danang': [
                'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn',
                'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'
            ],
            'cantho': [
                'Ninh Kiều', 'Ô Môn', 'Bình Thủy', 'Cái Răng',
                'Thốt Nốt', 'Vĩnh Thạnh', 'Cờ Đỏ'
            ]
        };

        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        
        if (districts[city]) {
            districts[city].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s/g, '');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    }

    // Collect form data
    collectFormData() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        
        this.formData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                city: formData.get('city'),
                district: formData.get('district'),
                address: formData.get('address')
            },
            shippingMethod: formData.get('shippingMethod'),
            paymentMethod: formData.get('paymentMethod'),
            orderNotes: formData.get('orderNotes')
        };
    }

    // Render order summary
    renderOrderSummary() {
        if (this.cart.length === 0) {
            window.location.href = '../cart/cart.php';
            return;
        }

        const orderItemsContainer = document.getElementById('orderItems');
        const template = document.getElementById('orderItemTemplate');
        
        const itemsHTML = this.cart.map(item => {
            const itemEl = template.content.cloneNode(true);
            const itemDiv = itemEl.querySelector('.order-item');
            
            itemDiv.querySelector('.product-image').src = item.image;
            itemDiv.querySelector('.product-image').alt = item.title;
            itemDiv.querySelector('.item-title').textContent = item.title;
            itemDiv.querySelector('.item-author').textContent = item.author;
            itemDiv.querySelector('.quantity').textContent = item.quantity;
            itemDiv.querySelector('.item-price').textContent = this.formatPrice(item.price * item.quantity);
            
            return itemDiv.outerHTML;
        }).join('');

        orderItemsContainer.innerHTML = itemsHTML;
        this.updateOrderSummary();
    }

    // Update order summary
    updateOrderSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
        const shippingCost = shippingMethod ? this.getShippingCost(shippingMethod.value) : 0;
        const grandTotal = subtotal + shippingCost;

        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('shippingCost').textContent = this.formatPrice(shippingCost);
        document.getElementById('grandTotal').textContent = this.formatPrice(grandTotal);
    }

    // Get shipping cost
    getShippingCost(method) {
        const costs = {
            'standard': 30000,
            'express': 50000
        };
        return costs[method] || 0;
    }

    // Populate review data
    populateReviewData() {
        this.collectFormData();
        
        // Shipping info
        const shippingInfo = document.getElementById('shippingInfo');
        if (shippingInfo) {
            shippingInfo.innerHTML = `
                <p><strong>${this.formData.customer.firstName} ${this.formData.customer.lastName}</strong></p>
                <p>${this.formData.customer.email}</p>
                <p>${this.formData.customer.phone}</p>
                <p>${this.formData.address}, ${this.formData.shipping.district}, ${this.formData.shipping.city}</p>
            `;
        }

        // Payment info
        const paymentInfo = document.getElementById('paymentInfo');
        if (paymentInfo) {
            const paymentMethods = {
                'cod': 'Thanh toán khi nhận hàng (COD)',
                'bank': 'Chuyển khoản ngân hàng',
                'momo': 'Ví MoMo',
                'zalopay': 'ZaloPay'
            };
            
            paymentInfo.innerHTML = `
                <p><strong>${paymentMethods[this.formData.paymentMethod]}</strong></p>
                ${this.formData.orderNotes ? `<p>Ghi chú: ${this.formData.orderNotes}</p>` : ''}
            `;
        }
    }

    // Submit order
    async submitOrder() {
        const submitBtn = document.getElementById('placeOrderBtn');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Đang xử lý...</span>';

            // Collect final form data
            this.collectFormData();

            // Create order data in backend API format
            const orderData = {
                items: this.cart.map(item => ({
                    product: item.id || item._id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: `${this.formData.customer.firstName} ${this.formData.customer.lastName}`,
                    phone: this.formData.customer.phone,
                    email: this.formData.customer.email,
                    street: this.formData.shipping.address,
                    city: this.formData.shipping.city,
                    state: this.formData.shipping.district,
                    zipCode: '00000',
                    country: 'Vietnam'
                },
                payment: {
                    method: this.formData.paymentMethod || 'cod'
                },
                notes: {
                    customer: this.formData.orderNotes || ''
                }
            };

            // Submit to API
            const response = await window.api.createOrder(orderData);
            
            if (response.success) {
                // Clear cart
                localStorage.removeItem('bookverse_cart');
                sessionStorage.removeItem('checkout_cart');
                
                // Redirect to success page
                const orderId = response.data.order._id || response.data.order.id;
                window.location.href = `success.php?orderId=${orderId}`;
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi đặt hàng');
            }

        } catch (error) {
            console.error('Order submission error:', error);
            this.showToast(error.message || 'Có lỗi xảy ra khi đặt hàng', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shippingCost = this.getShippingCost(this.formData.shippingMethod);
        const grandTotal = subtotal + shippingCost;

        return {
            subtotal,
            shippingCost,
            grandTotal
        };
    }

    // Format price
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Show toast notification
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

    // Get toast icon
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

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});

// Export for global access
window.CheckoutManager = CheckoutManager;
