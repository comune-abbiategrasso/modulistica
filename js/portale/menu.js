var menu = function(){
    function init(){        
        $('li.separator_din.in-path').addClass('expanded').children('ul').first().show();
        
        $('li.separator_din > a').bind('click',function(){
            $(this).parent('li.separator_din').toggleClass('expanded');
//            var element = $(this).parent('li.separator_din').children('ul').first();
//            if(element.is(':visible'))
//                $(this).parent('li.separator_din').removeClass('expanded')
//            else
//                $(this).parent('li.separator_din').addClass('expanded')
            $(this).parent('li.separator_din').children('ul').slideToggle();
            return false;
        });
    }
    
    return {
        init: init
    }
}();

$(function(){
    menu.init();
});
