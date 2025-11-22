const postsData = [
  {
    title: 'Bookverse: Hệ sinh thái sách toàn diện cho độc giả Việt',
    description: 'Từ mua sắm đến trao đổi sách cũ, Bookverse giúp bạn kết nối với cộng đồng yêu sách mọi lúc mọi nơi.',
    category: 'Hệ sinh thái',
    author: 'Bookverse Studio',
    date: '12 Mar 2024',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-he-sinh-thai.html'
  },
  {
    title: 'Vì sao Bookverse.vn là lựa chọn đáng tin hơn sàn TMĐT chung?',
    description: 'Nền tảng được tối ưu riêng cho ngành sách với kiểm duyệt nội dung, kho dữ liệu metadata chuẩn xuất bản.',
    category: 'Phân tích',
    author: 'Mai Trân',
    date: '10 Mar 2024',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=60',
    href: 'posts/vi-sao-bookverse-dang-tin.html'
  },
  {
    title: 'Bookverse Marketplace bảo vệ tác giả như thế nào?',
    description: 'Cơ chế royalty minh bạch và báo cáo realtime giúp tác giả theo dõi doanh thu từng tựa sách.',
    category: 'Tác giả',
    author: 'Loan Trần',
    date: '08 Mar 2024',
    readingTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1473755504818-b72b6dfdc226?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-bao-ve-tac-gia.html'
  },
  {
    title: 'Bookverse Fulfillment: giao sách nhanh trong 2h nội thành',
    description: 'Mạng lưới đối tác logistics chuyên sách giúp hạn chế rủi ro móp gáy và giao hàng đúng lịch.',
    category: 'Vận hành',
    author: 'Bookverse Ops',
    date: '05 Mar 2024',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-fulfillment.html'
  },
  {
    title: 'Bookverse Club: cộng đồng review sách chuẩn mực',
    description: 'Thuật toán phát hiện spam và badge cho reviewer chất lượng tạo nên nguồn tham khảo đáng tin.',
    category: 'Cộng đồng',
    author: 'Mai Anh',
    date: '02 Mar 2024',
    readingTime: '3 phút',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-club.html'
  },
  {
    title: 'Bảo chứng sách thật 100% trên Bookverse',
    description: 'Chuỗi kiểm định ISBN và partner trực tiếp với NXB giúp loại bỏ sách lậu ngay từ khâu đăng bán.',
    category: 'Niềm tin',
    author: 'Thuận Lê',
    date: '28 Feb 2024',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bao-chung-sach-that.html'
  },
  {
    title: 'Trải nghiệm dark mode đầu tiên cho sàn sách Bookverse',
    description: 'Độc giả có thể đọc review dài hàng giờ mà không mỏi mắt nhờ giao diện tương phản mềm.',
    category: 'UX/UI',
    author: 'Tùng Đỗ',
    date: '25 Feb 2024',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-dark-mode.html'
  },
  {
    title: '10 điểm khác biệt của Bookverse so với chợ điện tử truyền thống',
    description: 'Từ kho dữ liệu phong phú đến chương trình xuất bản độc quyền, đây là lý do thương hiệu nổi bật.',
    category: 'So sánh',
    author: 'Bookverse Studio',
    date: '21 Feb 2024',
    readingTime: '8 phút',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=60',
    href: 'posts/muoi-diem-khac-biet.html'
  },
  {
    title: 'Hướng dẫn nhà bán mở gian hàng trên Bookverse store',
    description: '5 bước đơn giản để đồng bộ kho sách, thiết lập chính sách và kích hoạt chiến dịch quảng bá.',
    category: 'Seller',
    author: 'Minh Đức',
    date: '18 Feb 2024',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=60',
    href: 'posts/huong-dan-nha-ban.html'
  },
  {
    title: 'Bookverse Ads: công cụ quảng bá sách cá nhân hoá',
    description: 'AI gợi ý nhóm độc giả phù hợp và đo lường chuyển đổi theo từng chiến dịch cụ thể.',
    category: 'Marketing',
    author: 'Lan Chi',
    date: '15 Feb 2024',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-ads.html'
  },
  {
    title: 'Bookverse Lending: trao đổi sách cũ an toàn',
    description: 'Hợp đồng số và ký quỹ giúp người mượn và người cho mượn đều yên tâm.',
    category: 'Chia sẻ',
    author: 'Song Ngân',
    date: '12 Feb 2024',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-lending.html'
  },
  {
    title: 'Số hoá tủ sách cá nhân với Bookverse Cloud',
    description: 'Lưu giữ ghi chú, đánh dấu trang và trích dẫn để chia sẻ cùng bạn đọc khác.',
    category: 'Sản phẩm',
    author: 'Bookverse Lab',
    date: '10 Feb 2024',
    readingTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-cloud.html'
  },
  {
    title: 'Vì sao nên mở pre-order trên Bookverse?',
    description: 'Công cụ dự báo nhu cầu giúp giảm rủi ro in dư và tối ưu dòng tiền cho NXB.',
    category: 'Kinh doanh',
    author: 'Khải Trần',
    date: '08 Feb 2024',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1474861644511-0f2775ae97cc?auto=format&fit=crop&w=900&q=60',
    href: 'posts/preorder-bookverse.html'
  },
  {
    title: 'Bookverse Data Lab: hiểu độc giả hơn từng ngày',
    description: 'Dashboard hành vi đọc cho phép NXB đưa ra quyết định nội dung nhanh chóng.',
    category: 'Dữ liệu',
    author: 'Data Team',
    date: '05 Feb 2024',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-data-lab.html'
  },
  {
    title: 'Chương trình Bookverse Care dành cho phụ huynh',
    description: 'Gợi ý sách thiếu nhi, thời lượng đọc và bộ câu hỏi đồng hành cùng con.',
    category: 'Gia đình',
    author: 'Phương Hoa',
    date: '03 Feb 2024',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-care.html'
  },
  {
    title: 'Bookverse Podcast: gặp gỡ tác giả mỗi tuần',
    description: 'Livestream trực tiếp từ studio và lưu trữ trên app để bạn nghe lại bất cứ lúc nào.',
    category: 'Nội dung',
    author: 'Bookverse Media',
    date: '30 Jan 2024',
    readingTime: '3 phút',
    image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-podcast.html'
  },
  {
    title: 'Bookverse Academy hỗ trợ nhà bán mới',
    description: 'Chuỗi workshop cùng chuyên gia xuất bản giúp tăng trưởng doanh số bền vững.',
    category: 'Đào tạo',
    author: 'Academy Team',
    date: '27 Jan 2024',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-academy.html'
  },
  {
    title: 'Bookverse bảo vệ môi trường ra sao?',
    description: 'Bao bì tái chế và chương trình thu hồi sách cũ giúp giảm 32% rác thải giấy mỗi năm.',
    category: 'Bền vững',
    author: 'Green Squad',
    date: '24 Jan 2024',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-green.html'
  },
  {
    title: 'Bookverse Pay và chính sách trả góp 0%',
    description: 'Độc giả dễ dàng sở hữu combo sách giá trị lớn với phương án thanh toán linh hoạt.',
    category: 'Tài chính',
    author: 'Fintech Lab',
    date: '20 Jan 2024',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-pay.html'
  },
  {
    title: 'Bookverse Retail: mở pop-up bookstore trong 7 ngày',
    description: 'Gói giải pháp turnkey giúp thương hiệu mở cửa hàng trải nghiệm nhanh chóng.',
    category: 'Mở rộng',
    author: 'Retail Lab',
    date: '17 Jan 2024',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-retail.html'
  },
  {
    title: 'BookverseVN.store: kế hoạch 2024 và tầm nhìn dài hạn',
    description: 'Tập trung vào dữ liệu, trải nghiệm cá nhân hóa và mở rộng mạng lưới đối tác quốc tế.',
    category: 'Chiến lược',
    author: 'CEO Desk',
    date: '15 Jan 2024',
    readingTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1486825586573-7131f7991bdd?auto=format&fit=crop&w=900&q=60',
    href: 'posts/bookverse-strategy-2024.html'
  }
];

const THEME_KEY = 'bookverse-theme';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  renderPosts();
});

function initThemeToggle() {
  const root = document.documentElement;
  const stored = localStorage.getItem(THEME_KEY);
  const theme = stored || 'light';
  root.setAttribute('data-theme', theme);

  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  setToggleLabel(toggle, theme);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    setToggleLabel(toggle, next);
  });
}

function setToggleLabel(button, theme) {
  button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

function renderPosts() {
  const grid = document.querySelector('[data-post-grid]');
  if (!grid || !Array.isArray(postsData)) return;

  grid.innerHTML = postsData
    .map(
      (post) => `
        <article class="post-card">
          <a href="${post.href}">
            <img src="${post.image}" alt="${post.title}">
          </a>
          <div class="tag">${post.category}</div>
          <h3><a href="${post.href}">${post.title}</a></h3>
          <p>${post.description}</p>
          <div class="post-meta">
            <span>${post.author}</span>
            <span>${post.date} • ${post.readingTime}</span>
          </div>
        </article>
      `
    )
    .join('');

  const heroImage = document.querySelector('[data-hero-image]');
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroSummary = document.querySelector('[data-hero-summary]');
  const heroLink = document.querySelector('[data-hero-link]');

  if (postsData.length && heroImage && heroTitle && heroSummary && heroLink) {
    const feature = postsData[0];
    heroImage.src = feature.image;
    heroImage.alt = feature.title;
    heroTitle.textContent = feature.title;
    heroSummary.textContent = feature.description;
    heroLink.href = feature.href;
  }
}
