(function () {
  function initReviewsCarousel(root) {
    var track = root.querySelector('[data-ft-reviews-track]');
    var prev = root.querySelector('[data-ft-reviews-prev]');
    var next = root.querySelector('[data-ft-reviews-next]');
    if (!track) return;

    var scrollAmount = function () {
      var card = track.querySelector('.ft-review');
      if (!card) return 300;
      var gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    };

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

    var touchX = 0;
    track.addEventListener('touchstart', function (event) {
      touchX = event.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', function (event) {
      var dx = touchX - event.touches[0].clientX;
      track.scrollLeft += dx;
      touchX = event.touches[0].clientX;
    }, { passive: true });
  }

  function boot() {
    document.querySelectorAll('[data-ft-reviews-carousel]').forEach(initReviewsCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
