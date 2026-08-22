/*
* ----------------------------------------------------------------------------------------
* SITE CORE — preloader release, hero typewriter, header scroll state, nav toggle,
* smooth-scroll, lightbox init and scroll-spy. Content lives in HTML data-attributes,
* not hardcoded here, so this file has nothing page-specific to edit.
* ----------------------------------------------------------------------------------------
*/

(function ($) {
    "use strict";

    $(function () {

        // ---- preloader release --------------------------------------------
        $(window).on("load", function () {
            $(".preloader").fadeOut(400);
            if (window.__mdStartTypewriter) {
                setTimeout(window.__mdStartTypewriter, 250);
            }
        });

        // ---- hero typewriter -------------------------------------------------
        var line1 = document.getElementById("typed-line1");
        var line2 = document.getElementById("typed-line2");
        var cursor1 = document.getElementById("typedCursor1");
        var cursor2 = document.getElementById("typedCursor2");

        if (line1 && line2) {
            var text1 = line1.getAttribute("data-text") || "";
            var text2 = line2.getAttribute("data-text") || "";

            var typeInto = function (target, text, index, speedMs, onDone) {
                if (index < text.length) {
                    target.textContent += text.charAt(index);
                    window.setTimeout(function () {
                        typeInto(target, text, index + 1, speedMs, onDone);
                    }, speedMs);
                } else if (onDone) {
                    onDone();
                }
            };

            window.__mdStartTypewriter = function () {
                typeInto(line1, text1, 0, 45, function () {
                    if (cursor1) cursor1.classList.add("typed-cursor-hidden");
                    window.setTimeout(function () {
                        if (cursor2) cursor2.classList.remove("typed-cursor-hidden");
                        typeInto(line2, text2, 0, 30);
                    }, 400);
                });
            };
        }

        // ---- header background on scroll --------------------------------------
        var headerTop = $(".header-top-area");
        $(window).on("scroll", function () {
            headerTop.toggleClass("menu-bg", $(window).scrollTop() > 200);
        });

        // ---- tablet nav toggle --------------------------------------------------
        $(".toggle-btn").on("click", function () {
            $(this).toggleClass("active");
            $(".site-header").toggleClass("active");
        });

        // ---- smooth scroll for in-page anchors -----------------------------------
        $("a.smoth-scroll").on("click", function (e) {
            var target = $($(this).attr("href"));
            if (!target.length) return;
            e.preventDefault();
            $("html, body").stop().animate({ scrollTop: target.offset().top - 50 }, 800);
        });

        // ---- lightbox for work images ------------------------------------------
        if ($.fn.magnificPopup) {
            $(".work-popup").magnificPopup({
                type: "image",
                removalDelay: 300,
                mainClass: "mfp-with-zoom",
                gallery: { enabled: true },
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: "ease-in-out",
                    opener: function (el) {
                        return el.is("img") ? el : el.find("img");
                    }
                }
            });
        }

        // ---- close mobile collapse on link click ---------------------------------
        $(document).on("click", ".navbar-collapse.in a", function (e) {
            if ($(e.target).attr("class") !== "dropdown-toggle") {
                $(this).closest(".navbar-collapse").collapse("hide");
            }
        });

        $("body").scrollspy({ target: ".navbar-collapse", offset: 195 });

        // ---- entrance animations -------------------------------------------------
        if (window.WOW) {
            new WOW().init();
        }
    });

})(jQuery);
