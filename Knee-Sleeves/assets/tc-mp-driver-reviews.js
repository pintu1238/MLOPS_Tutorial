(function () {
  document.querySelectorAll('[data-tc-mp-drv-rev]').forEach(function (root) {
    var track = root.querySelector('[data-tc-mp-drv-rev-track]');
    if (!track) return;

    function stepSize() {
      var card = track.querySelector('.tc-mp-drv-rev__card');
      if (!card) return 300;
      var gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * stepSize(), behavior: 'smooth' });
    }

    root.querySelectorAll('[data-tc-mp-drv-rev-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrollByDir(-1);
      });
    });
    root.querySelectorAll('[data-tc-mp-drv-rev-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrollByDir(1);
      });
    });
  });
})();
