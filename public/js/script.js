jQuery(function ($) {

    'use strict';

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

    $('#toggleEye').on('click', function(){
        if($(this).hasClass('mdi-eye-off')){
            $(this).removeClass('mdi-eye-off');
            $(this).addClass('mdi-eye');
            $('#password').attr('type','text');
        }else{
            $(this).removeClass('mdi-eye');
            $(this).addClass('mdi-eye-off');
            $('#password').attr('type','password');
        }
    });

   
    $('#toggleEye1').on('click', function(){
        if($(this).hasClass('mdi-eye-off')){
            $(this).removeClass('mdi-eye-off');
            $(this).addClass('mdi-eye');
            $('#cnfpassword').attr('type','text');
        }else{
            $(this).removeClass('mdi-eye');
            $(this).addClass('mdi-eye-off');
            $('#cnfpassword').attr('type','password');
        }
    });

    //  $("#changepassword").validate({
    //     rules: {
    //         new_password: "required",
    //         cnf_password: {
    //             equalTo: "#new_password"
    //         }
    //     },
    //     messages: {
    //         new_password: " Enter Password",
    //         cnf_password: " Enter Confirm Password Same as Password"
    //     }
    // });
    

    /*Refresh Page click on Browser back button*/
    window.onpopstate = function () {
        location.reload()
    };
});
