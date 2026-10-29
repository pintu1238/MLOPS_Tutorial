(function () {
  function initHero(root) {
    var videos = Array.from(root.querySelectorAll('[data-tc-mp-hero-video]'));
    var copies = Array.from(root.querySelectorAll('[data-tc-mp-hero-copy]'));
    var dots = Array.from(root.querySelectorAll('[data-tc-mp-hero-dot]'));
    var prev = root.querySelector('[data-tc-mp-hero-prev]');
    var next = root.querySelector('[data-tc-mp-hero-next]');
    var toggle = root.querySelector('[data-tc-mp-hero-toggle]');
    var intervalMs = parseInt(root.getAttribute('data-interval'), 10) || 8000;
    var index = 0;
    var autoplay = true;
    var timer;

    if (!videos.length) return;

    function setSlide(nextIndex) {
      index = (nextIndex + videos.length) % videos.length;

      videos.forEach(function (video, i) {
        var active = i === index;
        video.classList.toggle('is-active', active);
        if (active && autoplay) {
          video.play().catch(function () {});
        } else {
          video.pause();
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
          autoplay ? 'Pause background video' : 'Play background video'
        );
        if (autoplay) {
          setSlide(index);
          restartTimer();
        } else {
          window.clearInterval(timer);
          videos[index].pause();
        }
      });
    }

    root.classList.add('is-playing');

    window.addEventListener(
      'resize',
      function () {
        setSlide(index);
      },
      { passive: true }
    );
  }

  document.querySelectorAll('[data-tc-mp-hero]').forEach(initHero);
})();
