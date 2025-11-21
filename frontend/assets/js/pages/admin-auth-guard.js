(() => {
    if (typeof window === 'undefined') {
        return;
    }

    const body = document.body;
    const basePath = body?.dataset?.basePath || '';
    const loginPath = `${basePath}pages/admin/login.php`;

    function redirectToLogin() {
        window.location.href = loginPath;
    }

    function hasAdminToken() {
        try {
            return !!localStorage.getItem('bookverse_token');
        } catch (error) {
            console.warn('Unable to access localStorage:', error);
            return false;
        }
    }

    if (!hasAdminToken()) {
        redirectToLogin();
    }
})();

