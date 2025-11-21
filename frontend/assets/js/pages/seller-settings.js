// Seller Settings Page JavaScript

(function() {
    'use strict';
    
    function initSettingsPage() {
        if (typeof api === 'undefined') {
            setTimeout(initSettingsPage, 100);
            return;
        }
        
        window.settingsManager = new SettingsManager();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSettingsPage);
    } else {
        initSettingsPage();
    }
    
    class SettingsManager {
        constructor() {
            this.userData = null;
            this.init();
        }
        
        async init() {
            await this.loadUserData();
            this.bindEvents();
            this.setupNavigation();
        }
        
        async loadUserData() {
            try {
                const response = await api.request('/users/profile');
                if (response && response.success) {
                    this.userData = response.data.user;
                    this.populateForms();
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                if (typeof showToast === 'function') {
                    showToast('Không thể tải thông tin người dùng', 'error');
                }
            }
        }
        
        populateForms() {
            if (!this.userData) return;
            
            // Profile form
            const profile = this.userData.profile || {};
            const sellerProfile = this.userData.sellerProfile || {};
            
            // Populate profile fields
            if (document.getElementById('firstName')) {
                document.getElementById('firstName').value = profile.firstName || '';
            }
            if (document.getElementById('lastName')) {
                document.getElementById('lastName').value = profile.lastName || '';
            }
            if (document.getElementById('email')) {
                document.getElementById('email').value = this.userData.email || '';
            }
            if (document.getElementById('phone')) {
                document.getElementById('phone').value = profile.phone || '';
            }
            if (document.getElementById('address')) {
                const address = profile.address || {};
                if (typeof address === 'string') {
                    document.getElementById('address').value = address;
                } else {
                    document.getElementById('address').value = [
                        address.street,
                        address.city,
                        address.province,
                        address.country
                    ].filter(Boolean).join(', ');
                }
            }
            if (document.getElementById('avatarPreview') && profile.avatar) {
                document.getElementById('avatarPreview').src = profile.avatar;
            }
            
            // Populate business fields
            if (document.getElementById('businessName')) {
                document.getElementById('businessName').value = sellerProfile.businessName || '';
            }
            if (document.getElementById('businessDescription')) {
                document.getElementById('businessDescription').value = sellerProfile.description || '';
            }
            if (document.getElementById('businessType')) {
                document.getElementById('businessType').value = sellerProfile.businessType || 'individual';
            }
            if (document.getElementById('businessLicense')) {
                document.getElementById('businessLicense').value = sellerProfile.businessLicense || '';
            }
        }
        
        bindEvents() {
            // Profile form
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
            }
            
            // Business form
            const businessForm = document.getElementById('businessForm');
            if (businessForm) {
                businessForm.addEventListener('submit', (e) => this.handleBusinessSubmit(e));
            }
            
            // Security form
            const securityForm = document.getElementById('securityForm');
            if (securityForm) {
                securityForm.addEventListener('submit', (e) => this.handleSecuritySubmit(e));
            }
            
            // Avatar upload
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput) {
                avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
            }
            
            // Password strength checker
            const newPassword = document.getElementById('newPassword');
            if (newPassword) {
                newPassword.addEventListener('input', () => this.checkPasswordStrength());
            }
        }
        
        setupNavigation() {
            const menuLinks = document.querySelectorAll('.menu-link');
            const sections = document.querySelectorAll('.settings-section');
            
            // Set initial active section
            const initialHash = window.location.hash;
            let activeLinkFound = false;
            
            if (initialHash) {
                menuLinks.forEach(link => {
                    if (link.getAttribute('href') === initialHash) {
                        link.classList.add('active');
                        const sectionId = link.dataset.section;
                        const section = document.getElementById(sectionId);
                        if (section) {
                            section.classList.add('active');
                            activeLinkFound = true;
                        }
                    }
                });
            }
            
            if (!activeLinkFound && menuLinks.length > 0) {
                menuLinks[0].classList.add('active');
                const sectionId = menuLinks[0].dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                }
            }
            
            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all links and sections
                    menuLinks.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Show corresponding section
                    const sectionId = link.dataset.section;
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.classList.add('active');
                    }
                    
                    // Update URL hash
                    window.history.pushState(null, '', link.getAttribute('href'));
                });
            });
        }
        
        async handleProfileSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim()
            };
            
            try {
                // Show loading
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                
                const response = await api.request('/users/profile', {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                
                if (response && response.success) {
                    this.userData = response.data.user;
                    this.showSuccess('Cập nhật thông tin cá nhân thành công!');
                } else {
                    throw new Error(response?.message || 'Không thể cập nhật thông tin');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                this.showError(error.message || 'Không thể cập nhật thông tin cá nhân');
            } finally {
                // Hide loading
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        async handleBusinessSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            const formData = {
                businessName: document.getElementById('businessName').value.trim(),
                businessType: document.getElementById('businessType').value,
                businessLicense: document.getElementById('businessLicense').value.trim(),
                taxId: document.getElementById('taxId')?.value.trim() || '',
                description: document.getElementById('businessDescription').value.trim()
            };
            
            try {
                // Show loading
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                
                const response = await api.request('/users/seller/profile', {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                
                if (response && response.success) {
                    this.showSuccess('Cập nhật thông tin kinh doanh thành công!');
                } else {
                    throw new Error(response?.message || 'Không thể cập nhật thông tin');
                }
            } catch (error) {
                console.error('Error updating business profile:', error);
                this.showError(error.message || 'Không thể cập nhật thông tin kinh doanh');
            } finally {
                // Hide loading
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        async handleSecuritySubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (newPassword !== confirmPassword) {
                this.showError('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }
            
            if (newPassword.length < 6) {
                this.showError('Mật khẩu mới phải có ít nhất 6 ký tự');
                return;
            }
            
            try {
                // Show loading
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                
                const response = await api.request('/users/password', {
                    method: 'PUT',
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });
                
                if (response && response.success) {
                    this.showSuccess('Đổi mật khẩu thành công!');
                    form.reset();
                } else {
                    throw new Error(response?.message || 'Không thể đổi mật khẩu');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                this.showError(error.message || 'Không thể đổi mật khẩu');
            } finally {
                // Hide loading
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        async handleAvatarUpload(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showError('Vui lòng chọn file ảnh');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showError('Kích thước file không được vượt quá 5MB');
                return;
            }
            
            // Preview image
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarPreview = document.getElementById('avatarPreview');
                if (avatarPreview) {
                    avatarPreview.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
            
            // Upload to server (if API supports file upload)
            // For now, just show preview
            this.showInfo('Tính năng upload ảnh sẽ được triển khai sớm');
        }
        
        checkPasswordStrength() {
            const password = document.getElementById('newPassword')?.value || '';
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            if (!strengthFill || !strengthText) return;
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            strengthFill.className = 'strength-fill';
            if (strength >= 4) {
                strengthFill.classList.add('strong');
                strengthFill.style.width = '100%';
                strengthText.textContent = 'Mật khẩu mạnh';
            } else if (strength >= 3) {
                strengthFill.classList.add('medium');
                strengthFill.style.width = '66%';
                strengthText.textContent = 'Mật khẩu trung bình';
            } else if (strength >= 2) {
                strengthFill.style.width = '33%';
                strengthText.textContent = 'Mật khẩu yếu';
            } else {
                strengthFill.style.width = '0%';
                strengthText.textContent = 'Mật khẩu yếu';
            }
        }
        
        showSuccess(message) {
            if (typeof showToast === 'function') {
                showToast(message, 'success');
            } else {
                alert(message);
            }
        }
        
        showError(message) {
            if (typeof showToast === 'function') {
                showToast(message, 'error');
            } else {
                alert(message);
            }
        }
        
        showInfo(message) {
            if (typeof showToast === 'function') {
                showToast(message, 'info');
            } else {
                alert(message);
            }
        }
    }
})();

