document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    // Toggle FAQ answers
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs in the same category
            const category = this.closest('.faq-category');
            const categoryQuestions = category.querySelectorAll('.faq-question');
            categoryQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.classList.remove('show');
            });
            
            // Toggle current FAQ
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('show');
            }
        });
    });
    
    // FAQ category switching
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide categories
            faqCategories.forEach(cat => {
                if (cat.dataset.category === category) {
                    cat.style.display = 'block';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });
    
    // Chat and consultation buttons
    const chatBtn = document.querySelector('.chat-btn');
    const consultationBtn = document.querySelector('.consultation-btn');
    
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            alert('Tính năng chat trực tuyến sẽ được triển khai sớm!');
        });
    }
    
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function() {
            alert('Tính năng đặt lịch tư vấn sẽ được triển khai sớm!');
        });
    }
    
    // Smooth scrolling for resource links
    const resourceLinks = document.querySelectorAll('.resource-links a');
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // This would scroll to the specific guide section
            console.log('Navigate to:', this.textContent);
        });
    });
});
