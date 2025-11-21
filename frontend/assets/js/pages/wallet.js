// Wallet Page JavaScript for Bookverse

class WalletManager {
    constructor() {
        this.currentPage = 1;
        this.currentStatus = '';
        this.currentType = '';
        this.previousBalance = undefined;
        this.qrPollingInterval = null;
        // Get API base URL
        this.apiBaseUrl = window.appConfig?.getApiUrl() || 'http://localhost:5000/api';
        this.init();
    }
    
    // Helper to get full API URL
    getApiUrl(endpoint) {
        // Remove leading slash if present
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return `${this.apiBaseUrl}/${cleanEndpoint}`;
    }

    init() {
        this.loadWalletBalance();
        this.loadPaymentHistory();
        this.bindEvents();
        // Auto-generate QR code on page load (without amount)
        this.generateQRCodeWithoutAmount();
    }

    bindEvents() {
        // Auto-update QR code when amount input changes
        const depositAmountInput = document.getElementById('depositAmount');
        if (depositAmountInput) {
            let debounceTimer;
            depositAmountInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const amount = parseFloat(e.target.value);
                    if (amount && amount >= 1000) {
                        this.generateQRCode();
                    } else if (e.target.value === '' || e.target.value === null) {
                        // If input is cleared, generate QR without amount
                        this.generateQRCodeWithoutAmount();
                    }
                }, 800); // Wait 800ms after user stops typing
            });
        }

        // Filters
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentStatus = e.target.value;
                this.currentPage = 1;
                this.loadPaymentHistory();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentType = e.target.value;
                this.currentPage = 1;
                this.loadPaymentHistory();
            });
        }

        // Modal events
        const closeModal = document.getElementById('closeDepositModal');
        const confirmModal = document.getElementById('confirmDepositModal');
        const depositModal = document.getElementById('depositModal');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (confirmModal) {
            confirmModal.addEventListener('click', () => this.closeModal());
        }

        if (depositModal) {
            depositModal.addEventListener('click', (e) => {
                if (e.target === depositModal) {
                    this.closeModal();
                }
            });
        }
    }

    async loadWalletBalance() {
        try {
            // Use API helper if available, otherwise use fetch with correct token
            if (typeof api !== 'undefined' && api.request) {
                const response = await api.request('/payments/balance');
                if (response.success && response.data) {
                    this.updateBalanceDisplay(response.data.balance || 0);
                } else {
                    throw new Error(response.message || 'Không thể tải số dư ví');
                }
            } else {
                // Fallback to fetch with correct token name
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    throw new Error('Chưa đăng nhập');
                }

                const response = await fetch('/api/payments/balance', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể tải số dư ví');
                }

                const data = await response.json();
                if (data.success) {
                    this.updateBalanceDisplay(data.data.balance || 0);
                } else {
                    throw new Error(data.message || 'Không thể tải số dư ví');
                }
            }
        } catch (error) {
            console.error('Error loading wallet balance:', error);
            this.showToast(error.message || 'Lỗi khi tải số dư ví', 'error');
        }
    }

    updateBalanceDisplay(balance) {
        const balanceElement = document.getElementById('walletBalance');
        if (balanceElement) {
            balanceElement.textContent = `${balance.toLocaleString('vi-VN')} VND`;
        }
        // Store initial balance for QR payment polling
        if (this.previousBalance === undefined) {
            this.previousBalance = balance;
        }
    }

    async loadPaymentHistory() {
        const historyContainer = document.getElementById('paymentHistory');
        if (!historyContainer) return;

        // Show loading state
        historyContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Đang tải lịch sử giao dịch...</p>
            </div>
        `;

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: 10
            });

            if (this.currentStatus) params.append('status', this.currentStatus);
            if (this.currentType) params.append('type', this.currentType);

            // Use API helper if available, otherwise use fetch with correct token
            let response, data;
            if (typeof api !== 'undefined' && api.request) {
                const queryParams = {
                    page: this.currentPage,
                    limit: 10
                };
                if (this.currentStatus) queryParams.status = this.currentStatus;
                if (this.currentType) queryParams.type = this.currentType;
                
                response = await api.request(`/payments/history?${new URLSearchParams(queryParams)}`);
                data = response;
            } else {
                // Fallback to fetch with correct token name
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    throw new Error('Chưa đăng nhập');
                }

                response = await fetch(`/api/payments/history?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể tải lịch sử giao dịch');
                }

                data = await response.json();
            }

            if (data.success) {
                // Filter: Only show completed DEPOSIT payments (no spending/payment/withdrawal)
                const depositPayments = data.data.payments.filter(p => 
                    p.status === 'completed' && 
                    p.amount > 0 && 
                    p.type === 'deposit'
                );
                this.renderPaymentHistory(depositPayments);
                this.renderPagination(data.data.pagination);
            } else {
                throw new Error(data.message || 'Lỗi khi tải lịch sử giao dịch');
            }
        } catch (error) {
            console.error('Error loading payment history:', error);
            this.renderErrorState(error.message);
        }
    }

    renderPaymentHistory(payments) {
        const historyContainer = document.getElementById('paymentHistory');
        
        // Filter: Only show completed DEPOSIT payments (no spending/payment/withdrawal)
        const depositPayments = payments.filter(p => 
            p.status === 'completed' && 
            p.amount > 0 && 
            p.type === 'deposit'
        );
        
        if (!depositPayments || depositPayments.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>Chưa có giao dịch nạp tiền nào</h3>
                    <p>Chỉ các giao dịch nạp tiền thành công sẽ hiển thị ở đây</p>
                </div>
            `;
            return;
        }

        const historyHTML = depositPayments.map(payment => this.createPaymentItemHTML(payment)).join('');
        historyContainer.innerHTML = historyHTML;
    }

    createPaymentItemHTML(payment) {
        const typeIcons = {
            'deposit': '💰',
            'withdrawal': '💸',
            'payment': '🛒',
            'commission': '💎'
        };

        const typeLabels = {
            'deposit': 'Nạp tiền',
            'withdrawal': 'Rút tiền',
            'payment': 'Thanh toán',
            'commission': 'Hoa hồng'
        };

        const statusLabels = {
            'pending': 'Chờ xử lý',
            'completed': 'Hoàn thành',
            'failed': 'Thất bại',
            'cancelled': 'Đã hủy'
        };

        const isPositive = payment.type === 'deposit' || payment.type === 'commission';
        const amountClass = isPositive ? 'amount-positive' : 'amount-negative';
        const amountPrefix = isPositive ? '+' : '-';

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
                    <div class="history-description">${payment.description}</div>
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

    renderPagination(pagination) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer || pagination.pages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        const { current, pages, total } = pagination;
        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button ${current === 1 ? 'disabled' : ''} onclick="walletManager.goToPage(${current - 1})">
                ← Trước
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, current - 2);
        const endPage = Math.min(pages, current + 2);

        if (startPage > 1) {
            paginationHTML += `<button onclick="walletManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === current ? 'active' : ''}" onclick="walletManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < pages) {
            if (endPage < pages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="walletManager.goToPage(${pages})">${pages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button ${current === pages ? 'disabled' : ''} onclick="walletManager.goToPage(${current + 1})">
                Sau →
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    renderErrorState(message) {
        const historyContainer = document.getElementById('paymentHistory');
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h3>Lỗi khi tải dữ liệu</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="walletManager.loadPaymentHistory()">
                    Thử lại
                </button>
            </div>
        `;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadPaymentHistory();
    }

    async generateQRCode() {
        const amountInput = document.getElementById('depositAmount');
        const amount = amountInput ? parseFloat(amountInput.value) : null;

        if (amount && amount < 1000) {
            // Don't show error, just don't update QR
            return;
        }

        try {
            await this.createAndDisplayQR(amount);
        } catch (error) {
            console.error('Error generating QR code:', error);
            // Show error only if it's not a loading state
            if (this.qrDisplayVisible) {
                this.showToast(error.message || 'Lỗi khi tạo mã QR', 'error');
            }
        }
    }

    async generateQRCodeWithoutAmount() {
        try {
            await this.createAndDisplayQR(null);
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showToast(error.message || 'Lỗi khi tạo mã QR', 'error');
        }
    }

    async createAndDisplayQR(amount) {
        try {
            // Show loading state
            const qrLoading = document.getElementById('qrLoading');
            const qrCodeImage = document.getElementById('qrCodeImage');
            
            if (qrLoading) {
                qrLoading.style.display = 'flex';
            }
            if (qrCodeImage) {
                qrCodeImage.style.display = 'none';
            }

            const token = localStorage.getItem('bookverse_token');
            if (!token) {
                throw new Error('Chưa đăng nhập');
            }

            const response = await fetch(this.getApiUrl('payments/sepay/qrcode'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amount || null })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || errorData.error || 'Không thể tạo mã QR';
                
                // Show detailed error if available
                if (errorData.hint) {
                    console.error('Error details:', errorData);
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (data.success && data.data.qrCode) {
                this.displayQRCode(data.data);
            } else {
                throw new Error('Không nhận được mã QR từ server');
            }
        } catch (error) {
            console.error('Error creating QR code:', error);
            throw error;
        }
    }

    displayQRCode(qrData) {
        const qrDisplay = document.getElementById('qrDisplay');
        const qrCodeImage = document.getElementById('qrCodeImage');
        const qrAmountInfo = document.getElementById('qrAmountInfo');
        const qrNoteSmall = document.getElementById('qrNoteSmall');

        if (!qrDisplay || !qrCodeImage) return;

        // Show QR display (always visible now)
        qrDisplay.style.display = 'block';
        this.qrDisplayVisible = true;

        // Hide loading, show QR code
        const qrLoading = document.getElementById('qrLoading');
        if (qrLoading) {
            qrLoading.style.display = 'none';
        }
        
        // Set QR code image
        qrCodeImage.src = qrData.qrCode;
        qrCodeImage.alt = 'QR Code nạp tiền';
        qrCodeImage.style.display = 'block';
        qrCodeImage.style.opacity = '1';

        // Set amount info
        if (qrAmountInfo) {
            if (qrData.amount) {
                qrAmountInfo.textContent = `Số tiền: ${qrData.amount.toLocaleString('vi-VN')} VND`;
                qrAmountInfo.style.display = 'block';
            } else {
                qrAmountInfo.textContent = 'Nhập số tiền trong app ngân hàng';
                qrAmountInfo.style.display = 'block';
            }
        }

        // Set note
        if (qrNoteSmall) {
            if (qrData.amount) {
                qrNoteSmall.textContent = 'Quét mã để thanh toán nhanh với số tiền đã nhập';
            } else {
                qrNoteSmall.textContent = 'Quét mã và nhập số tiền bạn muốn nạp trong app ngân hàng';
            }
        }

        // Scroll to QR code
        qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Start polling for payment (if orderId available)
        if (qrData.orderId) {
            this.startQRPaymentPolling(qrData.orderId, qrData.amount);
        }
    }

    startQRPaymentPolling(orderId, expectedAmount) {
        // Clear any existing polling
        if (this.qrPollingInterval) {
            clearInterval(this.qrPollingInterval);
        }

        let pollCount = 0;
        const maxPolls = 120; // Poll for 10 minutes (120 * 5 seconds)

        this.qrPollingInterval = setInterval(async () => {
            pollCount++;

            if (pollCount > maxPolls) {
                clearInterval(this.qrPollingInterval);
                this.updateQRStatus('timeout', 'Đã hết thời gian chờ thanh toán');
                return;
            }

            try {
                // Check if payment was completed by checking recent transactions
                // We'll check wallet balance changes or payment history
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    clearInterval(this.qrPollingInterval);
                    return;
                }

                // Check balance change (simple approach)
                const balanceResponse = await fetch(this.getApiUrl('payments/balance'), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    const currentBalance = balanceData.data?.balance || 0;

                    // If we have a previous balance, check if it increased
                    if (this.previousBalance !== undefined && currentBalance > this.previousBalance) {
                        const increase = currentBalance - this.previousBalance;
                        
                        // If amount matches (or no expected amount), consider it paid
                        if (!expectedAmount || Math.abs(increase - expectedAmount) < 1000) {
                            clearInterval(this.qrPollingInterval);
                            this.updateQRStatus('success', 'Thanh toán thành công!');
                            this.loadWalletBalance();
                            this.loadPaymentHistory();
                            
                            // Show success message with amount
                            const amountText = increase.toLocaleString('vi-VN');
                            this.showToast(`Nạp thành công số tiền ${amountText} VND!`, 'success');
                            return;
                        }
                    }
                    
                    this.previousBalance = currentBalance;
                }
            } catch (error) {
                console.error('Error polling QR payment:', error);
            }
        }, 5000); // Poll every 5 seconds
    }

    updateQRStatus(status, message) {
        // Status display removed - no longer needed
        // Payment status is shown via toast notifications
    }

    async handleDeposit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const depositData = {
            amount: parseFloat(formData.get('amount')),
            method: formData.get('method'),
            description: formData.get('description') || ''
        };

        // Validation
        if (depositData.amount < 1000) {
            this.showToast('Số tiền tối thiểu là 1,000 VND', 'error');
            return;
        }

        if (!depositData.method) {
            this.showToast('Vui lòng chọn phương thức thanh toán', 'error');
            return;
        }

        try {
            // Use API helper if available, otherwise use fetch with correct token
            let data;
            if (typeof api !== 'undefined' && api.request) {
                data = await api.request('/payments/deposit', {
                    method: 'POST',
                    body: JSON.stringify(depositData)
                });
            } else {
                // Fallback to fetch with correct token name
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    throw new Error('Chưa đăng nhập');
                }

                const response = await fetch('/api/payments/deposit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(depositData)
                });

                if (!response.ok) {
                    throw new Error('Không thể tạo yêu cầu nạp tiền');
                }

                data = await response.json();
            }

            if (data.success) {
                // If SePay, show SePay payment modal
                if (depositData.method === 'sepay' && data.data.sepay) {
                    this.showSePayPaymentModal(depositData, data.data);
                } else {
                    this.showDepositSuccessModal(depositData);
                }
                e.target.reset();
                this.loadPaymentHistory();
            } else {
                throw new Error(data.message || 'Lỗi khi tạo yêu cầu nạp tiền');
            }
        } catch (error) {
            console.error('Error creating deposit:', error);
            this.showToast(error.message || 'Lỗi khi tạo yêu cầu nạp tiền', 'error');
        }
    }

    showDepositSuccessModal(depositData) {
        const modal = document.getElementById('depositModal');
        const modalTitle = document.getElementById('modalTitle');
        const sepaySection = document.getElementById('sepayPaymentSection');
        const regularSection = document.getElementById('regularDepositSection');
        const modalAmountRegular = document.getElementById('modalAmountRegular');
        const modalMethod = document.getElementById('modalMethod');

        // Hide SePay section, show regular section
        if (sepaySection) sepaySection.style.display = 'none';
        if (regularSection) regularSection.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Yêu cầu nạp tiền';

        if (modalAmountRegular) {
            modalAmountRegular.textContent = `${depositData.amount.toLocaleString('vi-VN')} VND`;
        }

        if (modalMethod) {
            const methodLabels = {
                'bank_transfer': 'Chuyển khoản ngân hàng',
                'cash': 'Thanh toán tiền mặt',
                'sepay': 'SePay'
            };
            modalMethod.textContent = methodLabels[depositData.method] || depositData.method;
        }

        if (modal) {
            modal.classList.add('show');
        }
    }

    showSePayPaymentModal(depositData, responseData) {
        const modal = document.getElementById('depositModal');
        const modalTitle = document.getElementById('modalTitle');
        const sepaySection = document.getElementById('sepayPaymentSection');
        const regularSection = document.getElementById('regularDepositSection');
        const qrCodeImage = document.getElementById('qrCodeImage');
        const paymentUrlLink = document.getElementById('paymentUrlLink');
        const modalAmount = document.getElementById('modalAmount');
        const modalOrderId = document.getElementById('modalOrderId');
        const modalStatus = document.getElementById('modalStatus');

        // Hide regular section, show SePay section
        if (regularSection) regularSection.style.display = 'none';
        if (sepaySection) sepaySection.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Thanh toán qua SePay';

        const sepay = responseData.sepay;
        
        if (qrCodeImage && sepay.qrCode) {
            qrCodeImage.src = sepay.qrCode;
            qrCodeImage.style.display = 'block';
        }

        if (paymentUrlLink && sepay.paymentUrl) {
            paymentUrlLink.href = sepay.paymentUrl;
        }

        if (modalAmount) {
            modalAmount.textContent = `${depositData.amount.toLocaleString('vi-VN')} VND`;
        }

        if (modalOrderId && sepay.orderId) {
            modalOrderId.textContent = sepay.orderId;
        }

        if (modalStatus) {
            modalStatus.textContent = 'Đang chờ thanh toán';
            modalStatus.className = 'detail-value status-pending';
        }

        if (modal) {
            modal.classList.add('show');
        }

        // Start polling for payment status
        if (responseData.payment && responseData.payment._id) {
            this.startPaymentStatusPolling(responseData.payment._id);
        }
    }

    startPaymentStatusPolling(paymentId) {
        let pollCount = 0;
        const maxPolls = 60; // Poll for 5 minutes (60 * 5 seconds)
        
        const pollInterval = setInterval(async () => {
            pollCount++;
            
            if (pollCount > maxPolls) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    clearInterval(pollInterval);
                    return;
                }

                const response = await fetch(`/api/payments/sepay/status/${paymentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success && data.data.payment) {
                        const payment = data.data.payment;
                        
                        if (payment.status === 'completed') {
                            clearInterval(pollInterval);
                            this.updatePaymentStatus('completed', 'Thanh toán thành công!');
                            this.loadWalletBalance();
                            this.loadPaymentHistory();
                            
                            // Show success message
                            setTimeout(() => {
                                this.showToast('Thanh toán thành công! Số dư đã được cập nhật.', 'success');
                            }, 500);
                        } else if (payment.status === 'failed') {
                            clearInterval(pollInterval);
                            this.updatePaymentStatus('failed', 'Thanh toán thất bại');
                        }
                    }
                }
            } catch (error) {
                console.error('Error polling payment status:', error);
            }
        }, 5000); // Poll every 5 seconds
    }

    updatePaymentStatus(status, message) {
        const modalStatus = document.getElementById('modalStatus');
        if (modalStatus) {
            modalStatus.textContent = message;
            modalStatus.className = `detail-value status-${status}`;
        }
    }

    closeModal() {
        const modal = document.getElementById('depositModal');
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

// Initialize wallet manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.walletManager = new WalletManager();
});
