jQuery(function ($) {

    'use strict';

    // Mean menu
    jQuery('.mean-menu').meanmenu({
        meanScreenWidth: "1199"
    });

    // Sticky navbar
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar-area').addClass('is-sticky');
            $(".fixed-top").addClass("non-fixed");
        } else {
            $('.navbar-area').removeClass('is-sticky');
            $(".fixed-top").removeClass("non-fixed");
        }
    });

    // Scrolltop
    $(window).on('scroll', function() {
        if( $(this).scrollTop() > 300 ) {
            $("#scrolltop").addClass("scrolltopactive");
        }
        else {
            $("#scrolltop").removeClass("scrolltopactive");
        }
    });
    $("#scrolltop").on('click', function () {
        $("html").animate({
            scrollTop: 0
        }, 2000);
        return false;
    });

    // Banner-carousel
    $(".banner-carousel").owlCarousel({
        loop: true,
        items: 1,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        nav: false,
        navText: ['',''],
        responsive:{
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            }
        }
    });


    //Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        loop: true,
        items: 3,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: false,
        nav: true,
        navText: ["<i class='mdi mdi-chevron-left c-blue'></i>", "<i class='mdi mdi-chevron-right c-blue'></i>"],
        responsive:{
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    //Client carousel
    $(".client-carousel").owlCarousel({
        loop: true,
        items: 3,
        autoplay: false,
        smartSpeed: 1500,
        margin: 5,
        dots: false,
        nav: true,
        navText: ["<i class='mdi mdi-chevron-left text-white'></i>", "<i class='mdi mdi-chevron-right text-white'></i>"],
        responsive:{
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    });

    //Blogs carousel
    $(".blog-carousel").owlCarousel({
        loop: true,
        items: 1,
        center:true,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: false,
        nav: true,
        navText: ["<i class='mdi mdi-chevron-left text-white'></i>", "<i class='mdi mdi-chevron-right text-white'></i>"],
        pagination:false,
        // onInitialized : function(el){
        //     el.find(".owl-item").eq(0).addClass("synced");
        // },
        responsive:{
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    /*Refresh Page click on Browser back button*/
    window.onpopstate = function () {
        location.reload()
    };
});
