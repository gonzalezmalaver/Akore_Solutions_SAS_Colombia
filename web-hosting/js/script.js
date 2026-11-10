$(window).on("load", function () {

    "use strict";
/* ===================================
        Loading Timeout
 ====================================== */

$('.side-menu').removeClass('hidden');

setTimeout(function(){
    $('.loader-bg').fadeToggle();
}, 1000);

// $('.navbar-collapse .navbar-nav .nav-link:nth-child(1)').addClass('active');
$('.navbar-collapse .navbar-nav .nav-link:nth-child(2)').removeClass('active');

});

jQuery(function ($) {

    "use strict";

$(window).on('scroll', function () {
    if ($(this).scrollTop() > 260) { // Set position from top to add class
        $('header').addClass('header-appear');
    } else {
        $('header').removeClass('header-appear');
    }
});

//scroll to appear
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 500)
        $('.scroll-top-arrow').fadeIn('slow');
    else
        $('.scroll-top-arrow').fadeOut('slow');
});

//Click event to scroll to top
$(document).on('click', '.scroll-top-arrow', function () {
    $('html, body').animate({scrollTop: 0}, 800);
    return false;
});

$(".scroll").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({
        scrollTop: $(this.hash).offset().top - 80
    }, 800);
});

/* ===================================
    Side Menu
====================================== */

if ($("#sidemenu_toggle").length) {
    $("#sidemenu_toggle").on("click", function () {
        $(".pushwrap").toggleClass("active");
        $(".side-menu").addClass("side-menu-active"), $("#close_side_menu").fadeIn(700)
    }), $("#close_side_menu").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $(this).fadeOut(200), $(".pushwrap").removeClass("active")
    }), $(".side-nav .navbar-nav .nav-link").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active")
    }), $("#btn_sideNavClose").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active")
    });
}

/* ===================================
    WOW Animation
====================================== */

if ($(window).width() > 991) {
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true
    });
    new WOW().init();
}

/* =====================================
     Circular Bars
====================================== */

$(".circular-wrap").appear(function () {
    $(".circle").circleProgress({
        size: 210,
        lineCap: "round",
        fill: {
            gradient: ["#00bbff", "#00bbff"],
        },
    });
    $("#circletwo").circleProgress({
        size: 210,
        lineCap: "round",
        fill: {
            gradient: ["#002450", "#002450"],
        },
    });
});

$(".circular-wrap.dark").appear(function () {
    $('.myskill').circleProgress({
        lineCap: "round",
        size: 200,
    });
});

/* ===================================
       Testimonial-Carousel
====================================== */
$('.testimonial-carousel').owlCarousel({
    loop: true,
    margin: 30,
    autoplay: true,
    nav: false,
    dots: false,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
});

/* ===================================
   Services Slider (banner) - giro continuo
====================================== */
(function () {
    var slider = document.querySelector('.services-slider');
    var track  = slider && slider.querySelector('.services-track');
    if (!track) return;

    var prevBtn = slider.querySelector('.slider-btn.prev');
    var nextBtn = slider.querySelector('.slider-btn.next');

    var SPEED = 40;             // píxeles por segundo (más alto = más rápido)
    var PAUSE_ON_HOVER = true;  // false = no se detiene al pasar el mouse
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var originals = [].slice.call(track.children);
    var n = originals.length;
    if (!n) return;

    // Contenedor que recorta (el track se mueve dentro de él)
    var viewport = document.createElement('div');
    viewport.className = 'services-viewport';
    track.parentNode.insertBefore(viewport, track);
    viewport.appendChild(track);

    var pos = 0, slideW = 0, setW = 0;
    var curSpeed = SPEED, hovering = false, dragging = false, tween = null, last = null;

    function mod(a, b) { return ((a % b) + b) % b; }

    // Clona las tarjetas las veces necesarias para que el giro sea infinito
    function build() {
        [].slice.call(track.querySelectorAll('.is-clone')).forEach(function (c) { c.remove(); });

        var oldSet = setW;
        slideW = originals[0].getBoundingClientRect().width;
        setW = slideW * n;
        if (!setW) return;
        if (oldSet) pos = pos / oldSet * setW; // conserva la posición al redimensionar

        var copies = Math.ceil(viewport.clientWidth / setW);
        for (var i = 0; i < copies; i++) {
            originals.forEach(function (el) {
                var c = el.cloneNode(true);
                c.classList.add('is-clone');
                c.setAttribute('aria-hidden', 'true');
                track.appendChild(c);
            });
        }
    }

    function render() {
        if (!setW) return;
        track.style.transform = 'translate3d(' + (-mod(pos, setW)) + 'px,0,0)';
    }

    function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function loop(ts) {
        if (last === null) last = ts;
        var dt = Math.min((ts - last) / 1000, 0.05);
        last = ts;

        if (tween) {
            var t = (ts - tween.start) / tween.dur;
            if (t >= 1) { pos = tween.to; tween = null; }
            else pos = tween.from + (tween.to - tween.from) * ease(t);
        } else if (!dragging) {
            var target = (reduceMotion || document.hidden || (PAUSE_ON_HOVER && hovering)) ? 0 : SPEED;
            curSpeed += (target - curSpeed) * Math.min(1, dt * 6); // arranque y frenado suaves
            pos += curSpeed * dt;
        }

        render();
        requestAnimationFrame(loop);
    }

    // Flechas: adelantar / devolver una tarjeta
    function jump(dir) {
        tween = { from: pos, to: pos + dir * slideW, start: performance.now(), dur: 600 };
    }
    prevBtn.addEventListener('click', function () { jump(-1); });
    nextBtn.addEventListener('click', function () { jump(1); });

    // Arrastrar con mouse o dedo
    var startX = 0, startPos = 0;
    viewport.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        tween = null;
        startX = e.clientX;
        startPos = pos;
        viewport.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        pos = startPos - (e.clientX - startX);
    });
    function endDrag() {
        if (!dragging) return;
        dragging = false;
        curSpeed = 0;
        viewport.classList.remove('is-dragging');
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // Pausa con el mouse encima (no aplica al tocar en móvil)
    viewport.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovering = true; });
    viewport.addEventListener('pointerleave', function () { hovering = false; });

    // Recalcular al redimensionar
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    window.addEventListener('load', build);

    build();
    requestAnimationFrame(loop);
})();

});