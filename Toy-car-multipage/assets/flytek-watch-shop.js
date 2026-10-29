(function () {
  function playAllVideos(root) {
    root.querySelectorAll('[data-ft-watch-video]').forEach(function (video) {
      video.muted = true;
      video.loop = true;
      var p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () {});
      }
    });
  }

  function initWatchCarousel(root) {
    var track = root.querySelector('[data-ft-watch-track]');
    var prev = root.querySelector('[data-ft-watch-prev]');
    var next = root.querySelector('[data-ft-watch-next]');
    if (!track) return;

    var scrollAmount = function () {
      var card = track.querySelector('.ft-watch__card');
      if (!card) return 280;
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

    function centerDominantCard() {
      var card = track.querySelector('.ft-watch__card');
      if (!card || !track.clientWidth) return;
      if (card.offsetWidth < track.clientWidth * 0.5) return;
      var cards = track.querySelectorAll('.ft-watch__card');
      var target = cards.length > 1 ? cards[1] : cards[0];
      var left = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
      var previous = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = Math.max(0, left);
      track.style.scrollBehavior = previous;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(centerDominantCard);
    });

    playAllVideos(root);

    root.querySelectorAll('[data-ft-watch-video]').forEach(function (video) {
      video.addEventListener('ended', function () {
        video.currentTime = 0;
        video.play();
      });
      video.addEventListener('pause', function () {
        if (!document.hidden) {
          video.play().catch(function () {});
        }
      });
    });

    if (typeof IntersectionObserver !== 'undefined') {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting) {
              video.play().catch(function () {});
            }
          });
        },
        { rootMargin: '80px', threshold: 0.1 }
      );
      root.querySelectorAll('[data-ft-watch-video]').forEach(function (video) {
        observer.observe(video);
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) playAllVideos(root);
    });
  }

  function boot() {
    document.querySelectorAll('[data-ft-watch-carousel]').forEach(initWatchCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
