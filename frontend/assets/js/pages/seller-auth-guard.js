(() => {
    try {
        const token = localStorage.getItem('bookverse_token');
        if (token) {
            document.cookie = `bookverse_token=${token}; path=/; max-age=${24 * 60 * 60}`;
            return;
        }

        if (window.location.pathname.includes('/auth/login')) {
            return;
        }

        const basePath = document.body?.dataset?.basePath || '';
        const loginUrl = `${basePath}pages/auth/login.php`;
        const redirectTarget = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `${loginUrl}?redirect=${redirectTarget}`;
    } catch (error) {
        console.error('Seller auth guard error:', error);
    }
})();

