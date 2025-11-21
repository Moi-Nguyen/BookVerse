document.addEventListener('DOMContentLoaded', () => {
    if (typeof api === 'undefined') {
        console.error('API instance not found for messaging page');
        return;
    }

    const wrapper = document.querySelector('.messages-wrapper');
    if (!wrapper) {
        console.warn('Messaging wrapper not found on page.');
        return;
    }

    const viewRole = wrapper.dataset.role || 'user';

    const state = {
        conversations: [],
        pagination: { page: 1, pages: 1 },
        selectedConversation: null,
        messages: [],
        messagePagination: { page: 1, pages: 1 },
        currentUser: null,
        pendingAttachments: [],
        pollingTimer: null,
        searchTerm: '',
        loadingConversations: false,
        loadingMessages: false,
        sellerSearchResults: [],
        selectedSeller: null,
        sellerSearchTimeout: null,
        viewRole
    };

    const elements = {
        conversationList: document.getElementById('conversationList'),
        deleteConversationBtn: document.getElementById('deleteConversationBtn'),
        conversationEmpty: document.getElementById('conversationEmpty'),
        conversationSearch: document.getElementById('conversationSearch'),
        conversationSearchBtn: document.getElementById('conversationSearchBtn'),
        refreshConversationsBtn: document.getElementById('refreshConversationsBtn'),
        loadMoreConversationsBtn: document.getElementById('loadMoreConversationsBtn'),
        messageList: document.getElementById('messageList'),
        messageEmpty: document.getElementById('messageEmpty'),
        messageInput: document.getElementById('messageInput'),
        sendMessageBtn: document.getElementById('sendMessageBtn'),
        attachmentInput: document.getElementById('attachmentInput'),
        attachmentPreview: document.getElementById('attachmentPreview'),
        markAsReadBtn: document.getElementById('markAsReadBtn'),
        participantName: document.getElementById('participantName'),
        participantAvatar: document.getElementById('participantAvatar'),
        conversationMeta: document.getElementById('conversationMeta'),
        viewOrderBtn: document.getElementById('viewOrderBtn'),
        newConversationBtn: document.getElementById('newConversationBtn'),
        newConversationModal: document.getElementById('newConversationModal'),
        closeNewConversationModal: document.getElementById('closeNewConversationModal'),
        dismissNewConversationModal: document.getElementById('dismissNewConversationModal'),
        cancelNewConversationBtn: document.getElementById('cancelNewConversation'),
        sellerSearchInput: document.getElementById('sellerSearchInput'),
        sellerResults: document.getElementById('sellerResults'),
        productLinkInput: document.getElementById('productLinkInput'),
        selectedSellerSummary: document.getElementById('selectedSellerSummary'),
        startConversationBtn: document.getElementById('startConversationBtn'),
        deleteConversationBtn: document.getElementById('deleteConversationBtn')
    };

    const apiBaseUrl = (api.baseURL || '').replace(/\/api$/i, '');
    const defaultHeaderState = {
        name: elements.participantName?.textContent?.trim() || 'Chọn một cuộc trò chuyện',
        meta: elements.conversationMeta?.textContent?.trim() || 'Thông tin sẽ hiển thị tại đây',
        avatar: elements.participantAvatar?.textContent || '👤'
    };
    const isNotFoundError = (error) => Number(error?.status) === 404;

    function normalizeId(value) {
        if (!value) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'object') {
            return value._id || value.id || value.toString?.() || null;
        }
        return null;
    }

    function formatTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    }

    function escapeHtml(str = '') {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getAvatarInitial(name = '') {
        if (!name) return '👤';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0]?.toUpperCase() || '👤';
        return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
    }

    function getSellerDisplayName(user) {
        if (!user) return 'Người bán';
        if (user.sellerProfile?.businessName) {
            return user.sellerProfile.businessName;
        }
        const first = user.profile?.firstName || '';
        const last = user.profile?.lastName || '';
        const fullName = `${first} ${last}`.trim();
        if (fullName) {
            return fullName;
        }
        return user.username || 'Người bán';
    }

    function scrollMessagesToBottom() {
        if (!elements.messageList) return;
        setTimeout(() => {
            elements.messageList.scrollTop = elements.messageList.scrollHeight;
        }, 100);
    }

    function toggleComposer(enabled) {
        if (elements.sendMessageBtn) elements.sendMessageBtn.disabled = !enabled;
        if (elements.messageInput) elements.messageInput.disabled = !enabled;
        if (elements.attachmentInput) elements.attachmentInput.disabled = !enabled;
    }

    function resetConversationView() {
        stopPolling();
        state.selectedConversation = null;
        state.messages = [];
        state.pendingAttachments = [];
        if (elements.participantName) elements.participantName.textContent = defaultHeaderState.name;
        if (elements.conversationMeta) elements.conversationMeta.textContent = defaultHeaderState.meta;
        if (elements.participantAvatar) elements.participantAvatar.textContent = defaultHeaderState.avatar;
        if (elements.deleteConversationBtn) elements.deleteConversationBtn.disabled = true;
        if (elements.markAsReadBtn) elements.markAsReadBtn.disabled = true;
        toggleComposer(false);
        if (elements.messageList) {
            elements.messageList.innerHTML = '';
        }
        if (elements.messageEmpty) {
            elements.messageEmpty.style.display = 'block';
        }
        renderAttachmentPreview();
    }

    toggleComposer(false);

    async function handleConversationMissing(message = 'Hội thoại đã bị xoá.') {
        resetConversationView();
        showToast(message, 'warning');
        await loadConversations({ page: 1 });
    }

    async function fetchCurrentUser() {
        try {
            const response = await api.getCurrentUser();
            state.currentUser = response.data.user;
        } catch (error) {
            console.error('Failed to fetch current user', error);
        }
    }

    function isBuyerPerspective(conversation) {
        const buyerId = normalizeId(conversation?.buyer);
        if (state.currentUser) {
            return buyerId === state.currentUser._id;
        }
        if (state.viewRole === 'user') return true;
        if (state.viewRole === 'seller') return false;
        return false;
    }

    function getConversationCounterpart(conversation) {
        if (!conversation) return null;
        const buyerPerspective = isBuyerPerspective(conversation);
        if (buyerPerspective) {
            return conversation.seller || null;
        }
        return conversation.buyer || null;
    }

    function getUnreadCount(conversation) {
        if (!conversation) return 0;
        const buyerPerspective = isBuyerPerspective(conversation);
        if (buyerPerspective) return conversation.buyerUnreadCount || 0;
        return conversation.sellerUnreadCount || 0;
    }

    function openNewConversationModal() {
        if (!elements.newConversationModal || state.viewRole !== 'user') return;
        elements.newConversationModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (!state.sellerSearchResults.length) {
            loadSellerSuggestions();
        } else {
            renderSellerResults();
        }
    }

    function closeNewConversationModal() {
        if (!elements.newConversationModal) return;
        elements.newConversationModal.classList.remove('show');
        document.body.style.overflow = '';
        resetNewConversationModal();
    }

    function resetNewConversationModal() {
        state.selectedSeller = null;
        state.sellerSearchResults = [];
        if (elements.sellerSearchInput) {
            elements.sellerSearchInput.value = '';
        }
        if (elements.productLinkInput) {
            elements.productLinkInput.value = '';
        }
        if (elements.selectedSellerSummary) {
            elements.selectedSellerSummary.style.display = 'none';
            elements.selectedSellerSummary.innerHTML = '';
        }
        if (elements.startConversationBtn) {
            elements.startConversationBtn.disabled = true;
            elements.startConversationBtn.innerHTML = '<span>Bắt đầu trò chuyện</span>';
        }
        if (elements.sellerResults) {
            elements.sellerResults.innerHTML = '<div class="modal-loading">Đang tải danh sách người bán...</div>';
        }
    }

    function handleSellerSearchInput(event) {
        if (state.viewRole !== 'user') return;
        const term = event.target.value.trim();
        if (state.sellerSearchTimeout) {
            clearTimeout(state.sellerSearchTimeout);
        }
        state.sellerSearchTimeout = setTimeout(() => {
            loadSellerSuggestions(term);
        }, 300);
    }

    async function loadSellerSuggestions(searchTerm = '') {
        if (!elements.sellerResults || state.viewRole !== 'user') return;
        elements.sellerResults.innerHTML = '<div class="modal-loading">Đang tải danh sách người bán...</div>';
        try {
            const response = await api.getSellers({ limit: 10, search: searchTerm });
            const sellers = response.data?.sellers || response.data || [];
            state.sellerSearchResults = sellers;
            renderSellerResults();
        } catch (error) {
            elements.sellerResults.innerHTML = '<p class="error-text">Không thể tải danh sách người bán. Vui lòng thử lại.</p>';
            api.handleError(error);
        }
    }

    function renderSellerResults() {
        if (!elements.sellerResults) return;
        if (!state.sellerSearchResults.length) {
            elements.sellerResults.innerHTML = '<p class="error-text">Không tìm thấy người bán phù hợp.</p>';
            return;
        }
        elements.sellerResults.innerHTML = state.sellerSearchResults.map((seller) => {
            const sellerId = normalizeId(seller._id || seller.id);
            const isActive = state.selectedSeller && normalizeId(state.selectedSeller._id || state.selectedSeller.id) === sellerId;
            return `
                <button type="button" class="seller-card ${isActive ? 'active' : ''}" data-id="${sellerId}">
                    <div class="seller-info">
                        <span class="seller-name">${escapeHtml(getSellerDisplayName(seller))}</span>
                        <span class="seller-meta">
                            📚 ${seller.sellerProfile?.totalProducts || 0} sản phẩm • ⭐ ${(seller.sellerProfile?.rating || 0).toFixed(1)}
                        </span>
                    </div>
                    <span class="seller-action">${isActive ? 'Đã chọn' : 'Chọn'}</span>
                </button>
            `;
        }).join('');

        elements.sellerResults.querySelectorAll('.seller-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const seller = state.sellerSearchResults.find(item => normalizeId(item._id || item.id) === id);
                if (seller) {
                    selectSeller(seller);
                    renderSellerResults();
                }
            });
        });
    }

    function selectSeller(seller) {
        state.selectedSeller = seller;
        if (elements.selectedSellerSummary) {
            elements.selectedSellerSummary.style.display = 'block';
            elements.selectedSellerSummary.innerHTML = `
                <strong>${escapeHtml(getSellerDisplayName(seller))}</strong><br>
                <span>${escapeHtml(seller.email || seller.sellerProfile?.businessName || '')}</span>
            `;
        }
        if (elements.startConversationBtn) {
            elements.startConversationBtn.disabled = false;
        }
    }

    function parseProductIdFromInput() {
        const rawValue = elements.productLinkInput?.value.trim();
        if (!rawValue) return null;
        if (/^[a-f0-9]{24}$/i.test(rawValue)) {
            return rawValue;
        }
        try {
            const url = new URL(rawValue, window.location.origin);
            const idParam = url.searchParams.get('id');
            if (idParam) return idParam;
        } catch (error) {
            // Not a valid URL, ignore
        }
        return null;
    }

    async function handleStartConversationFromModal() {
        if (state.viewRole !== 'user' || !state.selectedSeller) return;
        const sellerId = normalizeId(state.selectedSeller._id || state.selectedSeller.id);
        if (!sellerId) return;
        const productId = parseProductIdFromInput();
        const originalLabel = elements.startConversationBtn?.innerHTML;
        if (elements.startConversationBtn) {
            elements.startConversationBtn.disabled = true;
            elements.startConversationBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Đang tạo...</span>';
        }
        try {
            await startConversationWithSeller({ sellerId, productId });
            closeNewConversationModal();
        } catch (error) {
            api.handleError(error);
        } finally {
            if (elements.startConversationBtn) {
                elements.startConversationBtn.innerHTML = originalLabel || '<span>Bắt đầu trò chuyện</span>';
                elements.startConversationBtn.disabled = !state.selectedSeller;
            }
        }
    }

    async function loadConversations({ page = 1, append = false } = {}) {
        if (state.loadingConversations) return;
        state.loadingConversations = true;
        elements.conversationList?.classList.add('loading');
        try {
            const params = { page, limit: 20 };
            if (state.viewRole === 'admin') {
                params.scope = 'all';
            }
            if (state.searchTerm) params.search = state.searchTerm;
            const response = await api.getConversations(params);
            const { data = [], pagination } = response;
            state.pagination = pagination || { page: 1, pages: 1 };
            state.conversations = append ? [...state.conversations, ...data] : data;
            renderConversations();
        } catch (error) {
            api.handleError(error);
        } finally {
            state.loadingConversations = false;
            elements.conversationList?.classList.remove('loading');
        }
    }

    function renderConversations() {
        if (!elements.conversationList) return;
        if (!state.conversations.length) {
            elements.conversationEmpty.style.display = 'block';
            elements.loadMoreConversationsBtn.style.display = 'none';
            elements.conversationList.innerHTML = '';
            return;
        }

        elements.conversationEmpty.style.display = 'none';
        elements.loadMoreConversationsBtn.style.display = state.pagination.page < state.pagination.pages ? 'block' : 'none';

        elements.conversationList.innerHTML = state.conversations.map(conversation => {
            const counterpart = getConversationCounterpart(conversation);
            const unreadCount = getUnreadCount(conversation);
            return `
                <button class="conversation-item ${state.selectedConversation?._id === conversation._id ? 'active' : ''}" data-id="${conversation._id}">
                    <div class="conversation-avatar">${getAvatarInitial(counterpart?.profile?.firstName || counterpart?.username)}</div>
                    <div class="conversation-content">
                        <div class="conversation-top">
                            <span class="conversation-name">${escapeHtml(counterpart?.profile?.firstName ? `${counterpart.profile.firstName} ${counterpart.profile.lastName || ''}` : counterpart?.username || 'Người bán')}</span>
                            <span class="conversation-time">${formatTime(conversation.updatedAt)}</span>
                        </div>
                        <div class="conversation-preview">
                            ${escapeHtml(conversation.lastMessage?.preview || 'Chưa có tin nhắn')}
                            ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                        </div>
                        ${conversation.product?.title ? `<p class="conversation-product">${escapeHtml(conversation.product.title)}</p>` : ''}
                    </div>
                </button>
            `;
        }).join('');

        elements.conversationList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                const conversation = state.conversations.find(c => c._id === id);
                if (conversation) {
                    selectConversation(conversation);
                }
            });
        });
    }

    async function selectConversation(conversation) {
        state.selectedConversation = conversation;
        renderConversations();
        updateConversationHeader(conversation);
        if (elements.messageEmpty) {
            elements.messageEmpty.style.display = 'none';
        }
        toggleComposer(true);
        if (elements.markAsReadBtn) elements.markAsReadBtn.disabled = false;
        if (elements.deleteConversationBtn) elements.deleteConversationBtn.disabled = false;
        await loadMessages(conversation._id);
        await markConversationRead(conversation._id);
        startPolling();
    }

    function updateConversationHeader(conversation) {
        const counterpart = getConversationCounterpart(conversation);
        elements.participantName.textContent = counterpart?.profile?.firstName
            ? `${counterpart.profile.firstName} ${counterpart.profile.lastName || ''}`
            : counterpart?.username || 'Người bán';
        elements.participantAvatar.textContent = getAvatarInitial(elements.participantName.textContent);
        const productTitle = conversation.product?.title;
        const orderNumber = conversation.order?.orderNumber;
        const subject = conversation.subject;
        elements.conversationMeta.textContent = [subject, productTitle ? `Sản phẩm: ${productTitle}` : null, orderNumber ? `Đơn hàng: ${orderNumber}` : null]
            .filter(Boolean)
            .join(' • ');

        if (conversation.order?._id) {
            elements.viewOrderBtn.style.display = 'inline-flex';
            elements.viewOrderBtn.onclick = () => {
                window.location.href = `../account/orders.php?orderId=${conversation.order._id}`;
            };
        } else {
            elements.viewOrderBtn.style.display = 'none';
        }

    }

    async function loadMessages(conversationId, { page = 1 } = {}) {
        if (state.loadingMessages) return;
        state.loadingMessages = true;
        elements.messageList?.classList.add('loading');
        try {
            const response = await api.getConversationMessages(conversationId, { page, limit: 30 });
            state.messagePagination = response.pagination || { page: 1, pages: 1 };
            state.messages = response.data || [];
            renderMessages();
            scrollMessagesToBottom();
        } catch (error) {
            if (isNotFoundError(error)) {
                await handleConversationMissing('Hội thoại đã bị xoá hoặc hết hạn.');
            } else {
                api.handleError(error);
            }
        } finally {
            state.loadingMessages = false;
            elements.messageList?.classList.remove('loading');
        }
    }

    function renderMessages() {
        if (!elements.messageList) return;
        if (!state.messages.length) {
            if (elements.messageEmpty) {
                elements.messageEmpty.style.display = 'block';
            }
            elements.messageList.innerHTML = '';
            return;
        }

        if (elements.messageEmpty) {
            elements.messageEmpty.style.display = 'none';
        }
        elements.messageList.innerHTML = state.messages.map(message => {
            const senderId = normalizeId(message.sender);
            const isMe = state.currentUser && senderId === state.currentUser._id;
            const messageId = message._id || message.id;
            const attachmentsHtml = (message.attachments || []).map(att => renderAttachment(att)).join('');
            const bodyHtml = message.body ? `<div class="message-text">${escapeHtml(message.body)}</div>` : '';
            const actionButton = state.viewRole === 'admin' && messageId
                ? `<button class="message-action" data-message="${messageId}">🗑️ Xóa</button>`
                : '';
            const meta = `
                <div class="message-meta">
                    <span>${formatDateTime(message.createdAt)}</span>
                    ${message.status === 'read' ? '<span>✔✔ Đã đọc</span>' : ''}
                    ${actionButton}
                </div>
            `;
            return `
                <div class="message-bubble ${isMe ? 'me' : 'them'}">
                    ${bodyHtml}
                    ${attachmentsHtml ? `<div class="message-attachments">${attachmentsHtml}</div>` : ''}
                    ${meta}
                </div>
            `;
        }).join('');
        if (state.viewRole === 'admin') {
            elements.messageList.querySelectorAll('.message-action').forEach(btn => {
                btn.addEventListener('click', () => {
                    const messageId = btn.getAttribute('data-message');
                    if (messageId) {
                        deleteMessage(messageId);
                    }
                });
            });
        }
    }

    function renderAttachment(attachment) {
        if (!attachment) return '';
        const absoluteUrl = attachment.url?.startsWith('http')
            ? attachment.url
            : `${apiBaseUrl}${attachment.url}`;
        if (attachment.type === 'image') {
            return `<a href="${absoluteUrl}" target="_blank" class="attachment-card">
                <img src="${absoluteUrl}" alt="${escapeHtml(attachment.fileName)}" loading="lazy">
            </a>`;
        }
        return `<a href="${absoluteUrl}" target="_blank" class="attachment-card">
            📄 ${escapeHtml(attachment.fileName)} (${Math.round(attachment.fileSize / 1024)}KB)
        </a>`;
    }

    async function markConversationRead(conversationId) {
        try {
            await api.markConversationRead(conversationId);
            const conversation = state.conversations.find(c => c._id === conversationId);
            if (conversation) {
                if (state.currentUser && conversation.buyer?._id === state.currentUser._id) {
                    conversation.buyerUnreadCount = 0;
                } else {
                    conversation.sellerUnreadCount = 0;
                }
            }
            renderConversations();
        } catch (error) {
            if (isNotFoundError(error)) {
                await handleConversationMissing('Hội thoại đã bị xoá.');
            } else {
                console.warn('Failed to mark conversation as read', error);
            }
        }
    }

    async function deleteSelectedConversation() {
        if (!state.selectedConversation) return;
        const confirmMessage = 'Bạn chắc chắn muốn xóa cuộc trò chuyện này?';
        if (!window.confirm(confirmMessage)) {
            return;
        }
        if (elements.deleteConversationBtn) elements.deleteConversationBtn.disabled = true;
        try {
            await api.deleteConversation(state.selectedConversation._id);
            showToast('Đã xoá hội thoại', 'success');
            resetConversationView();
            await loadConversations({ page: 1 });
        } catch (error) {
            if (elements.deleteConversationBtn) elements.deleteConversationBtn.disabled = false;
            if (isNotFoundError(error)) {
                await handleConversationMissing('Hội thoại này đã được xoá trước đó.');
            } else {
                api.handleError(error);
            }
        }
    }

    async function sendMessage() {
        if (!state.selectedConversation) {
            showToast('Vui lòng chọn một cuộc trò chuyện', 'warning');
            return;
        }
        const text = elements.messageInput ? elements.messageInput.value.trim() : '';
        if (!text && state.pendingAttachments.length === 0) {
            showToast('Vui lòng nhập nội dung hoặc chọn tệp đính kèm', 'warning');
            return;
        }
        elements.sendMessageBtn.disabled = true;
        try {
            await api.sendConversationMessage(state.selectedConversation._id, {
                body: text,
                attachments: state.pendingAttachments
            });
            if (elements.messageInput) {
                elements.messageInput.value = '';
            }
            state.pendingAttachments = [];
            renderAttachmentPreview();
            await loadMessages(state.selectedConversation._id);
            await loadConversations({ page: 1 });
        } catch (error) {
            if (isNotFoundError(error)) {
                await handleConversationMissing('Hội thoại đã bị xoá do chưa có tin nhắn. Vui lòng tạo hội thoại mới.');
            } else {
                api.handleError(error);
            }
        } finally {
        if (elements.sendMessageBtn) {
            elements.sendMessageBtn.disabled = false;
        }
        }
    }

    function handleAttachmentChange(event) {
        const files = Array.from(event?.target?.files || []);
        if (!files.length) return;

        const totalFiles = state.pendingAttachments.length + files.length;
        if (totalFiles > 5) {
            showToast('Chỉ được đính kèm tối đa 5 file mỗi tin nhắn', 'warning');
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                showToast(`"${file.name}" vượt quá dung lượng 5MB`, 'warning');
                return false;
            }
            return true;
        });

        state.pendingAttachments = [...state.pendingAttachments, ...validFiles];
        elements.attachmentInput.value = '';
        renderAttachmentPreview();
    }

    function renderAttachmentPreview() {
        if (!elements.attachmentPreview) {
            return;
        }
        if (!state.pendingAttachments.length) {
            elements.attachmentPreview.style.display = 'none';
            elements.attachmentPreview.innerHTML = '';
            return;
        }

        elements.attachmentPreview.style.display = 'flex';
        elements.attachmentPreview.innerHTML = state.pendingAttachments.map((file, index) => `
            <span class="attachment-chip">
                ${file.type.startsWith('image/') ? '🖼️' : '📄'} ${escapeHtml(file.name)}
                <button type="button" data-index="${index}" aria-label="Xóa tệp đính kèm">&times;</button>
            </span>
        `).join('');

        elements.attachmentPreview.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-index'));
                state.pendingAttachments.splice(idx, 1);
                renderAttachmentPreview();
            });
        });
    }

    function startPolling() {
        stopPolling();
        state.pollingTimer = setInterval(async () => {
            if (state.selectedConversation) {
                await loadMessages(state.selectedConversation._id);
            }
        }, 8000);
    }

    function stopPolling() {
        if (state.pollingTimer) {
            clearInterval(state.pollingTimer);
            state.pollingTimer = null;
        }
    }

    async function deleteMessage(messageId) {
        if (!messageId) return;
        if (!confirm('Bạn có chắc muốn xoá tin nhắn này khỏi cuộc trò chuyện?')) {
            return;
        }
        try {
            await api.deleteMessage(messageId);
            showToast('Đã xoá tin nhắn', 'success');
            if (state.selectedConversation) {
                await loadMessages(state.selectedConversation._id);
            }
        } catch (error) {
            api.handleError(error);
        }
    }

    async function handleQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const conversationId = params.get('conversationId');
        const sellerId = params.get('sellerId');
        const productId = params.get('productId');
        const orderId = params.get('orderId');

        if (conversationId) {
            const existing = state.conversations.find(c => c._id === conversationId);
            if (existing) {
                await selectConversation(existing);
                return;
            }
        }

        if (sellerId) {
            await startConversationWithSeller({ sellerId, productId, orderId });
        }
    }

    async function startConversationWithSeller({ sellerId, productId, orderId }) {
        if (state.viewRole !== 'user') return;
        try {
            const payload = { sellerId };
            if (productId) payload.productId = productId;
            if (orderId) payload.orderId = orderId;
            payload.createdFrom = productId ? 'product' : orderId ? 'order' : 'store';
            const response = await api.createConversation(payload);
            await loadConversations({ page: 1 });
            let conversation = state.conversations.find(c => c._id === response.data._id);
            if (!conversation) {
                const fallback = { ...response.data };
                if (!fallback.seller && state.selectedSeller) {
                    fallback.seller = state.selectedSeller;
                }
                if (!fallback.buyer && state.currentUser) {
                    fallback.buyer = state.currentUser;
                }
                conversation = fallback;
            }
            await selectConversation(conversation);
        } catch (error) {
            api.handleError(error);
        }
    }

    function setupEventListeners() {
        elements.sendMessageBtn?.addEventListener('click', sendMessage);
        elements.messageInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
        elements.attachmentInput?.addEventListener('change', handleAttachmentChange);
        elements.markAsReadBtn?.addEventListener('click', () => {
            if (state.selectedConversation) {
                markConversationRead(state.selectedConversation._id);
            }
        });
        elements.conversationSearch?.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                state.searchTerm = elements.conversationSearch.value.trim();
                loadConversations({ page: 1 });
            }
        });
        elements.refreshConversationsBtn?.addEventListener('click', () => {
            state.searchTerm = '';
            elements.conversationSearch.value = '';
            loadConversations({ page: 1 });
        });
        elements.loadMoreConversationsBtn?.addEventListener('click', () => {
            if (state.pagination.page < state.pagination.pages) {
                loadConversations({ page: state.pagination.page + 1, append: true });
            }
        });
        if (state.viewRole === 'user') {
            elements.newConversationBtn?.addEventListener('click', openNewConversationModal);
            elements.closeNewConversationModal?.addEventListener('click', closeNewConversationModal);
            elements.dismissNewConversationModal?.addEventListener('click', closeNewConversationModal);
            elements.cancelNewConversationBtn?.addEventListener('click', closeNewConversationModal);
            elements.sellerSearchInput?.addEventListener('input', handleSellerSearchInput);
            elements.startConversationBtn?.addEventListener('click', handleStartConversationFromModal);
        } else if (elements.newConversationBtn) {
            elements.newConversationBtn.addEventListener('click', () => {
                showToast('Vui lòng vào trang sản phẩm và chọn "Nhắn tin với người bán" để bắt đầu hội thoại.', 'info');
            });
        }

        elements.deleteConversationBtn?.addEventListener('click', deleteSelectedConversation);
    }

    async function init() {
        await fetchCurrentUser();
        setupEventListeners();
        await loadConversations({ page: 1 });
        await handleQueryParams();
    }

    init();
    window.addEventListener('beforeunload', stopPolling);
});

