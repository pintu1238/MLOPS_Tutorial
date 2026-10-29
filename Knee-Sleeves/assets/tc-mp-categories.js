(function () {
  document.querySelectorAll('[data-tc-mp-cats]').forEach(function (root) {
    var track = root.querySelector('[data-tc-mp-cats-track]');
    if (!track) return;

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 4000;
    var paused = false;
    var timer;

    function stepSize() {
      var card = track.querySelector('.tc-mp-cats__card');
      if (!card) return 0;
      var gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    }

    function scrollByDir(dir) {
      var step = stepSize();
      if (!step) return;
      var max = track.scrollWidth - track.clientWidth;
      var next = track.scrollLeft + dir * step;
      if (next < 0) next = max;
      if (next > max + 4) next = 0;
      track.scrollTo({ left: next, behavior: 'smooth' });
    }

    function scrollNext() {
      if (paused) return;
      var step = stepSize();
      if (!step) return;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + step,
        behavior: 'smooth',
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(scrollNext, interval);
    }

    root.querySelectorAll('[data-tc-mp-cats-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrollByDir(-1);
      });
    });
    root.querySelectorAll('[data-tc-mp-cats-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrollByDir(1);
      });
    });

    track.addEventListener('mouseenter', function () {
      paused = true;
    });
    track.addEventListener('mouseleave', function () {
      paused = false;
    });
    track.addEventListener('focusin', function () {
      paused = true;
    });
    track.addEventListener('focusout', function () {
      paused = false;
    });
    track.addEventListener(
      'touchstart',
      function () {
        paused = true;
      },
      { passive: true }
    );

    start();
  });
})();
