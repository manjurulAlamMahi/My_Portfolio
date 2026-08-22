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
        ADMIN_EMAIL: "admin",
        ADMIN_PASSWORD: "1",

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

        // DEMO MODE: no real backend sends this code, so verification only
        // checks the code is well-formed (6 digits) rather than matching
        // the generated value — any 6-digit input passes, on purpose.
        verifyOtp: function (code) {
            var ok = /^\d{6}$/.test(String(code));
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
