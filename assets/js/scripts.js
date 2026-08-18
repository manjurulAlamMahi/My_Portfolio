/*
* ----------------------------------------------------------------------------------------
Author Name  :Md Shamsuzzaman
Author Url   : https://themeforest.net/user/litedesign
Template Name: Pretty - Beautiful Creative Portfolio
Version      : 1.0
* ----------------------------------------------------------------------------------------
*/



(function ($) {
    'use strict';

    jQuery(document).ready(function () {

        /*
         * ----------------------------------------------------------------------------------------
         *  PRELOADER JS
         * ----------------------------------------------------------------------------------------
         */

        var prealoaderOption = $(window);
        prealoaderOption.on("load", function () {
            var preloader = jQuery('.preloader');
            var preloaderArea = jQuery('.preloader-area');
            preloader.fadeOut();
            preloaderArea.delay(350).fadeOut('slow');

            if (typedLine1Target) {
                setTimeout(typeNextChar, 300);
            }
        });


        /*
         * ----------------------------------------------------------------------------------------
         *  HERO TYPEWRITER GREETING JS
         *  Types the whole greeting line, then the role tagline underneath it.
         * ----------------------------------------------------------------------------------------
         */

        var typedLine1Target = document.getElementById('typed-line1');
        var typedLine2Target = document.getElementById('typed-line2');
        var typedCursor1 = document.getElementById('typedCursor1');
        var typedCursor2 = document.getElementById('typedCursor2');

        var typeNextChar = function () {};

        if (typedLine1Target && typedLine2Target) {
            var typedLine1Text = 'Hi, I am Juliana Doe';
            var typedLine2Text = 'WordPress Designer, UI/UX Designer & Developer';
            var typedLine1SpeedMs = 45;
            var typedLine2SpeedMs = 30;
            var typedLineGapMs = 400;

            var typeLine = function (target, text, index, speedMs, onDone) {
                if (index < text.length) {
                    target.textContent += text.charAt(index);
                    setTimeout(function () {
                        typeLine(target, text, index + 1, speedMs, onDone);
                    }, speedMs);
                } else if (onDone) {
                    onDone();
                }
            };

            typeNextChar = function () {
                typeLine(typedLine1Target, typedLine1Text, 0, typedLine1SpeedMs, function () {
                    if (typedCursor1) {
                        typedCursor1.classList.add('typed-cursor-hidden');
                    }
                    setTimeout(function () {
                        if (typedCursor2) {
                            typedCursor2.classList.remove('typed-cursor-hidden');
                        }
                        typeLine(typedLine2Target, typedLine2Text, 0, typedLine2SpeedMs);
                    }, typedLineGapMs);
                });
            };
        }


        /*
         * ----------------------------------------------------------------------------------------
         *  CHANGE MENU BACKGROUND JS
         * ----------------------------------------------------------------------------------------
         */

        var headertopoption = $(window);
        var headTop = $('.header-top-area');

        headertopoption.on('scroll', function () {
            if (headertopoption.scrollTop() > 200) {
                headTop.addClass('menu-bg');
            } else {
                headTop.removeClass('menu-bg');
            }
        });


        /*
         * ----------------------------------------------------------------------------------------
         *  MENU JS
         * ----------------------------------------------------------------------------------------
         */
        $(".toggle-btn").on("click", function () {
            $(this).toggleClass("active");
            $(".site-header").toggleClass("active");
        });

        /*
         * ----------------------------------------------------------------------------------------
         *  SMOTH SCROOL JS
         * ----------------------------------------------------------------------------------------
         */

        $('a.smoth-scroll').on("click", function (e) {
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top - 50
            }, 1000);
            e.preventDefault();
        });



        /*
         * ----------------------------------------------------------------------------------------
         *  MAGNIFIC POPUP JS
         * ----------------------------------------------------------------------------------------
         */

        var magnifPopup = function () {
            $('.work-popup').magnificPopup({
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-with-zoom',
                gallery: {
                    enabled: true
                },
                zoom: {
                    enabled: true, // By default it's false, so don't forget to enable it

                    duration: 300, // duration of the effect, in milliseconds
                    easing: 'ease-in-out', // CSS transition easing function

                    // The "opener" function should return the element from which popup will be zoomed in
                    // and to which popup will be scaled down
                    // By defailt it looks for an image tag:
                    opener: function (openerElement) {
                        // openerElement is the element on which popup was initialized, in this case its <a> tag
                        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    }
                }
            });
        };
        // Call the functions 
        magnifPopup();




        /*
         * ----------------------------------------------------------------------------------------
         *  EXTRA JS
         * ----------------------------------------------------------------------------------------
         */
        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
        });
        $('body').scrollspy({
            target: '.navbar-collapse',
            offset: 195
        });



        /*
         * ----------------------------------------------------------------------------------------
         *  WOW JS
         * ----------------------------------------------------------------------------------------
         */
        new WOW().init();


    });

})(jQuery);


/*
* ----------------------------------------------------------------------------------------
Author Name  :Md Shamsuzzaman
Author Url   : https://themeforest.net/user/litedesign
Template Name: Pretty - Beautiful Creative Portfolio
Version      : 1.0
* ----------------------------------------------------------------------------------------
*/
