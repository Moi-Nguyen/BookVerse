// Account functionality for Bookverse

class AccountManager {
    constructor() {
        this.user = null;
        this.initializeEventListeners();
        this.loadUserProfile();
        this.loadUserStats();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Profile form
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Edit profile button
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.toggleEditMode();
        });

        // Cancel edit
        document.getElementById('cancelEdit')?.addEventListener('click', () => {
            this.cancelEdit();
        });

        // Change password
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.openChangePasswordModal();
        });

        // Password modal
        document.getElementById('closePasswordModal')?.addEventListener('click', () => {
            this.closeChangePasswordModal();
        });

        document.getElementById('cancelPassword')?.addEventListener('click', () => {
            this.closeChangePasswordModal();
        });

        // Password form
        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Preferences form
        document.getElementById('preferencesForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePreferences();
        });

        // Avatar edit
        document.getElementById('editAvatarBtn')?.addEventListener('click', () => {
            this.editAvatar();
        });

        // Security buttons
        document.getElementById('setup2FABtn')?.addEventListener('click', () => {
            this.setup2FA();
        });

        document.getElementById('manageSessionsBtn')?.addEventListener('click', () => {
            this.manageSessions();
        });

        // Close modal on outside click
        document.getElementById('changePasswordModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'changePasswordModal') {
                this.closeChangePasswordModal();
            }
        });
    }

    // Load user profile
    async loadUserProfile() {
        try {
            const response = await api.getUserProfile();
            if (response.success) {
                this.user = response.data.user;
                this.populateProfileForm();
                this.updateUserInfo();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showToast('Không thể tải thông tin người dùng', 'error');
        }
    }

    // Populate profile form
    populateProfileForm() {
        if (!this.user) return;

        const fields = [
            'firstName', 'lastName', 'email', 'phone', 'birthDate', 
            'gender', 'bio'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && this.user[field]) {
                element.value = this.user[field];
            }
        });

        // Disable form initially
        this.setFormEnabled(false);
    }

    // Update user info display
    updateUserInfo() {
        if (!this.user) return;

        // Update avatar
        const avatar = document.getElementById('userAvatar');
        if (avatar && this.user.avatar) {
            avatar.src = this.user.avatar;
        }

        // Update name and email
        const nameElement = document.getElementById('userName');
        const emailElement = document.getElementById('userEmail');
        
        if (nameElement) {
            nameElement.textContent = `${this.user.firstName} ${this.user.lastName}`;
        }
        
        if (emailElement) {
            emailElement.textContent = this.user.email;
        }
    }

    // Toggle edit mode
    toggleEditMode() {
        const editBtn = document.getElementById('editProfileBtn');
        const form = document.getElementById('profileForm');
        
        if (editBtn.textContent.includes('Chỉnh sửa')) {
            this.setFormEnabled(true);
            editBtn.innerHTML = '<span class="btn-icon">❌</span><span>Hủy</span>';
            editBtn.onclick = () => this.cancelEdit();
        }
    }

    // Cancel edit
    cancelEdit() {
        this.setFormEnabled(false);
        this.populateProfileForm(); // Reset form
        this.resetEditButton();
    }

    // Reset edit button
    resetEditButton() {
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.innerHTML = '<span class="btn-icon">✏️</span><span>Chỉnh sửa</span>';
            editBtn.onclick = () => this.toggleEditMode();
        }
    }

    // Set form enabled/disabled
    setFormEnabled(enabled) {
        const form = document.getElementById('profileForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = !enabled;
        });

        const actions = form.querySelector('.form-actions');
        if (actions) {
            actions.style.display = enabled ? 'flex' : 'none';
        }
    }

    // Update profile
    async updateProfile() {
        const form = document.getElementById('profileForm');
        if (!form) return;

        const formData = new FormData(form);
        const profileData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birthDate: formData.get('birthDate'),
            gender: formData.get('gender'),
            bio: formData.get('bio')
        };

        try {
            const response = await api.updateUserProfile(profileData);
            if (response.success) {
                this.user = { ...this.user, ...profileData };
                this.updateUserInfo();
                this.setFormEnabled(false);
                this.resetEditButton();
                this.showToast('Cập nhật thông tin thành công', 'success');
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showToast(error.message || 'Không thể cập nhật thông tin', 'error');
        }
    }

    // Open change password modal
    openChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Close change password modal
    closeChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.remove('show');
            document.getElementById('changePasswordForm').reset();
        }
    }

    // Change password
    async changePassword() {
        const form = document.getElementById('changePasswordForm');
        if (!form) return;

        const formData = new FormData(form);
        const passwordData = {
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            this.showToast('Mật khẩu mới không khớp', 'error');
            return;
        }

        // Validate password length
        if (passwordData.newPassword.length < 6) {
            this.showToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
            return;
        }

        try {
            const response = await api.changePassword(passwordData);
            if (response.success) {
                this.closeChangePasswordModal();
                this.showToast('Thay đổi mật khẩu thành công', 'success');
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showToast(error.message || 'Không thể thay đổi mật khẩu', 'error');
        }
    }

    // Update preferences
    async updatePreferences() {
        const form = document.getElementById('preferencesForm');
        if (!form) return;

        const formData = new FormData(form);
        const preferences = {
            emailNotifications: formData.get('emailNotifications') === 'on',
            smsNotifications: formData.get('smsNotifications') === 'on',
            marketingEmails: formData.get('marketingEmails') === 'on',
            theme: formData.get('theme'),
            language: formData.get('language')
        };

        try {
            const response = await api.updateUserPreferences(preferences);
            if (response.success) {
                this.showToast('Cập nhật tùy chọn thành công', 'success');
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            this.showToast(error.message || 'Không thể cập nhật tùy chọn', 'error');
        }
    }

    // Edit avatar
    editAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadAvatar(file);
            }
        };
        input.click();
    }

    // Upload avatar
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.uploadAvatar(formData);
            if (response.success) {
                this.user.avatar = response.data.avatarUrl;
                this.updateUserInfo();
                this.showToast('Cập nhật ảnh đại diện thành công', 'success');
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            this.showToast(error.message || 'Không thể cập nhật ảnh đại diện', 'error');
        }
    }

    // Setup 2FA
    setup2FA() {
        this.showToast('Tính năng xác thực 2 bước sẽ được triển khai sớm', 'info');
    }

    // Manage sessions
    manageSessions() {
        this.showToast('Quản lý phiên đăng nhập sẽ được triển khai sớm', 'info');
    }

    // Load user stats
    async loadUserStats() {
        try {
            const response = await api.getUserStats();
            if (response.success) {
                const stats = response.data;
                
                document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
                document.getElementById('totalWishlist').textContent = stats.totalWishlist || 0;
                document.getElementById('totalReviews').textContent = stats.totalReviews || 0;
                
                // Calculate member since
                if (this.user && this.user.createdAt) {
                    const memberSince = this.calculateMemberSince(this.user.createdAt);
                    document.getElementById('memberSince').textContent = memberSince;
                }
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    // Calculate member since
    calculateMemberSince(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return diffMonths;
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

// Initialize account manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.accountManager = new AccountManager();
});

// Export for global access
window.AccountManager = AccountManager;
