(function () {
  var MOBILE_MQ = window.matchMedia('(max-width: 767px)');

  function initBestsellersCarousel(root) {
    var viewport = root.querySelector('[data-ks-mp-bs-viewport]');
    var track = root.querySelector('[data-ks-mp-bs-track]');
    var prevBtn = root.querySelector('[data-ks-mp-bs-prev]');
    var nextBtn = root.querySelector('[data-ks-mp-bs-next]');
    if (!viewport || !track) return;

    var cards = track.querySelectorAll('.ks-mp-bs__card');
    if (!cards.length) return;

    var index = 0;
    var active = false;
    var controller = null;
    var viewportW = 1;
    var dragActive = false;
    var dragStartX = 0;
    var dragStartIndex = 0;
    var slideMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380;

    function measure() {
      viewportW = viewport.offsetWidth || 1;
      return viewportW;
    }

    function applyTransform(offsetPx, animate) {
      track.style.transition =
        animate && slideMs ? 'transform ' + slideMs + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
      track.style.transform = 'translate3d(' + offsetPx + 'px, 0, 0)';
    }

    function clampIndex(i) {
      return Math.max(0, Math.min(cards.length - 1, i));
    }

    function updateButtons() {
      if (!prevBtn || !nextBtn) return;
      var disabled = cards.length <= 1;
      prevBtn.disabled = disabled || index <= 0;
      nextBtn.disabled = disabled || index >= cards.length - 1;
    }

    function goTo(i, animate) {
      index = clampIndex(i);
      measure();
      applyTransform(-index * viewportW, animate !== false);
      updateButtons();
    }

    function onPrev() {
      goTo(index - 1, true);
    }

    function onNext() {
      goTo(index + 1, true);
    }

    function onPointerDown(e) {
      if (!active || e.button > 0) return;
      dragActive = true;
      dragStartX = e.clientX;
      dragStartIndex = index;
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
      applyTransform(-index * viewportW, false);
    }

    function onPointerMove(e) {
      if (!dragActive) return;
      measure();
      var delta = e.clientX - dragStartX;
      var offset = -dragStartIndex * viewportW + delta;
      applyTransform(offset, false);
    }

    function onPointerUp(e) {
      if (!dragActive) return;
      dragActive = false;
      viewport.classList.remove('is-dragging');
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      measure();
      var delta = e.clientX - dragStartX;
      var threshold = viewportW * 0.18;
      if (delta < -threshold) goTo(dragStartIndex + 1, true);
      else if (delta > threshold) goTo(dragStartIndex - 1, true);
      else goTo(dragStartIndex, true);
    }

    function onResize() {
      if (!active) return;
      goTo(index, false);
    }

    function enable() {
      if (active) return;
      active = true;
      controller = new AbortController();
      var signal = controller.signal;
      measure();
      goTo(index, false);

      if (prevBtn) prevBtn.addEventListener('click', onPrev, { signal: signal });
      if (nextBtn) nextBtn.addEventListener('click', onNext, { signal: signal });
      viewport.addEventListener('pointerdown', onPointerDown, { signal: signal });
      viewport.addEventListener('pointermove', onPointerMove, { signal: signal });
      viewport.addEventListener('pointerup', onPointerUp, { signal: signal });
      viewport.addEventListener('pointercancel', onPointerUp, { signal: signal });
      window.addEventListener('resize', onResize, { signal: signal });
    }

    function disable() {
      if (!active) return;
      active = false;
      if (controller) controller.abort();
      controller = null;
      dragActive = false;
      viewport.classList.remove('is-dragging');
      track.style.transform = '';
      track.style.transition = '';
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    }

    function syncMode() {
      if (MOBILE_MQ.matches) enable();
      else disable();
    }

    MOBILE_MQ.addEventListener('change', syncMode);
    syncMode();
  }

  function boot() {
    document.querySelectorAll('[data-ks-mp-bs-carousel]:not([data-ks-mp-bs-init])').forEach(function (root) {
      root.setAttribute('data-ks-mp-bs-init', '');
      initBestsellersCarousel(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
