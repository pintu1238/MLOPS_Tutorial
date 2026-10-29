(function () {
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function init(root) {
    var end = root.getAttribute('data-end');
    if (!end) return;
    var endMs = Date.parse(end);
    if (isNaN(endMs)) return;

    var dEl = root.querySelector('[data-cd-days]');
    var hEl = root.querySelector('[data-cd-hours]');
    var mEl = root.querySelector('[data-cd-mins]');
    var sEl = root.querySelector('[data-cd-secs]');
    var expiredEl = root.querySelector('[data-cd-expired]');
    var liveEl = root.querySelector('[data-cd-live]');

    function tick() {
      var diff = endMs - Date.now();
      if (diff <= 0) {
        if (liveEl) liveEl.hidden = true;
        if (expiredEl) expiredEl.hidden = false;
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = days + 'd';
      if (hEl) hEl.textContent = pad(hours) + 'h';
      if (mEl) mEl.textContent = pad(mins) + 'm';
      if (sEl) sEl.textContent = pad(secs) + 's';
    }

    tick();
    setInterval(tick, 1000);
  }

  document.querySelectorAll('[data-ls-countdown]').forEach(init);
})();
