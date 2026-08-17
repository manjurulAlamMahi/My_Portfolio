/*
* ----------------------------------------------------------------------------------------
* PROJECT DETAILS PAGE — renders a case study from window.PROJECTS by ?slug=.
* Vanilla JS, no dependencies. Sections with no data are simply not rendered.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var projects = window.PROJECTS || [];
    var mount = document.getElementById("projectDetailsMount");
    if (!mount) return;

    function getSlug() {
        var params = new URLSearchParams(window.location.search);
        return params.get("slug");
    }

    function escapeHtml(value) {
        var div = document.createElement("div");
        div.textContent = value;
        return div.innerHTML;
    }

    function section(eyebrow, heading, bodyHtml) {
        return (
            '<div class="case-section">' +
                '<div class="about-section-title case-section-title">' +
                    "<span>" + eyebrow + "</span>" +
                    "<h2>" + heading + "</h2>" +
                "</div>" +
                bodyHtml +
            "</div>"
        );
    }

    function paragraphSection(eyebrow, heading, text) {
        if (!text) return "";
        return section(eyebrow, heading, "<p>" + escapeHtml(text) + "</p>");
    }

    function listSection(eyebrow, heading, items) {
        if (!items || !items.length) return "";
        var lis = items.map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
        }).join("");
        return section(eyebrow, heading, '<ul class="case-feature-list">' + lis + "</ul>");
    }

    function galleryMarkup(images) {
        return images.map(function (src) {
            return (
                '<a href="' + src + '" class="case-gallery-item work-popup">' +
                    '<img src="' + src + '" alt="">' +
                "</a>"
            );
        }).join("");
    }

    function screenshotsSection(screenshots) {
        if (!screenshots || !screenshots.length) return "";
        return section("Gallery", "Screenshots", '<div class="case-gallery">' + galleryMarkup(screenshots) + "</div>");
    }

    function importantPagesSection(pages) {
        if (!pages || !pages.length) return "";
        var cards = pages.map(function (page) {
            return (
                '<a href="' + page.image + '" class="case-page-card work-popup">' +
                    '<img src="' + page.image + '" alt="">' +
                    '<span>' + escapeHtml(page.label) + "</span>" +
                "</a>"
            );
        }).join("");
        return section("UI Previews", "Important Pages", '<div class="case-page-grid">' + cards + "</div>");
    }

    function linkButton(label, href) {
        if (!href) return "";
        return '<a class="home-btn home-btn-outline case-link-btn" href="' + href + '" target="_blank" rel="noopener">' + label + "</a>";
    }

    function linksMarkup(links) {
        if (!links) return "";
        var buttons = [
            linkButton("GitHub", links.github),
            linkButton("Live Site", links.live),
            linkButton("App", links.app),
            linkButton("Figma", links.figma)
        ];
        if (links.other && links.other.length) {
            links.other.forEach(function (link) {
                buttons.push(linkButton(link.label, link.url));
            });
        }
        buttons = buttons.filter(Boolean);
        if (!buttons.length) return "";
        return '<div class="case-links">' + buttons.join("") + "</div>";
    }

    function techTagsMarkup(techStack) {
        if (!techStack || !techStack.length) return "";
        var tags = techStack.map(function (tech) {
            return '<span class="project-card-tag">' + escapeHtml(tech) + "</span>";
        }).join("");
        return '<div class="case-tech-row">' + tags + "</div>";
    }

    function renderNotFound() {
        mount.innerHTML =
            '<div class="case-not-found">' +
                "<h2>Project not found</h2>" +
                "<p>We couldn't find a project matching that link.</p>" +
                '<a class="home-btn home-btn-dark" href="projects.html">Back to Projects</a>' +
            "</div>";
    }

    function render(project) {
        document.title = project.title + " — Case Study";

        var current = document.querySelector(".sidebar-current-page strong");
        if (current) current.textContent = project.title;

        mount.innerHTML =
            '<div class="case-banner" style="background-image: url(\'' + project.banner + "');\">" +
                '<div class="container">' +
                    '<span class="case-banner-category">' + escapeHtml(project.category) + "</span>" +
                    "<h1>" + escapeHtml(project.title) + "</h1>" +
                "</div>" +
            "</div>" +
            '<div class="container case-body">' +
                '<a class="case-back-link" href="projects.html"><i class="fa fa-arrow-left"></i> Back to Projects</a>' +
                techTagsMarkup(project.techStack) +
                linksMarkup(project.links) +
                paragraphSection("Case Study", "Overview", project.overview) +
                paragraphSection("The Challenge", "Problem &amp; Objective", project.problem) +
                paragraphSection("Process", "Project Journey", project.journey) +
                listSection("Highlights", "Features", project.features) +
                paragraphSection("How It Works", "Functionality", project.functionality) +
                screenshotsSection(project.screenshots) +
                importantPagesSection(project.importantPages) +
                paragraphSection("More", "Additional Information", project.additionalInfo) +
            "</div>";

        if (window.jQuery && window.jQuery.fn.magnificPopup) {
            window.jQuery(".work-popup").magnificPopup({
                type: "image",
                removalDelay: 300,
                mainClass: "mfp-with-zoom",
                gallery: { enabled: true }
            });
        }
    }

    var slug = getSlug();
    var project = projects.filter(function (p) { return p.slug === slug; })[0];

    if (project) {
        render(project);
    } else {
        renderNotFound();
    }
})();
