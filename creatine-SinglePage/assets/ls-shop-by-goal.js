(function () {
  function initShopGoalCarousel(root) {
    if (!root || root.dataset.lsShopGoalReady === 'true') return;

    var track = root.querySelector('[data-ls-shop-goal-track]');
    var prev = root.querySelector('[data-ls-shop-goal-prev]');
    var next = root.querySelector('[data-ls-shop-goal-next]');
    if (!track) return;

    root.dataset.lsShopGoalReady = 'true';

    function scrollAmount() {
      var item = track.querySelector(':scope > li');
      if (!item) return 240;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
      return item.offsetWidth + gap;
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * scrollAmount(), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByDir(-1); });
    if (next) next.addEventListener('click', function () { scrollByDir(1); });

    var isDragging = false;
    var dragStartX = 0;
    var dragScrollLeft = 0;
    var dragMoved = false;

    track.addEventListener('mousedown', function (event) {
      if (event.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      dragStartX = event.pageX;
      dragScrollLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });

    track.addEventListener('mousemove', function (event) {
      if (!isDragging) return;
      event.preventDefault();
      var delta = event.pageX - dragStartX;
      if (Math.abs(delta) > 4) dragMoved = true;
      track.scrollLeft = dragScrollLeft - delta;
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
    }

    track.addEventListener('mouseup', endDrag);
    track.addEventListener('mouseleave', endDrag);

    track.addEventListener(
      'click',
      function (event) {
        if (dragMoved) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
  }

  function boot() {
    document.querySelectorAll('[data-ls-shop-goal-carousel]').forEach(initShopGoalCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
