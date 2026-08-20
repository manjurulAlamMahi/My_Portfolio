(function () {
    var code = Auth.requestOtp();
    // DEV MODE ONLY: a real backend would email this code instead of
    // surfacing it in the UI. Kept visible here so the demo is testable
    // without a mail server.
    Toast.show('DEV MODE — your OTP is ' + code, 'info');

    document.getElementById('continueBtn').addEventListener('click', function () {
        window.location.href = 'verify-otp.html';
    });
})();
