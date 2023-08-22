$(document).ready(function () {

    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })

})

var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function () {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
            $element.addClass('in-view');
        } else {
            $element.removeClass('in-view');
        }
    });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');


const nav = document.querySelector('#nav');
const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('.nav__toggle');
let isMenuOpen = false;


// TOGGLE MENU ACTIVE STATE
menuToggle.addEventListener('click', e => {
    e.preventDefault();
    isMenuOpen = !isMenuOpen;

    // toggle a11y attributes and active class
    menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
    menu.hidden = !isMenuOpen;
    nav.classList.toggle('nav--open');
});


// TRAP TAB INSIDE NAV WHEN OPEN
nav.addEventListener('keydown', e => {
    // abort if menu isn't open or modifier keys are pressed
    if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
        return;
    }

    // listen for tab press and move focus
    // if we're on either end of the navigation
    const menuLinks = menu.querySelectorAll('.nav__link');
    if (e.keyCode === 9) {
        if (e.shiftKey) {
            if (document.activeElement === menuLinks[0]) {
                menuToggle.focus();
                e.preventDefault();
            }
        } else if (document.activeElement === menuToggle) {
            menuLinks[0].focus();
            e.preventDefault();
        }
    }
});
$('#toggle').click(function () {
    $('.slide-in').toggleClass('slidlef');
})

$(function () {
    /*
    fancybox init on each cloud-zoom element
     */
    $("#content .cloud-zoom").fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'none',
        'speedIn': 600,
        'speedOut': 200,
        'overlayShow': true,
        'overlayColor': '#000',
        'cyclic': true,
        'easingIn': 'easeInOutExpo'
    });

    /*
    because the cloud zoom plugin draws a mousetrap
    div on top of the image, the fancybox click needs
    to be changed. What we do here is to trigger the click
    the fancybox expects, when we click the mousetrap div.
    We know the mousetrap div is inserted after
    the <a> we want to click:
     */
    $("#content .mousetrap").live('click', function () {
        $(this).prev().trigger('click');
    });

    /*
    the content element;
    each list item / group with several images
     */
    var $content = $('#content'),
        $thumb_list = $content.find('.thumb > ul');
    /*
    we need to set the width of each ul (sum of the children width);
    we are also defining the click events on the right and left arrows
    of each item.
     */
    $thumb_list.each(function () {
        var $this_list = $(this),
            total_w = 0,
            loaded = 0,
            //preload all the images first
            $images = $this_list.find('img'),
            total_images = $images.length;
        $images.each(function () {
            var $img = $(this);
            $('<img/>').load(function () {
                ++loaded;
                if (loaded == total_images) {
                    $this_list.data('current', 0).children().each(function () {
                        total_w += $(this).width();
                    });
                    $this_list.css('width', total_w + 'px');

                    //next / prev events

                    $this_list.parent()
                        .siblings('.next')
                        .bind('click', function (e) {
                            var current = $this_list.data('current');
                            if (current == $this_list.children().length - 1)
                                return false;
                            var next = ++current,
                                ml = -next * $this_list.children(':first')
                                .width();

                            $this_list.data('current', next)
                                .stop()
                                .animate({
                                    'marginLeft': ml + 'px'
                                }, 400);
                            e.preventDefault();
                        })
                        .end()
                        .siblings('.prev')
                        .bind('click', function (e) {
                            var current = $this_list.data('current');
                            if (current == 0) return false;
                            var prev = --current,
                                ml = -prev * $this_list.children(':first')
                                .width();

                            $this_list.data('current', prev)
                                .stop()
                                .animate({
                                    'marginLeft': ml + 'px'
                                }, 400);
                            e.preventDefault();
                        });
                }
            }).attr('src', $img.attr('src'));
        });
    });
});