(function () {
  if (window.__KS_MP_HEADER_STICKY__) return;
  window.__KS_MP_HEADER_STICKY__ = true;

  function scrollers() {
    var list = [window];
    var wrap = document.querySelector('.page-wrapper');
    if (wrap) list.push(wrap);
    return list;
  }

  function currentScrollTop() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var wrap = document.querySelector('.page-wrapper');
    if (wrap && wrap.scrollTop > y) y = wrap.scrollTop;
    return y;
  }

  function init() {
    var group = document.getElementById('header-group');
    if (!group) return;
    var section = group.querySelector('.ks-mp-header-section');
    var header = section ? section.querySelector('.tc-mp-hdr') : null;
    if (!section || !header) return;

    function promoHeight() {
      var total = 0;
      var kids = group.querySelectorAll('.ks-mp-header-offers-section, .ks-mp-header-countdown-section');
      for (var i = 0; i < kids.length; i++) total += kids[i].offsetHeight;
      return total;
    }

    function sync() {
      section.classList.toggle('ks-mp-header-section--pinned', currentScrollTop() >= promoHeight());
    }

    sync();
    scrollers().forEach(function (node) {
      node.addEventListener('scroll', sync, { passive: true });
    });
    window.addEventListener('resize', sync, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(sync);
      ro.observe(header);
      group.querySelectorAll('.ks-mp-header-offers-section, .ks-mp-header-countdown-section').forEach(function (el) {
        ro.observe(el);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
