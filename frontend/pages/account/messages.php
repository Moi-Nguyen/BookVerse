<?php 
require_once __DIR__.'/../../includes/auth-check-safe.php';

$pageTitle = 'Tin nhắn với người bán'; 
$extraCss = ['assets/css/account.css', 'assets/css/messages.css']; 
$extraJs = [
    'assets/js/pages/account-auth-guard.js',
    'assets/js/pages/messages.js'
];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="account-main">
    <div class="container">
        <div class="account-content">
            <div class="account-header">
                <div>
                    <p class="section-badge">Trò chuyện</p>
                    <h1>Tin nhắn với người bán</h1>
                    <p>Trao đổi trực tiếp với người bán để hỏi thêm thông tin trước khi đặt mua</p>
                </div>
            </div>

            <div class="messages-wrapper" data-role="user">
                <aside class="conversation-panel" aria-label="Danh sách hội thoại">
                    <div class="panel-header">
                        <div class="search-box small">
                            <input type="text" id="conversationSearch" placeholder="Tìm kiếm theo người bán, sản phẩm...">
                        </div>
                        <button class="btn btn-primary btn-sm w-100" id="newConversationBtn">
                            <span class="btn-icon">➕</span> 
                            <span>Hội thoại mới</span>
                        </button>
                    </div>
                    <div class="conversation-list" id="conversationList" role="tablist" aria-label="Danh sách hội thoại">
                        <div class="empty-state" id="conversationEmpty">
                            <div class="empty-icon">💬</div>
                            <h3>Bạn chưa có cuộc trò chuyện nào</h3>
                            <p>Bắt đầu nhắn tin với người bán từ trang sản phẩm hoặc đơn hàng</p>
                        </div>
                    </div>
                    <div class="panel-footer">
                        <button class="btn btn-link" id="loadMoreConversationsBtn">Tải thêm cuộc trò chuyện</button>
                    </div>
                </aside>

                <section class="message-panel" aria-label="Chi tiết hội thoại">
                    <div class="message-header" id="conversationHeader">
                        <div class="participant-info">
                            <div class="avatar" id="participantAvatar">👤</div>
                            <div>
                                <h3 id="participantName">Chọn một cuộc trò chuyện</h3>
                                <p id="conversationMeta">Thông tin sản phẩm/đơn hàng sẽ hiển thị tại đây</p>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-outline btn-sm" id="markAsReadBtn" disabled>Đánh dấu đã đọc</button>
                            <button class="btn btn-outline btn-sm" id="viewOrderBtn" style="display:none;">Xem đơn hàng</button>
                            <button class="btn btn-danger btn-sm" id="deleteConversationBtn" disabled title="Xóa hội thoại">
                                <span class="btn-icon">🗑️</span>
                            </button>
                        </div>
                    </div>

                    <div class="message-body">
                        <div id="messageList" class="message-list" aria-live="polite">
                            <div class="empty-state" id="messageEmpty">
                                <div class="empty-icon">✉️</div>
                                <h3>Chưa có tin nhắn</h3>
                                <p>Bạn có thể ghim câu hỏi tại đây để người bán phản hồi nhanh hơn</p>
                            </div>
                        </div>
                    </div>

                    <div class="composer" id="messageComposer">
                        <div class="attachment-preview" id="attachmentPreview" style="display:none;"></div>
                        <div class="composer-row">
                            <div class="composer-actions">
                                <label class="attachment-btn" for="attachmentInput" title="Đính kèm hình ảnh hoặc PDF">
                                    📎
                                </label>
                                <input type="file" id="attachmentInput" accept="image/*,.pdf" multiple hidden>
                            </div>
                            <textarea id="messageInput" placeholder="Nhập nội dung tin nhắn..." rows="1"></textarea>
                            <button class="btn btn-primary" id="sendMessageBtn" disabled>
                                <span class="btn-icon">📤</span>
                                <span>Gửi</span>
                            </button>
                        </div>
                        <p class="composer-hint">Cho phép tối đa 5 tập tin, dung lượng mỗi file ≤ 5MB</p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</main>

<!-- New Conversation Modal -->
<div id="newConversationModal" class="messages-modal" aria-hidden="true">
    <div class="modal-overlay" id="closeNewConversationModal"></div>
    <div class="modal-dialog">
        <div class="modal-header">
            <div>
                <p class="section-badge">Hội thoại mới</p>
                <h3>Bắt đầu trò chuyện với người bán</h3>
                <p>Chọn cửa hàng hoặc sản phẩm bạn muốn trao đổi thêm thông tin</p>
            </div>
            <button type="button" class="modal-close" id="dismissNewConversationModal">×</button>
        </div>
        <div class="modal-body">
            <label for="sellerSearchInput">Chọn người bán</label>
            <div class="search-box small">
                <input type="text" id="sellerSearchInput" placeholder="Tìm theo tên người bán hoặc tên cửa hàng...">
            </div>
            <div class="seller-results" id="sellerResults">
                <div class="modal-loading">Đang tải danh sách người bán...</div>
            </div>

            <label for="productLinkInput">Liên kết sản phẩm (tuỳ chọn)</label>
            <input type="text" id="productLinkInput" placeholder="Dán đường dẫn sản phẩm hoặc mã sản phẩm nếu đã xem">
            <p class="input-hint">Gợi ý: Mở trang sản phẩm và chọn “Sao chép liên kết” để gắn vào đây.</p>

            <div class="selected-seller" id="selectedSellerSummary" style="display:none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" id="cancelNewConversation">Hủy</button>
            <button class="btn btn-primary" id="startConversationBtn" disabled>
                <span>Bắt đầu trò chuyện</span>
            </button>
        </div>
    </div>
</div>

<?php include __DIR__.'/../../includes/footer.php'; ?>

