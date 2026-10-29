(function () {
  function boot() {
    document.querySelectorAll('[data-eb-mp-hero-video]').forEach(function (video) {
      video.muted = true;
      var play = video.play();
      if (play && typeof play.catch === 'function') {
        play.catch(function () {});
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
