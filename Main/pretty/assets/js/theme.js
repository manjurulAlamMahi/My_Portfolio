/*
* ----------------------------------------------------------------------------------------
* DARK / LIGHT THEME TOGGLE
* Applies the "dark-mode" class to <html>. Persisted in localStorage, respects the
* OS color-scheme preference on first visit. Pairs with the early inline snippet in
* <head> (prevents a flash of the wrong theme) and assets/css/theme-dark.css.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var STORAGE_KEY = "pretty-theme";
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");

    function updateIcon() {
        if (!btn) return;
        var icon = btn.querySelector("i");
        if (!icon) return;
        icon.className = root.classList.contains("dark-mode") ? "fa fa-sun-o" : "fa fa-moon-o";
    }

    updateIcon();

    if (btn) {
        btn.addEventListener("click", function () {
            root.classList.toggle("dark-mode");
            try {
                localStorage.setItem(STORAGE_KEY, root.classList.contains("dark-mode") ? "dark" : "light");
            } catch (e) {
                /* localStorage unavailable (e.g. private mode) — theme just won't persist */
            }
            updateIcon();
        });
    }
})();
