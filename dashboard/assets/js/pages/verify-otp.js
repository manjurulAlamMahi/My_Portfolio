(function () {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('#otpRow input'));

    inputs.forEach(function (input, i) {
        input.addEventListener('input', function () {
            input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
            if (input.value && inputs[i + 1]) inputs[i + 1].focus();
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !input.value && inputs[i - 1]) inputs[i - 1].focus();
        });
    });

    document.getElementById('verifyBtn').addEventListener('click', function () {
        var code = inputs.map(function (i) { return i.value; }).join('');
        if (code.length !== 6) {
            Toast.show('Enter all 6 digits.', 'error');
            return;
        }
        if (Auth.verifyOtp(code)) {
            window.location.href = 'reset-password.html';
        } else {
            Toast.show('Invalid or expired code.', 'error');
        }
    });

    var cooldownSeconds = 30;
    var resendLink = document.getElementById('resendLink');
    var cooldownLabel = document.getElementById('resendCooldown');
    var timer = null;

    function startCooldown() {
        var remaining = cooldownSeconds;
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.5';
        cooldownLabel.textContent = ' (' + remaining + 's)';
        timer = setInterval(function () {
            remaining -= 1;
            cooldownLabel.textContent = remaining > 0 ? ' (' + remaining + 's)' : '';
            if (remaining <= 0) {
                clearInterval(timer);
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.opacity = '1';
            }
        }, 1000);
    }

    resendLink.addEventListener('click', function (e) {
        e.preventDefault();
        var code = Auth.requestOtp();
        Toast.show('DEV MODE — your new OTP is ' + code, 'info');
        startCooldown();
    });

    startCooldown();
})();
