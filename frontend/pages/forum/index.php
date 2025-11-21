<?php 
$pageTitle='Diễn đàn Bookverse'; 
$extraCss=['assets/css/forum.css']; 
$extraJs=['assets/js/pages/forum.js'];
include __DIR__.'/../../includes/header.php'; 
?>

<main class="forum-main">
    <section class="forum-hero">
        <div class="container">
            <div class="forum-hero-content">
                <div>
                    <p class="section-badge">Diễn đàn cộng đồng</p>
                    <h1>Chia sẻ, thảo luận và lan toả tình yêu sách</h1>
                    <p>Viết bài review, hỏi đáp, chia sẻ kinh nghiệm bán sách và kết nối với hàng nghìn độc giả trên Bookverse.</p>
                    <div class="forum-hero-actions">
                        <button class="btn btn-primary" id="scrollToComposer">
                            <span class="btn-icon">✍️</span>
                            <span>Tạo bài viết ngay</span>
                        </button>
                    </div>
                </div>
                <div class="forum-stats">
                    <article class="stat-card">
                        <p class="stat-label">Bài viết</p>
                        <p class="stat-value" id="statPosts">0</p>
                        <p class="stat-trend positive">+32 bài tuần này</p>
                    </article>
                    <article class="stat-card">
                        <p class="stat-label">Bình luận</p>
                        <p class="stat-value" id="statComments">0</p>
                        <p class="stat-trend">Hoạt động 10 phút trước</p>
                    </article>
                    <article class="stat-card">
                        <p class="stat-label">Thành viên tích cực</p>
                        <p class="stat-value" id="statMembers">0</p>
                        <p class="stat-trend positive">+12 seller mới</p>
                    </article>
                </div>
            </div>
        </div>
    </section>

    <section class="forum-content">
        <div class="container forum-grid">
            <div class="forum-left">
                <article class="composer-card" id="composerCard">
                    <h2>Tạo bài viết mới</h2>
                    <form id="postForm">
                        <div class="form-group">
                            <label for="postTitle">Tiêu đề</label>
                            <input type="text" id="postTitle" name="title" placeholder="Ví dụ: Review & cảm nhận về tiểu thuyết..." required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="postCategory">Chủ đề</label>
                                <select id="postCategory" name="category" required>
                                    <option value="review">Review sách</option>
                                    <option value="discussion">Thảo luận</option>
                                    <option value="sell-tips">Kinh nghiệm bán sách</option>
                                    <option value="request">Tìm sách / gợi ý</option>
                                    <option value="news">Tin tức & sự kiện</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="postTags">Thẻ (cách nhau bằng dấu phẩy)</label>
                                <input type="text" id="postTags" name="tags" placeholder="fantasy, review, kinh điển">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="postContent">Nội dung</label>
                            <textarea id="postContent" name="content" rows="5" placeholder="Chia sẻ cảm nhận, câu hỏi hoặc kinh nghiệm của bạn..." required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <span class="btn-icon">🚀</span>
                                <span>Đăng bài</span>
                            </button>
                            <p class="hint-text">Bài viết sẽ được kiểm duyệt nhanh trong giờ hành chính.</p>
                        </div>
                    </form>
                </article>

                <article class="filter-card">
                    <div class="filter-row">
                        <div>
                            <label for="filterCategory">Chủ đề</label>
                            <select id="filterCategory">
                                <option value="all">Tất cả</option>
                                <option value="review">Review sách</option>
                                <option value="discussion">Thảo luận</option>
                                <option value="sell-tips">Kinh nghiệm bán sách</option>
                                <option value="request">Tìm sách / gợi ý</option>
                                <option value="news">Tin tức & sự kiện</option>
                            </select>
                        </div>
                        <div>
                            <label for="filterRole">Vai trò</label>
                            <select id="filterRole">
                                <option value="all">Tất cả</option>
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label for="filterSearch">Từ khoá</label>
                            <input type="text" id="filterSearch" placeholder="Tìm tiêu đề, thẻ...">
                        </div>
                    </div>
                </article>

                <section class="posts-section">
                    <h2>Bài viết mới</h2>
                    <div id="postsList" class="posts-list" aria-live="polite">
                        <!-- Posts render via JS -->
                    </div>
                </section>
            </div>

            <aside class="forum-right" id="guidelinesCard">
                <article class="guideline-card">
                    <h3>Nội quy nhanh</h3>
                    <ul>
                        <li>Tôn trọng ý kiến người khác, tránh spam & nội dung độc hại.</li>
                        <li>Đính kèm ảnh/nguồn khi trích dẫn review của người khác.</li>
                        <li>Gắn thẻ chủ đề phù hợp để mọi người dễ tìm.</li>
                        <li>Tin bán sách phải ghi rõ tình trạng, giá và hình thức giao dịch.</li>
                    </ul>
                </article>
                <article class="guideline-card">
                    <h3>Hỗ trợ & quản trị</h3>
                    <div class="moderator-list">
                        <div class="moderator">
                            <div class="avatar admin">A</div>
                            <div>
                                <p class="mod-name">Lan Anh</p>
                                <p class="mod-role">Admin & Trưởng nhóm cộng đồng</p>
                            </div>
                        </div>
                        <div class="moderator">
                            <div class="avatar seller">S</div>
                            <div>
                                <p class="mod-name">Tuấn Kiệt</p>
                                <p class="mod-role">Seller Mentor</p>
                            </div>
                        </div>
                        <div class="moderator">
                            <div class="avatar user">U</div>
                            <div>
                                <p class="mod-name">Thuỳ Dương</p>
                                <p class="mod-role">Curator Review</p>
                            </div>
                        </div>
                    </div>
                    <div class="moderator-actions">
                        <button class="btn btn-outline" id="reportBtn">
                            <span class="btn-icon">⚠️</span>
                            <span>Báo cáo vi phạm</span>
                        </button>
                        <button class="btn btn-secondary" id="openFAQ">
                            <span class="btn-icon">❓</span>
                            <span>FAQ diễn đàn</span>
                        </button>
                    </div>
                </article>
                <article class="guideline-card resource-card">
                    <h3>Tương tác nổi bật</h3>
                    <ul class="resource-list" id="highlightList">
                        <li>
                            <strong>Thử thách đọc 12 sách 2025</strong>
                            <span>45 bình luận • bởi <em>seller</em></span>
                        </li>
                        <li>
                            <strong>Checklist mở shop sách online</strong>
                            <span>20 bình luận • bởi <em>admin</em></span>
                        </li>
                        <li>
                            <strong>Cafe sách thân thiện tại Hà Nội</strong>
                            <span>15 bình luận • bởi <em>user</em></span>
                        </li>
                    </ul>
                </article>
            </aside>
        </div>
    </section>
</main>

<?php include __DIR__.'/../../includes/footer.php'; ?>

