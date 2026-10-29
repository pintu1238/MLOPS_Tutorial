(function () {
  function initArrivals(root) {
    if (!root || root.dataset.ftArrivalsReady === 'true') return;

    var track = root.querySelector('[data-ft-arrivals-track]');
    var prev = root.querySelector('[data-ft-arrivals-prev]');
    var next = root.querySelector('[data-ft-arrivals-next]');
    var meter = root.querySelector('[data-ft-arrivals-meter-fill]');
    if (!track) return;

    root.dataset.ftArrivalsReady = 'true';

    function cardStep() {
      var item = track.querySelector(':scope > li');
      if (!item) return 240;
      var styles = getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return item.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function updateMeter() {
      if (!meter) return;
      var max = maxScroll();
      var ratio = max <= 0 ? 1 : Math.min(1, track.scrollLeft / max);
      var thumb = Math.max(0.34, track.clientWidth / Math.max(track.scrollWidth, 1));
      meter.style.width = thumb * 100 + '%';
      meter.style.transform = 'translateX(' + ratio * ((1 / thumb - 1) * 100) + '%)';
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByDir(-1); });
    if (next) next.addEventListener('click', function () { scrollByDir(1); });
    track.addEventListener('scroll', updateMeter, { passive: true });
    window.addEventListener('resize', updateMeter);

    var dragging = false;
    var startX = 0;
    var startLeft = 0;
    var moved = false;

    track.addEventListener('mousedown', function (event) {
      if (event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.pageX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });

    track.addEventListener('mousemove', function (event) {
      if (!dragging) return;
      event.preventDefault();
      var delta = event.pageX - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = startLeft - delta;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    }

    track.addEventListener('mouseup', endDrag);
    track.addEventListener('mouseleave', endDrag);
    track.addEventListener(
      'click',
      function (event) {
        if (moved) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    updateMeter();
  }

  function boot() {
    document.querySelectorAll('[data-ft-arrivals]').forEach(initArrivals);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
