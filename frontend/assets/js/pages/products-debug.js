// Products Debug Helper for Bookverse
// This file provides debugging utilities for product listing page

class ProductsDebugHelper {
    constructor() {
        this.debugMode = this.isDebugMode();
        if (this.debugMode) {
            this.initDebugPanel();
            this.logApiCalls();
            console.log('🐛 Products Debug Mode Enabled');
        }
    }

    isDebugMode() {
        // Check if debug mode is enabled via URL parameter or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('debug') || localStorage.getItem('bookverse_debug') === 'true';
    }

    initDebugPanel() {
        // Create floating debug panel
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: #1a1a1a; color: #00ff00; 
                        padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; 
                        max-width: 400px; max-height: 300px; overflow-y: auto; z-index: 10000; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>🐛 Debug Panel</strong>
                    <button onclick="document.getElementById('debug-panel').remove()" 
                            style="background: #ff4444; color: white; border: none; padding: 3px 8px; 
                                   border-radius: 4px; cursor: pointer;">✕</button>
                </div>
                <div id="debug-log"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    log(message, type = 'info') {
        if (!this.debugMode) return;

        const logDiv = document.getElementById('debug-log');
        if (!logDiv) return;

        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        const color = type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : type === 'warning' ? '#ffaa00' : '#00ff00';
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `margin: 5px 0; padding: 5px; border-left: 3px solid ${color};`;
        logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${icon} ${message}`;
        
        logDiv.insertBefore(logEntry, logDiv.firstChild);

        // Keep only last 20 entries
        while (logDiv.children.length > 20) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }

    logApiCalls() {
        if (!this.debugMode) return;

        // Intercept fetch calls
        const originalFetch = window.fetch;
        const self = this;
        
        window.fetch = async function(...args) {
            const url = args[0];
            const options = args[1] || {};
            
            self.log(`API Call: ${options.method || 'GET'} ${url}`, 'info');
            
            try {
                const response = await originalFetch.apply(this, args);
                const status = response.status;
                const statusType = status >= 200 && status < 300 ? 'success' : 'error';
                
                self.log(`API Response: ${status} ${url}`, statusType);
                
                return response;
            } catch (error) {
                self.log(`API Error: ${error.message} - ${url}`, 'error');
                throw error;
            }
        };
    }

    logProductsLoaded(products) {
        if (!this.debugMode) return;
        this.log(`Loaded ${products.length} products`, 'success');
    }

    logFilterApplied(filterName, filterValue) {
        if (!this.debugMode) return;
        this.log(`Filter applied: ${filterName} = ${filterValue}`, 'info');
    }

    logError(error) {
        if (!this.debugMode) return;
        this.log(`Error: ${error.message}`, 'error');
        console.error('Debug Error Details:', error);
    }

    // Helper to show current state
    showState(state) {
        if (!this.debugMode) return;
        this.log(`State: ${JSON.stringify(state)}`, 'info');
    }

    // Helper to measure performance
    measurePerformance(label, fn) {
        if (!this.debugMode) {
            return fn();
        }

        const start = performance.now();
        const result = fn();
        const duration = (performance.now() - start).toFixed(2);
        
        this.log(`⏱️ ${label}: ${duration}ms`, 'info');
        
        return result;
    }

    async measureAsyncPerformance(label, asyncFn) {
        if (!this.debugMode) {
            return await asyncFn();
        }

        const start = performance.now();
        const result = await asyncFn();
        const duration = (performance.now() - start).toFixed(2);
        
        this.log(`⏱️ ${label}: ${duration}ms`, 'info');
        
        return result;
    }
}

// Initialize debug helper
window.productsDebugHelper = new ProductsDebugHelper();

// Add global debug functions
window.enableDebug = function() {
    localStorage.setItem('bookverse_debug', 'true');
    location.reload();
};

window.disableDebug = function() {
    localStorage.removeItem('bookverse_debug');
    location.reload();
};

// Log that debug helper is loaded
if (window.productsDebugHelper.debugMode) {
    console.log('%c🐛 Products Debug Helper Loaded', 'color: #00ff00; font-size: 14px; font-weight: bold;');
    console.log('%cUse enableDebug() to enable or disableDebug() to disable', 'color: #888; font-size: 12px;');
}

// Export for use in other modules
window.ProductsDebugHelper = ProductsDebugHelper;

