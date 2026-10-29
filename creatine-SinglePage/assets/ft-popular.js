(function () {
  function initPopular(root) {
    if (!root || root.dataset.ftPopularReady === 'true') return;
    root.dataset.ftPopularReady = 'true';

    var tabs = root.querySelectorAll('[data-ft-popular-tab]');
    var panels = root.querySelectorAll('[data-ft-popular-panel]');
    var track = root.querySelector('[data-ft-popular-track]');
    var prev = root.querySelector('[data-ft-popular-prev]');
    var next = root.querySelector('[data-ft-popular-next]');

    function showPanel(id) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-ft-popular-tab') === id;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        var on = panel.getAttribute('data-ft-popular-panel') === id;
        panel.hidden = !on;
      });
      root.setAttribute('data-ft-popular-view', id);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        showPanel(tab.getAttribute('data-ft-popular-tab'));
      });
    });

    function cardStep() {
      if (!track) return 280;
      var item = track.querySelector(':scope > li');
      if (!item) return 280;
      var styles = getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return item.getBoundingClientRect().width + gap;
    }

    function scrollByDir(dir) {
      if (!track) return;
      track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByDir(-1); });
    if (next) next.addEventListener('click', function () { scrollByDir(1); });

    if (track) {
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
    }

    root.querySelectorAll('[data-ft-popular-wish]').forEach(function (btn) {
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
    document.querySelectorAll('[data-ft-popular]').forEach(initPopular);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
