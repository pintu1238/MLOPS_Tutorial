(function () {
  var MOBILE_MQ = window.matchMedia('(max-width: 767px)');

  function forceMobileGrid(section) {
    if (!MOBILE_MQ.matches || !section) return;
    var toolbar = section.querySelector('tc-mp-shop-all-toolbar');
    var grid = section.querySelector('[data-tc-mp-layout-grid]');
    if (!grid || !toolbar) return;
    if (grid.classList.contains('tc-mp-shop-all__grid--list')) {
      grid.classList.remove('tc-mp-shop-all__grid--list');
      grid.classList.add('tc-mp-shop-all__grid--cols-2');
    }
    toolbar.querySelectorAll('[data-columns]').forEach(function (btn) {
      var cols = btn.getAttribute('data-columns');
      var active = cols === '2';
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function watchSection(section) {
    if (section.dataset.ksMpShopAllWatch) return;
    section.dataset.ksMpShopAllWatch = '1';
    var grid = section.querySelector('[data-tc-mp-layout-grid]');
    if (!grid) return;

    var observer = new MutationObserver(function () {
      if (MOBILE_MQ.matches && grid.classList.contains('tc-mp-shop-all__grid--list')) {
        forceMobileGrid(section);
      }
    });
    observer.observe(grid, { attributes: true, attributeFilter: ['class'] });
    forceMobileGrid(section);
  }

  function boot() {
    document.querySelectorAll('.ks-mp-shop-all').forEach(watchSection);
  }

  MOBILE_MQ.addEventListener('change', boot);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
  window.addEventListener('load', boot);
  setTimeout(boot, 120);
})();
