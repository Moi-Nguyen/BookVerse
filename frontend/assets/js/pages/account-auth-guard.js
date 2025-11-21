(() => {
    try {
        const token = localStorage.getItem('bookverse_token');
        if (token) {
            document.cookie = `bookverse_token=${token}; path=/; max-age=${24 * 60 * 60}`;
            return;
        }

        const isAuthPage = window.location.pathname.includes('/auth/login');
        if (isAuthPage) {
            return;
        }

        const basePath = document.body?.dataset?.basePath || '';
        const loginUrl = `${basePath}pages/auth/login.php`;
        const redirectParam = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `${loginUrl}?redirect=${redirectParam}`;
    } catch (error) {
        console.error('Failed to sync auth token or redirect:', error);
    }
})();

