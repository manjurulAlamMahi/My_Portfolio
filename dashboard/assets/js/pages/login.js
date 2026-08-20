(function () {
    var form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;
        if (Auth.login(email, password)) {
            window.location.href = 'index.html';
        } else {
            Toast.show('Incorrect email or password.', 'error');
        }
    });
})();
