(function () {
    if (!Auth.isOtpVerified()) {
        window.location.replace('forgot-password.html');
        return;
    }

    document.getElementById('resetForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var pw = document.getElementById('newPassword').value;
        var confirm = document.getElementById('confirmPassword').value;
        if (pw !== confirm) {
            Toast.show('Passwords do not match.', 'error');
            return;
        }
        if (Auth.resetPassword(pw)) {
            Toast.show('Password reset. Please log in.', 'success');
            setTimeout(function () { window.location.href = 'login.html'; }, 1200);
        } else {
            Toast.show('Password must be at least 6 characters.', 'error');
        }
    });
})();
