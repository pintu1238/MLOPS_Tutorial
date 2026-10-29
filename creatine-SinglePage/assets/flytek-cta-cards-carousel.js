(function () {
  function initCtaCardsCarousel(root) {
    var viewport = root.querySelector('[data-ft-cta-cards-viewport]') || root;
    var track = root.querySelector('[data-ft-cta-cards-track]');
    var prev = root.querySelector('[data-ft-cta-cards-prev]');
    var next = root.querySelector('[data-ft-cta-cards-next]');
    if (!track) return;

    var cards = track.querySelectorAll('.ft-cta__card');
    var index = 0;
    var drag = null;
    var suppressClick = false;

    function isSlideMode() {
      return window.matchMedia('(max-width: 767px)').matches;
    }

    function maxIndex() {
      return Math.max(0, cards.length - 1);
    }

    function cardStep() {
      var card = cards[0];
      if (!card) return viewport.clientWidth || 220;
      return card.getBoundingClientRect().width;
    }

    function offsetFor(i) {
      return -(i * cardStep());
    }

    function setDragging(on) {
      track.classList.toggle('is-dragging', on);
    }

    function setX(x) {
      track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
    }

    function clearSlide() {
      setDragging(false);
      track.style.transform = '';
    }

    function goTo(nextIndex, animate) {
      if (!isSlideMode()) {
        clearSlide();
        return;
      }

      index = Math.min(maxIndex(), Math.max(0, nextIndex));
      var x = offsetFor(index);
      if (animate === false) {
        setDragging(true);
        setX(x);
        void track.offsetWidth;
        setDragging(false);
        return;
      }
      setDragging(false);
      void track.offsetWidth;
      setX(x);
    }

    if (prev) prev.addEventListener('click', function () { goTo(index - 1, true); });
    if (next) next.addEventListener('click', function () { goTo(index + 1, true); });

    viewport.addEventListener('pointerdown', function (event) {
      if (!isSlideMode()) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        base: offsetFor(index),
        moved: false
      };
      suppressClick = false;
      setDragging(true);
      setX(drag.base);
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch (err) {}
    });

    viewport.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      var delta = event.clientX - drag.x;
      if (Math.abs(delta) > 6) drag.moved = true;
      setX(drag.base + delta);
    });

    function endDrag(event) {
      if (!drag || (event && event.pointerId !== drag.id)) return;
      var delta = event && typeof event.clientX === 'number' ? event.clientX - drag.x : 0;
      var moved = drag.moved;
      var threshold = Math.max(40, cardStep() * 0.18);
      drag = null;
      if (moved) {
        suppressClick = true;
        if (delta <= -threshold) goTo(index + 1, true);
        else if (delta >= threshold) goTo(index - 1, true);
        else goTo(index, true);
      } else {
        goTo(index, true);
      }
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    viewport.addEventListener(
      'click',
      function (event) {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      },
      true
    );

    window.addEventListener('resize', function () {
      goTo(index, false);
    });

    goTo(0, false);
  }

  function boot() {
    document.querySelectorAll('[data-ft-cta-cards-carousel]').forEach(initCtaCardsCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
