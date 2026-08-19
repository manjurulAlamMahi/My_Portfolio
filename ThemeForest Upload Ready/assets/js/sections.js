/*
* ----------------------------------------------------------------------------------------
* SHARED SECTION INTERACTIONS (About, Resume, Projects)
* Count-up stats, animated skill bars, scroll reveal and a small testimonial carousel.
* Vanilla JS, no dependencies.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    // ---- count-up stats ----------------------------------------------------
    var statNums = document.querySelectorAll(".about-stat .num");

    function animateCount(el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var duration = 1400;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        window.requestAnimationFrame(step);
    }

    // ---- skill bar fill ----------------------------------------------------
    function fillSkillBars(container) {
        var bars = container.querySelectorAll(".skill-bar-fill");
        bars.forEach(function (bar) {
            bar.style.width = bar.getAttribute("data-width") + "%";
        });
    }

    // ---- generic scroll reveal ---------------------------------------------
    var revealEls = document.querySelectorAll(".about-reveal");

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");

                        if (entry.target.classList.contains("about-stats")) {
                            statNums.forEach(animateCount);
                        }
                        if (entry.target.classList.contains("about-skills")) {
                            fillSkillBars(entry.target);
                        }

                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.25 }
        );

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // fallback: no IO support, just show everything immediately
        revealEls.forEach(function (el) {
            el.classList.add("in-view");
        });
        statNums.forEach(animateCount);
        var skillsSection = document.querySelector(".about-skills");
        if (skillsSection) fillSkillBars(skillsSection);
    }

    // ---- testimonial carousel ----------------------------------------------
    var track = document.getElementById("testimonialTrack");
    if (track) {
        var slides = track.querySelectorAll(".testimonial-slide");
        var dotsWrap = document.getElementById("testimonialNav");
        var current = 0;
        var autoTimer;

        slides.forEach(function (_, i) {
            var dot = document.createElement("button");
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
            dot.addEventListener("click", function () {
                goTo(i);
                restartAuto();
            });
            dotsWrap.appendChild(dot);
        });

        var dots = dotsWrap.querySelectorAll("button");

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            track.style.transform = "translateX(-" + (current * 100) + "%)";
            dots.forEach(function (d, i) {
                d.classList.toggle("active", i === current);
            });
        }

        function restartAuto() {
            window.clearInterval(autoTimer);
            autoTimer = window.setInterval(function () {
                goTo(current + 1);
            }, 5000);
        }

        restartAuto();
    }
})();
