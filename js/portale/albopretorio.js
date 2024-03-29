
          var adjustContentHeight = function(){
              if($('#content-big').length)
                  $content = $('#content-big');
              else if($('#content-fs').length)
                  $content = $('#content-fs');
              else
                  $content = $('#content');
              $content.css('height',$('#sfondo').css('height'));
              $content.css('position','relative');
              $content.append($('.addthis_toolbox'));
          }

$(function(){
  // Reset Font Size
//  var defaultFontSize = $('body').css('font-size');

  // Decrease Font Size
//  $("#accessibility .small").click(function() {
//    setFontSize('small');
//  });
//
//  $("#accessibility .normal").click(function(){
//    setFontSize('normal');
//  });
//
//  // Increase Font Size
//  $("#accessibility .big").click(function(){
//    setFontSize('big');
//  });
  
//  function setFontSize(dim) {
//    $('#accessibility a').removeClass('selected');
//    var fontSize = parseFloat(defaultFontSize, 10);
//    $.cookie('font-size', (dim != 'normal') ? dim : null);
//    switch(dim) {
//      case 'small' : fontSize *= 0.8; break;
//      case 'big' : fontSize *= 1.2; break;
//      default: fontSize = 'inherit'; break;
//    }
//    $('#page').css('font-size', fontSize);
//    $('#accessibility .' + dim).addClass('selected');
//  }

//  if($.cookie('font-size')) {
//    setFontSize($.cookie('font-size'));
//  }

  $(function() {
    $('.attachments-toggler').click(function() {
      $el = $(this);
      $el.parent().next('.attachments').slideToggle(function() {
        if($(this).is(':visible')) {
          $el.text('nascondi');
        }
        else
          $el.text('mostra');
        }
      );
      return false;
    });
  });

//$(function() {
//  $("div.document").hover(
//    function() {
//      $(this).addClass("highlight");
//    },
//    function() {
//      $(this).removeClass("highlight");
//    }
//  )});

  $('input[rel=date]').each(function() {
    // var params = $.datepicker.regional['it'];
    // $(this).datepicker(params);
    // $(this).datepicker('option', $.datepicker.regional['it']);
  });
});
