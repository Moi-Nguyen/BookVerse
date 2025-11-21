document.addEventListener('DOMContentLoaded', () => {
    const dataEl = document.getElementById('loginPageData');
    if (!dataEl) return;

    const loginReturnUrl = dataEl.dataset.returnUrl || '';
    const googleClientPrefix = dataEl.dataset.googleClientPrefix || '';
    const hasGoogleClient = dataEl.dataset.googleConfigured === '1';

    window.loginReturnUrl = loginReturnUrl;

    try {
        if (loginReturnUrl) {
            sessionStorage.setItem('bookverse_return_url', loginReturnUrl);
        } else {
            sessionStorage.removeItem('bookverse_return_url');
        }
    } catch (error) {
        console.warn('[Auth] Unable to persist returnUrl', error);
    }

    if (hasGoogleClient) {
        console.log('[Google Login] Client ID configured:', `${googleClientPrefix}...`);
    } else {
        console.warn('[Google Login] ⚠️ Google Client ID chưa được cấu hình!');
        console.warn('[Google Login] Vui lòng thêm Google Client ID vào file login.php dòng 7');
    }
});

