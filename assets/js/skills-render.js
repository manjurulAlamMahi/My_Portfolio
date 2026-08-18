/*
* ----------------------------------------------------------------------------------------
* RESUME SKILLS — technical skill tabs + soft skill cards, built from window.SKILLS
* (assets/js/skills-data.js). Vanilla JS, no dependencies.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var data = window.SKILLS || { technical: [], soft: [] };

    function slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    /* ---------------- TECHNICAL SKILLS: TABS ---------------- */
    var tabButtons = document.getElementById("skillsTabButtons");
    var tabPanels = document.getElementById("skillsTabPanels");

    function skillRowMarkup(item) {
        return (
            '<div class="skill-row">' +
                '<div class="skill-row-head"><span>' + item.name + '</span><span class="pct">' + item.level + '%</span></div>' +
                '<div class="skill-bar-track"><div class="skill-bar-fill" data-width="' + item.level + '"></div></div>' +
            "</div>"
        );
    }

    function animatePanel(panel) {
        if (!panel) return;
        var bars = panel.querySelectorAll(".skill-bar-fill");

        bars.forEach(function (bar) {
            bar.style.width = "0%";
        });

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                bars.forEach(function (bar) {
                    bar.style.width = bar.getAttribute("data-width") + "%";
                });
            });
        });
    }

    function renderTabs() {
        if (!tabButtons || !tabPanels || !data.technical.length) return;

        var buttons = [];
        var panels = [];

        data.technical.forEach(function (group, index) {
            var key = slugify(group.category);
            buttons.push(
                '<button type="button" class="skills-tab-btn' + (index === 0 ? " active" : "") + '" data-tab="' + key + '">' +
                    group.category +
                "</button>"
            );
            panels.push(
                '<div class="skills-tab-panel' + (index === 0 ? " active" : "") + '" data-panel="' + key + '">' +
                    group.items.map(skillRowMarkup).join("") +
                "</div>"
            );
        });

        tabButtons.innerHTML = buttons.join("");
        tabPanels.innerHTML = panels.join("");
    }

    function bindTabEvents() {
        if (!tabButtons || !tabPanels) return;

        var buttons = tabButtons.querySelectorAll(".skills-tab-btn");
        var panels = tabPanels.querySelectorAll(".skills-tab-panel");

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var key = btn.getAttribute("data-tab");

                buttons.forEach(function (b) {
                    b.classList.remove("active");
                });
                panels.forEach(function (p) {
                    p.classList.remove("active");
                });

                btn.classList.add("active");
                var activePanel = tabPanels.querySelector('[data-panel="' + key + '"]');
                if (activePanel) {
                    activePanel.classList.add("active");
                    animatePanel(activePanel);
                }
            });
        });
    }

    /* ---------------- SOFT SKILLS: CARDS ---------------- */
    var softGrid = document.getElementById("softSkillsGrid");

    function softSkillCardMarkup(skill) {
        return (
            '<div class="soft-skill-card">' +
                '<span class="soft-skill-icon"><i class="fa ' + (skill.icon || "fa-check") + '"></i></span>' +
                '<div class="soft-skill-text">' +
                    "<h4>" + skill.name + "</h4>" +
                    (skill.note ? "<p>" + skill.note + "</p>" : "") +
                "</div>" +
            "</div>"
        );
    }

    function renderSoftSkills() {
        if (!softGrid) return;
        softGrid.innerHTML = data.soft.map(softSkillCardMarkup).join("");
    }

    renderTabs();
    bindTabEvents();
    renderSoftSkills();
})();
