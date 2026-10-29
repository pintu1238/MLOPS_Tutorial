(function () {
  function initHero(root) {
    var slides = Array.from(root.querySelectorAll('[data-eb-mp-hero-slide]'));
    var copies = Array.from(root.querySelectorAll('[data-eb-mp-hero-copy]'));
    var dots = Array.from(root.querySelectorAll('[data-eb-mp-hero-dot]'));
    var prev = root.querySelector('[data-eb-mp-hero-prev]');
    var next = root.querySelector('[data-eb-mp-hero-next]');
    var toggle = root.querySelector('[data-eb-mp-hero-toggle]');
    var intervalMs = parseInt(root.getAttribute('data-interval'), 10) || 8000;
    var index = 0;
    var autoplay = true;
    var timer;

    if (!slides.length) return;

    function activeVideo() {
      var slide = slides[index];
      return slide && slide.tagName === 'VIDEO' ? slide : null;
    }

    function setSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle('is-active', active);
        if (slide.tagName === 'VIDEO') {
          if (active && autoplay) {
            slide.play().catch(function () {});
          } else {
            slide.pause();
          }
        }
      });

      copies.forEach(function (copy, i) {
        copy.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function restartTimer() {
      window.clearInterval(timer);
      if (!autoplay) return;
      timer = window.setInterval(function () {
        setSlide(index + 1);
      }, intervalMs);
    }

    setSlide(0);
    restartTimer();

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(index - 1);
        restartTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(index + 1);
        restartTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = parseInt(dot.getAttribute('data-index'), 10);
        if (Number.isFinite(target)) {
          setSlide(target);
          restartTimer();
        }
      });
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        autoplay = !autoplay;
        root.classList.toggle('is-playing', autoplay);
        toggle.setAttribute(
          'aria-label',
          autoplay ? 'Pause slideshow' : 'Play slideshow'
        );
        if (autoplay) {
          setSlide(index);
          restartTimer();
        } else {
          window.clearInterval(timer);
          var v = activeVideo();
          if (v) v.pause();
        }
      });
    }

    root.classList.add('is-playing');
  }

  document.querySelectorAll('[data-eb-mp-hero]').forEach(initHero);
})();
