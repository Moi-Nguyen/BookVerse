document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.terms-section');

    tocLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    const tocLinksArray = Array.from(tocLinks);

    function updateActiveSection() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        tocLinksArray.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
});

