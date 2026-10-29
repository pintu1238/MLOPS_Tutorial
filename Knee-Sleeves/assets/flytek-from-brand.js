(function () {
  function initFromBrandCarousel(root) {
    var track = root.querySelector('[data-ft-brand-track]');
    var prev = root.querySelector('[data-ft-brand-prev]');
    var next = root.querySelector('[data-ft-brand-next]');
    if (!track) return;

    function scrollAmount() {
      var slide = track.querySelector('.ft-brand__slide');
      if (!slide) return 320;
      var gap = parseFloat(getComputedStyle(track).gap) || 16;
      return slide.offsetWidth + gap;
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * scrollAmount(), behavior: 'smooth' });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        scrollByDir(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        scrollByDir(1);
      });
    }

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
    document.querySelectorAll('[data-ft-from-brand]').forEach(initFromBrandCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
