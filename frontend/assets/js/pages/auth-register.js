document.addEventListener('DOMContentLoaded', () => {
    const accountTypeCards = document.querySelectorAll('.account-type-card');
    const form = document.getElementById('registerForm');

    accountTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            accountTypeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    document.querySelectorAll('.password-toggle').forEach(button => {
        const input = button.previousElementSibling;
        button.addEventListener('click', () => togglePassword(input, button));
    });
});

function togglePassword(field, button) {
    if (!field || !button) return;

    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
    } else {
        field.type = 'password';
        button.textContent = '👁️';
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Đang xử lý...';
    submitBtn.disabled = true;

    let loadingId = null;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        validateForm(data);

        const selectedType = document.querySelector('.account-type-card.active')?.dataset.type;
        if (!selectedType) {
            throw new Error('Vui lòng chọn loại tài khoản!');
        }

        const registrationData = {
            username: data.username.trim(),
            email: data.email.trim(),
            password: data.password,
            profile: {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim()
            },
            role: selectedType === 'seller' ? 'seller' : 'user'
        };

        console.log('📝 Registering with data:', registrationData);

        loadingId = showLoading('Đang tạo tài khoản...');
        const response = await api.register(registrationData);
        notificationManager.close(loadingId);

        console.log('✅ Registration response:', response);

        const accountTypeText = selectedType === 'buyer' ? 'Người mua' : 'Người bán';
        let successMessage = `🎉 Đăng ký thành công!\n\nLoại tài khoản: ${accountTypeText}\nEmail: ${data.email}`;

        if (selectedType === 'seller') {
            successMessage += '\n\n⚠️ Tài khoản người bán cần được admin phê duyệt trước khi có thể bán hàng.';
        }

        successMessage += '\n\nChuyển đến trang đăng nhập...';
        showAuthSuccess(successMessage, 'login.php');
    } catch (error) {
        console.error('Registration error:', error);
        if (loadingId) notificationManager.close(loadingId);

        let errorMessage = parseErrorMessage(error);
        showAuthError(errorMessage);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateForm(data) {
    if (!data.firstName || !data.lastName) {
        throw new Error('⚠️ Vui lòng nhập đầy đủ họ và tên!');
    }

    if (!data.username || data.username.length < 3) {
        throw new Error('⚠️ Tên đăng nhập phải có ít nhất 3 ký tự!');
    }

    if (!data.email || !data.email.includes('@')) {
        throw new Error('⚠️ Email không hợp lệ!');
    }

    if (!data.password || data.password.length < 6) {
        throw new Error('⚠️ Mật khẩu phải có ít nhất 6 ký tự!');
    }

    if (data.password !== data.confirmPassword) {
        throw new Error('❌ Mật khẩu xác nhận không khớp!');
    }

    if (!data.agreeTerms) {
        throw new Error('⚠️ Vui lòng đồng ý với điều khoản sử dụng!');
    }
}

function parseErrorMessage(error) {
    let msg = error?.message || error?.error || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!';

    if (msg.includes('Email already registered') || (msg.includes('email') && msg.includes('exists'))) {
        msg = '📧 Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.';
    } else if (msg.includes('Username already taken') || (msg.includes('username') && msg.includes('exists'))) {
        msg = '👤 Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.';
    } else if (msg.includes('validation') || msg.includes('invalid')) {
        msg = '⚠️ Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
    } else if (msg.includes('network') || msg.includes('fetch')) {
        msg = '🌐 Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }

    return msg;
}

function showAuthSuccess(message, redirectUrl) {
    return notificationManager.showAuthSuccess(message, redirectUrl);
}

function showAuthError(message) {
    return notificationManager.showAuthError(message);
}

function showLoading(message) {
    return notificationManager.loading ? notificationManager.loading(message) : null;
}

