(function () {
  function playVideos(root) {
    root.querySelectorAll('[data-ft-pdp-video]').forEach(function (video) {
      video.muted = true;
      video.loop = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    });
  }

  function initVideoStrip(root) {
    var track = root.querySelector('[data-ft-pdp-videos-track]');
    var prev = root.querySelector('[data-ft-pdp-videos-prev]');
    var next = root.querySelector('[data-ft-pdp-videos-next]');
    if (!track) return;

    function scrollAmount() {
      var card = track.querySelector('.ft-pdp-videos__card');
      if (!card) return 200;
      var gap = parseFloat(getComputedStyle(track).gap) || 14;
      return card.offsetWidth + gap;
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }

    playVideos(root);
  }

  document.querySelectorAll('[data-ft-pdp-videos]').forEach(initVideoStrip);
})();
