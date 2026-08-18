/*
* ----------------------------------------------------------------------------------------
* DARK / LIGHT THEME TOGGLE
* Applies the "dark-mode" class to <html>. Persisted in localStorage, respects the
* OS color-scheme preference on first visit. Pairs with the early inline snippet in
* <head> (prevents a flash of the wrong theme) and assets/css/theme-dark.css.
* Drives every element with a [data-theme-toggle] attribute on the page (the desktop
* floating-nav button and the mobile floating button both carry it).
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var STORAGE_KEY = "pretty-theme";
    var root = document.documentElement;
    var btns = document.querySelectorAll("[data-theme-toggle]");

    function updateIcons() {
        var dark = root.classList.contains("dark-mode");
        for (var i = 0; i < btns.length; i++) {
            var icon = btns[i].querySelector("i");
            if (icon) icon.className = dark ? "fa fa-sun-o" : "fa fa-moon-o";
        }
    }

    updateIcons();

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            root.classList.toggle("dark-mode");
            try {
                localStorage.setItem(STORAGE_KEY, root.classList.contains("dark-mode") ? "dark" : "light");
            } catch (e) {
                /* localStorage unavailable (e.g. private mode) — theme just won't persist */
            }
            updateIcons();
        });
    }
})();
