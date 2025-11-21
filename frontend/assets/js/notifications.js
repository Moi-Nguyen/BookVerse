// ========================================
// BOOKVERSE NOTIFICATIONS SYSTEM
// Beautiful popup notifications for user feedback
// ========================================

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.defaultDuration = 5000;
        this.createContainer();
        this.initializeEventListeners();
    }

    createContainer() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    initializeEventListeners() {
        // Auto-remove notifications after duration
        setInterval(() => {
            this.cleanupExpiredNotifications();
        }, 1000);
    }

    show(message, type = 'info', options = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            duration: options.duration || this.defaultDuration,
            actions: options.actions || [],
            autoClose: options.autoClose !== false,
            createdAt: Date.now()
        };

        this.notifications.push(notification);
        this.renderNotification(notification);
        this.cleanupOldNotifications();

        return notification.id;
    }

    renderNotification(notification) {
        const container = document.getElementById('notificationContainer');
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.dataset.id = notification.id;

        const icon = this.getIcon(notification.type);
        const actionsHTML = this.renderActions(notification.actions, notification.id);

        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${icon}
                </div>
                <div class="notification-body">
                    <div class="notification-message">${this.escapeHtml(notification.message)}</div>
                    ${actionsHTML}
                </div>
                <button class="notification-close" onclick="notificationManager.close('${notification.id}')">
                    <span>&times;</span>
                </button>
            </div>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

        container.appendChild(notificationEl);

        // Animate in
        setTimeout(() => {
            notificationEl.classList.add('notification-show');
        }, 10);

        // Auto close if enabled
        if (notification.autoClose) {
            setTimeout(() => {
                this.close(notification.id);
            }, notification.duration);
        }

        // Start progress bar animation
        this.startProgressBar(notificationEl, notification.duration);
    }

    renderActions(actions, notificationId) {
        if (!actions || actions.length === 0) return '';

        const actionsHTML = actions.map(action => `
            <button class="notification-action notification-action-${action.type || 'primary'}" 
                    onclick="${action.onClick}">
                ${action.text}
            </button>
        `).join('');

        return `<div class="notification-actions">${actionsHTML}</div>`;
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            loading: '⏳'
        };
        return icons[type] || icons.info;
    }

    startProgressBar(notificationEl, duration) {
        const progressBar = notificationEl.querySelector('.notification-progress-bar');
        if (!progressBar) return;

        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 10);
    }

    close(notificationId) {
        const notificationEl = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notificationEl) return;

        notificationEl.classList.add('notification-hide');
        
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.parentNode.removeChild(notificationEl);
            }
        }, 300);

        // Remove from array
        this.notifications = this.notifications.filter(n => n.id != notificationId);
    }

    cleanupExpiredNotifications() {
        const now = Date.now();
        this.notifications.forEach(notification => {
            if (notification.autoClose && (now - notification.createdAt) > notification.duration) {
                this.close(notification.id);
            }
        });
    }

    cleanupOldNotifications() {
        if (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications[0];
            this.close(oldest.id);
        }
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, duration: 7000 });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    loading(message, options = {}) {
        return this.show(message, 'loading', { ...options, autoClose: false });
    }

    // Special methods for auth flows
    showAuthSuccess(message, redirectUrl = null) {
        const actions = [];
        
        if (redirectUrl) {
            actions.push({
                text: 'Tiếp tục',
                type: 'primary',
                onClick: `window.location.href = '${redirectUrl}'`
            });
        }

        return this.success(message, {
            duration: 4000,
            actions
        });
    }

    showAuthError(message, stayOnPage = true) {
        return this.error(message, {
            duration: 6000,
            actions: stayOnPage ? [{
                text: 'Thử lại',
                type: 'secondary',
                onClick: 'notificationManager.closeAll()'
            }] : []
        });
    }

    closeAll() {
        this.notifications.forEach(notification => {
            this.close(notification.id);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.notificationManager = new NotificationManager();

// Global convenience functions
window.showSuccess = (message, options) => notificationManager.success(message, options);
window.showError = (message, options) => notificationManager.error(message, options);
window.showWarning = (message, options) => notificationManager.warning(message, options);
window.showInfo = (message, options) => notificationManager.info(message, options);
window.showLoading = (message, options) => notificationManager.loading(message, options);

// Export for use in other scripts
window.NotificationManager = NotificationManager;
