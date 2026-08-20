/*
* guard.js — include at the very top of every guarded page's <head>, after
* auth.js. Redirects to login if there's no active session. Uses a relative
* path resolved from the page's own depth so it works from both
* dashboard/*.html and dashboard/pages/*.html.
*/
(function () {
    if (window.Auth && window.Auth.isAuthenticated()) return;
    var inPagesDir = /\/pages\//.test(window.location.pathname);
    window.location.replace(inPagesDir ? "../login.html" : "login.html");
})();
