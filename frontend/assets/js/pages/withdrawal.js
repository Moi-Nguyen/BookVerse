// Withdrawal Page JavaScript for Bookverse

(function() {
    'use strict';
    
    function initWithdrawalPage() {
        if (typeof api === 'undefined') {
            setTimeout(initWithdrawalPage, 100);
            return;
        }
        
        window.withdrawalManager = new WithdrawalManager();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWithdrawalPage);
    } else {
        initWithdrawalPage();
    }
    
    class WithdrawalManager {
        constructor() {
            this.currentBalance = 0;
            this.init();
        }
        
        init() {
            this.loadBalance();
            this.loadWithdrawalHistory();
            this.bindEvents();
        }
        
        bindEvents() {
            // Form submit
            const form = document.getElementById('withdrawalForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
            
            // Cancel button
            const cancelBtn = document.getElementById('cancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    document.getElementById('withdrawalForm').reset();
                });
            }
            
            // Status filter
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) {
                statusFilter.addEventListener('change', () => {
                    this.loadWithdrawalHistory();
                });
            }
            
            // Modal close
            document.getElementById('closeSuccessModal')?.addEventListener('click', () => this.closeModal());
            document.getElementById('confirmSuccessModal')?.addEventListener('click', () => this.closeModal());
        }
        
        async loadBalance() {
            try {
                const response = await api.request('/payments/balance');
                if (response && response.success) {
                    this.currentBalance = response.data.balance || 0;
                    this.updateBalanceDisplay();
                }
            } catch (error) {
                console.error('Error loading balance:', error);
            }
        }
        
        updateBalanceDisplay() {
            const balanceEl = document.getElementById('currentBalance');
            if (balanceEl) {
                balanceEl.textContent = this.formatPrice(this.currentBalance);
            }
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            
            const amountInput = document.getElementById('amount');
            const notesInput = document.getElementById('notes');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            const amount = parseFloat(amountInput.value);
            const notes = notesInput.value.trim();
            
            // Validation
            if (!amount || amount < 50000) {
                this.showError('Số tiền tối thiểu là 50,000 VND');
                return;
            }
            
            if (amount > this.currentBalance) {
                this.showError('Số tiền rút không được vượt quá số dư hiện tại');
                return;
            }
            
            if (!confirm(`Bạn có chắc chắn muốn rút ${this.formatPrice(amount)}?`)) {
                return;
            }
            
            try {
                // Show loading
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                
                const response = await api.request('/payments/withdrawal', {
                    method: 'POST',
                    body: JSON.stringify({
                        amount: amount,
                        notes: notes
                    })
                });
                
                if (response && response.success) {
                    this.showSuccessModal();
                    document.getElementById('withdrawalForm').reset();
                    this.loadBalance();
                    this.loadWithdrawalHistory();
                } else {
                    throw new Error(response?.message || 'Không thể tạo yêu cầu rút tiền');
                }
            } catch (error) {
                console.error('Error creating withdrawal:', error);
                this.showError(error.message || 'Không thể tạo yêu cầu rút tiền');
            } finally {
                // Hide loading
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        async loadWithdrawalHistory() {
            const historyContainer = document.getElementById('withdrawalHistory');
            if (!historyContainer) return;
            
            // Show loading
            historyContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Đang tải lịch sử rút tiền...</p>
                </div>
            `;
            
            try {
                const statusFilter = document.getElementById('statusFilter');
                const status = statusFilter?.value || '';
                
                const params = new URLSearchParams({ type: 'withdrawal' });
                if (status) {
                    params.append('status', status);
                }
                
                const response = await api.request(`/payments/seller/payments?${params.toString()}`);
                
                if (response && response.success) {
                    this.renderWithdrawalHistory(response.data.payments || []);
                } else {
                    throw new Error(response?.message || 'Không thể tải lịch sử rút tiền');
                }
            } catch (error) {
                console.error('Error loading withdrawal history:', error);
                this.renderErrorState(error.message || 'Không thể tải lịch sử rút tiền');
            }
        }
        
        renderWithdrawalHistory(withdrawals) {
            const historyContainer = document.getElementById('withdrawalHistory');
            if (!historyContainer) return;
            
            if (withdrawals.length === 0) {
                historyContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">💸</div>
                        <h3>Chưa có yêu cầu rút tiền nào</h3>
                        <p>Lịch sử rút tiền của bạn sẽ hiển thị ở đây</p>
                    </div>
                `;
                return;
            }
            
            const historyHTML = withdrawals.map(withdrawal => this.createWithdrawalItemHTML(withdrawal)).join('');
            historyContainer.innerHTML = historyHTML;
        }
        
        createWithdrawalItemHTML(withdrawal) {
            const statusLabels = {
                'pending': 'Chờ duyệt',
                'completed': 'Đã duyệt',
                'failed': 'Thất bại',
                'cancelled': 'Đã hủy'
            };
            
            const statusClasses = {
                'pending': 'status-pending',
                'completed': 'status-completed',
                'failed': 'status-failed',
                'cancelled': 'status-cancelled'
            };
            
            const date = new Date(withdrawal.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="history-item">
                    <div class="history-info">
                        <div class="history-header">
                            <span class="history-amount">${this.formatPrice(withdrawal.amount)}</span>
                            <span class="history-status ${statusClasses[withdrawal.status] || ''}">
                                ${statusLabels[withdrawal.status] || withdrawal.status}
                            </span>
                        </div>
                        <div class="history-description">${this.escapeHtml(withdrawal.description || withdrawal.notes || 'Không có mô tả')}</div>
                        <div class="history-date">${date}</div>
                        ${withdrawal.approvedAt ? `
                            <div class="history-approved">
                                Đã duyệt: ${new Date(withdrawal.approvedAt).toLocaleDateString('vi-VN')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        renderErrorState(message) {
            const historyContainer = document.getElementById('withdrawalHistory');
            if (!historyContainer) return;
            
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Lỗi khi tải dữ liệu</h3>
                    <p>${this.escapeHtml(message)}</p>
                    <button class="btn btn-primary" onclick="window.withdrawalManager.loadWithdrawalHistory()">
                        Thử lại
                    </button>
                </div>
            `;
        }
        
        showSuccessModal() {
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }
        
        closeModal() {
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price || 0);
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        showError(message) {
            if (typeof showToast === 'function') {
                showToast(message, 'error');
            } else {
                alert(message);
            }
        }
    }
})();

