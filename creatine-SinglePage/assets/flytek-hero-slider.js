(function () {
  var INTERVAL_MS = 2500;

  function initHeroSlider(root) {
    if (!root || root.dataset.ftHeroSliderReady === 'true') return;

    var slides = root.querySelectorAll('[data-ft-hero-slide]');
    var dots = root.querySelectorAll('[data-ft-hero-dot]');
    var prev = root.querySelector('[data-ft-hero-prev]');
    var next = root.querySelector('[data-ft-hero-next]');
    if (slides.length < 2) return;

    root.dataset.ftHeroSliderReady = 'true';

    var index = 0;
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(nextIndex) {
      var total = slides.length;
      index = ((nextIndex % total) + total) % total;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        var on = i === index;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-current', on ? 'true' : 'false');
      });
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (reduceMotion) return;
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, INTERVAL_MS);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        goTo(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        goTo(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function (event) {
      if (!root.contains(event.relatedTarget)) start();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    goTo(0);
    start();
  }

  function initHeroBanner(root) {
    if (!root || root.dataset.ftHeroBannerReady === 'true') return;

    var bgs = root.querySelectorAll('[data-ft-hero-bgs] img');
    var copies = root.querySelectorAll('[data-ft-hero-copy-slide]');
    var total = Math.max(bgs.length, copies.length);
    if (total < 2) return;

    root.dataset.ftHeroBannerReady = 'true';

    var index = 0;
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(nextIndex) {
      index = ((nextIndex % total) + total) % total;
      bgs.forEach(function (img, i) {
        img.classList.toggle('is-active', i === index);
      });
      copies.forEach(function (slide, i) {
        var on = i === index;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (reduceMotion) return;
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, INTERVAL_MS);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    goTo(0);
    start();
  }

  function boot() {
    document.querySelectorAll('[data-ft-hero-slider]').forEach(initHeroSlider);
    document.querySelectorAll('[data-ft-hero-banner]').forEach(initHeroBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
