(() => {
  const activeDialogs = new Map();

  const getFocusableElements = (container) => {
    if (!container) return [];
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  };

  const closeDialog = (dialog) => {
    if (!dialog) return;
    const trigger = activeDialogs.get(dialog);
    activeDialogs.delete(dialog);
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    dialog.removeAttribute('aria-busy');
    if (trigger && trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
  };

  const openDialog = (trigger) => {
    const id = trigger.getAttribute('aria-controls');
    const dialog = id ? document.getElementById(id) : null;
    if (!dialog) return;
    activeDialogs.set(dialog, trigger);
    if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    dialog.setAttribute('aria-busy', 'false');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    const focusable = getFocusableElements(dialog);
    if (focusable[0]) focusable[0].focus();
  };

  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-dialog-open]');
    if (openTrigger) {
      event.preventDefault();
      openDialog(openTrigger);
      return;
    }

    const closeTrigger = event.target.closest('[data-dialog-close]');
    if (closeTrigger) {
      event.preventDefault();
      closeDialog(closeTrigger.closest('dialog'));
      return;
    }

    const dialog = event.target.closest('dialog');
    if (dialog && event.target === dialog) closeDialog(dialog);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const dialog = event.target.closest('dialog[open]');
      if (dialog) closeDialog(dialog);
    }
  });

  document.addEventListener('cancel', (event) => {
    const dialog = event.target.closest('dialog[open]');
    if (!dialog) return;
    event.preventDefault();
    closeDialog(dialog);
  }, true);

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-disclosure-toggle]');
    if (!toggle) return;
    const id = toggle.getAttribute('aria-controls');
    const panel = id ? document.getElementById(id) : null;
    if (!panel) return;
    if (panel.tagName === 'DIALOG') return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.toggleAttribute('hidden', expanded);
  });

  window.addEventListener('pageshow', () => {
    document.documentElement.dataset.ready = 'true';
  });

  const updateCart = async (line, quantity) => {
    const response = await fetch(`${window.theme.routes.cartChange}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line, quantity })
    });
    if (!response.ok) throw new Error('Cart update failed');
    window.location.reload();
  };

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-cart-quantity]');
    if (!input) return;
    const item = input.closest('[data-cart-item]');
    const line = item?.dataset.line;
    const quantity = Math.max(0, Number(input.value) || 0);
    if (!line) return;
    input.disabled = true;
    updateCart(line, quantity).catch(() => {
      input.disabled = false;
      window.location.reload();
    });
  });

  document.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-cart-remove]');
    if (!remove) return;
    event.preventDefault();
    const item = remove.closest('[data-cart-item]');
    const line = item?.dataset.line;
    if (!line) return;
    updateCart(line, 0).catch(() => { window.location.href = remove.href; });
  });
})();
