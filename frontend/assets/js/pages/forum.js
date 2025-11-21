document.addEventListener('DOMContentLoaded', () => {
    const state = {
        posts: [],
        currentUser: null,
        userRole: 'user', // Default role
        stats: {
            posts: 0,
            comments: 0,
            members: 0
        },
        filter: {
            category: 'all',
            role: 'all',
            search: ''
        }
    };

    const samplePosts = [
        {
            id: 1,
            author: 'Minh Anh',
            role: 'user',
            title: 'Review "Tuổi trẻ đáng giá bao nhiêu" – Bạn có nên đọc lại mỗi năm?',
            content: 'Mình đã đọc cuốn này lần 3 và vẫn tìm được rất nhiều năng lượng tích cực cho các dự định mới...',
            category: 'review',
            tags: ['review', 'self-help'],
            likes: 24,
            createdAt: '2025-11-16T09:30:00',
            comments: [
                { author: 'Kiều My', role: 'seller', content: 'Mình đang bán bản limited, bạn nào cần ib nhé!', createdAt: '2025-11-16T10:05:00' },
                { author: 'Admin Duy', role: 'admin', content: 'Cảm ơn bài review chất lượng nha!', createdAt: '2025-11-16T10:20:00' }
            ]
        },
        {
            id: 2,
            author: 'Hoàng Đức',
            role: 'seller',
            title: 'Checklist mở shop sách online trong 30 ngày',
            content: 'Chia sẻ nhanh checklist mình dùng để mở tiệm sách online: nghiên cứu thị trường, tối ưu tồn kho...',
            category: 'sell-tips',
            tags: ['seller', 'growth'],
            likes: 31,
            createdAt: '2025-11-15T13:15:00',
            comments: [
                { author: 'Thuỷ Tiên', role: 'user', content: 'Anh cho em xin chi tiết phần đóng gói ạ?', createdAt: '2025-11-15T13:40:00' }
            ]
        },
        {
            id: 3,
            author: 'Bookverse Admin',
            role: 'admin',
            title: 'Tuần lễ #ReadingChallenge – Cùng đọc 12 sách trong 2025!',
            content: 'Tham gia thử thách 12 chủ đề sách – chia sẻ cảm nhận mỗi tháng, nhận huy hiệu & quà tặng từ Bookverse.',
            category: 'news',
            tags: ['challenge', 'sự kiện'],
            likes: 52,
            createdAt: '2025-11-14T08:00:00',
            comments: [
                { author: 'Thảo Vy', role: 'user', content: 'Em join thử thách, chủ đề tháng 1 là gì ạ?', createdAt: '2025-11-14T08:30:00' },
                { author: 'Hoàng Đức', role: 'seller', content: 'Mình tài trợ thêm 5 voucher giảm 50k nhé!', createdAt: '2025-11-14T09:00:00' }
            ]
        }
    ];

    const elements = {
        statPosts: document.getElementById('statPosts'),
        statComments: document.getElementById('statComments'),
        statMembers: document.getElementById('statMembers'),
        postsList: document.getElementById('postsList'),
        composerCard: document.getElementById('composerCard'),
        guidelinesCard: document.getElementById('guidelinesCard'),
        postForm: document.getElementById('postForm'),
        filterCategory: document.getElementById('filterCategory'),
        filterRole: document.getElementById('filterRole'),
        filterSearch: document.getElementById('filterSearch'),
        scrollToComposer: document.getElementById('scrollToComposer'),
        reportBtn: document.getElementById('reportBtn'),
        openFAQ: document.getElementById('openFAQ')
    };

    async function init() {
        // Wait for API to be available
        let retries = 0;
        while (typeof api === 'undefined' && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        if (typeof api === 'undefined') {
            console.error('API not available after retries');
        }

        await loadCurrentUser();
        await loadStats();
        await loadPosts();
        await loadModerators();
        await loadFeatured();
        bindEvents();
    }

    async function loadCurrentUser() {
        try {
            // Check if token exists first
            const token = localStorage.getItem('bookverse_token');
            if (!token) {
                console.log('No token found, user not logged in');
                state.currentUser = null;
                state.userRole = 'user';
                return;
            }

            if (typeof api !== 'undefined' && api.getCurrentUser) {
                const response = await api.getCurrentUser();
                console.log('Current user response:', response);
                if (response && response.success && response.user) {
                    state.currentUser = response.user;
                    state.userRole = response.user.role || 'user';
                    console.log('User loaded:', state.currentUser.username, 'Role:', state.userRole);
                } else {
                    // Token might be invalid
                    state.currentUser = null;
                    state.userRole = 'user';
                }
            }
        } catch (error) {
            console.log('User not logged in or error loading user:', error);
            // User not logged in, keep default role 'user'
            state.currentUser = null;
            state.userRole = 'user';
        }
    }

    async function loadStats() {
        try {
            if (typeof api !== 'undefined' && api.getForumStats) {
                const response = await api.getForumStats();
                if (response && response.success && response.data) {
                    state.stats = response.data;
                    renderStats();
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            // Use default stats
            renderStats();
        }
    }

    function renderStats() {
        if (elements.statPosts) elements.statPosts.textContent = state.stats.posts || 0;
        if (elements.statComments) elements.statComments.textContent = state.stats.comments || 0;
        if (elements.statMembers) elements.statMembers.textContent = state.stats.members || 0;
    }

    async function loadPosts() {
        try {
            if (typeof api !== 'undefined' && api.getForumPosts) {
                const params = {
                    category: state.filter.category !== 'all' ? state.filter.category : undefined,
                    role: state.filter.role !== 'all' ? state.filter.role : undefined,
                    search: state.filter.search.trim() || undefined,
                    page: 1,
                    limit: 50
                };
                
                // Remove undefined params
                Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
                
                const response = await api.getForumPosts(params);
                if (response && response.success && response.data) {
                    // Load comments for each post
                    const postsWithComments = await Promise.all(
                        response.data.map(async (post) => {
                            try {
                                const postDetail = await api.getForumPost(post.id);
                                if (postDetail && postDetail.success && postDetail.data) {
                                    return postDetail.data;
                                }
                                return post;
                            } catch (error) {
                                console.error(`Error loading post ${post.id}:`, error);
                                return post;
                            }
                        })
                    );
                    state.posts = postsWithComments;
                    renderPosts();
                }
            } else {
                // Fallback to sample data if API not available
                state.posts = [...samplePosts];
                renderPosts();
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            showToast('Không thể tải bài viết. Vui lòng thử lại.', 'error');
            // Fallback to sample data
            state.posts = [...samplePosts];
            renderPosts();
        }
    }

    function renderPosts() {
        if (!elements.postsList) return;

        // Posts are already filtered by API, just render them
        const filtered = state.posts;

        if (filtered.length === 0) {
            elements.postsList.innerHTML = `<div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>Chưa có bài nào phù hợp</h3>
                <p>Hãy chọn bộ lọc khác hoặc tạo bài viết mới để mở đầu cuộc trò chuyện.</p>
            </div>`;
            return;
        }

        elements.postsList.innerHTML = filtered.map(post => `
            <article class="post-card" data-id="${post.id}">
                <header class="post-header">
                    <div class="author-info">
                        <div class="author-avatar">${getInitial(post.author)}</div>
                        <div class="author-meta">
                            <p>${escapeHtml(post.author)}</p>
                            <span class="role-badge ${post.role}">${formatRole(post.role)}</span>
                        </div>
                    </div>
                    <div class="post-meta">
                        <span class="category-badge">${getCategoryLabel(post.category)}</span>
                        <time>${formatDate(post.createdAt)}</time>
                    </div>
                </header>
                <div class="post-content">
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.content)}</p>
                </div>
                <div class="post-tags">
                    ${(post.tags || []).map(tag => `<span>#${escapeHtml(tag.trim())}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <button class="like-btn" data-id="${post.id}">
                        <span>👍</span> <span>${post.likes || 0}</span>
                    </button>
                    <button class="comment-toggle" data-id="${post.id}">
                        <span>💬</span> <span>${(post.comments && post.comments.length) || 0} bình luận</span>
                    </button>
                </div>
                <div class="comments-section" data-id="${post.id}" style="display: none;">
                    ${(post.comments && post.comments.length > 0) ? post.comments.map(comment => `
                        <div class="comment">
                            <div class="comment-meta">
                                <strong>${escapeHtml(comment.author)}</strong>
                                <span class="role-badge ${comment.role}">${formatRole(comment.role)}</span>
                                <time>${formatRelativeTime(comment.createdAt)}</time>
                            </div>
                            <p>${escapeHtml(comment.content)}</p>
                        </div>
                    `).join('') : ''}
                    <form class="comment-form" data-id="${post.id}">
                        <textarea placeholder="Gửi bình luận của bạn..." required></textarea>
                        <button type="submit">Gửi</button>
                    </form>
                </div>
            </article>
        `).join('');

        attachPostEvents();
    }

    function attachPostEvents() {
        elements.postsList.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    showToast('Vui lòng đăng nhập để thích bài viết.', 'error');
                    return;
                }

                // Reload user if not loaded yet
                if (!state.currentUser) {
                    await loadCurrentUser();
                    if (!state.currentUser) {
                        showToast('Vui lòng đăng nhập để thích bài viết.', 'error');
                        return;
                    }
                }
                
                const id = btn.dataset.id;
                try {
                    if (typeof api !== 'undefined' && api.likeForumPost) {
                        const response = await api.likeForumPost(id);
                        if (response && response.success) {
                            const post = state.posts.find(p => p.id === id);
                            if (post) {
                                post.likes = response.likesCount || post.likes || 0;
                                btn.querySelector('span:last-child').textContent = post.likes;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error liking post:', error);
                    showToast('Không thể thích bài viết. Vui lòng thử lại.', 'error');
                }
            });
        });

        elements.postsList.querySelectorAll('.comment-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const commentsSection = elements.postsList.querySelector(`.comments-section[data-id="${id}"]`);
                if (commentsSection) {
                    const isVisible = commentsSection.style.display !== 'none';
                    commentsSection.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) {
                        commentsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });

        elements.postsList.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                // Check if user is logged in
                const token = localStorage.getItem('bookverse_token');
                if (!token) {
                    showToast('Vui lòng đăng nhập để bình luận.', 'error');
                    return;
                }

                // Reload user if not loaded yet
                if (!state.currentUser) {
                    await loadCurrentUser();
                    if (!state.currentUser) {
                        showToast('Vui lòng đăng nhập để bình luận.', 'error');
                        return;
                    }
                }
                
                const id = form.dataset.id;
                const textarea = form.querySelector('textarea');
                const content = textarea.value.trim();
                if (!content) return;

                try {
                    if (typeof api !== 'undefined' && api.addForumComment) {
                        const response = await api.addForumComment(id, content);
                        if (response && response.success && response.data) {
                            const post = state.posts.find(p => p.id === id);
                            if (post) {
                                if (!post.comments) post.comments = [];
                                post.comments.push(response.data);
                                renderPosts();
                                showToast('Bình luận thành công!', 'success');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error adding comment:', error);
                    showToast('Không thể gửi bình luận. Vui lòng thử lại.', 'error');
                }
                
                textarea.value = '';
            });
        });
    }

    function bindEvents() {
        if (elements.postForm) {
            elements.postForm.addEventListener('submit', handlePostSubmit);
        }
        elements.filterCategory?.addEventListener('change', (e) => {
            state.filter.category = e.target.value;
            loadPosts();
        });
        elements.filterRole?.addEventListener('change', (e) => {
            state.filter.role = e.target.value;
            loadPosts();
        });
        elements.filterSearch?.addEventListener('input', debounce((e) => {
            state.filter.search = e.target.value;
            loadPosts();
        }, 500));
        elements.scrollToComposer?.addEventListener('click', () => {
            elements.composerCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        elements.reportBtn?.addEventListener('click', () => {
            showToast('Hãy gửi email đến community@bookverse.vn kèm đường link bài viết cần báo cáo.', 'info');
        });
        elements.openFAQ?.addEventListener('click', () => {
            showToast('FAQ sẽ sớm được cập nhật. Tạm thời bạn có thể hỏi trực tiếp admin trong diễn đàn.', 'info');
        });
    }

    function buildLoginUrl() {
        const baseUrl = '../../pages/auth/login.php';
        const currentPath = window.location.pathname + window.location.search;
        const encoded = encodeURIComponent(currentPath);
        return `${baseUrl}?returnUrl=${encoded}`;
    }

    function redirectToLogin() {
        window.location.href = buildLoginUrl();
    }

    async function handlePostSubmit(event) {
        event.preventDefault();
        
        // Check if user is logged in - check both token and currentUser
        const token = localStorage.getItem('bookverse_token');
        if (!token) {
            showToast('Vui lòng đăng nhập để đăng bài viết.', 'error');
            redirectToLogin();
            return;
        }

        // Reload user if not loaded yet
        if (!state.currentUser) {
            await loadCurrentUser();
            if (!state.currentUser) {
                showToast('Vui lòng đăng nhập để đăng bài viết.', 'error');
                redirectToLogin();
                return;
            }
        }
        
        const formData = new FormData(event.target);
        const postData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            tags: (formData.get('tags') || '').split(',').map(tag => tag.trim()).filter(Boolean).join(',')
        };

        if (!postData.tags) {
            postData.tags = 'bookverse';
        }

        try {
            if (typeof api !== 'undefined' && api.createForumPost) {
                const response = await api.createForumPost(postData);
                if (response && response.success && response.data) {
                    // Reload posts to get the new one
                    await loadPosts();
                    await loadStats();
                    event.target.reset();
                    showToast('Đăng bài thành công! Bài viết của bạn đã xuất hiện trong danh sách.', 'success');
                    // Scroll to top of posts
                    elements.postsList?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                showToast('Chức năng đăng bài chưa sẵn sàng. Vui lòng thử lại sau.', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showToast('Không thể đăng bài. Vui lòng thử lại.', 'error');
        }
    }

    function getDisplayName() {
        // Try to get name from current user first
        if (state.currentUser) {
            if (state.currentUser.profile) {
                const firstName = state.currentUser.profile.firstName || '';
                const lastName = state.currentUser.profile.lastName || '';
                if (firstName || lastName) {
                    return `${firstName} ${lastName}`.trim();
                }
            }
            if (state.currentUser.username) {
                return state.currentUser.username;
            }
        }
        
        // Fallback to header display name
        const el = document.getElementById('userDisplayName');
        if (el) {
            const text = el.textContent.trim();
            if (text && text.toLowerCase() !== 'tài khoản') {
                return text;
            }
        }
        return 'Thành viên mới';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getInitial(name) {
        if (!name) return 'U';
        return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
    }

    function formatRole(role) {
        if (role === 'seller') return 'Seller';
        if (role === 'admin') return 'Admin';
        return 'User';
    }

    function getCategoryLabel(key) {
        const map = {
            'review': 'Review sách',
            'discussion': 'Thảo luận',
            'sell-tips': 'Kinh nghiệm bán sách',
            'request': 'Tìm sách / gợi ý',
            'news': 'Tin tức & sự kiện'
        };
        return map[key] || key;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatRelativeTime(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMinutes = Math.round(diffMs / 60000);
        if (diffMinutes < 1) return 'Vừa xong';
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} giờ trước`;
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays} ngày trước`;
    }

    async function loadModerators() {
        try {
            if (typeof api !== 'undefined' && api.getForumModerators) {
                const response = await api.getForumModerators();
                if (response && response.success && response.data) {
                    renderModerators(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading moderators:', error);
        }
    }

    function renderModerators(moderators) {
        const moderatorList = document.querySelector('.moderator-list');
        if (!moderatorList || !moderators || moderators.length === 0) return;

        moderatorList.innerHTML = moderators.map(mod => {
            const initial = getInitial(mod.name);
            const avatarClass = mod.role === 'admin' ? 'admin' : mod.role === 'seller' ? 'seller' : 'user';
            return `
                <div class="moderator">
                    <div class="avatar ${avatarClass}">${initial}</div>
                    <div>
                        <p class="mod-name">${escapeHtml(mod.name)}</p>
                        <p class="mod-role">${escapeHtml(mod.roleLabel)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function loadFeatured() {
        try {
            if (typeof api !== 'undefined' && api.getForumFeatured) {
                const response = await api.getForumFeatured();
                if (response && response.success && response.data) {
                    renderFeatured(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading featured posts:', error);
        }
    }

    function renderFeatured(featured) {
        const highlightList = document.getElementById('highlightList');
        if (!highlightList || !featured || featured.length === 0) return;

        highlightList.innerHTML = featured.map(post => {
            const roleLabel = post.roleLabel === 'admin' ? 'admin' 
                : post.roleLabel === 'seller' ? 'seller' 
                : 'user';
            return `
                <li>
                    <strong>${escapeHtml(post.title)}</strong>
                    <span>${post.commentsCount} bình luận • bởi <em>${roleLabel}</em></span>
                </li>
            `;
        }).join('');
    }

    function debounce(fn, delay = 200) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    init();
});

