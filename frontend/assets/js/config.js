// ========================================
// BOOKVERSE FRONTEND CONFIGURATION
// Environment-based configuration
// ========================================

class AppConfig {
    constructor() {
        this.environment = this.detectEnvironment();
        this.config = this.getConfig();
        this.applyOverrides();
    }

    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('test')) {
            return 'staging';
        } else if (hostname === 'bookversevn.store' || hostname.includes('bookversevn.store')) {
            return 'production';
        } else {
            return 'production';
        }
    }

    getConfig() {
        const configs = {
            development: {
                API_BASE_URL: 'http://localhost:5000/api',
                ADMIN_API_BASE: 'http://localhost:5000/api/admin',
                FRONTEND_URL: 'http://localhost:8000',
                GOOGLE_CLIENT_ID: '', // Will be set via meta tag if needed
                DEBUG: true,
                CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
                REQUEST_TIMEOUT: 10000, // 10 seconds
                RETRY_ATTEMPTS: 3
            },
            staging: {
                API_BASE_URL: 'https://localhost:5000/api',
                ADMIN_API_BASE: 'https://localhost:5000/api/admin',
                FRONTEND_URL: 'https://bookversevn.store/',
                DEBUG: true,
                CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
                REQUEST_TIMEOUT: 15000, // 15 seconds
                RETRY_ATTEMPTS: 3
            },
            production: {
                API_BASE_URL: 'https://backend-bookverse.onrender.com/api',
                ADMIN_API_BASE: 'https://backend-bookverse.onrender.com/api/admin',
                FRONTEND_URL: 'https://bookversevn.store',
                DEBUG: false,
                CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
                REQUEST_TIMEOUT: 20000, // 20 seconds
                RETRY_ATTEMPTS: 2
            }
        };

        return configs[this.environment];
    }

    /**
     * Apply API URL overrides from query params or localStorage
     * Supports testing with local backend
     * 
     * Usage:
     * - Query param: ?api=local hoặc ?api=http://localhost:5000
     * - localStorage: localStorage.setItem('bookverse_api_override', 'http://localhost:5000')
     * - Clear override: ?api=reset hoặc localStorage.removeItem('bookverse_api_override')
     */
    applyOverrides() {
        // Check query parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const apiParam = urlParams.get('api');
        
        if (apiParam) {
            if (apiParam === 'reset' || apiParam === 'clear') {
                // Clear override
                localStorage.removeItem('bookverse_api_override');
                // Remove query param from URL
                urlParams.delete('api');
                const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                window.history.replaceState({}, '', newUrl);
                return;
            } else if (apiParam === 'local') {
                // Use local backend
                const localApi = 'http://localhost:5000/api';
                this.config.API_BASE_URL = localApi;
                this.config.ADMIN_API_BASE = 'http://localhost:5000/api/admin';
                this.config.DEBUG = true;
                // Save to localStorage
                localStorage.setItem('bookverse_api_override', localApi);
                console.log('🔧 API Override: Using local backend', localApi);
                return;
            } else if (apiParam.startsWith('http://') || apiParam.startsWith('https://')) {
                // Custom API URL
                this.config.API_BASE_URL = apiParam + (apiParam.endsWith('/api') ? '' : '/api');
                this.config.ADMIN_API_BASE = this.config.API_BASE_URL + '/admin';
                this.config.DEBUG = true;
                localStorage.setItem('bookverse_api_override', this.config.API_BASE_URL);
                console.log('🔧 API Override: Using custom backend', this.config.API_BASE_URL);
                return;
            }
        }

        // Check localStorage for saved override
        const savedOverride = localStorage.getItem('bookverse_api_override');
        if (savedOverride) {
            this.config.API_BASE_URL = savedOverride;
            this.config.ADMIN_API_BASE = savedOverride.replace('/api', '/api/admin');
            this.config.DEBUG = true;
            console.log('🔧 API Override: Using saved backend', savedOverride);
        }
    }

    /**
     * Set API override programmatically
     * @param {string} apiUrl - API base URL (e.g., 'http://localhost:5000/api')
     */
    setApiOverride(apiUrl) {
        if (apiUrl) {
            localStorage.setItem('bookverse_api_override', apiUrl);
            this.config.API_BASE_URL = apiUrl;
            this.config.ADMIN_API_BASE = apiUrl.replace('/api', '/api/admin');
            this.config.DEBUG = true;
            console.log('🔧 API Override set:', apiUrl);
        } else {
            localStorage.removeItem('bookverse_api_override');
            // Reload config
            this.config = this.getConfig();
            console.log('🔧 API Override cleared');
        }
    }

    /**
     * Check if API override is active
     */
    hasApiOverride() {
        return !!localStorage.getItem('bookverse_api_override');
    }

    get(key) {
        return this.config[key];
    }

    isDevelopment() {
        return this.environment === 'development';
    }

    isProduction() {
        return this.environment === 'production';
    }

    getApiUrl(endpoint = '') {
        return `${this.config.API_BASE_URL}${endpoint}`;
    }

    getAdminApiUrl(endpoint = '') {
        return `${this.config.ADMIN_API_BASE}${endpoint}`;
    }
}

// Create global config instance
window.appConfig = new AppConfig();

// Export for use in other scripts
window.AppConfig = AppConfig;
