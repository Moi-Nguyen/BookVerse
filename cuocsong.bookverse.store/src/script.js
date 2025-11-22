const postsData = [
  {
    "title": "Sống chậm để hiểu mình",
    "description": "Ba nhịp thở sâu và một trang nhật ký giúp bạn trở lại với cơ thể trước khi phản ứng vô thức.",
    "category": "Triết lý sống",
    "author": "Soul Notes",
    "date": "12 Mar 2024",
    "readingTime": "8 phút",
    "image": "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/song-cham-de-hieu-minh.html"
  },
  {
    "title": "Lắng nghe tiếng nói bên trong",
    "description": "Thực hành ghi âm, viết tay và đặt câu hỏi mở để đọc vị cảm xúc nguyên bản.",
    "category": "Chánh niệm",
    "author": "Minh Tịnh",
    "date": "11 Mar 2024",
    "readingTime": "8 phút",
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/lang-nghe-tieng-noi-ben-trong.html"
  },
  {
    "title": "Tối giản cảm xúc hỗn loạn",
    "description": "Ba bước gọi tên, sắp xếp và buông bớt cảm xúc nặng nề để tâm trí thông thoáng.",
    "category": "Tối giản",
    "author": "Lan Chi",
    "date": "10 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/toi-gian-cam-xuc-hon-loan.html"
  },
  {
    "title": "Thực hành biết ơn buổi sáng",
    "description": "Nghi thức 10 phút kết hợp viết tay, chuyển động nhẹ và lời cảm ơn gửi đi.",
    "category": "Biết ơn",
    "author": "An Nhiên",
    "date": "09 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/thuc-hanh-biet-on-buoi-sang.html"
  },
  {
    "title": "Nghệ thuật nghỉ ngơi có chủ đích",
    "description": "Thiết kế menu nghỉ ngơi, phân loại mức năng lượng và bảo vệ thời gian phục hồi.",
    "category": "Tự chăm sóc",
    "author": "Thảo Vi",
    "date": "08 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/nghe-thuat-nghi-ngoi-co-chu-dich.html"
  },
  {
    "title": "Đối thoại dịu dàng với nỗi sợ",
    "description": "Áp dụng sơ đồ cảm xúc, thư trấn an và nghi thức kết thúc để nỗi sợ bớt dữ dằn.",
    "category": "Tâm lý",
    "author": "Thiên Ân",
    "date": "07 Mar 2024",
    "readingTime": "8 phút",
    "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/doi-thoai-diu-dang-voi-noi-so.html"
  },
  {
    "title": "Thiền thở 5 phút nơi công sở",
    "description": "Thiết lập góc thở, sử dụng chu trình 4-6-4 và neo cảm xúc bằng câu khẳng định.",
    "category": "Thiền thở",
    "author": "Hướng Dương",
    "date": "06 Mar 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/thien-tho-5-phut-noi-cong-so.html"
  },
  {
    "title": "Viết thư cho chính mình sau 10 năm",
    "description": "Nghi thức viết thư hướng tới tương lai để củng cố giá trị và lòng biết ơn hiện tại.",
    "category": "Viết tay",
    "author": "Thu Hà",
    "date": "05 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/viet-thu-cho-chinh-minh-muoi-nam.html"
  },
  {
    "title": "Đặt giới hạn lành mạnh với thế giới số",
    "description": "Thiết lập khung giờ offline, lọc nội dung và nuôi dưỡng sự thảnh thơi khi online.",
    "category": "Digital detox",
    "author": "An Bình",
    "date": "04 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/gioi-han-lanh-manh-voi-the-gioi-so.html"
  },
  {
    "title": "Buổi sáng tỉnh thức 10 phút",
    "description": "Công thức 10 phút gồm cảm giác, chuyển động và lời dẫn đường để khởi động ngày mới.",
    "category": "Thói quen",
    "author": "Mai Phương",
    "date": "03 Mar 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/buoi-sang-tinh-thuc-10-phut.html"
  },
  {
    "title": "Bản đồ bình an trong nhà",
    "description": "Thiết kế ba góc nhỏ: góc thở, bàn sáng tạo và kệ tri ân để nuôi dưỡng năng lượng.",
    "category": "Không gian sống",
    "author": "Gia Yên",
    "date": "02 Mar 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/ban-do-binh-an-trong-nha.html"
  },
  {
    "title": "Nghi thức buổi tối không màn hình",
    "description": "Lộ trình 30 phút gồm tắt thiết bị, chăm sóc cơ thể và thư giãn bằng giấy mực.",
    "category": "Giấc ngủ",
    "author": "Hoài An",
    "date": "01 Mar 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/nghi-thuc-buoi-toi-khong-man-hinh.html"
  },
  {
    "title": "Xử lý cảm giác tội lỗi",
    "description": "Phân biệt lỗi thực tế – lỗi tưởng tượng, rồi chuyển thành hành động chữa lành cụ thể.",
    "category": "Chữa lành",
    "author": "Tường Vy",
    "date": "29 Feb 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/xu-ly-cam-giac-toi-loi.html"
  },
  {
    "title": "Dọn dẹp tâm trí cuối tuần",
    "description": "Checklist 4 bước để gom suy nghĩ, sắp lịch và khởi động tuần mới nhẹ nhõm.",
    "category": "Tâm trí",
    "author": "Bình Minh",
    "date": "27 Feb 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/don-dep-tam-tri-cuoi-tuan.html"
  },
  {
    "title": "Thoát khỏi căn bệnh hoàn hảo",
    "description": "Bộ 3 chiến lược: đặt thời hạn thân thiện, chia bản nháp và ôm lấy phản hồi.",
    "category": "Phát triển bản thân",
    "author": "Song Kha",
    "date": "25 Feb 2024",
    "readingTime": "7 phút",
    "image": "https://images.unsplash.com/photo-1453227588063-bb302b62f50b?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/thoat-khoi-can-benh-hoan-hao.html"
  },
  {
    "title": "Uống nước chậm để tĩnh tâm",
    "description": "Biến việc uống nước thành nghi thức chánh niệm giúp kết nối thân – tâm.",
    "category": "Sức khỏe",
    "author": "Mộc Lam",
    "date": "23 Feb 2024",
    "readingTime": "5 phút",
    "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/uong-nuoc-cham-de-tinh-tam.html"
  },
  {
    "title": "Ôm lấy im lặng có ý",
    "description": "Thực hành ẩn tu mini 15 phút mỗi ngày để lắng nghe nhịp tim và tiếng vọng của linh hồn.",
    "category": "Tĩnh lặng",
    "author": "Hà Mi",
    "date": "21 Feb 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1477511801984-4ad318ed9846?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/om-lay-im-lang-co-y.html"
  },
  {
    "title": "Nghệ thuật nói không chân ái đấy",
    "description": "Gợi ý câu từ và chiến lược giúp bạn đặt ranh giới mà vẫn giữ sự tử tế.",
    "category": "Ranh giới",
    "author": "Ly Gia",
    "date": "19 Feb 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/nghe-thuat-noi-khong-chan-ai-day.html"
  },
  {
    "title": "Đi bộ chậm trong phố",
    "description": "Hành trình 20 phút giúp bạn làm thân với thành phố theo cách dịu dàng.",
    "category": "Chuyển động",
    "author": "Khải Minh",
    "date": "17 Feb 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/di-bo-cham-trong-pho.html"
  },
  {
    "title": "Tri ân những người thương",
    "description": "Gửi lời tri ân đúng lúc để nuôi dưỡng sợi dây kết nối bền vững.",
    "category": "Gắn kết",
    "author": "Thiên Ý",
    "date": "15 Feb 2024",
    "readingTime": "6 phút",
    "image": "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    "href": "posts/tri-an-nhung-nguoi-thuong.html"
  }
];

const THEME_KEY = 'bookverse-theme';
let filteredPosts = [...postsData];

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSearch();
  initAds();
  renderPosts(filteredPosts);
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
        resultText.textContent = `Tìm thấy ${filteredPosts.length} bài viết cho "${query}".`;
      } else {
        resultText.textContent = `Không có bài viết nào khớp với "${query}".`;
      }
    }
  });
}

function initAds() {
  document.querySelectorAll('[data-ad-close]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const card = button.closest('[data-ad-card]');
      if (card) {
        card.classList.add('hide');
      }
    });
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

function renderPosts(dataset = postsData) {
  const grid = document.querySelector('[data-post-grid]');
  if (!grid || !Array.isArray(dataset)) return;

  if (!dataset.length) {
    grid.innerHTML = '<p>Chưa có bài viết nào phù hợp.</p>';
    return;
  }

  grid.innerHTML = dataset
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

  if (dataset.length && heroImage && heroTitle && heroSummary && heroLink) {
    const feature = dataset[0];
    heroImage.src = feature.image;
    heroImage.alt = feature.title;
    heroTitle.textContent = feature.title;
    heroSummary.textContent = feature.description;
    heroLink.href = feature.href;
  }
}
