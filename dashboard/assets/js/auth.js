/*
* Auth — single hardcoded administrator, no backend. login()/requestOtp()/
* verifyOtp()/resetPassword() are the only functions a real API integration
* would need to rewrite; every page calls only these, never sessionStorage
* directly.
*/
(function (global) {
    var SESSION_KEY = "maxdev-dashboard-session";
    var OTP_KEY = "maxdev-dashboard-otp";
    var OTP_VERIFIED_KEY = "maxdev-dashboard-otp-verified";
    var OTP_TTL_MS = 5 * 60 * 1000;

    var Auth = {
        ADMIN_EMAIL: "admin@maxdev.com",
        ADMIN_PASSWORD: "MaxDev@2026",

        login: function (email, password) {
            var ok = email === Auth.ADMIN_EMAIL && password === Auth.ADMIN_PASSWORD;
            if (ok) sessionStorage.setItem(SESSION_KEY, "1");
            return ok;
        },

        isAuthenticated: function () {
            return sessionStorage.getItem(SESSION_KEY) === "1";
        },

        logout: function () {
            sessionStorage.removeItem(SESSION_KEY);
        },

        requestOtp: function () {
            var code = String(Math.floor(100000 + Math.random() * 900000));
            sessionStorage.setItem(OTP_KEY, JSON.stringify({ code: code, expires: Date.now() + OTP_TTL_MS }));
            return code;
        },

        verifyOtp: function (code) {
            var raw = sessionStorage.getItem(OTP_KEY);
            if (!raw) return false;
            var stored = JSON.parse(raw);
            var ok = stored.code === String(code) && Date.now() < stored.expires;
            if (ok) {
                sessionStorage.setItem(OTP_VERIFIED_KEY, "1");
                sessionStorage.removeItem(OTP_KEY);
            }
            return ok;
        },

        isOtpVerified: function () {
            return sessionStorage.getItem(OTP_VERIFIED_KEY) === "1";
        },

        resetPassword: function (newPassword) {
            if (sessionStorage.getItem(OTP_VERIFIED_KEY) !== "1") return false;
            if (!newPassword || newPassword.length < 6) return false;
            sessionStorage.removeItem(OTP_VERIFIED_KEY);
            return true;
        }
    };

    global.Auth = Auth;
})(window);
