/**
 * Horizon overrides for Shopify.actions:
 * - updateCart: emit events from the cart drawer scope.
 * - openCart: open the TORQVOLT ss-cart drawer (never redirect to /cart).
 */

function openTorqvoltCart() {
  if (typeof window.ssRefreshCart === 'function' && typeof window.ssOpenCart === 'function') {
    return window.ssRefreshCart().then(function () {
      window.ssOpenCart();
    });
  }

  /** @type {HTMLElement & { open?: () => void } | null} */
  const drawer = document.querySelector('theme-drawer#cart-drawer');
  if (drawer?.open) {
    drawer.open();
    return Promise.resolve();
  }

  return Promise.resolve();
}

function init() {
  const actions = window.Shopify?.actions;
  if (!actions) return;

  actions.updateCart.configure({
    eventTarget: () => document.querySelector('.scd') ?? document.querySelector('theme-drawer#cart-drawer') ?? document,
  });

  actions.openCart.configure({
    async handler() {
      await openTorqvoltCart();
    },
  });
}

if (window.Shopify?.actions) {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, { once: true });
}
