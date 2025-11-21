// Settings management
let currentSettings = {};

// Initialize settings
document.addEventListener('DOMContentLoaded', function() {
    // Wait for adminAPI to be available
    let retryCount = 0;
    const maxRetries = 20;
    
    function checkAdminAPI() {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        
        if (api && typeof api.getSettings === 'function') {
            loadSettings();
            setupEventListeners();
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkAdminAPI, 200);
        } else {
            console.error('adminAPI not available after', maxRetries, 'retries');
            showSettingsError();
        }
    }
    
    setTimeout(checkAdminAPI, 100);
});

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchSettingsTab(tabName);
        });
    });
}

// Switch settings tab
function switchSettingsTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content tabs
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Load settings
async function loadSettings() {
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            showSettingsError();
            return;
        }
        
        const response = await api.getSettings();
        if (response && response.success && response.data) {
            currentSettings = response.data.settings || {};
            populateSettingsForm(currentSettings);
        } else {
            showSettingsError();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showSettingsError();
    }
}

function showSettingsError() {
    alert('Không thể tải cài đặt. Vui lòng tải lại trang.');
}

// Populate settings form
function populateSettingsForm(settings) {
    // General Settings
    const siteNameEl = document.getElementById('siteName');
    const siteDescriptionEl = document.getElementById('siteDescription');
    const metaTitleEl = document.getElementById('metaTitle');
    const metaDescriptionEl = document.getElementById('metaDescription');
    const metaKeywordsEl = document.getElementById('metaKeywords');
    
    if (siteNameEl) siteNameEl.value = settings.siteName || 'Bookverse';
    if (siteDescriptionEl) siteDescriptionEl.value = settings.siteDescription || '';
    if (metaTitleEl) metaTitleEl.value = settings.metaTitle || '';
    if (metaDescriptionEl) metaDescriptionEl.value = settings.metaDescription || '';
    if (metaKeywordsEl) metaKeywordsEl.value = Array.isArray(settings.metaKeywords) 
        ? settings.metaKeywords.join(', ') 
        : (settings.metaKeywords || '');
    
    // Security Settings
    const tokenExpiryEl = document.getElementById('tokenExpiry');
    const maxLoginAttemptsEl = document.getElementById('maxLoginAttempts');
    const lockoutDurationEl = document.getElementById('lockoutDuration');
    const minPasswordLengthEl = document.getElementById('minPasswordLength');
    const requireUppercaseEl = document.getElementById('requireUppercase');
    const requireNumbersEl = document.getElementById('requireNumbers');
    const requireSpecialCharsEl = document.getElementById('requireSpecialChars');
    
    if (tokenExpiryEl) tokenExpiryEl.value = settings.tokenExpiry || 15;
    if (maxLoginAttemptsEl) maxLoginAttemptsEl.value = settings.maxLoginAttempts || 5;
    if (lockoutDurationEl) lockoutDurationEl.value = settings.lockoutDuration || 30;
    if (minPasswordLengthEl) minPasswordLengthEl.value = settings.minPasswordLength || 8;
    if (requireUppercaseEl) requireUppercaseEl.checked = settings.requireUppercase !== false;
    if (requireNumbersEl) requireNumbersEl.checked = settings.requireNumbers !== false;
    if (requireSpecialCharsEl) requireSpecialCharsEl.checked = settings.requireSpecialChars !== false;
    
    // Email Settings
    const smtpHostEl = document.getElementById('smtpHost');
    const smtpPortEl = document.getElementById('smtpPort');
    const smtpUsernameEl = document.getElementById('smtpUsername');
    const smtpPasswordEl = document.getElementById('smtpPassword');
    const fromEmailEl = document.getElementById('fromEmail');
    const fromNameEl = document.getElementById('fromName');
    
    if (smtpHostEl) smtpHostEl.value = settings.smtpHost || '';
    if (smtpPortEl) smtpPortEl.value = settings.smtpPort || 587;
    if (smtpUsernameEl) smtpUsernameEl.value = settings.smtpUsername || '';
    if (smtpPasswordEl) smtpPasswordEl.value = settings.smtpPassword || '';
    if (fromEmailEl) fromEmailEl.value = settings.fromEmail || '';
    if (fromNameEl) fromNameEl.value = settings.fromName || 'Bookverse';
    
    // Payment Settings
    const defaultShippingFeeEl = document.getElementById('defaultShippingFee');
    const freeShippingThresholdEl = document.getElementById('freeShippingThreshold');
    const processingFeeEl = document.getElementById('processingFee');
    const momoPartnerCodeEl = document.getElementById('momoPartnerCode');
    const momoAccessKeyEl = document.getElementById('momoAccessKey');
    const momoSecretKeyEl = document.getElementById('momoSecretKey');
    
    if (defaultShippingFeeEl) defaultShippingFeeEl.value = settings.defaultShippingFee || 30000;
    if (freeShippingThresholdEl) freeShippingThresholdEl.value = settings.freeShippingThreshold || 500000;
    if (processingFeeEl) processingFeeEl.value = settings.processingFee || 2.5;
    if (momoPartnerCodeEl) momoPartnerCodeEl.value = settings.momoPartnerCode || '';
    if (momoAccessKeyEl) momoAccessKeyEl.value = settings.momoAccessKey || '';
    if (momoSecretKeyEl) momoSecretKeyEl.value = settings.momoSecretKey || '';
    
    // Notification Settings
    const notifyNewOrdersEl = document.getElementById('notifyNewOrders');
    const notifyNewUsersEl = document.getElementById('notifyNewUsers');
    const notifyNewProductsEl = document.getElementById('notifyNewProducts');
    const notifyNewReviewsEl = document.getElementById('notifyNewReviews');
    
    if (notifyNewOrdersEl) notifyNewOrdersEl.checked = settings.notifyNewOrders !== false;
    if (notifyNewUsersEl) notifyNewUsersEl.checked = settings.notifyNewUsers !== false;
    if (notifyNewProductsEl) notifyNewProductsEl.checked = settings.notifyNewProducts !== false;
    if (notifyNewReviewsEl) notifyNewReviewsEl.checked = settings.notifyNewReviews !== false;
    
    // Maintenance Settings
    const maintenanceModeEl = document.getElementById('maintenanceMode');
    const maintenanceMessageEl = document.getElementById('maintenanceMessage');
    
    if (maintenanceModeEl) maintenanceModeEl.checked = settings.maintenanceMode === true;
    if (maintenanceMessageEl) maintenanceMessageEl.value = settings.maintenanceMessage || 'Website đang được bảo trì, vui lòng quay lại sau...';
}

// Save all settings (expose globally)
window.saveAllSettings = async function saveAllSettings() {
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        // Collect all settings
        const settings = {
            // General
            siteName: document.getElementById('siteName')?.value || '',
            siteDescription: document.getElementById('siteDescription')?.value || '',
            metaTitle: document.getElementById('metaTitle')?.value || '',
            metaDescription: document.getElementById('metaDescription')?.value || '',
            metaKeywords: document.getElementById('metaKeywords')?.value || '',
            
            // Security
            tokenExpiry: parseInt(document.getElementById('tokenExpiry')?.value || 15),
            maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts')?.value || 5),
            lockoutDuration: parseInt(document.getElementById('lockoutDuration')?.value || 30),
            minPasswordLength: parseInt(document.getElementById('minPasswordLength')?.value || 8),
            requireUppercase: document.getElementById('requireUppercase')?.checked || false,
            requireNumbers: document.getElementById('requireNumbers')?.checked || false,
            requireSpecialChars: document.getElementById('requireSpecialChars')?.checked || false,
            
            // Email
            smtpHost: document.getElementById('smtpHost')?.value || '',
            smtpPort: parseInt(document.getElementById('smtpPort')?.value || 587),
            smtpUsername: document.getElementById('smtpUsername')?.value || '',
            smtpPassword: document.getElementById('smtpPassword')?.value || '',
            fromEmail: document.getElementById('fromEmail')?.value || '',
            fromName: document.getElementById('fromName')?.value || '',
            
            // Payment
            defaultShippingFee: parseFloat(document.getElementById('defaultShippingFee')?.value || 30000),
            freeShippingThreshold: parseFloat(document.getElementById('freeShippingThreshold')?.value || 500000),
            processingFee: parseFloat(document.getElementById('processingFee')?.value || 2.5),
            momoPartnerCode: document.getElementById('momoPartnerCode')?.value || '',
            momoAccessKey: document.getElementById('momoAccessKey')?.value || '',
            momoSecretKey: document.getElementById('momoSecretKey')?.value || '',
            
            // Notifications
            notifyNewOrders: document.getElementById('notifyNewOrders')?.checked || false,
            notifyNewUsers: document.getElementById('notifyNewUsers')?.checked || false,
            notifyNewProducts: document.getElementById('notifyNewProducts')?.checked || false,
            notifyNewReviews: document.getElementById('notifyNewReviews')?.checked || false,
            
            // Maintenance
            maintenanceMode: document.getElementById('maintenanceMode')?.checked || false,
            maintenanceMessage: document.getElementById('maintenanceMessage')?.value || ''
        };
        
        const response = await api.updateSettings(settings);
        if (response && response.success) {
            alert('Đã lưu cài đặt thành công!');
            currentSettings = response.data.settings || {};
        } else {
            alert('Lưu cài đặt thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Lưu cài đặt thất bại: ' + error.message);
    }
}

// Reset settings (expose globally)
window.resetSettings = async function resetSettings() {
    if (!confirm('Bạn có chắc muốn khôi phục cài đặt về mặc định? Tất cả cài đặt hiện tại sẽ bị mất.')) {
        return;
    }
    
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        const response = await api.resetSettings();
        if (response && response.success) {
            alert('Đã khôi phục cài đặt về mặc định!');
            currentSettings = response.data.settings || {};
            populateSettingsForm(currentSettings);
        } else {
            alert('Khôi phục cài đặt thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error resetting settings:', error);
        alert('Khôi phục cài đặt thất bại: ' + error.message);
    }
}

// Test email connection (expose globally)
window.testEmailConnection = async function testEmailConnection() {
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        const response = await api.testEmailConnection();
        if (response && response.success) {
            alert('Kết nối email thành công!');
        } else {
            alert('Kết nối email thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error testing email:', error);
        alert('Kết nối email thất bại: ' + error.message);
    }
}

// Toggle maintenance mode (expose globally)
window.toggleMaintenanceMode = async function toggleMaintenanceMode() {
    const maintenanceMode = document.getElementById('maintenanceMode')?.checked || false;
    const maintenanceMessage = document.getElementById('maintenanceMessage')?.value || '';
    
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        const response = await api.updateSettings({
            maintenanceMode,
            maintenanceMessage
        });
        
        if (response && response.success) {
            alert(maintenanceMode ? 'Đã bật chế độ bảo trì!' : 'Đã tắt chế độ bảo trì!');
        } else {
            alert('Cập nhật chế độ bảo trì thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error toggling maintenance mode:', error);
        alert('Cập nhật chế độ bảo trì thất bại: ' + error.message);
    }
}

// Clear cache (expose globally)
window.clearCache = async function clearCache() {
    if (!confirm('Bạn có chắc muốn xóa cache?')) return;
    
    try {
        const api = window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);
        if (!api) {
            alert('Admin API không khả dụng');
            return;
        }
        
        const response = await api.clearCache();
        if (response && response.success) {
            alert('Đã xóa cache thành công!');
        } else {
            alert('Xóa cache thất bại: ' + (response?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
        alert('Xóa cache thất bại: ' + error.message);
    }
}

// Clear old logs (expose globally)
window.clearOldLogs = async function clearOldLogs() {
    if (!confirm('Bạn có chắc muốn xóa logs cũ hơn 30 ngày?')) return;
    alert('Tính năng xóa logs đang được phát triển');
}

// Optimize database (expose globally)
window.optimizeDatabase = async function optimizeDatabase() {
    if (!confirm('Bạn có chắc muốn tối ưu database?')) return;
    alert('Tính năng tối ưu database đang được phát triển');
}

// Preview logo (expose globally)
window.previewLogo = function previewLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('logoPreview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Logo preview">`;
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview favicon (expose globally)
window.previewFavicon = function previewFavicon(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            alert('Favicon preview: ' + input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

