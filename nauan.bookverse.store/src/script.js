const postsData = [
  {
    slug: 'ca-hoi-ap-chao',
    title: 'Cá hồi áp chảo sốt chanh tỏi',
    description: 'Da giòn, thịt mềm, ăn kèm khoai baby và salad thì là.',
    intro:
      'Món ăn 25 phút với thao tác tối giản: chỉ cần 10 phút ướp và 8 phút áp chảo là có ngay bữa tối giàu đạm tốt.',
    category: 'Món chính',
    author: 'Bếp AnyF',
    date: '12 Nov 2025',
    readingTime: '25 phút',
    image: 'assets/images/recipes/ca-hoi.jpg',
    ingredients: [
      '2 phi lê cá hồi 150 g',
      '1 quả chanh vàng, 4 tép tỏi',
      '200 g khoai tây baby, đậu que',
      '2 thìa dầu ô liu, 1 thìa bơ lạt',
      'Muối biển, tiêu đen, thì là khô'
    ],
    steps: [
      'Thấm khô cá, ướp muối tiêu, vỏ chanh bào và 1 thìa dầu ô liu trong 10 phút.',
      'Áp chảo mặt da 4 phút đến khi giòn, lật mặt còn lại thêm 2 phút rồi rưới nước cốt chanh tỏi.',
      'Nướng khoai và đậu que với bơ lạt ở 200°C trong 12 phút, dọn kèm cá và sốt.'
    ],
    tips: 'Để cá chín đều, luôn đặt vào chảo khi dầu đã nóng và hạn chế di chuyển miếng cá.'
  },
  {
    slug: 'salad-ngu-sac',
    title: 'Salad ngũ sắc dầu giấm mật ong',
    description: 'Rau xanh, cam tươi và ức gà rang trộn sốt Dijon chua ngọt.',
    intro:
      'Bữa trưa nhanh dưới 10 phút nhưng vẫn đủ đạm, chất xơ và chất béo tốt nhờ hạnh nhân và bơ chín.',
    category: 'Ăn lành mạnh',
    author: 'Thảo Linh',
    date: '10 Nov 2025',
    readingTime: '10 phút',
    image: 'assets/images/recipes/salad-ngu-sac.jpg',
    ingredients: [
      '100 g xà lách xoăn và cải mầm',
      '1 quả cam vàng, 1 trái bơ chín',
      '120 g ức gà rang hoặc luộc',
      'Hạnh nhân lát, hạt bí rang',
      'Dầu ô liu, giấm táo, mật ong, mù tạt'
    ],
    steps: [
      'Pha sốt với tỷ lệ dầu ô liu : giấm táo : mật ong : mù tạt = 3:2:1:1.',
      'Bày rau, cam, bơ và gà vào tô lớn, rưới sốt rồi trộn nhẹ tay.',
      'Rắc thêm hạnh nhân, hạt bí và ít tiêu xay trước khi dùng.'
    ],
    tips: 'Có thể chuẩn bị sẵn phần sốt trong hũ kín và bảo quản lạnh 3 ngày.'
  },
  {
    slug: 'mi-y-kem-nam',
    title: 'Mì Ý kem nấm chay 15 phút',
    description: 'Nấm đùi gà xào với tỏi và hạt điều xay tạo sốt kem béo mịn.',
    intro: 'Phiên bản thuần chay không sữa bò nhưng vẫn thơm béo nhờ hạt điều ngâm mềm.',
    category: 'Ăn chay',
    author: 'Minh An',
    date: '08 Nov 2025',
    readingTime: '15 phút',
    image: 'assets/images/recipes/mi-y-nam.jpg',
    ingredients: [
      '200 g mì Ý tươi hoặc khô',
      '150 g nấm đùi gà, nấm mỡ',
      '50 g hạt điều ngâm mềm',
      '2 tép tỏi, 1 thìa dầu ô liu',
      'Muối, tiêu, lá oregano khô'
    ],
    steps: [
      'Luộc mì đến al dente, giữ lại 50 ml nước luộc.',
      'Xay hạt điều với nước luộc mì thành sốt kem, nêm muối tiêu.',
      'Xào nấm với tỏi, cho mì và sốt hạt điều vào đảo đều, thêm oregano.'
    ],
    tips: 'Nếu thích vị phô mai, thêm một muỗng men dinh dưỡng khi trộn sốt.'
  },
  {
    slug: 'meal-prep-gao-lut',
    title: 'Meal prep cơm gạo lứt 3 ngày',
    description: 'Ức gà xông khói, bông cải và khoai vàng chia sẵn 6 hộp.',
    intro:
      'Dành 60 phút cuối tuần để chuẩn bị 9 bữa ăn cân bằng, giúp bạn không phải lo bữa trưa văn phòng.',
    category: 'Meal prep',
    author: 'AnyF Lab',
    date: '06 Nov 2025',
    readingTime: '20 phút',
    image: 'assets/images/recipes/meal-prep-gao-lut.jpg',
    ingredients: [
      '300 g gạo lứt ngâm 2 giờ',
      '2 ức gà xông khói hoặc hấp chín',
      '1 bông cải xanh, 2 củ khoai vàng',
      'Sốt miso mè rang, dầu ô liu',
      'Muối, tiêu, hành lá'
    ],
    steps: [
      'Nấu gạo lứt với tỷ lệ nước 1:1.6 đến khi chín mềm.',
      'Nướng khoai và bông cải với dầu ô liu, muối tiêu ở 200°C trong 18 phút.',
      'Chia cơm, gà thái lát và rau củ vào 6 hộp, ăn kèm sốt miso khi dùng.'
    ],
    tips: 'Khi hâm cơm, rưới 1 thìa nước lọc lên bề mặt để cơm không khô.'
  },
  {
    slug: 'banh-mi-bo-toi',
    title: 'Bánh mì bơ tỏi phô mai',
    description: 'Baguette nướng ngập bơ tỏi và mozzarella kéo sợi.',
    intro: 'Món snack 10 phút giúp tận dụng bánh mì cũ nhưng vẫn thơm nức khi ra lò.',
    category: 'Ăn vặt',
    author: 'Quang Bếp',
    date: '03 Nov 2025',
    readingTime: '12 phút',
    image: 'assets/images/recipes/banh-mi-bo-toi.jpg',
    ingredients: [
      '1 ổ baguette hoặc bánh mì Việt',
      '40 g bơ lạt mềm, 3 tép tỏi băm',
      '80 g phô mai mozzarella bào',
      'Mùi tây, ớt bột paprika',
      'Muối biển, tiêu đen'
    ],
    steps: [
      'Trộn bơ mềm với tỏi, mùi tây, muối tiêu và ớt bột.',
      'Rạch bánh mì thành khoang, phết bơ tỏi rồi rắc phô mai.',
      'Nướng 190°C trong 8 phút đến khi phô mai chảy và bánh vàng giòn.'
    ],
    tips: 'Thêm ít mật ong để có vị mặn ngọt kiểu Hàn rất hợp khẩu vị trẻ nhỏ.'
  },
  {
    slug: 'sup-bi-do',
    title: 'Súp bí đỏ dừa non',
    description: 'Bí đỏ hấp xay cùng nước dừa tươi, topping hạt bí rang.',
    intro: 'Dùng nước dừa thay kem tươi giúp món súp nhẹ bụng nhưng vẫn ngậy bùi.',
    category: 'Comfort food',
    author: 'Lan Chi',
    date: '01 Nov 2025',
    readingTime: '30 phút',
    image: 'assets/images/recipes/sup-bi-do.jpg',
    ingredients: [
      '500 g bí đỏ, 200 ml nước dừa tươi',
      '1 củ hành tây, 2 tép tỏi, 1 củ khoai tây nhỏ',
      'Hạt bí rang, dầu ớt, tiêu xay',
      '1 thìa bơ lạt, 1 thìa dầu ô liu',
      'Muối biển, lá thyme khô'
    ],
    steps: [
      'Áp chảo hành tây, tỏi với bơ đến khi thơm, cho bí và khoai vào xào sơ.',
      'Đổ nước dừa, ninh 15 phút rồi xay mịn cùng ít nước luộc.',
      'Đun lại hỗn hợp, nêm muối tiêu, múc ra tô và thêm hạt bí, dầu ớt.'
    ],
    tips: 'Xay cùng lát gừng nhỏ để tăng độ ấm, rất hợp những ngày mưa lạnh.'
  },
  {
    slug: 'pizza-burrata',
    title: 'Pizza burrata 15 phút',
    description: 'Đế mỏng áp chảo, sốt cà chua tự nấu và phô mai burrata béo mướt.',
    intro: 'Không cần lò nướng, bạn vẫn có pizza nóng hổi nhờ đế áp chảo nhanh gọn.',
    category: 'Cuối tuần',
    author: 'An Khang',
    date: '30 Oct 2025',
    readingTime: '15 phút',
    image: 'assets/images/recipes/pizza-burrata.jpg',
    ingredients: [
      '1 đế pizza mỏng hoặc bánh tortilla lớn',
      '200 g sốt cà chua homemade',
      '1 viên burrata, cà chua bi, lá húng quế',
      'Dầu ô liu, tiêu đen'
    ],
    steps: [
      'Áp chảo đế pizza đến khi vàng nhẹ.',
      'Phết sốt cà, thêm cà chua bi và húng quế, đậy nắp 5 phút để nóng đều.',
      'Tắt bếp, đặt burrata lên giữa, rưới dầu ô liu và tiêu.'
    ],
    tips: 'Khò nhanh burrata giúp phần vỏ ấm nóng và mềm hơn khi cắt.'
  },
  {
    slug: 'nuoc-ep-cu-den',
    title: 'Nước ép củ dền táo lạnh',
    description: 'Củ dền, táo xanh và gừng ép lạnh, thêm vài giọt chanh vàng.',
    intro: 'Ly nước ép giàu sắt và vitamin, rất hợp sau buổi tập hoặc cho bữa sáng nhẹ.',
    category: 'Đồ uống',
    author: 'Bếp AnyF',
    date: '28 Oct 2025',
    readingTime: '7 phút',
    image: 'assets/images/recipes/nuoc-ep-cu-den.jpg',
    ingredients: [
      '1 củ dền cỡ vừa, gọt vỏ',
      '2 quả táo xanh, 1 củ cà rốt nhỏ',
      '1 nhánh gừng 1 cm',
      '1/2 quả chanh vàng',
      'Lá bạc hà, đá viên'
    ],
    steps: [
      'Cho củ dền, táo và cà rốt qua máy ép chậm.',
      'Thêm gừng, vắt chanh vàng và khuấy đều.',
      'Rót ra ly với đá viên, trang trí bạc hà.'
    ],
    tips: 'Muốn vị bớt ngọt, thay một quả táo bằng dưa leo.'
  },
  {
    slug: 'banh-chuoi-yen-mach',
    title: 'Bánh chuối yến mạch nồi chiên',
    description: 'Chuối chín nghiền với yến mạch và bơ đậu phộng, không bột mì.',
    intro: 'Món ăn vặt eat clean, dễ làm sẵn cho bữa sáng vội.',
    category: 'Eat clean',
    author: 'Mai Hương',
    date: '25 Oct 2025',
    readingTime: '35 phút',
    image: 'assets/images/recipes/banh-chuoi-yen-mach.jpg',
    ingredients: [
      '3 quả chuối chín',
      '120 g yến mạch cán dẹt',
      '2 quả trứng gà, 30 g bơ đậu phộng',
      '50 ml sữa hạnh nhân, 1 thìa mật ong',
      'Hạt óc chó, bột quế, baking powder'
    ],
    steps: [
      'Nghiền chuối, trộn với trứng, bơ đậu phộng và sữa hạnh nhân.',
      'Thêm yến mạch, bột quế, baking powder và hạt óc chó.',
      'Đổ vào khuôn, nướng nồi chiên 170°C trong 18 phút.'
    ],
    tips: 'Đợi bánh nguội hoàn toàn trước khi cắt để bề mặt không bị nứt.'
  },
  {
    slug: 'pho-bo-tai',
    title: 'Phở bò tái nhanh buổi sáng',
    description: 'Nước dùng hầm xương 45 phút bằng nồi áp suất, thịt bò tái mềm.',
    intro: 'Phiên bản phở rút gọn nhưng vẫn giữ tròn vị nhờ gia vị rang chuẩn.',
    category: 'Ẩm thực Việt',
    author: 'Hoàng Hân',
    date: '22 Oct 2025',
    readingTime: '35 phút',
    image: 'assets/images/recipes/pho-bo.jpg',
    ingredients: [
      '500 g xương bò ống, 300 g nạm bò',
      '200 g thịt thăn bò thái mỏng',
      'Hoa hồi, quế, đinh hương rang thơm',
      'Bánh phở tươi, rau thơm, giá trụng',
      'Gừng nướng, hành tây nướng, mắm, đường phèn'
    ],
    steps: [
      'Chần xương, sau đó cho vào nồi áp suất cùng gia vị rang, gừng hành nướng và 2 lít nước, hầm 30 phút.',
      'Nêm mắm, đường phèn, lọc nước dùng qua rây.',
      'Trụng bánh phở, xếp thịt nạm và thịt tái lên trên, chan nước dùng sôi.'
    ],
    tips: 'Thêm vài lát thơm vào nồi nước dùng giúp vị ngọt thanh và dậy mùi.'
  },
  {
    slug: 'lau-miso-hai-san',
    title: 'Lẩu miso hải sản ấm bụng',
    description: 'Nước dùng miso kombu, tôm mực tươi và nấm kim châm thanh ngọt.',
    intro: 'Buổi tối cuối tuần chỉ cần 30 phút để chuẩn bị nồi lẩu nhẹ bụng nhưng vẫn đủ dưỡng chất.',
    category: 'Lẩu tại gia',
    author: 'An Phúc',
    date: '18 Oct 2025',
    readingTime: '30 phút',
    image: 'assets/images/recipes/lau-miso.jpg',
    ingredients: [
      '1.5 lít nước dùng kombu hoặc xương',
      '3 thìa miso đỏ, 1 thìa mirin',
      '300 g tôm sú, 200 g mực ống',
      'Đậu hũ non, cải thảo, nấm kim châm',
      'Rau tía tô, hành boa rô, bún tươi'
    ],
    steps: [
      'Đun nước dùng với kombu, bỏ kombu khi nước sôi lăn tăn để tránh đắng.',
      'Hòa miso với ít nước nóng rồi đổ vào nồi, nêm mirin và xì dầu nhẹ.',
      'Thả hải sản, đậu hũ và rau nấm vào nồi lẩu, ăn kèm bún tươi và rau tía tô.'
    ],
    tips: 'Không đun sôi mạnh sau khi cho miso để giữ vị ngọt và màu đẹp của nước lẩu.'
  },
  {
    slug: 'banh-mi-kep-ga',
    title: 'Bánh mì kẹp gà mật ong',
    description: 'Ức gà ướp gừng mật ong, kẹp với dưa leo muối và rau rocket.',
    intro: 'Bữa sáng mang đi siêu tiện, thịt gà mềm thấm vị ngọt mặn hài hòa.',
    category: 'Bữa sáng',
    author: 'Bếp AnyF',
    date: '16 Oct 2025',
    readingTime: '15 phút',
    image: 'assets/images/recipes/banh-mi-kep-ga.jpg',
    ingredients: [
      '2 ổ bánh ciabatta nhỏ hoặc baguette mini',
      '200 g ức gà, 1 thìa mật ong, 1 thìa xì dầu',
      'Gừng bào, tỏi băm, dầu mè',
      'Dưa leo muối chua, rau rocket, mayonnaise'
    ],
    steps: [
      'Ướp gà với mật ong, xì dầu, gừng, tỏi và dầu mè trong 10 phút.',
      'Áp chảo hoặc nướng ức gà 6-7 phút mỗi bên đến khi chín, cắt lát.',
      'Phết mayonnaise lên bánh, xếp rau, dưa leo và gà lên trên, kẹp lại.'
    ],
    tips: 'Nướng sơ bánh trước khi kẹp giúp lớp vỏ giòn nhưng ruột vẫn mềm.'
  },
  {
    slug: 'smoothie-xoai-cu-den',
    title: 'Smoothie xoài củ dền detox',
    description: 'Sinh tố xoài, củ dền và sữa chua Hy Lạp giàu chất xơ.',
    intro: 'Ly smoothie hồng rực giúp bạn bắt đầu ngày mới với nhiều vitamin và chất chống oxy hóa.',
    category: 'Healthy drink',
    author: 'Lan Vy',
    date: '14 Oct 2025',
    readingTime: '5 phút',
    image: 'assets/images/recipes/smoothie-xoai.jpg',
    ingredients: [
      '1/2 củ dền luộc chín, 1 quả xoài chín',
      '150 g sữa chua Hy Lạp không đường',
      '120 ml sữa hạt hoặc nước dừa',
      '1 thìa hạt chia, đá viên'
    ],
    steps: [
      'Cắt nhỏ xoài và củ dền, cho vào máy xay cùng sữa chua và sữa hạt.',
      'Xay mịn, thêm đá viên và hạt chia rồi xay tiếp 5 giây.',
      'Rót ra ly, thêm vài lát xoài hoặc hạt chia lên mặt.'
    ],
    tips: 'Muốn vị tươi mát hơn có thể thêm vài lá bạc hà hoặc 1 thìa nước cốt chanh.'
  }
];

const THEME_KEY = 'anyf-theme';
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
        resultText.textContent = `Tìm thấy ${filteredPosts.length} công thức cho "${query}".`;
      } else {
        resultText.textContent = `Không có công thức nào phù hợp với "${query}".`;
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
    grid.innerHTML = '<p>Chưa có công thức nào phù hợp.</p>';
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

  document.title = `AnyF Kitchen | ${post.title}`;

  const categoryEl = document.querySelector('[data-post-category]');
  const titleEl = document.querySelector('[data-post-title]');
  const metaEl = document.querySelector('[data-post-meta]');
  const imageEl = document.querySelector('[data-post-image]');
  const introEl = document.querySelector('[data-post-intro]');
  const ingredientsEl = document.querySelector('[data-post-ingredients]');
  const stepsEl = document.querySelector('[data-post-steps]');
  const tipEl = document.querySelector('[data-post-tip]');

  if (categoryEl) categoryEl.textContent = post.category;
  if (titleEl) titleEl.textContent = post.title;
  if (metaEl) metaEl.textContent = `Đăng bởi ${post.author} · ${post.date} · ${post.readingTime}`;
  if (imageEl) {
    imageEl.src = post.image;
    imageEl.alt = post.title;
  }
  if (introEl) introEl.textContent = post.intro;
  if (ingredientsEl) {
    ingredientsEl.innerHTML = post.ingredients.map((item) => `<li>${item}</li>`).join('');
  }
  if (stepsEl) {
    stepsEl.innerHTML = post.steps.map((step) => `<li>${step}</li>`).join('');
  }
  if (tipEl) {
    tipEl.textContent = post.tips || '';
    tipEl.style.display = post.tips ? 'block' : 'none';
  }
}

