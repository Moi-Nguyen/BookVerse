(() => {
    let currentTab = 'withdrawals';
    let withdrawals = [];
    let transactions = [];
    let currentWithdrawalPage = 1;
    let currentTransactionPage = 1;
    const pageSize = 20;

    const getAdminAPI = () => window.adminAPI || (typeof adminAPI !== 'undefined' ? adminAPI : null);

    window.switchTab = function switchTab(tab) {
        currentTab = tab;

        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((t, index) => {
            if ((tab === 'withdrawals' && index === 0) || (tab === 'transactions' && index === 1)) {
                t.classList.add('active');
            }
        });

        const tabContent = document.getElementById(`${tab}Tab`);
        tabContent?.classList.add('active');

        if (tab === 'withdrawals') {
            loadWithdrawals();
        } else {
            loadTransactions();
        }
    };

    async function waitForAdminAPI(method) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxRetries = 20;

            const check = () => {
                const api = getAdminAPI();
                if (api && typeof api[method] === 'function') {
                    resolve(api);
                } else if (attempts < maxRetries) {
                    attempts += 1;
                    setTimeout(check, 200);
                } else {
                    reject(new Error('Admin API unavailable'));
                }
            };

            setTimeout(check, 100);
        });
    }

    window.loadWithdrawals = async function loadWithdrawals() {
        const tbody = document.getElementById('withdrawalsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;"><div>Đang tải...</div></td></tr>';
        }

        try {
            const api = await waitForAdminAPI('getWithdrawals');
            const params = {
                page: currentWithdrawalPage,
                limit: pageSize,
                status: document.getElementById('withdrawalStatusFilter')?.value || '',
                search: document.getElementById('withdrawalSearch')?.value || '',
                dateFrom: document.getElementById('withdrawalFromDate')?.value || '',
                dateTo: document.getElementById('withdrawalToDate')?.value || ''
            };

            const response = await api.getWithdrawals(params);
            if (response?.success && response.data) {
                withdrawals = response.data.withdrawals || [];
                const stats = response.data.stats || {};
                renderWithdrawalsTable();
                updateWithdrawalStats(stats);
            } else {
                showWithdrawalsError();
            }
        } catch (error) {
            console.error('Error loading withdrawals:', error);
            showWithdrawalsError();
        }
    };

    function showWithdrawalsError() {
        const tbody = document.getElementById('withdrawalsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center error-state">
                        <div class="error-icon">⚠️</div>
                        <p>Không thể tải danh sách yêu cầu rút tiền. Vui lòng tải lại trang.</p>
                        <button class="btn btn-outline" onclick="location.reload()">Tải lại</button>
                    </td>
                </tr>
            `;
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    }

    function formatDate(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderWithdrawalsTable() {
        const tbody = document.getElementById('withdrawalsTableBody');
        const countEl = document.getElementById('withdrawalCount');

        if (!tbody) return;

        if (!withdrawals?.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">💰</div>
                        <h3>Chưa có yêu cầu rút tiền nào</h3>
                    </td>
                </tr>
            `;
            if (countEl) countEl.textContent = '0 yêu cầu';
            return;
        }

        if (countEl) countEl.textContent = `${withdrawals.length} yêu cầu`;

        tbody.innerHTML = withdrawals.map((w) => {
            const seller = w.seller || w.user || {};
            const sellerName = seller.profile
                ? `${seller.profile.firstName || ''} ${seller.profile.lastName || ''}`.trim()
                : seller.username || 'N/A';
            const bankAccount = w.bankAccount || {};

            let statusBadge = '';
            if (w.status === 'pending') {
                statusBadge = '<span class="badge badge-warning">⏳ Chờ duyệt</span>';
            } else if (w.status === 'completed') {
                statusBadge = '<span class="badge badge-success">✅ Đã duyệt</span>';
            } else if (w.status === 'failed') {
                statusBadge = '<span class="badge badge-danger">❌ Từ chối</span>';
            }

            let actions = '';
            if (w.status === 'pending') {
                actions = `
                    <button class="btn btn-sm btn-primary" onclick="approveWithdrawal('${w._id}')" title="Duyệt">✅</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectWithdrawal('${w._id}')" title="Từ chối">❌</button>
                `;
            }
            actions += `
                <button class="btn btn-sm btn-outline" onclick="viewWithdrawalDetail('${w._id}')" title="Xem chi tiết">👁️</button>
            `;

            return `
                <tr>
                    <td><strong style="color: var(--primary-color);">#${escapeHtml(w.transactionId || w._id.toString().slice(-8))}</strong></td>
                    <td>
                        <div class="customer-info">
                            <div class="customer-name" style="font-weight: 500;">${escapeHtml(sellerName)}</div>
                            <div class="customer-email" style="color: var(--text-tertiary); font-size: 0.875rem;">${escapeHtml(seller.email || '')}</div>
                        </div>
                    </td>
                    <td><span style="font-weight: 600; color: var(--success-color);">${formatCurrency(w.amount)}</span></td>
                    <td>
                        ${bankAccount.bankName ? `<div><strong>${escapeHtml(bankAccount.bankName)}</strong></div>` : ''}
                        ${bankAccount.accountNumber ? `<div style="font-size: 0.875rem; color: var(--text-tertiary);">${escapeHtml(bankAccount.accountNumber)}</div>` : ''}
                        ${bankAccount.accountHolder ? `<div style="font-size: 0.875rem; color: var(--text-tertiary);">${escapeHtml(bankAccount.accountHolder)}</div>` : ''}
                        ${!bankAccount.bankName && !bankAccount.accountNumber ? '<span style="color: var(--text-muted);">Chưa cập nhật</span>' : ''}
                    </td>
                    <td>${statusBadge}</td>
                    <td style="color: var(--text-tertiary); font-size: 0.9375rem;">${formatDate(w.createdAt)}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            ${actions}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function updateWithdrawalStats(stats) {
        const totalEl = document.getElementById('totalWithdrawals');
        const pendingEl = document.getElementById('pendingWithdrawals');
        const completedEl = document.getElementById('completedWithdrawals');
        if (totalEl) totalEl.textContent = stats.total || 0;
        if (pendingEl) pendingEl.textContent = stats.pending || 0;
        if (completedEl) completedEl.textContent = stats.completed || 0;
        const amountEl = document.getElementById('totalWithdrawalAmount');
        if (amountEl) {
            amountEl.textContent = formatCurrency(stats.totalAmount || 0);
        }
    }

    window.loadTransactions = async function loadTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;"><div>Đang tải...</div></td></tr>';
        }

        try {
            const api = await waitForAdminAPI('getTransactions');
            const params = {
                page: currentTransactionPage,
                limit: pageSize,
                type: document.getElementById('transactionTypeFilter')?.value || '',
                status: document.getElementById('transactionStatusFilter')?.value || '',
                method: document.getElementById('transactionMethodFilter')?.value || '',
                search: document.getElementById('transactionSearch')?.value || '',
                dateFrom: document.getElementById('transactionFromDate')?.value || '',
                dateTo: document.getElementById('transactionToDate')?.value || ''
            };

            const response = await api.getTransactions(params);
            if (response?.success && response.data) {
                transactions = response.data.transactions || [];
                const stats = response.data.stats || {};
                renderTransactionsTable();
                updateTransactionStats(stats);
            } else {
                showTransactionsError();
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            showTransactionsError();
        }
    };

    function showTransactionsError() {
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center error-state">
                        <div class="error-icon">⚠️</div>
                        <p>Không thể tải danh sách giao dịch. Vui lòng tải lại trang.</p>
                        <button class="btn btn-outline" onclick="location.reload()">Tải lại</button>
                    </td>
                </tr>
            `;
        }
    }

    function getTypeLabel(type) {
        const labels = {
            deposit: '💰 Nạp tiền',
            withdrawal: '💸 Rút tiền',
            commission: '💼 Hoa hồng',
            refund: '↩️ Hoàn tiền'
        };
        return labels[type] || type;
    }

    function getStatusBadge(status) {
        if (status === 'completed') return '<span class="badge badge-success">✅ Thành công</span>';
        if (status === 'pending') return '<span class="badge badge-warning">⏳ Đang xử lý</span>';
        if (status === 'failed') return '<span class="badge badge-danger">❌ Thất bại</span>';
        return `<span class="badge">${status}</span>`;
    }

    function renderTransactionsTable() {
        const tbody = document.getElementById('transactionsTableBody');
        const countEl = document.getElementById('transactionCount');

        if (!tbody) return;

        if (!transactions?.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">💳</div>
                        <h3>Chưa có giao dịch nào</h3>
                    </td>
                </tr>
            `;
            if (countEl) countEl.textContent = '0 giao dịch';
            return;
        }

        if (countEl) countEl.textContent = `${transactions.length} giao dịch`;

        tbody.innerHTML = transactions.map((t) => {
            const user = t.user || {};
            const userName = user.profile
                ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                : user.username || 'N/A';

            return `
                <tr>
                    <td><strong style="color: var(--primary-color);">#${escapeHtml(t.transactionId || t._id.toString().slice(-8))}</strong></td>
                    <td>
                        <div class="customer-info">
                            <div class="customer-name" style="font-weight: 500;">${escapeHtml(userName)}</div>
                            <div class="customer-email" style="color: var(--text-tertiary); font-size: 0.875rem;">${escapeHtml(user.email || '')}</div>
                        </div>
                    </td>
                    <td>${getTypeLabel(t.type)}</td>
                    <td><span style="font-weight: 600; color: ${t.type === 'deposit' || t.type === 'commission' ? 'var(--success-color)' : 'var(--error-color)'};">${formatCurrency(t.amount)}</span></td>
                    <td>${escapeHtml(t.method || 'N/A')}</td>
                    <td>${getStatusBadge(t.status)}</td>
                    <td style="color: var(--text-tertiary); font-size: 0.9375rem;">${formatDate(t.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="viewTransactionDetail('${t._id}')" title="Xem chi tiết">👁️</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function updateTransactionStats(stats) {
        const totalRevenue = document.getElementById('totalRevenue');
        const successEl = document.getElementById('successPayments');
        const totalEl = document.getElementById('totalTransactions');
        const failedEl = document.getElementById('failedPayments');

        if (totalRevenue) totalRevenue.textContent = formatCurrency(stats.totalRevenue || 0);
        if (successEl) successEl.textContent = stats.successPayments || 0;
        if (failedEl) failedEl.textContent = stats.failedPayments || 0;
        if (totalEl) {
            totalEl.textContent = (stats.successPayments || 0) + (stats.failedPayments || 0);
        }
    }

    window.approveWithdrawal = async function approveWithdrawal(id) {
        if (!confirm('Bạn có chắc muốn duyệt yêu cầu rút tiền này?')) return;

        try {
            const api = getAdminAPI();
            if (!api) throw new Error('Admin API không khả dụng');

            const response = await api.approveWithdrawal(id);
            if (response?.success) {
                alert('Đã duyệt yêu cầu rút tiền thành công!');
                loadWithdrawals();
            } else {
                alert(`Duyệt yêu cầu thất bại: ${response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            alert(`Duyệt yêu cầu thất bại: ${error.message}`);
        }
    };

    window.rejectWithdrawal = async function rejectWithdrawal(id) {
        const reason = prompt('Nhập lý do từ chối:');
        if (reason === null) return;

        try {
            const api = getAdminAPI();
            if (!api) throw new Error('Admin API không khả dụng');

            const response = await api.rejectWithdrawal(id, reason);
            if (response?.success) {
                alert('Đã từ chối yêu cầu rút tiền!');
                loadWithdrawals();
            } else {
                alert(`Từ chối yêu cầu thất bại: ${response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            alert(`Từ chối yêu cầu thất bại: ${error.message}`);
        }
    };

    window.viewWithdrawalDetail = function viewWithdrawalDetail(id) {
        const withdrawal = withdrawals.find((w) => w._id === id);
        if (!withdrawal) return;

        const seller = withdrawal.seller || withdrawal.user || {};
        const sellerName = seller.profile
            ? `${seller.profile.firstName || ''} ${seller.profile.lastName || ''}`.trim()
            : seller.username || 'N/A';
        const bankAccount = withdrawal.bankAccount || {};

        document.getElementById('withdrawalDetails').innerHTML = `
            <div class="detail-section">
                <h4>Thông tin yêu cầu</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Mã giao dịch:</label>
                        <span>${escapeHtml(withdrawal.transactionId || withdrawal._id.toString().slice(-8))}</span>
                    </div>
                    <div class="detail-item">
                        <label>Số tiền:</label>
                        <span style="font-weight: 600; color: var(--success-color);">${formatCurrency(withdrawal.amount)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Trạng thái:</label>
                        <span class="badge ${withdrawal.status === 'pending' ? 'badge-warning' : withdrawal.status === 'completed' ? 'badge-success' : 'badge-danger'}">
                            ${withdrawal.status === 'pending' ? '⏳ Chờ duyệt' : withdrawal.status === 'completed' ? '✅ Đã duyệt' : '❌ Từ chối'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Ngày tạo:</label>
                        <span>${formatDate(withdrawal.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Thông tin seller</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Tên:</label>
                        <span>${escapeHtml(sellerName)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${escapeHtml(seller.email || 'N/A')}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Thông tin ngân hàng</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Ngân hàng:</label>
                        <span>${escapeHtml(bankAccount.bankName || 'Chưa cập nhật')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Số tài khoản:</label>
                        <span>${escapeHtml(bankAccount.accountNumber || 'Chưa cập nhật')}</span>
                    </div>
                    <div class="detail-item">
                        <label>Chủ tài khoản:</label>
                        <span>${escapeHtml(bankAccount.accountHolder || 'Chưa cập nhật')}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Mô tả</h4>
                <p>${escapeHtml(withdrawal.description || 'Không có mô tả')}</p>
            </div>
            ${withdrawal.status === 'pending' ? `
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="approveWithdrawal('${withdrawal._id}'); closeWithdrawalModal();">✅ Duyệt</button>
                    <button class="btn btn-danger" onclick="rejectWithdrawal('${withdrawal._id}'); closeWithdrawalModal();">❌ Từ chối</button>
                </div>
            ` : ''}
        `;

        document.getElementById('withdrawalDetailModal').style.display = 'flex';
    };

    window.closeWithdrawalModal = function closeWithdrawalModal() {
        const modal = document.getElementById('withdrawalDetailModal');
        if (modal) modal.style.display = 'none';
    };

    window.viewTransactionDetail = function viewTransactionDetail(id) {
        const transaction = transactions.find((t) => t._id === id);
        if (!transaction) return;
        alert(`Chi tiết giao dịch: ${JSON.stringify(transaction, null, 2)}`);
    };

    window.clearWithdrawalFilters = function clearWithdrawalFilters() {
        document.getElementById('withdrawalSearch').value = '';
        document.getElementById('withdrawalStatusFilter').value = '';
        document.getElementById('withdrawalFromDate').value = '';
        document.getElementById('withdrawalToDate').value = '';
        loadWithdrawals();
    };

    window.clearTransactionFilters = function clearTransactionFilters() {
        document.getElementById('transactionSearch').value = '';
        document.getElementById('transactionTypeFilter').value = '';
        document.getElementById('transactionStatusFilter').value = '';
        document.getElementById('transactionMethodFilter').value = '';
        document.getElementById('transactionFromDate').value = '';
        document.getElementById('transactionToDate').value = '';
        loadTransactions();
    };

    window.exportPayments = function exportPayments() {
        alert('Tính năng xuất báo cáo đang phát triển');
    };

    document.addEventListener('DOMContentLoaded', () => {
        loadWithdrawals();
    });
})();

