(function () {
  function initSpin3d(root) {
    const pivot = root.querySelector('[data-ft-3d-pivot]');
    if (!pivot) return;

    let rotY = -18;
    let rotX = 8;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pointerId = null;
    let velY = 0;
    let velX = 0;
    let raf = 0;

    const dragSens = 0.42;
    const maxTilt = 52;
    const friction = 0.92;
    const minVel = 0.08;

    function applyTransform() {
      pivot.style.transform =
        'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
    }

    function tick() {
      if (!dragging && (Math.abs(velY) > minVel || Math.abs(velX) > minVel)) {
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-maxTilt, Math.min(maxTilt, rotX));
        velY *= friction;
        velX *= friction;
        applyTransform();
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = 0;
      velX = 0;
      if (raf) cancelAnimationFrame(raf);
      root.classList.add('is-dragging');
      root.setPointerCapture(e.pointerId);
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * dragSens;
      rotX -= dy * dragSens;
      rotX = Math.max(-maxTilt, Math.min(maxTilt, rotX));
      velY = dx * dragSens * 0.35;
      velX = -dy * dragSens * 0.35;
      applyTransform();
    }

    function onPointerUp(e) {
      if (e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      root.classList.remove('is-dragging');
      try {
        root.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);
    root.addEventListener('lostpointercapture', onPointerUp);

    applyTransform();
  }

  function boot() {
    document.querySelectorAll('[data-ft-3d]').forEach(initSpin3d);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
