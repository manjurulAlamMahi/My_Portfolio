/*
* ----------------------------------------------------------------------------------------
* PROJECTS PAGE — grid + filters, built from window.PROJECTS (assets/js/projects-data.js).
* Vanilla JS, no dependencies. Replaces the old static-HTML projects.js.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var projects = window.PROJECTS || [];
    var grid = document.getElementById("projectGrid");
    var filters = document.getElementById("projectFilters");
    if (!grid || !filters) return;

    function slugifyCategory(category) {
        return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    function techTagsMarkup(techStack) {
        if (!techStack || !techStack.length) return "";
        return techStack.map(function (tech) {
            return '<span class="project-card-tag">' + tech + "</span>";
        }).join("");
    }

    function cardMarkup(project) {
        var filterKey = slugifyCategory(project.category);
        var detailsHref = "project-details.html?slug=" + encodeURIComponent(project.slug);

        return (
            '<div class="col-md-6 col-sm-6 project-grid-item" data-category="' + filterKey + '">' +
                '<a class="project-card" href="' + detailsHref + '">' +
                    '<div class="project-card-media">' +
                        '<img src="' + project.thumbnail + '" class="img-responsive" alt="' + project.title + '">' +
                    "</div>" +
                    '<div class="project-card-overlay">' +
                        '<span class="project-card-category">' + project.category + "</span>" +
                        '<h3 class="project-card-title">' + project.title + "</h3>" +
                        '<p class="project-card-desc">' + project.shortDescription + "</p>" +
                        '<div class="project-card-tech">' + techTagsMarkup(project.techStack) + "</div>" +
                        '<span class="project-card-btn">View Details</span>' +
                    "</div>" +
                "</a>" +
            "</div>"
        );
    }

    function renderGrid() {
        grid.innerHTML = projects.map(cardMarkup).join("");
    }

    function renderFilters() {
        var seen = {};
        var categories = [];

        projects.forEach(function (project) {
            var key = slugifyCategory(project.category);
            if (!seen[key]) {
                seen[key] = true;
                categories.push({ key: key, label: project.category });
            }
        });

        var buttons = ['<button type="button" class="active" data-filter="all">All</button>'];
        categories.forEach(function (cat) {
            buttons.push('<button type="button" data-filter="' + cat.key + '">' + cat.label + "</button>");
        });
        filters.innerHTML = buttons.join("");
    }

    function bindFilterEvents() {
        var buttons = filters.querySelectorAll("button");
        var items = grid.querySelectorAll(".project-grid-item");

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
    }

    renderFilters();
    renderGrid();
    bindFilterEvents();
})();
