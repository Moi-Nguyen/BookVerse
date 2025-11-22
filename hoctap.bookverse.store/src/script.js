const postsData = [
  {
    slug: 'ban-do-binh-an-trong-nha',
    title: 'Bản đồ bình an trong nhà',
    description: 'Bố trí góc học tập với ba lớp thân - tâm - trí để tái tạo năng lượng cho một tuần bận rộn.',
    intro: 'Bài hướng dẫn gợi bạn quan sát căn hộ hiện tại, chọn 3 điểm dừng và thêm những tín hiệu nhỏ giúp nhắc mình quay lại với hơi thở.',
    category: 'Nghi thức tại gia',
    author: 'Minh Tịnh',
    date: '12 Nov 2025',
    readingTime: '8 phút',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Bảng nhịp thở sáng - chiều với ba trạng thái của cơ thể.',
      'Góc ánh sáng ấm cùng một vật nhỏ tượng trưng cho sự bình an.',
      'Ngăn lưu trữ “không màn hình” để mắt được nghỉ trước 22h.'
    ],
    practices: [
      'Vẽ sơ đồ căn phòng, đánh dấu ba điểm giúp bạn kéo lại sự tỉnh thức trong ngày.',
      'Đặt chuông nhẹ lúc 19:30 để bắt đầu thu dọn và hạ nhịp, không dùng chuông báo gắt.',
      'Viết một câu hỏi phản tư, bỏ vào hộp gỗ và đọc lại vào tối Chủ nhật.'
    ],
    mantra: 'Khi biết mình đang đứng ở đâu, tôi mới chọn được bước tiếp theo.'
  },
  {
    slug: 'buoi-sang-tinh-thuc-10-phut',
    title: 'Buổi sáng tỉnh thức 10 phút',
    description: 'Chuỗi kéo giãn - viết tay - đặt ý định giúp bạn mở ngày mới mà không cần chạm điện thoại.',
    intro: 'Không phải ai cũng có một giờ thiền, nhưng 10 phút đầu ngày vẫn đủ để nói lời chào với cơ thể và sắp hàng lại điều quan trọng.',
    category: 'Nghi lễ buổi sáng',
    author: 'Thu Hà',
    date: '10 Nov 2025',
    readingTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Đặt bình nước ấm cạnh giường để nhắc uống đầu tiên.',
      'Chuẩn bị sổ tay “ba dòng” và bút đã mở sẵn trang.',
      'Danh sách câu hỏi gợi ý định hình ý định trong tuần.'
    ],
    practices: [
      '2 phút vươn người, xoay vai và chào mặt trời ngay tại giường.',
      '3 phút viết tay: hôm nay cơ thể cần gì - cảm xúc đang ở đâu - điều tôi muốn giữ.',
      '5 phút nhắm mắt, đọc thầm ý định và hẹn giờ nhắc lại vào buổi trưa.'
    ],
    mantra: 'Tôi cho phép mình bắt đầu ngày mới bằng nhịp điệu chậm rãi.'
  },
  {
    slug: 'don-dep-tam-tri-cuoi-tuan',
    title: 'Dọn dẹp tâm trí cuối tuần',
    description: 'Nghi thức “lau bụi cảm xúc” bằng checklist nhỏ giúp bạn đóng lại tuần cũ và làm mới năng lượng.',
    intro: 'Một buổi chiều Chủ nhật chậm rãi đủ để nhìn lại lịch trình, cảm ơn điều đã qua và chọn thứ cần để lại.',
    category: 'Chăm sóc cảm xúc',
    author: 'Linh Chi',
    date: '09 Nov 2025',
    readingTime: '9 phút',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Một trang “đã xảy ra” ghi lại 5 khoảnh khắc trong tuần.',
      'Hộp lưu giữ giấy tờ, biên nhận và lời nhắn cần trả lời.',
      'Playlist nhẹ 20 phút giúp giữ nhịp hơi thở khi dọn.'
    ],
    practices: [
      'Gom mọi giấy tờ đang rải trên bàn, chia thành làm ngay / lưu trữ / vứt đi.',
      'Vẽ lại biểu đồ cảm xúc tuần bằng 3 màu: sáng, trưa, tối.',
      'Viết thư cảm ơn một người đã giúp bạn bình an hơn, gửi hoặc giữ tùy ý.'
    ],
    mantra: 'Khi dọn gọn bên ngoài, tâm trí tôi cũng có thêm khoảng thở.'
  },
  {
    slug: 'lang-nghe-tieng-noi-ben-trong',
    title: 'Lắng nghe tiếng nói bên trong',
    description: 'Thực hành ghi âm thủ thỉ giúp bạn bước ra khỏi vòng lặp phán xét và nghe rõ nhu cầu thật.',
    intro: 'Âm thanh của chính mình là tấm bản đồ tinh tế nhất. Khi nghe lại, bạn sẽ biết chỗ nào đang cần hơi ấm.',
    category: 'Viết phản tư',
    author: 'Minh Tịnh',
    date: '08 Nov 2025',
    readingTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Ứng dụng ghi âm gọn gàng với thư mục “Private”.',
      'Tai nghe chụp tai giúp tạo bong bóng riêng tư.',
      'Danh sách 5 câu hỏi mở để bắt đầu cuộc trò chuyện.'
    ],
    practices: [
      'Thu âm 5 phút mỗi tối khi đèn đã tắt, nói như đang kể cho bản thân 10 tuổi.',
      'Nghe lại bản thu vào Chủ nhật, gạch chân cụm từ lặp lại nhiều nhất.',
      'Viết một hành động nhỏ đáp lại nhu cầu mà bạn nghe được.'
    ],
    mantra: 'Tiếng nói bên trong luôn ở đó, chỉ cần tôi đủ yên để lắng nghe.'
  },
  {
    slug: 'nghe-thuat-nghi-ngoi-co-chu-dich',
    title: 'Nghệ thuật nghỉ ngơi có chủ đích',
    description: 'Bảng menu nghỉ ngơi giúp bạn phân biệt giữa “né tránh” và “bồi đắp” sức sống.',
    intro: 'Nghỉ không chỉ là nằm dài trên giường. Bài viết gợi ý 4 loại nghỉ ngơi để bạn chọn đúng loại cơ thể đang cần.',
    category: 'Chăm sóc thân thể',
    author: 'An Nhiên',
    date: '06 Nov 2025',
    readingTime: '10 phút',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Bảng phân loại 4 nhóm nghỉ: thể chất, tinh thần, cảm xúc, sáng tạo.',
      'Chuông báo “micro break” 3 lần/ngày.',
      'Nhật ký mini để ghi cảm giác trước và sau khi nghỉ.'
    ],
    practices: [
      'Đặt lịch nghỉ 7 phút sau mỗi 90 phút làm việc, chọn một hoạt động không màn hình.',
      'Thử một nghi thức nghỉ sáng tạo: vẽ nguệch ngoạc, nhảy nhỏ trong phòng, hoặc nặn đất sét.',
      'Chấm điểm mức sạc lại (1-5) để hiểu loại nghỉ nào hiệu quả với bạn.'
    ],
    mantra: 'Nghỉ ngơi cũng là một hành động nghiêm túc nuôi dưỡng bản thân.'
  },
  {
    slug: 'gioi-han-lanh-manh-voi-the-gioi-so',
    title: 'Giới hạn lành mạnh với thế giới số',
    description: 'Thiết lập ranh giới mềm với điện thoại để bạn có mặt trọn vẹn hơn trong đời thật.',
    intro: 'Chỉ cần ba nghi thức nhỏ: chốt giờ offline, vùng không thiết bị và nhật ký cảm xúc sau khi lướt mạng.',
    category: 'Vệ sinh số',
    author: 'Thảo Nguyên',
    date: '05 Nov 2025',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Một chiếc hộp cho điện thoại sau 22h.',
      'Widget hiển thị tổng thời gian dùng màn hình ngay tại trang chủ.',
      'Lịch “Digital Sabbath” cố định mỗi tuần.'
    ],
    practices: [
      'Chọn hai khung giờ offline cố định và thông báo cho người thân.',
      'Đặt câu hỏi “tôi muốn tìm điều gì?” trước khi mở ứng dụng xã hội.',
      'Ghi lại cảm xúc sau 5 phút lướt, để ý tín hiệu mệt mỏi hoặc hứng khởi.'
    ],
    mantra: 'Khi ranh giới rõ ràng, sự hiện diện của tôi trở nên trọn vẹn hơn.'
  },
  {
    slug: 'viet-thu-cho-chinh-minh-muoi-nam',
    title: 'Viết thư cho chính mình mười năm',
    description: 'Gửi một lá thư tới bản thân trong tương lai để nhắc lại điều đáng giữ và điều có thể buông.',
    intro: 'Thư tay giúp bạn ghi lại mạch cảm xúc dài hơn mạng xã hội. Đây là chiếc neo dịu dàng giữa những biến động.',
    category: 'Viết tay chậm',
    author: 'Triều An',
    date: '04 Nov 2025',
    readingTime: '11 phút',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Bộ văn phòng phẩm ưa thích và phong bì dày.',
      'Danh sách mốc thời gian quan trọng đã qua.',
      'Ứng dụng gửi thư tương lai hoặc hộp khóa cá nhân.'
    ],
    practices: [
      'Viết hai đoạn: “Tôi đang biết ơn điều gì” và “Tôi mong muốn điều gì vẫn còn”.',
      'Gửi thư đến một dịch vụ lưu giữ 5-10 năm hoặc tự đặt lịch mở lại.',
      'Khi nhận lại, viết thêm chú thích mới để thấy hành trình trưởng thành.'
    ],
    mantra: 'Thời gian không lấy đi điều gì nếu tôi chủ động ghi nhớ nó.'
  },
  {
    slug: 'thien-tho-5-phut-noi-cong-so',
    title: 'Thiền thở 5 phút nơi công sở',
    description: 'Bài thực hành dùng hơi thở hình hộp để cân bằng lại thần kinh giữa giờ làm.',
    intro: 'Ngồi ngay tại bàn làm việc nhưng vẫn có thể trở về với cơ thể bằng 3 vòng thở box breathing 4-4-4-4.',
    category: 'Làm việc tỉnh thức',
    author: 'AnyF Lab',
    date: '03 Nov 2025',
    readingTime: '4 phút',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Chuông nhắc mỗi 90 phút để nghỉ thở.',
      'Thẻ hướng dẫn box breathing đặt trên bàn.',
      'Ghế ngồi được điều chỉnh để bàn chân chạm đất.'
    ],
    practices: [
      'Hít vào 4 nhịp, giữ 4 nhịp, thở ra 4 nhịp và giữ 4 nhịp, lặp lại 5 vòng.',
      'Đặt tay lên bụng để cảm nhận chuyển động của hơi thở.',
      'Ghi chú ba từ mô tả trạng thái sau bài thở và so sánh cuối ngày.'
    ],
    mantra: 'Hơi thở đều là tín hiệu cho bộ não biết rằng tôi an toàn.'
  },
  {
    slug: 'uong-nuoc-cham-de-tinh-tam',
    title: 'Uống nước chậm để tĩnh tâm',
    description: 'Chiếc ly nước sáng có thể trở thành bài thiền nhỏ giúp bạn quan sát cơ thể.',
    intro: 'Thay vì xem việc uống nước là nhiệm vụ, hãy coi đó là nghi thức dừng lại và cảm nhận sự sống chảy qua.',
    category: 'Thực hành vi mô',
    author: 'Lan Vy',
    date: '02 Nov 2025',
    readingTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Ly thủy tinh riêng cho nghi thức uống chậm.',
      'Ứng dụng đếm ngược 60 giây.',
      'Tờ sticker ghi câu hỏi: “Nước đi đến đâu trong tôi?”'
    ],
    practices: [
      'Đổ một ly nước ấm, cầm bằng hai tay và hít sâu trước khi uống.',
      'Chia ly nước thành ba ngụm, mỗi ngụm nuốt xong thì đặt ly xuống cảm nhận.',
      'Kết thúc bằng việc đặt tay lên bụng và cảm ơn cơ thể vì đã cùng mình đi tiếp.'
    ],
    mantra: 'Tôi có thể quay về với hiện tại thông qua từng ngụm nước nhẹ nhàng.'
  },
  {
    slug: 'tri-an-nhung-nguoi-thuong',
    title: 'Tri ân những người thương',
    description: 'Lập danh sách tri ân theo mùa để nhắc mình gửi lời cảm ơn đúng lúc.',
    intro: 'Lòng biết ơn không chỉ là cảm xúc thoáng qua. Khi viết xuống, nó trở thành sợi dây kết nối bạn với cộng đồng.',
    category: 'Kết nối',
    author: 'Hoàng Hân',
    date: '01 Nov 2025',
    readingTime: '7 phút',
    image: 'assets/images/ads/bookverse-podcast.jpg',
    pillars: [
      'Bảng tên theo mùa: gia đình, đồng nghiệp, bản thân, người lạ tử tế.',
      'Bộ postcard hoặc email template ngắn gọn.',
      'Quỹ thời gian 30 phút vào tối Chủ nhật.'
    ],
    practices: [
      'Chọn 3 người/tuần để viết lời cảm ơn cụ thể về điều họ mang đến.',
      'Gửi đi ngay khi viết xong để không kịp “ngại”.',
      'Cuối tháng đọc lại câu trả lời để nuôi dưỡng cảm giác được nâng đỡ.'
    ],
    mantra: 'Khi trao đi lòng biết ơn, tôi cũng nhận lại nhiều bình an.'
  },
  {
    slug: 'thoat-khoi-can-benh-hoan-hao',
    title: 'Thoát khỏi căn bệnh hoàn hảo',
    description: 'Bộ câu hỏi phản tư giúp bạn dừng việc tự phán xét và chọn điều quan trọng nhất lúc này.',
    intro: 'Hoàn hảo là chiếc áo quá chật. Bài viết giúp bạn thay bằng trang phục vừa vặn với năng lượng hôm nay.',
    category: 'Tâm lý ứng dụng',
    author: 'Uyên Lam',
    date: '30 Oct 2025',
    readingTime: '12 phút',
    image: 'https://images.unsplash.com/photo-1497294815431-9365093b7331?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      'Checklist “đủ tốt” với tối đa ba tiêu chí.',
      'Đồng hồ cát 15 phút để neo thời gian thực hiện.',
      'Bạn đồng hành để nhắn tin nhắc nhở.'
    ],
    practices: [
      'Trước khi bắt đầu dự án, trả lời ba câu: Vì sao tôi làm? Điều gì đủ tốt? Tôi sẽ dừng ở đâu?',
      'Khi thấy muốn sửa lần thứ n, quay lại đọc checklist “đủ tốt”.',
      'Tặng mình một hành động ăn mừng nhỏ ngay khi hoàn thành mốc đã định.'
    ],
    mantra: 'Đủ tốt hôm nay sẽ mở đường cho những phiên bản tốt hơn ngày mai.'
  }
];

const THEME_KEY = 'bookverse-theme';
let filteredPosts = [...postsData];

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSearch();
  initAds();
  renderPosts(filteredPosts);
  renderSinglePost();
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

function initSearch() {
  const input = document.querySelector('[data-search-input]');
  const resultText = document.querySelector('[data-search-result]');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim();
    filteredPosts = filterPosts(query);
    renderPosts(filteredPosts);

    if (resultText) {
      if (!query) {
        resultText.textContent = '';
      } else if (filteredPosts.length) {
        resultText.textContent = `Tìm thấy ${filteredPosts.length} bài học cho "${query}".`;
      } else {
        resultText.textContent = `Không có bài học nào phù hợp với "${query}".`;
      }
    }
  });
}

function filterPosts(query) {
  if (!query) return [...postsData];
  const needle = normalizeText(query);

  return postsData.filter((post) => {
    return ['title', 'description', 'category', 'author'].some((key) =>
      normalizeText(post[key]).includes(needle)
    );
  });
}

function normalizeText(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function initAds() {
  const closeButtons = document.querySelectorAll('[data-ad-close]');

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('[data-ad-panel]');
      if (panel) {
        panel.classList.add('is-hidden');
      }
    });
  });
}

function renderPosts(dataset = postsData) {
  const grid = document.querySelector('[data-post-grid]');
  if (!grid || !Array.isArray(dataset)) return;

  if (!dataset.length) {
    grid.innerHTML = '<p>Chưa có bài học nào phù hợp.</p>';
    return;
  }

  grid.innerHTML = dataset
    .map(
      (post) => `
        <article class="post-card">
          <a href="post.html?slug=${post.slug}">
            <img src="${post.image}" alt="${post.title}">
          </a>
          <div class="tag">${post.category}</div>
          <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
          <p>${post.description}</p>
          <div class="post-meta">
            <span>${post.author}</span>
            <span>${post.date} · ${post.readingTime}</span>
          </div>
        </article>
      `
    )
    .join('');

  const heroImage = document.querySelector('[data-hero-image]');
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroSummary = document.querySelector('[data-hero-summary]');
  const heroLink = document.querySelector('[data-hero-link]');

  if (dataset.length && heroImage && heroTitle && heroSummary && heroLink) {
    const feature = dataset[0];
    heroImage.src = feature.image;
    heroImage.alt = feature.title;
    heroTitle.textContent = feature.title;
    heroSummary.textContent = feature.description;
    heroLink.href = `post.html?slug=${feature.slug}`;
  }
}

function renderSinglePost() {
  const article = document.querySelector('[data-post-article]');
  if (!article) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const post = postsData.find((item) => item.slug === slug) || postsData[0];

  document.title = `Bookverse Study Hub | ${post.title}`;

  const categoryEl = document.querySelector('[data-post-category]');
  const titleEl = document.querySelector('[data-post-title]');
  const metaEl = document.querySelector('[data-post-meta]');
  const imageEl = document.querySelector('[data-post-image]');
  const introEl = document.querySelector('[data-post-intro]');
  const pillarsEl = document.querySelector('[data-post-pillars]');
  const practicesEl = document.querySelector('[data-post-practices]');
  const mantraEl = document.querySelector('[data-post-mantra]');

  if (categoryEl) categoryEl.textContent = post.category;
  if (titleEl) titleEl.textContent = post.title;
  if (metaEl) metaEl.textContent = `Đăng bởi ${post.author} · ${post.date} · ${post.readingTime}`;
  if (imageEl) {
    imageEl.src = post.image;
    imageEl.alt = post.title;
  }
  if (introEl) introEl.textContent = post.intro;
  if (pillarsEl) {
    pillarsEl.innerHTML = (post.pillars || []).map((item) => `<li>${item}</li>`).join('');
  }
  if (practicesEl) {
    practicesEl.innerHTML = (post.practices || []).map((step) => `<li>${step}</li>`).join('');
  }
  if (mantraEl) {
    mantraEl.textContent = post.mantra || '';
    mantraEl.style.display = post.mantra ? 'block' : 'none';
  }
}
