document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('reset_email');
    const otp = sessionStorage.getItem('reset_otp');

    if (!email || !otp) {
        alert('Vui lòng xác thực OTP trước khi đặt lại mật khẩu.');
        window.location.href = 'verify-otp.php';
        return;
    }

    const emailInput = document.getElementById('resetEmailInput');
    const otpInput = document.getElementById('resetOtpInput');

    if (emailInput) {
        emailInput.value = email;
    }

    if (otpInput) {
        otpInput.value = otp;
    }
});

