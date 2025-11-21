document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    initUserMenu();
    updateUserDisplayName();
    updateWalletBalance();
});

function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        try {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (currentPath === linkPath) {
                link.style.fontWeight = '600';
                link.style.color = 'var(--primary-color, #6366f1)';
                link.style.borderBottom = '2px solid var(--primary-color, #6366f1)';
            }
        } catch (error) {
            console.warn('Failed to evaluate nav link path', error);
        }
    });
}

function initUserMenu() {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (!userBtn || !userDropdown) {
        return;
    }

    const userMenu = userBtn.closest('.user-menu') || userBtn.parentElement;
    let isPinned = false;

    const showDropdown = () => {
        userBtn.setAttribute('aria-expanded', 'true');
        userDropdown.setAttribute('aria-hidden', 'false');
        userDropdown.classList.add('show');
        userDropdown.style.display = 'block';
    };

    const hideDropdown = () => {
        if (isPinned) {
            return;
        }
        userBtn.setAttribute('aria-expanded', 'false');
        userDropdown.setAttribute('aria-hidden', 'true');
        userDropdown.classList.remove('show');
        userDropdown.style.display = 'none';
    };

    userBtn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        isPinned = !isPinned;
        if (isPinned) {
            showDropdown();
        } else {
            hideDropdown();
        }
    }, true);

    if (userMenu) {
        userMenu.addEventListener('mouseenter', () => {
            if (!isPinned) {
                showDropdown();
            }
        });

        userMenu.addEventListener('mouseleave', () => {
            if (!isPinned) {
                hideDropdown();
            }
        });
    }

    document.addEventListener('click', event => {
        if (event.target.closest('.dropdown-link') && event.target.closest('.dropdown-link').getAttribute('href') !== '#') {
            isPinned = false;
            hideDropdown();
            return;
        }

        if (!userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
            isPinned = false;
            hideDropdown();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            isPinned = false;
            hideDropdown();
        }
    });
}

function updateUserDisplayName() {
    try {
        const token = localStorage.getItem('bookverse_token');
        const userDisplayNameEl = document.getElementById('userDisplayName');

        if (!userDisplayNameEl) {
            return;
        }

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const username = payload.username || payload.email || 'User';
            const role = payload.role || 'user';

            let displayName = username;
            if (role === 'seller') {
                displayName = `${username} 🏪`;
            } else if (role === 'admin') {
                displayName = `${username} 👑`;
            }

            userDisplayNameEl.textContent = displayName;
            document.cookie = `bookverse_token=${token}; path=/; max-age=${24 * 60 * 60}`;
        } else {
            userDisplayNameEl.textContent = 'Tài khoản';
        }
    } catch (error) {
        console.error('Failed to update user display name:', error);
        const fallbackEl = document.getElementById('userDisplayName');
        if (fallbackEl) {
            fallbackEl.textContent = 'Tài khoản';
        }
    }
}

async function updateWalletBalance() {
    try {
        const balanceDisplay = document.getElementById('walletBalanceDisplay');
        if (!balanceDisplay || !window.api || typeof window.api.getCurrentUser !== 'function') {
            return;
        }

        const response = await window.api.getCurrentUser();
        if (response.success && response.data?.user) {
            const balance = response.data.user.wallet?.balance ?? 0;
            const formatted = typeof window.api.formatPrice === 'function'
                ? window.api.formatPrice(balance)
                : `${balance} ₫`;
            balanceDisplay.textContent = formatted;
        }
    } catch (error) {
        console.error('Failed to update wallet balance:', error);
    }
}

window.logout = function logout() {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        return;
    }

    localStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_user');
    sessionStorage.removeItem('bookverse_token');
    document.cookie = 'bookverse_token=; path=/; max-age=0';

    const basePath = document.body?.dataset?.basePath || '';
    window.location.href = `${basePath}index.php`;
};

