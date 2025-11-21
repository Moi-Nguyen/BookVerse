<?php 
$pageTitle='Tin nhắn với khách hàng'; 
$extraCss=['assets/css/global.css', 'assets/css/seller.css', 'assets/css/messages.css']; 
$extraJs=['assets/js/pages/seller-auth-guard.js', 'assets/js/main.js', 'assets/js/api.js', 'assets/js/pages/messages.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
        <ol class="breadcrumb-list">
            <li><a href="../../index.php">Trang chủ</a></li>
            <li><a href="dashboard.php">Seller Dashboard</a></li>
            <li aria-current="page">Tin nhắn</li>
        </ol>
    </div>
</nav>

<main class="seller-main">
    <div class="container">
        <div class="page-header">
            <div class="header-content">
                <div class="header-info">
                    <p class="section-badge">Hộp thư người bán</p>
                    <h1>Trao đổi với người mua</h1>
                    <p>Phản hồi câu hỏi và hỗ trợ khách hàng để chốt đơn nhanh hơn</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-outline btn-sm" id="refreshConversationsBtn">
                        <span class="btn-icon">🔄</span>Làm mới
                    </button>
                </div>
            </div>
        </div>

        <div class="messages-wrapper" data-role="seller">
            <aside class="conversation-panel" aria-label="Danh sách hội thoại với khách hàng">
                <div class="panel-header">
                    <div class="search-box small">
                        <input type="text" id="conversationSearch" placeholder="Tìm theo khách hàng, sản phẩm...">
                    </div>
                </div>
                <div class="conversation-list" id="conversationList" role="tablist">
                    <div class="empty-state" id="conversationEmpty">
                        <div class="empty-icon">💬</div>
                        <h3>Chưa có tin nhắn nào</h3>
                        <p>Khách hàng sẽ liên hệ bạn từ trang sản phẩm hoặc đơn hàng</p>
                    </div>
                </div>
                <div class="panel-footer">
                    <button class="btn btn-link" id="loadMoreConversationsBtn">Tải thêm</button>
                </div>
            </aside>

            <section class="message-panel" aria-label="Chi tiết hội thoại">
                <div class="message-header" id="conversationHeader">
                    <div class="participant-info">
                        <div class="avatar" id="participantAvatar">👤</div>
                        <div>
                            <h3 id="participantName">Chọn một cuộc trò chuyện</h3>
                            <p id="conversationMeta">Thông tin khách hàng sẽ hiển thị tại đây</p>
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
                    <div id="messageList" class="message-list">
                        <div class="empty-state" id="messageEmpty">
                            <div class="empty-icon">✉️</div>
                            <h3>Chưa có tin nhắn</h3>
                            <p>Phản hồi nhanh chóng để tăng tỉ lệ chuyển đổi</p>
                        </div>
                    </div>
                </div>

                <div class="composer" id="messageComposer">
                    <div class="attachment-preview" id="attachmentPreview" style="display:none;"></div>
                    <div class="composer-row">
                        <div class="composer-actions">
                            <label class="attachment-btn" for="attachmentInput">📎</label>
                            <input type="file" id="attachmentInput" accept="image/*,.pdf" multiple hidden>
                        </div>
                        <textarea id="messageInput" placeholder="Nhập phản hồi của bạn..." rows="1"></textarea>
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
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>

