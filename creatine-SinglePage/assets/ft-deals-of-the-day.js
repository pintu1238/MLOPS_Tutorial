(function () {
  function initDeals(root) {
    if (!root || root.dataset.ftDealsReady === 'true') return;

    var track = root.querySelector('[data-ft-deals-track]');
    var prev = root.querySelector('[data-ft-deals-prev]');
    var next = root.querySelector('[data-ft-deals-next]');
    if (!track) return;

    root.dataset.ftDealsReady = 'true';

    function cardStep() {
      var item = track.querySelector(':scope > li');
      if (!item) return 280;
      var styles = getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return item.getBoundingClientRect().width + gap;
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByDir(-1); });
    if (next) next.addEventListener('click', function () { scrollByDir(1); });

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

    root.querySelectorAll('[data-ft-deals-wish]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var on = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', on ? 'false' : 'true');
        btn.classList.toggle('is-on', !on);
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-ft-deals]').forEach(initDeals);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
