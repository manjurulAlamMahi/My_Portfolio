/*
* ----------------------------------------------------------------------------------------
* PROJECTS PAGE — CATEGORY FILTER
* Vanilla JS, no dependencies.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var buttons = document.querySelectorAll(".project-filters button");
    var items = document.querySelectorAll(".project-grid-item");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var filter = btn.getAttribute("data-filter");

            buttons.forEach(function (b) {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            items.forEach(function (item) {
                var show = filter === "all" || item.getAttribute("data-category") === filter;
                item.classList.toggle("is-hidden", !show);
            });
        });
    });
})();
