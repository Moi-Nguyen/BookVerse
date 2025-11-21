document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.classList.remove('show');
            });

            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('show');
            }
        });
    });

    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            faqCategories.forEach(cat => {
                cat.style.display = cat.dataset.category === category ? 'block' : 'none';
            });
        });
    });

    const chatBtn = document.querySelector('.chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            alert('Tính năng chat trực tuyến sẽ được triển khai sớm!');
        });
    }

    const searchForm = document.querySelector('.help-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', event => {
            const query = searchForm.querySelector('input[name=\"q\"]').value.trim();
            if (!query) {
                event.preventDefault();
                alert('Vui lòng nhập từ khóa tìm kiếm');
            }
        });
    }
});

