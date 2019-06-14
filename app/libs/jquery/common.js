$(document).ready(function() {
	$("body").niceScroll({
horizrailenabled:false
});
var $win = $(window),
    $fixed = $(".logo_box img"),
    limit = 750;

function tgl (state) {
    $fixed.toggleClass("hiddenad", state);
}

$win.on("scroll", function () {
    var top = $win.scrollTop();

    if (top > limit) {
        tgl(true);
        $('.top-line .container').removeClass('container').addClass('container-fluid').animate('slow');

    } else {
        tgl(false);
          $('.top-line .container-fluid').removeClass('container-fluid').addClass('container').animate('slow');
    }
});

// начало табов
  var tabs = $('.cd-tabs');

  tabs.each(function(){
    var tab = $(this),
      tabItems = tab.find('ul.cd-tabs-navigation'),
      tabContentWrapper = tab.children('ul.cd-tabs-content'),
      tabNavigation = tab.find('nav');

    tabItems.on('click', 'a', function(event){
      event.preventDefault();
      var selectedItem = $(this);
      if( !selectedItem.hasClass('selected') ) {
        var selectedTab = selectedItem.data('content'),
          selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
          slectedContentHeight = selectedContent.innerHeight();

        tabItems.find('a.selected').removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');
        //animate tabContentWrapper height when content changes
        tabContentWrapper.animate({
          'height': slectedContentHeight
        }, 200);
      }
    });

    //hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
    checkScrolling(tabNavigation);
    tabNavigation.on('scroll', function(){
      checkScrolling($(this));
    });
  });

  $(window).on('resize', function(){
    tabs.each(function(){
      var tab = $(this);
      checkScrolling(tab.find('nav'));
      tab.find('.cd-tabs-content').css('height', 'auto');
    });
  });

  function checkScrolling(tabs){
    var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
      tabsViewport = parseInt(tabs.width());
    if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.cd-tabs').addClass('is-ended');
    } else {
      tabs.parent('.cd-tabs').removeClass('is-ended');
    }
  }


// make height div
// $(".name class").equalHeights();
$(".price_box").equalHeights();

//button top scroll hiddens
$(window).scroll(function() {
if ($(this).scrollTop() > $(this).height()) {
  $(".button-top").addClass("active");
} else
{   $(".button-top").removeClass("active");
}
});

  $(".owl-carousel").owlCarousel({
margin:20,
loop:true

  });



// pagination on lending pages
$(".top-line_menu ul li a, #my-menu ul li a").mPageScroll2id({
layout                 : "auto",
// offset                 : ".top-line",
scrollEasing           : "linear",
highlightByNextTarget  : true,
keepHighlightUntilNext : true,
autoScrollSpeed        : true,
scrollSpeed            : 1000
});

// popup formes
$("a[href='#call-back']").magnificPopup ({
  mainClass    : 'mfp-fade',
  removalDelay : 400,
  type         : 'inline',
});

/*resive indivsdual input */
$("a[href='#call-back']").click(function(){
  var dataForm = $(this).data("form");
  var dataText = $(this).data("text");
  $(".forms-call h4").text(dataText);
  $(".forms-call [name=admin-data]").val(dataForm);
});




//Ajax push mesege http://api.jquery.com/jquery.ajax/

$("form").submit(function() { //Change
    var th = $(this);
    $.ajax({
      type: "POST",
      url: "mail.php", //Change
      data: th.serialize()
    }).done(function() {
      $(".forms-calldecor .success").addClass("active");
      setTimeout(function() {
        // Done Functions
        $(".forms-calldecor .success").removeClass("active");
        th.trigger("reset");
        $.magnificPopup.close();
      }, 3000);
    });
    return false;
  });
//castom code


// mmenu began
$('#my-menu').mmenu ({
    "pageScroll": true,
 extensions: [
"theme-black",
"fx-listitems-fade"
],
navbar:
 {
 	title: 'меню'
},
 "offCanvas": {
"position": "left",
zposition : "front"
}
});

var $icon = $(".hamburger");
var API = $('#my-menu').data( "mmenu" );
$icon.on( "click", function() {
   API.open();
});

API.bind( "open:finish", function() {
    $icon.addClass( "is-active" );
});

API.bind( "close:finish", function() {
 $icon.removeClass( "is-active" );
});





});