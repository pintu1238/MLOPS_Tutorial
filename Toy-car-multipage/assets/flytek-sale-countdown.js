(function () {
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function init(root) {
    var end = root.getAttribute('data-end');
    var start = root.getAttribute('data-start');
    if (!end) return;
    var endMs = Date.parse(end);
    if (isNaN(endMs)) return;
    var startMs = start ? Date.parse(start) : endMs - 14 * 86400000;
    if (isNaN(startMs)) startMs = endMs - 14 * 86400000;

    var dEl = root.querySelector('[data-ft-cd-days]');
    var hEl = root.querySelector('[data-ft-cd-hours]');
    var mEl = root.querySelector('[data-ft-cd-mins]');
    var sEl = root.querySelector('[data-ft-cd-secs]');
    var barEl = root.querySelector('[data-ft-timebar-fill]');
    var liveEl = root.querySelector('[data-ft-cd-live]');
    var expiredEl = root.querySelector('[data-ft-cd-expired]');

    function tick() {
      var now = Date.now();
      var diff = endMs - now;
      if (diff <= 0) {
        if (liveEl) liveEl.hidden = true;
        if (expiredEl) expiredEl.hidden = false;
        if (barEl) barEl.style.width = '0%';
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);

      if (barEl) {
        var total = Math.max(endMs - startMs, 1);
        var elapsed = Math.min(Math.max(now - startMs, 0), total);
        var remaining = 100 - (elapsed / total) * 100;
        barEl.style.width = remaining + '%';
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  function boot() {
    document.querySelectorAll('[data-ft-sale-countdown]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
