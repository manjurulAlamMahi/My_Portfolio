/*
* ----------------------------------------------------------------------------------------
* HOME "TOP PROJECTS" — renders the same real projects shown on projects.html,
* built from window.PROJECTS (assets/js/projects-data.js). No filters, just the top items.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var projects = window.PROJECTS || [];
    var grid = document.getElementById("topProjectsGrid");
    if (!grid) return;

    var TOP_PROJECTS_COUNT = 3;

    function cardMarkup(project) {
        var detailsHref = "project-details.html?slug=" + encodeURIComponent(project.slug);

        return (
            '<div class="col-md-4 col-sm-6 project-grid-item">' +
                '<a class="project-card" href="' + detailsHref + '">' +
                    '<div class="project-card-media">' +
                        '<img src="' + project.thumbnail + '" class="img-responsive" alt="' + project.title + '">' +
                    "</div>" +
                    '<div class="project-card-overlay">' +
                        '<span class="project-card-category">' + project.category + "</span>" +
                        '<h3 class="project-card-title">' + project.title + "</h3>" +
                        '<p class="project-card-desc">' + project.shortDescription + "</p>" +
                        '<span class="project-card-btn">View Details</span>' +
                    "</div>" +
                "</a>" +
            "</div>"
        );
    }

    grid.innerHTML = projects.slice(0, TOP_PROJECTS_COUNT).map(cardMarkup).join("");
})();
