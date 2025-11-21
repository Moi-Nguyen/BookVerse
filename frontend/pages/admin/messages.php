<?php 
$pageTitle='Quản lý tin nhắn'; 
$extraCss=['assets/css/admin-improved.css', 'assets/css/messages.css']; 
$extraJs=['assets/js/pages/admin-auth-guard.js', 'assets/js/admin.js', 'assets/js/pages/messages.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="admin-main">
    <div class="admin-container">
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <span class="title-icon">💬</span>
                    Quản lý tin nhắn người dùng
                </h1>
                <p class="page-subtitle">Theo dõi và hỗ trợ cuộc trò chuyện giữa người mua và người bán</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" id="refreshConversationsBtn">
                    <span class="btn-icon">🔄</span>
                    Làm mới
                </button>
            </div>
        </div>

        <div class="messages-wrapper" data-role="admin">
            <aside class="conversation-panel" aria-label="Danh sách hội thoại hệ thống">
                <div class="panel-header">
                    <div class="search-box small">
                        <input type="text" id="conversationSearch" placeholder="Tìm theo người dùng, sản phẩm, mã đơn...">
                    </div>
                </div>
                <div class="conversation-list" id="conversationList">
                    <div class="empty-state" id="conversationEmpty">
                        <div class="empty-icon">💬</div>
                        <h3>Chưa có dữ liệu</h3>
                        <p>Các cuộc trò chuyện giữa người mua và người bán sẽ xuất hiện tại đây</p>
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
                            <h3 id="participantName">Chọn một hội thoại để xem</h3>
                            <p id="conversationMeta">Xem nhanh thông tin sản phẩm/đơn hàng liên quan</p>
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
                            <p>Chọn một hội thoại để xem nội dung chi tiết và thực hiện thao tác kiểm duyệt</p>
                        </div>
                    </div>
                </div>
                <div class="moderation-note">
                    <p><strong>Lưu ý:</strong> Quản trị viên có thể xem và xoá các tin nhắn vi phạm. Việc gửi thông báo hệ thống sẽ được bổ sung trong bản nâng cấp tiếp theo.</p>
                </div>
            </section>
        </div>
    </div>
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>

