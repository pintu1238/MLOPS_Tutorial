(function () {
  var SELECTOR = '[data-ks-mp-hero]';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHero(root) {
    if (!root || root.dataset.ksMpHeroReady === 'true') return;
    root.dataset.ksMpHeroReady = 'true';

    var track = root.querySelector('[data-ks-mp-hero-track]');
    var slides = Array.from(root.querySelectorAll('[data-ks-mp-hero-slide]'));
    var dots = Array.from(root.querySelectorAll('[data-ks-mp-hero-dot]'));
    var prev = root.querySelector('[data-ks-mp-hero-prev]');
    var next = root.querySelector('[data-ks-mp-hero-next]');
    var intervalMs = parseInt(root.getAttribute('data-interval'), 10) || 1500;
    if (intervalMs < 800) intervalMs = 800;

    var count = slides.length;
    if (!track || count === 0) return;

    var index = 0;
    var timer = 0;
    var hovering = false;
    var inView = true;
    var reduced = prefersReducedMotion();
    var designMode = Boolean(window.Shopify && window.Shopify.designMode);
    var pointerStartX = 0;
    var pointerDelta = 0;
    var pointerActive = false;

    function setSlide(nextIndex, instant) {
      index = ((nextIndex % count) + count) % count;
      if (instant) track.classList.add('is-instant');
      track.style.transform = 'translate3d(' + -index * 100 + '%, 0, 0)';
      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (instant) {
        window.requestAnimationFrame(function () {
          track.classList.remove('is-instant');
        });
      }
    }

    function canAutoplay() {
      return !reduced && !hovering && inView && !designMode && count > 1;
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    }

    function startTimer() {
      stopTimer();
      if (!canAutoplay()) return;
      timer = window.setInterval(function () {
        setSlide(index + 1, false);
      }, intervalMs);
    }

    setSlide(0, true);
    startTimer();

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(index - 1, false);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(index + 1, false);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = parseInt(dot.getAttribute('data-index'), 10);
        if (Number.isFinite(target)) {
          setSlide(target, false);
          startTimer();
        }
      });
    });

    root.addEventListener('mouseenter', function () {
      hovering = true;
      stopTimer();
    });
    root.addEventListener('mouseleave', function () {
      hovering = false;
      startTimer();
    });
    root.addEventListener('focusin', function () {
      hovering = true;
      stopTimer();
    });
    root.addEventListener('focusout', function (event) {
      if (!root.contains(event.relatedTarget)) {
        hovering = false;
        startTimer();
      }
    });

    root.addEventListener(
      'pointerdown',
      function (event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        pointerActive = true;
        pointerStartX = event.clientX;
        pointerDelta = 0;
      },
      { passive: true }
    );
    root.addEventListener(
      'pointermove',
      function (event) {
        if (!pointerActive) return;
        pointerDelta = event.clientX - pointerStartX;
      },
      { passive: true }
    );
    root.addEventListener('pointerup', function () {
      if (!pointerActive) return;
      pointerActive = false;
      if (Math.abs(pointerDelta) > 40) {
        setSlide(pointerDelta < 0 ? index + 1 : index - 1, false);
        startTimer();
      }
    });
    root.addEventListener('pointercancel', function () {
      pointerActive = false;
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          inView = entries[0] ? entries[0].isIntersecting : true;
          if (inView) startTimer();
          else stopTimer();
        },
        { threshold: 0.35 }
      );
      observer.observe(root);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopTimer();
      else startTimer();
    });
  }

  function initAll(scope) {
    (scope || document).querySelectorAll(SELECTOR).forEach(initHero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }

  document.addEventListener('shopify:section:load', function (event) {
    initAll(event.target);
  });
})();
