// Authentication JavaScript
class AuthManager {
    constructor() {
        this.api = window.api;
        console.log('[Auth] AuthManager initialized', { apiReady: !!this.api });
        this.initializeEventListeners();
        this.checkAuthStatus();
    }

    getSafeReturnUrl() {
        try {
            const raw = window.loginReturnUrl || sessionStorage.getItem('bookverse_return_url');
            if (!raw) return null;
            const url = raw.startsWith('http')
                ? new URL(raw)
                : new URL(raw, window.location.origin);
            if (url.origin !== window.location.origin) {
                return null;
            }
            return url.href;
        } catch (error) {
            console.warn('[Auth] Invalid return URL', error);
            return null;
        }
    }

    clearReturnUrl() {
        window.loginReturnUrl = '';
        sessionStorage.removeItem('bookverse_return_url');
    }

    initializeEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('[Auth] Binding login form submit');
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        } else {
            console.warn('[Auth] loginForm not found');
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Verify OTP form
        const verifyOtpForm = document.getElementById('verifyOtpForm');
        if (verifyOtpForm) {
            verifyOtpForm.addEventListener('submit', (e) => this.handleVerifyOTP(e));
        }

        // Reset password form
        const resetForm = document.getElementById('resetForm');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        }

        // Password toggle buttons
        this.initializePasswordToggles();
    }

    initializePasswordToggles() {
        // Login page password toggle
        const togglePwd = document.getElementById('togglePwd');
        const passwordInput = document.getElementById('passwordInput');
        if (togglePwd && passwordInput) {
            togglePwd.addEventListener('click', () => this.togglePassword(passwordInput, togglePwd));
        }

        // Register page password toggles
        const toggleRegisterPwd = document.getElementById('togglePwd');
        const toggleConfirmPwd = document.getElementById('toggleConfirmPwd');
        const registerPasswordInput = document.getElementById('passwordInput');
        const confirmPasswordInput = document.getElementById('confirmPasswordInput');
        
        if (toggleRegisterPwd && registerPasswordInput) {
            toggleRegisterPwd.addEventListener('click', () => this.togglePassword(registerPasswordInput, toggleRegisterPwd));
        }
        
        if (toggleConfirmPwd && confirmPasswordInput) {
            toggleConfirmPwd.addEventListener('click', () => this.togglePassword(confirmPasswordInput, toggleConfirmPwd));
        }

        // Reset page password toggles
        const toggleNewPwd = document.getElementById('toggleNewPwd');
        const toggleConfirmNewPwd = document.getElementById('toggleConfirmNewPwd');
        const newPasswordInput = document.getElementById('newPasswordInput');
        const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
        
        if (toggleNewPwd && newPasswordInput) {
            toggleNewPwd.addEventListener('click', () => this.togglePassword(newPasswordInput, toggleNewPwd));
        }
        
        if (toggleConfirmNewPwd && confirmNewPasswordInput) {
            toggleConfirmNewPwd.addEventListener('click', () => this.togglePassword(confirmNewPasswordInput, toggleConfirmNewPwd));
        }
    }

    togglePassword(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.textContent = type === 'password' ? '👁️' : '🙈';
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('[Auth] handleLogin submit');
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        try {
            this.setLoading(loginBtn, btnText, btnLoading, true);
            const loadingId = (typeof notificationManager !== 'undefined' && notificationManager)
                ? notificationManager.loading('Đang đăng nhập...')
                : null;
            
            // Call real API
            console.log('[Auth] Calling API login');
            const resp = await this.api.login(email, password);
            console.log('[Auth] Login response OK');
            if (loadingId && typeof notificationManager !== 'undefined') notificationManager.close(loadingId);
            
            // Save token for frontend JS
            const token = resp?.data?.token;
            if (!token) {
                throw new Error('Phản hồi không hợp lệ từ máy chủ (không có token)');
            }
            this.api.setToken(token);
            console.log('[Auth] Token set');
            
            // Also set cookie for PHP detection (24h)
            document.cookie = `bookverse_token=${token}; path=/; max-age=${24 * 60 * 60}`;
            
            // Determine user and redirect
            let user = resp?.data?.user;
            try {
                if (!user) {
                    console.log('[Auth] Fetching /auth/me as fallback');
                    const me = await this.api.getCurrentUser();
                    user = me?.data?.user;
                }
            } catch (_) {}
            
            // Determine redirect target
            let redirectUrl;
            let successMessage;
            const baseUrl = window.location.origin + '/Bookverse/frontend';
            const safeReturnUrl = this.getSafeReturnUrl();
            
            if (safeReturnUrl) {
                redirectUrl = safeReturnUrl;
                successMessage = '🎉 Đăng nhập thành công! Đang quay lại trang trước...';
                this.clearReturnUrl();
            } else if (user?.role === 'admin') {
                redirectUrl = baseUrl + '/pages/admin/dashboard.php';
                successMessage = '🎉 Chào mừng Admin! Đang chuyển đến Dashboard quản trị...';
            } else if (user?.role === 'seller') {
                const isApproved = user?.sellerProfile?.isApproved;
                if (isApproved) {
                    redirectUrl = baseUrl + '/pages/seller/dashboard.php';
                    successMessage = '🎉 Chào mừng Seller! Đang chuyển đến Dashboard bán hàng...';
                } else {
                    redirectUrl = baseUrl + '/index.php';
                    successMessage = '⏳ Đăng nhập thành công! Tài khoản seller của bạn đang chờ admin phê duyệt. Bạn có thể mua sắm trong khi chờ.';
                }
            } else {
                redirectUrl = baseUrl + '/index.php';
                successMessage = '🎉 Đăng nhập thành công! Chào mừng bạn quay trở lại!';
            }
            
            // Show success notification and redirect
            if (typeof notificationManager !== 'undefined' && notificationManager) {
                notificationManager.success(successMessage);
            }
            
            // Always use direct redirect with setTimeout
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            // Prefer APIError details if available
            const apiMsg = error?.data?.message || error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
            if (typeof notificationManager !== 'undefined' && notificationManager?.showAuthError) {
                notificationManager.showAuthError(apiMsg);
            } else if (typeof showAuthError === 'function') {
                showAuthError(apiMsg);
            } else if (typeof showError === 'function') {
                showError(apiMsg);
            } else {
                alert(apiMsg);
            }
        } finally {
            this.setLoading(loginBtn, btnText, btnLoading, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate password confirmation
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp.');
            return;
        }
        
        // Validate terms agreement
        const agreeTerms = formData.get('agreeTerms');
        if (!agreeTerms) {
            showError('Vui lòng đồng ý với điều khoản sử dụng.');
            return;
        }
        
        // Get account type
        const accountType = document.querySelector('input[name="accountType"]:checked')?.value || 'user';
        
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: password,
            role: accountType, // Set role based on selection
            profile: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName')
            }
        };
        
        const registerBtn = document.getElementById('registerBtn');
        const btnText = registerBtn.querySelector('.btn-text');
        const btnLoading = registerBtn.querySelector('.btn-loading');
        
        try {
            this.setLoading(registerBtn, btnText, btnLoading, true);
            
            // Show loading notification
            const loadingId = showLoading('Đang tạo tài khoản...');
            
            // Call real API
            const resp = await this.api.register(userData);
            if (!resp?.success) {
                throw new Error(resp?.message || 'Đăng ký thất bại');
            }
            
            // Close loading notification
            notificationManager.close(loadingId);
            
            // Show success notification with redirect
            const accountTypeText = accountType === 'buyer' ? 'Người mua' : 
                                  accountType === 'seller' ? 'Người bán' : 'Người dùng';
            
            // Check if needs approval from API response
            const needsApproval = resp?.data?.needsApproval || false;
            const approvalNote = needsApproval 
                ? '\\n\\n⏳ Lưu ý: Tài khoản seller cần admin phê duyệt trước khi có thể bán hàng.'
                : '';
            
            if (typeof notificationManager !== 'undefined' && notificationManager?.showAuthSuccess) {
                notificationManager.showAuthSuccess(`🎉 Đăng ký thành công!\\n\\nLoại tài khoản: ${accountTypeText}\\nEmail: ${userData.email}${approvalNote}\\n\\nChuyển đến trang đăng nhập...`, 'login.php');
            } else if (typeof showAuthSuccess === 'function') {
                showAuthSuccess(`🎉 Đăng ký thành công!\\n\\nLoại tài khoản: ${accountTypeText}\\nEmail: ${userData.email}${approvalNote}\\n\\nChuyển đến trang đăng nhập...`, 'login.php');
            } else {
                window.location.href = 'login.php';
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            const msg = error?.data?.message || error?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!';
            if (typeof notificationManager !== 'undefined' && notificationManager?.showAuthError) {
                notificationManager.showAuthError(msg);
            } else if (typeof showAuthError === 'function') {
                showAuthError(msg);
            } else {
                alert(msg);
            }
        } finally {
            this.setLoading(registerBtn, btnText, btnLoading, false);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        
        const forgotBtn = document.getElementById('forgotBtn');
        const btnText = forgotBtn.querySelector('.btn-text');
        const btnLoading = forgotBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('forgotError');
        const successDiv = document.getElementById('forgotSuccess');
        
        // Check if API is available
        if (!this.api || typeof this.api.forgotPassword !== 'function') {
            this.showError(errorDiv, 'API chưa sẵn sàng. Vui lòng tải lại trang.');
            console.error('[Auth] API not available:', { api: this.api, hasMethod: !!this.api?.forgotPassword });
            return;
        }
        
        try {
            this.setLoading(forgotBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            this.hideSuccess(successDiv);
            
            const response = await this.api.forgotPassword(email);
            
            if (response.success) {
                let successMessage = 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.';
                
                // Show OTP in development mode
                if (response.data && response.data.otp) {
                    successMessage += `\n\nMã OTP: ${response.data.otp} (Chỉ hiển thị trong development)`;
                }
                
                this.showSuccess(successDiv, successMessage);
                
                // Redirect to verify OTP page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'verify-otp.php?email=' + encodeURIComponent(email);
                }, 3000);
            }
        } catch (error) {
            const errorMessage = error?.data?.message || error?.message || 'Gửi mã OTP thất bại. Vui lòng thử lại.';
            this.showError(errorDiv, errorMessage);
        } finally {
            this.setLoading(forgotBtn, btnText, btnLoading, false);
        }
    }

    async handleVerifyOTP(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const otp = formData.get('otp');
        
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        const btnText = verifyOtpBtn.querySelector('.btn-text');
        const btnLoading = verifyOtpBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('verifyOtpError');
        const successDiv = document.getElementById('verifyOtpSuccess');
        
        // Check if API is available
        if (!this.api || typeof this.api.verifyOTP !== 'function') {
            this.showError(errorDiv, 'API chưa sẵn sàng. Vui lòng tải lại trang.');
            console.error('[Auth] API not available:', { api: this.api, hasMethod: !!this.api?.verifyOTP });
            return;
        }
        
        try {
            this.setLoading(verifyOtpBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            this.hideSuccess(successDiv);
            
            const response = await this.api.verifyOTP(email, otp);
            
            if (response.success) {
                // Store email and OTP for reset password page
                sessionStorage.setItem('reset_email', email);
                sessionStorage.setItem('reset_otp', otp);
                
                this.showSuccess(successDiv, 'Mã OTP hợp lệ! Đang chuyển đến trang đặt lại mật khẩu...');
                
                // Redirect to reset password page
                setTimeout(() => {
                    window.location.href = 'reset.php';
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error?.data?.message || error?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.';
            this.showError(errorDiv, errorMessage);
        } finally {
            this.setLoading(verifyOtpBtn, btnText, btnLoading, false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate password confirmation
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        if (newPassword !== confirmPassword) {
            const errorDiv = document.getElementById('resetError');
            this.showError(errorDiv, 'Mật khẩu xác nhận không khớp.');
            return;
        }
        
        // Get email and OTP from sessionStorage or form
        const email = formData.get('email') || sessionStorage.getItem('reset_email');
        const otp = formData.get('otp') || sessionStorage.getItem('reset_otp');
        
        if (!email || !otp) {
            const errorDiv = document.getElementById('resetError');
            this.showError(errorDiv, 'Thông tin xác thực không đầy đủ. Vui lòng quay lại trang xác thực OTP.');
            setTimeout(() => {
                window.location.href = 'verify-otp.php';
            }, 2000);
            return;
        }
        
        const resetData = {
            email: email,
            otp: otp,
            newPassword: newPassword
        };
        
        const resetBtn = document.getElementById('resetBtn');
        const btnText = resetBtn.querySelector('.btn-text');
        const btnLoading = resetBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('resetError');
        const successDiv = document.getElementById('resetSuccess');
        
        // Check if API is available
        if (!this.api || typeof this.api.resetPasswordWithOtp !== 'function') {
            this.showError(errorDiv, 'API chưa sẵn sàng. Vui lòng tải lại trang.');
            console.error('[Auth] API not available:', { api: this.api, hasMethod: !!this.api?.resetPasswordWithOtp });
            return;
        }
        
        try {
            this.setLoading(resetBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            this.hideSuccess(successDiv);
            
            const response = await this.api.resetPasswordWithOtp(resetData.email, resetData.otp, resetData.newPassword);
            
            if (response.success) {
                // Clear session storage
                sessionStorage.removeItem('reset_email');
                sessionStorage.removeItem('reset_otp');
                
                this.showSuccess(successDiv, 'Đặt lại mật khẩu thành công! Đang chuyển hướng...');
                
                setTimeout(() => {
                    window.location.href = 'login.php';
                }, 2000);
            }
        } catch (error) {
            this.showError(errorDiv, error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            this.setLoading(resetBtn, btnText, btnLoading, false);
        }
    }

    setLoading(button, textElement, loadingElement, isLoading) {
        if (isLoading) {
            button.disabled = true;
            textElement.style.display = 'none';
            loadingElement.style.display = 'inline';
        } else {
            button.disabled = false;
            textElement.style.display = 'inline';
            loadingElement.style.display = 'none';
        }
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError(errorDiv) {
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showSuccess(successDiv, message) {
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        } else {
            // Create temporary success message
            this.createToast(message, 'success');
        }
    }

    hideSuccess(successDiv) {
        if (successDiv) {
            successDiv.style.display = 'none';
        }
    }

    createToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    checkAuthStatus() {
        const token = this.api.token;
        if (token) {
            // User is already logged in, redirect to appropriate page
            this.api.getCurrentUser()
                .then(response => {
                    const user = response.data.user;
                    const safeReturnUrl = this.getSafeReturnUrl();
                    if (safeReturnUrl) {
                        this.clearReturnUrl();
                        window.location.href = safeReturnUrl;
                        return;
                    }
                    if (user.role === 'admin') {
                        window.location.href = '../../pages/admin/dashboard.php';
                    } else if (user.role === 'seller') {
                        window.location.href = '../../pages/seller/dashboard.php';
                    } else {
                        window.location.href = '../../index.php';
                    }
                })
                .catch(() => {
                    // Token is invalid, clear it
                    this.api.clearToken();
                });
        }
    }
}

// Social login handlers
async function handleSocialLogin(provider) {
    if (provider === 'google') {
        await handleGoogleLogin();
    } else if (provider === 'facebook') {
        // Facebook login - coming soon
        const authManager = new AuthManager();
        authManager.createToast('Đăng nhập bằng Facebook sẽ có sớm!', 'info');
    } else {
        const authManager = new AuthManager();
        authManager.createToast(`Đăng nhập bằng ${provider} sẽ có sớm!`, 'info');
    }
}

// Google OAuth login handler
let googleInitialized = false;

async function handleGoogleLogin() {
    try {
        // Wait for Google Sign-In library to load
        let retries = 0;
        while ((typeof google === 'undefined' || !google.accounts) && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            retries++;
        }

        if (typeof google === 'undefined' || !google.accounts) {
            throw new Error('Google Sign-In library chưa được tải. Vui lòng tải lại trang.');
        }

        // Get Google Client ID from meta tag or config
        const googleClientId = document.querySelector('meta[name="google-client-id"]')?.content ||
                              window.appConfig?.get?.('GOOGLE_CLIENT_ID') ||
                              null;

        if (!googleClientId) {
            throw new Error('Google Client ID chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
        }

        // Initialize Google Sign-In
        if (!googleInitialized) {
            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCallback
            });
            googleInitialized = true;
        }

        // Create a hidden container and render Google button
        // Then immediately trigger click to open popup
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = 'position: fixed; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;';
        document.body.appendChild(tempDiv);
        
        // Render Google button in hidden div
        google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            locale: 'vi',
            width: '300px'
        });
        
        // Wait for button to render, then trigger click immediately
        setTimeout(() => {
            const googleButton = tempDiv.querySelector('div[role="button"]');
            if (googleButton) {
                // Trigger click to open Google Sign-In popup
                googleButton.click();
            }
            // Clean up hidden container
            setTimeout(() => {
                if (tempDiv.parentNode) {
                    document.body.removeChild(tempDiv);
                }
            }, 500);
        }, 50);

    } catch (error) {
        console.error('Google login initialization error:', error);
        const errorMsg = error?.message || 'Không thể khởi tạo Google Sign-In. Vui lòng tải lại trang.';
        
        if (typeof notificationManager !== 'undefined' && notificationManager?.showAuthError) {
            notificationManager.showAuthError(errorMsg);
        } else {
            alert(errorMsg);
        }
    }
}

// Google callback handler
async function handleGoogleCallback(response) {
    try {
        // Show loading notification
        const loadingId = (typeof notificationManager !== 'undefined' && notificationManager)
            ? notificationManager.loading('Đang xác thực với Google...')
            : null;

        // Get ID token from response
        const idToken = response.credential || response.id_token;
        
        if (!idToken) {
            throw new Error('Không nhận được token từ Google');
        }

        // Send ID token to backend
        const resp = await window.api.loginWithGoogle(idToken);
        
        if (loadingId && typeof notificationManager !== 'undefined') {
            notificationManager.close(loadingId);
        }

        if (!resp?.success) {
            throw new Error(resp?.message || 'Đăng nhập Google thất bại');
        }

        // Save token
        const token = resp?.data?.token;
        if (!token) {
            throw new Error('Phản hồi không hợp lệ từ máy chủ (không có token)');
        }
        window.api.setToken(token);

        // Get user info
        let user = resp?.data?.user;
        if (!user) {
            try {
                const me = await window.api.getCurrentUser();
                user = me?.data?.user;
            } catch (_) {}
        }

        // Determine redirect URL
        const baseUrl = window.location.origin + '/Bookverse/frontend';
        let redirectUrl;
        let successMessage;

        if (user?.role === 'admin') {
            redirectUrl = baseUrl + '/pages/admin/dashboard.php';
            successMessage = '🎉 Chào mừng Admin! Đang chuyển đến Dashboard quản trị...';
        } else if (user?.role === 'seller') {
            const isApproved = user?.sellerProfile?.isApproved;
            if (isApproved) {
                redirectUrl = baseUrl + '/pages/seller/dashboard.php';
                successMessage = '🎉 Chào mừng Seller! Đang chuyển đến Dashboard bán hàng...';
            } else {
                redirectUrl = baseUrl + '/index.php';
                successMessage = '⏳ Đăng nhập thành công! Tài khoản seller của bạn đang chờ admin phê duyệt.';
            }
        } else {
            redirectUrl = baseUrl + '/index.php';
            successMessage = '🎉 Đăng nhập thành công! Chào mừng bạn đến với Bookverse!';
        }

        // Show success and redirect
        if (typeof notificationManager !== 'undefined' && notificationManager) {
            notificationManager.success(successMessage);
        }

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);

    } catch (error) {
        console.error('Google login callback error:', error);
        const errorMsg = error?.data?.message || error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!';
        
        if (typeof notificationManager !== 'undefined' && notificationManager?.showAuthError) {
            notificationManager.showAuthError(errorMsg);
        } else {
            alert(errorMsg);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error-message {
        background: #fef2f2;
        color: #dc2626;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid #fecaca;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
    
    .success-message {
        background: #f0fdf4;
        color: #16a34a;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid #bbf7d0;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    
    .form-checkbox input[type="checkbox"] {
        margin: 0;
        width: auto;
    }
    
    .form-checkbox label {
        font-size: 0.875rem;
        line-height: 1.4;
        color: #6b7280;
    }
    
    .form-checkbox a {
        color: #667eea;
        text-decoration: none;
    }
    
    .form-checkbox a:hover {
        text-decoration: underline;
    }
    
    @media (max-width: 480px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);// JWT Token creation (simplified for demo)
function createJWTToken(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature'); // In production, use proper HMAC
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Check token expiry
function isTokenExpired(token) {
    try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
        return true;
    }
}

// Auto-logout when token expires
function checkTokenExpiry() {
    const token = sessionStorage.getItem('bookverse_token');
    if (token && isTokenExpired(token)) {
        sessionStorage.removeItem('bookverse_token');
        document.cookie = 'bookverse_token=; path=/; max-age=0';
        showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
            window.location.href = 'pages/auth/login.php';
        }, 2000);
    }
}

// Check token every 5 minutes
setInterval(checkTokenExpiry, 5 * 60 * 1000);

