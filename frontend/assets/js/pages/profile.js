// Profile Page JavaScript
class ProfileManager {
    constructor() {
        // Ensure API is available
        if (typeof window.api === 'undefined' && typeof api !== 'undefined') {
            window.api = api;
        }
        
        if (!window.api) {
            console.error('API not available! Make sure api.js is loaded before profile.js');
            return;
        }
        
        this.api = window.api;
        this.currentUser = null;
        this.initializeEventListeners();
        this.loadUserProfile();
    }

    initializeEventListeners() {
        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            console.log('✅ Profile form found, attaching submit listener');
            profileForm.addEventListener('submit', (e) => {
                console.log('📝 Profile form submitted');
                this.handleProfileUpdate(e);
            });
        } else {
            console.error('❌ Profile form not found!');
        }

        // Password form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        }

        // Avatar upload
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        // Remove avatar
        const removeAvatar = document.getElementById('removeAvatar');
        if (removeAvatar) {
            removeAvatar.addEventListener('click', () => this.removeAvatar());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetForm());
        }
    }

    async loadUserProfile() {
        try {
            const response = await this.api.getCurrentUser();
            if (response.success) {
                this.currentUser = response.data.user;
                this.populateProfileForm();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('profileError', 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
        }
    }

    populateProfileForm() {
        if (!this.currentUser) return;

        const user = this.currentUser;
        
        // Basic info
        document.getElementById('firstName').value = user.profile?.firstName || '';
        document.getElementById('lastName').value = user.profile?.lastName || '';
        document.getElementById('username').value = user.username || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.profile?.phone || '';
        
        // Address
        document.getElementById('street').value = user.profile?.address?.street || '';
        document.getElementById('city').value = user.profile?.address?.city || '';
        document.getElementById('state').value = user.profile?.address?.state || '';
        document.getElementById('zipCode').value = user.profile?.address?.zipCode || '';
        document.getElementById('country').value = user.profile?.address?.country || 'Vietnam';
        
        // Account info
        document.getElementById('role').value = this.getRoleDisplayName(user.role);
        document.getElementById('joinDate').value = this.formatDate(user.createdAt);
        document.getElementById('lastLogin').value = user.lastLogin ? this.formatDate(user.lastLogin) : 'Chưa có';
        
        // Avatar
        if (user.profile?.avatar) {
            document.getElementById('avatarImage').src = user.profile.avatar;
        }
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'user': 'Người dùng',
            'seller': 'Người bán',
            'admin': 'Quản trị viên'
        };
        return roleNames[role] || role;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const profileData = {
            firstName: formData.get('firstName') || '',
            lastName: formData.get('lastName') || '',
            phone: formData.get('phone') || '',
            address: {
                street: formData.get('street') || '',
                city: formData.get('city') || '',
                state: formData.get('state') || '',
                zipCode: formData.get('zipCode') || '',
                country: formData.get('country') || 'Vietnam'
            }
        };
        
        console.log('📝 Updating profile with data:', profileData);
        
        const saveBtn = document.getElementById('saveBtn');
        const btnText = saveBtn.querySelector('.btn-text');
        const btnLoading = saveBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('profileError');
        const successDiv = document.getElementById('profileSuccess');
        
        try {
            this.setLoading(saveBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            this.hideSuccess(successDiv);
            
            if (!this.api) {
                throw new Error('API không khả dụng. Vui lòng tải lại trang.');
            }
            
            console.log('📡 Calling updateUserProfile API...');
            const response = await this.api.updateUserProfile(profileData);
            console.log('✅ Profile update response:', response);
            
            if (response && response.success) {
                this.showSuccess(successDiv, 'Cập nhật hồ sơ thành công!');
                if (response.data && response.data.user) {
                    this.currentUser = response.data.user;
                    this.populateProfileForm();
                }
            } else {
                const errorMsg = response?.message || response?.error || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            const errorMessage = error.message || error.response?.data?.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.';
            this.showError(errorDiv, errorMessage);
        } finally {
            this.setLoading(saveBtn, btnText, btnLoading, false);
        }
    }

    async handlePasswordChange(e) {
			e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmNewPassword');
        
        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            this.showError('passwordError', 'Mật khẩu xác nhận không khớp.');
            return;
        }
        
        // Validate password strength
        if (newPassword.length < 6) {
            this.showError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const btnText = changePasswordBtn.querySelector('.btn-text');
        const btnLoading = changePasswordBtn.querySelector('.btn-loading');
        const errorDiv = document.getElementById('passwordError');
        const successDiv = document.getElementById('passwordSuccess');
        
        try {
            this.setLoading(changePasswordBtn, btnText, btnLoading, true);
            this.hideError(errorDiv);
            this.hideSuccess(successDiv);
            
            const response = await this.api.changePassword(currentPassword, newPassword);
            
            if (response.success) {
                this.showSuccess(successDiv, 'Đổi mật khẩu thành công!');
                form.reset();
            }
        } catch (error) {
            this.showError(errorDiv, error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            this.setLoading(changePasswordBtn, btnText, btnLoading, false);
        }
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('profileError', 'Vui lòng chọn file ảnh hợp lệ.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('profileError', 'Kích thước file không được vượt quá 5MB.');
            return;
        }
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('avatarImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // TODO: Upload to server
        console.log('Avatar upload:', file);
        this.showSuccess('profileSuccess', 'Ảnh đại diện đã được cập nhật! (Tính năng upload sẽ có sớm)');
    }

    removeAvatar() {
        document.getElementById('avatarImage').src = '../../assets/images/default-avatar.svg';
        document.getElementById('avatarInput').value = '';
        
        // TODO: Remove from server
        console.log('Avatar removed');
        this.showSuccess('profileSuccess', 'Ảnh đại diện đã được xóa! (Tính năng xóa sẽ có sớm)');
    }

    resetForm() {
        if (this.currentUser) {
            this.populateProfileForm();
        }
        
        // Clear password form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.reset();
        }
        
        this.hideError('profileError');
        this.hideError('passwordError');
        this.hideSuccess('profileSuccess');
        this.hideSuccess('passwordSuccess');
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

    showError(elementId, message) {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError(elementId) {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showSuccess(elementId, message) {
        const successDiv = document.getElementById(elementId);
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    hideSuccess(elementId) {
        const successDiv = document.getElementById(elementId);
        if (successDiv) {
            successDiv.style.display = 'none';
        }
    }
}

// Password toggle function
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.textContent = type === 'password' ? '👁️' : '🙈';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for API to be available
    function initProfile() {
        if (typeof api !== 'undefined' && typeof window.api !== 'undefined') {
            window.profileManager = new ProfileManager();
            console.log('✅ Profile Manager initialized');
        } else if (typeof window.api !== 'undefined') {
            window.profileManager = new ProfileManager();
            console.log('✅ Profile Manager initialized');
        } else {
            console.warn('API not loaded, retrying...');
            setTimeout(initProfile, 100);
        }
    }
    
    initProfile();
});

// Add API method for changing password
if (window.api) {
    window.api.changePassword = async function(currentPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    };
}