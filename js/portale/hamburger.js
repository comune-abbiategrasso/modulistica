jQuery(document).ready(function () {

    //Open the menu
    jQuery("#hamburger").click(function () {

        jQuery('#sfondo').css('min-height', jQuery(window).height());

        jQuery('nav').css('opacity', 1);

        //set the width of primary content container -> content should not scale while animating
        var contentWidth = jQuery('#sfondo').width();

        //set the content with the width that it has originally
        jQuery('#sfondo').css('width', contentWidth);

        //display a layer to disable clicking and scrolling on the content while menu is shown
        jQuery('#contentLayer').css('display', 'block');

        //disable all scrolling on mobile devices while menu is shown
        jQuery('#container').bind('touchmove', function (e) {
            e.preventDefault()
        });

        //set margin for the whole container with a jquery UI animation
        jQuery("#container").animate({"marginLeft": ["72%", 'easeOutExpo']}, {
            duration: 700
        });
        //set margin for the whole container with a jquery UI animation
        jQuery("#change-mode").animate({"marginLeft": ["72%", 'easeOutExpo']}, {
            duration: 700
        });
		        //set margin for the whole container with a jquery UI animation
        jQuery("#link-istituzionali").animate({"marginLeft": ["72%", 'easeOutExpo']}, {
            duration: 700
        });

    });

    //close the menu
    jQuery("#contentLayer").click(function () {

        //enable all scrolling on mobile devices when menu is closed
        jQuery('#container').unbind('touchmove');
        jQuery('#change-mode').unbind('touchmove');
        jQuery('#link-istituzionali').unbind('touchmove');

        //set margin for the whole container back to original state with a jquery UI animation
        jQuery("#container").animate({"marginLeft": ["2%", 'easeOutExpo'],}, {
            duration: 700,
            complete: function () {
                jQuery('#sfondo').css('width', 'auto');
                jQuery('#contentLayer').css('display', 'none');
                jQuery('nav').css('opacity', 0);
                jQuery('#sfondo').css('min-height', 'auto');

            }
        });
        jQuery("#change-mode").animate({"marginLeft": ["2%", 'easeOutExpo'],}, {
            duration: 700,

        });
        jQuery("#link-istituzionali").animate({"marginLeft": ["2%", 'easeOutExpo'],}, {
            duration: 700,

        });
    });

});