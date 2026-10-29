(function () {
  const root = document.querySelector('.ks-mp-header');
  if (!root) return;

  const drop = root.querySelector('.ks-mp-hdr__drop');
  const trigger = root.querySelector('.ks-mp-hdr__drop-trigger');
  if (!drop || !trigger) return;

  let closeTimer = 0;

  const open = () => {
    window.clearTimeout(closeTimer);
    drop.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    window.clearTimeout(closeTimer);
    drop.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(close, 180);
  };

  drop.addEventListener('mouseenter', open);
  drop.addEventListener('mouseleave', scheduleClose);

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (drop.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener('click', (event) => {
    if (!drop.contains(event.target)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
})();
