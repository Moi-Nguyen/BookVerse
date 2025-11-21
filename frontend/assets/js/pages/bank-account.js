// Bank Account Page JavaScript for Bookverse

class BankAccountManager {
    constructor() {
        this.isEditing = false;
        this.init();
    }

    init() {
        this.loadBankAccountInfo();
        this.loadPaymentHistory();
        this.bindEvents();
    }

    bindEvents() {
        // Bank form
        const bankForm = document.getElementById('bankForm');
        if (bankForm) {
            bankForm.addEventListener('submit', (e) => this.handleBankFormSubmit(e));
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }

        // Edit button
        const editBtn = document.getElementById('editAccountBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.startEdit());
        }

        // Modal events
        const closeModal = document.getElementById('closeSuccessModal');
        const confirmModal = document.getElementById('confirmSuccessModal');
        const successModal = document.getElementById('successModal');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (confirmModal) {
            confirmModal.addEventListener('click', () => this.closeModal());
        }

        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    this.closeModal();
                }
            });
        }
    }

    async loadBankAccountInfo() {
        try {
            if (typeof api === 'undefined') {
                console.error('API helper not available');
                return;
            }
            
            const response = await api.request('/payments/bank-account');
            
            if (response && response.success) {
                this.updateBankAccountDisplay(response.data.bankAccount);
            } else {
                throw new Error(response?.message || 'Không thể tải thông tin tài khoản ngân hàng');
            }
        } catch (error) {
            console.error('Error loading bank account info:', error);
            this.showToast(error.message || 'Lỗi khi tải thông tin tài khoản ngân hàng', 'error');
        }
    }

    updateBankAccountDisplay(bankAccount) {
        const statusElement = document.getElementById('accountStatus');
        const currentAccount = document.getElementById('currentAccount');
        
        if (bankAccount && bankAccount.bankName) {
            // Show current account info
            currentAccount.style.display = 'block';
            
            // Update status badge
            if (bankAccount.isVerified) {
                statusElement.textContent = 'Đã xác minh';
                statusElement.className = 'status-badge verified';
            } else {
                statusElement.textContent = 'Chờ xác minh';
                statusElement.className = 'status-badge pending';
            }
            
            // Update current account details
            document.getElementById('currentBankName').textContent = bankAccount.bankName;
            document.getElementById('currentAccountNumber').textContent = this.maskAccountNumber(bankAccount.accountNumber);
            document.getElementById('currentAccountHolder').textContent = bankAccount.accountHolder;
            document.getElementById('currentBranch').textContent = bankAccount.branch || 'Không có';
            document.getElementById('currentStatus').textContent = bankAccount.isVerified ? 'Đã xác minh' : 'Chờ xác minh';
            
            // Hide form initially
            document.querySelector('.bank-form-section').style.display = 'none';
        } else {
            // No bank account set
            statusElement.textContent = 'Chưa cập nhật';
            statusElement.className = 'status-badge not-set';
            currentAccount.style.display = 'none';
            document.querySelector('.bank-form-section').style.display = 'block';
        }
    }

    maskAccountNumber(accountNumber) {
        if (!accountNumber || accountNumber.length < 8) {
            return accountNumber;
        }
        
        const start = accountNumber.substring(0, 4);
        const end = accountNumber.substring(accountNumber.length - 4);
        const middle = '*'.repeat(accountNumber.length - 8);
        
        return start + middle + end;
    }

    startEdit() {
        this.isEditing = true;
        document.querySelector('.bank-form-section').style.display = 'block';
        document.getElementById('currentAccount').style.display = 'none';
        
        // Load current data into form
        this.loadCurrentDataIntoForm();
    }

    async loadCurrentDataIntoForm() {
        try {
            if (typeof api === 'undefined') {
                console.error('API helper not available');
                return;
            }
            
            const response = await api.request('/payments/bank-account');
            
            if (response && response.success && response.data.bankAccount) {
                const bankAccount = response.data.bankAccount;
                
                document.getElementById('bankName').value = bankAccount.bankName || '';
                document.getElementById('accountNumber').value = bankAccount.accountNumber || '';
                document.getElementById('accountHolder').value = bankAccount.accountHolder || '';
                document.getElementById('branch').value = bankAccount.branch || '';
            }
        } catch (error) {
            console.error('Error loading current data:', error);
        }
    }

    cancelEdit() {
        this.isEditing = false;
        document.querySelector('.bank-form-section').style.display = 'none';
        document.getElementById('currentAccount').style.display = 'block';
        
        // Reset form
        document.getElementById('bankForm').reset();
    }

    async handleBankFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bankData = {
            bankName: formData.get('bankName'),
            accountNumber: formData.get('accountNumber'),
            accountHolder: formData.get('accountHolder'),
            branch: formData.get('branch') || ''
        };

        // Validation
        if (!bankData.bankName || !bankData.accountNumber || !bankData.accountHolder) {
            this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        if (bankData.accountNumber.length < 8) {
            this.showToast('Số tài khoản phải có ít nhất 8 ký tự', 'error');
            return;
        }

        try {
            if (typeof api === 'undefined') {
                throw new Error('API helper not available');
            }
            
            const response = await api.request('/payments/bank-account', {
                method: 'POST',
                body: JSON.stringify(bankData)
            });

            if (response && response.success) {
                this.showSuccessModal();
                this.loadBankAccountInfo();
                document.getElementById('bankForm').reset();
                if (this.isEditing) {
                    this.cancelEdit();
                }
            } else {
                throw new Error(response?.message || 'Lỗi khi cập nhật thông tin tài khoản ngân hàng');
            }
        } catch (error) {
            console.error('Error updating bank account:', error);
            this.showToast(error.message || 'Lỗi khi cập nhật thông tin tài khoản ngân hàng', 'error');
        }
    }

    async loadPaymentHistory() {
        const historyContainer = document.getElementById('paymentHistory');
        if (!historyContainer) return;

        // Show loading state
        historyContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Đang tải lịch sử thanh toán...</p>
            </div>
        `;

        try {
            if (typeof api === 'undefined') {
                throw new Error('API helper not available');
            }
            
            const response = await api.request('/payments/seller/payments');

            if (response && response.success) {
                this.renderPaymentHistory(response.data.payments);
            } else {
                throw new Error(response?.message || 'Lỗi khi tải lịch sử thanh toán');
            }
        } catch (error) {
            console.error('Error loading payment history:', error);
            this.renderErrorState(error.message || 'Không thể tải lịch sử thanh toán');
        }
    }

    renderPaymentHistory(payments) {
        const historyContainer = document.getElementById('paymentHistory');
        
        if (!payments || payments.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💰</div>
                    <h3>Chưa có thanh toán nào</h3>
                    <p>Lịch sử thanh toán của bạn sẽ hiển thị ở đây</p>
                </div>
            `;
            return;
        }

        const historyHTML = payments.map(payment => this.createPaymentItemHTML(payment)).join('');
        historyContainer.innerHTML = historyHTML;
    }

    createPaymentItemHTML(payment) {
        const typeIcons = {
            'withdrawal': '💸',
            'commission': '💎'
        };

        const typeLabels = {
            'withdrawal': 'Thanh toán',
            'commission': 'Hoa hồng'
        };

        const statusLabels = {
            'pending': 'Chờ xử lý',
            'completed': 'Hoàn thành',
            'failed': 'Thất bại',
            'cancelled': 'Đã hủy'
        };

        const isPositive = payment.type === 'commission';
        const amountClass = isPositive ? 'amount-positive' : 'amount-negative';
        const amountPrefix = isPositive ? '+' : '';

        const date = new Date(payment.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-type">
                        <span class="type-icon">${typeIcons[payment.type] || '💳'}</span>
                        <span class="type-text">${typeLabels[payment.type] || payment.type}</span>
                    </div>
                    <div class="history-description">${payment.description || payment.note || 'Không có mô tả'}</div>
                    <div class="history-date">${date}</div>
                </div>
                <div class="history-amount">
                    <div class="amount-value ${amountClass}">
                        ${amountPrefix}${payment.amount.toLocaleString('vi-VN')} VND
                    </div>
                    <div class="history-status status-${payment.status}">
                        ${statusLabels[payment.status] || payment.status}
                    </div>
                </div>
            </div>
        `;
    }

    renderErrorState(message) {
        const historyContainer = document.getElementById('paymentHistory');
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Lỗi khi tải dữ liệu</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="bankAccountManager.loadPaymentHistory()">
                    Thử lại
                </button>
            </div>
        `;
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    showToast(message, type = 'info') {
        // Use the global showToast function from api.js
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize bank account manager when DOM is loaded
(function() {
    function initBankAccountManager() {
        if (typeof api === 'undefined') {
            setTimeout(initBankAccountManager, 100);
            return;
        }
        
        window.bankAccountManager = new BankAccountManager();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBankAccountManager);
    } else {
        initBankAccountManager();
    }
})();
