document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verifyOtpForm');
    if (!form) {
        return;
    }

    const emailInput = document.getElementById('verifyEmailInput');
    const otpHiddenInput = document.getElementById('verifyOtpInput');
    const otpInputs = [];

    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`otp-${i}`);
        if (!input) {
            return;
        }
        otpInputs.push(input);

        input.addEventListener('input', (event) => {
            const value = event.target.value.replace(/[^0-9]/g, '');
            event.target.value = value;

            updateHiddenOtp();

            if (value && i < 6) {
                otpInputs[i].focus();
            }

            if (i === 6 && value) {
                const otpValue = otpInputs.map((inp) => inp.value).join('');
                if (otpValue.length === 6) {
                    setTimeout(() => {
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    }, 300);
                }
            }
        });

        input.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Backspace':
                    if (!event.target.value && i > 1) {
                        otpInputs[i - 2].focus();
                    }
                    break;
                case 'ArrowLeft':
                    if (i > 1) {
                        otpInputs[i - 2].focus();
                    }
                    break;
                case 'ArrowRight':
                    if (i < 6) {
                        otpInputs[i].focus();
                    }
                    break;
                default:
                    break;
            }
        });

        input.addEventListener('paste', (event) => {
            event.preventDefault();
            const clipboardData = event.clipboardData?.getData('text') || '';
            const numericData = clipboardData.replace(/[^0-9]/g, '').slice(0, 6);

            if (!numericData) {
                return;
            }

            for (let j = 0; j < numericData.length && (i - 1 + j) < 6; j++) {
                otpInputs[i - 1 + j].value = numericData[j];
            }

            updateHiddenOtp();

            const nextEmpty = otpInputs.findIndex((inp) => !inp.value);
            if (nextEmpty !== -1) {
                otpInputs[nextEmpty].focus();
            } else {
                otpInputs[5].focus();
            }
        });
    }

    function updateHiddenOtp() {
        if (!otpHiddenInput) {
            return;
        }
        otpHiddenInput.value = otpInputs.map((inp) => inp.value).join('');
    }

    setTimeout(() => {
        otpInputs[0].focus();
    }, 100);

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (email && emailInput) {
        emailInput.value = email;
        emailInput.readOnly = true;
        emailInput.classList.add('input-readonly');
    }

    let timeLeft = 600;
    const timerElement = document.getElementById('otpTimer');

    if (timerElement) {
        const timerInterval = setInterval(() => {
            timeLeft -= 1;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            if (timeLeft > 0) {
                timerElement.textContent = `Mã OTP có hiệu lực trong ${minutes}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timerElement.textContent = 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.';
                timerElement.classList.add('otp-timer--expired');
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    form.addEventListener('submit', (event) => {
        const otpValue = otpInputs.map((inp) => inp.value).join('');
        if (otpValue.length !== 6) {
            event.preventDefault();
            otpInputs.forEach((input) => {
                if (!input.value) {
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 1000);
                }
            });
        }
    });
});

