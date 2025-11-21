document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('contactError');
    const successDiv = document.getElementById('contactSuccess');

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        toggleLoadingState(true);

        try {
            const formData = new FormData(contactForm);
            // Placeholder for real API integration
            await new Promise(resolve => setTimeout(resolve, 2000));

            showMessage(successDiv, 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
            hideMessage(errorDiv);
            contactForm.reset();
        } catch (error) {
            showMessage(errorDiv, 'Có lỗi xảy ra. Vui lòng thử lại sau.');
            hideMessage(successDiv);
        } finally {
            toggleLoadingState(false);
        }
    });

    function toggleLoadingState(isLoading) {
        if (!submitBtn) {
            return;
        }
        submitBtn.disabled = isLoading;
        const textEl = submitBtn.querySelector('.btn-text');
        const loadingEl = submitBtn.querySelector('.btn-loading');
        if (textEl) {
            textEl.style.display = isLoading ? 'none' : 'inline';
        }
        if (loadingEl) {
            loadingEl.style.display = isLoading ? 'inline' : 'none';
        }
    }

    function showMessage(container, message) {
        if (!container) {
            return;
        }
        container.style.display = 'block';
        container.textContent = message;
    }

    function hideMessage(container) {
        if (!container) {
            return;
        }
        container.style.display = 'none';
        container.textContent = '';
    }
});

