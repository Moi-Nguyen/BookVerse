// Admin Authentication functionality for Bookverse

class AdminAuth {
    constructor() {
        this.api = window.api;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Admin login form
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                this.handleAdminLogin(e);
            });
        }

        // Password toggle
        const toggleAdminPwd = document.getElementById('toggleAdminPwd');
        const adminPasswordInput = document.getElementById('adminPasswordInput');
        
        if (toggleAdminPwd && adminPasswordInput) {
            toggleAdminPwd.addEventListener('click', () => {
                const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                adminPasswordInput.setAttribute('type', type);
                toggleAdminPwd.textContent = type === 'password' ? '👁️' : '🙈';
            });
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        const loginBtn = document.getElementById('adminLoginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('adminLoginError');
        
        try {
            this.setLoading(loginBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            
            const response = await this.api.login(email, password);
            
            if (response.success) {
                const user = response.data.user;
                
                // Check if user is admin
                if (user.role !== 'admin') {
                    throw new Error('Bạn không có quyền truy cập vào trang admin.');
                }
                
                this.api.setToken(response.data.token);
                this.showSuccess('Đăng nhập admin thành công! Đang chuyển hướng...');
                
                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.php';
                }, 1500);
            } else {
                throw new Error(response.message || 'Đăng nhập thất bại.');
            }
        } catch (error) {
            this.showError(errorDiv, error.message || 'Đăng nhập admin thất bại. Vui lòng thử lại.');
        } finally {
            this.setLoading(loginBtn, btnText, btnLoading, false);
        }
    }

    setLoading(button, btnText, btnLoading, isLoading) {
        if (isLoading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
        } else {
            button.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    }

    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.className = 'error-message';
        }
    }

    hideError(element) {
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
        }
    }

    showSuccess(message) {
        // Create success toast
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✅</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

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
}

// Initialize admin auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});

// Export for global access
window.AdminAuth = AdminAuth;
