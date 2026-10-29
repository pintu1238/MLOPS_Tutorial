/**
 * New Arrivals collection — Lavie-style cards: color swatches update hero image + cart target.
 */

function initGwNaCards(root = document) {
  root.querySelectorAll('[data-gw-na-card]').forEach((card) => {
    if (card.getAttribute('data-gw-na-bound') === 'true') return;
    card.setAttribute('data-gw-na-bound', 'true');

    const mainImg = card.querySelector('[data-gw-na-main-image]');
    const mediaLink = card.querySelector('[data-gw-na-media-link]');
    const titleLink = card.querySelector('[data-gw-na-title-link]');
    const cartBtn = card.querySelector('[data-gw-na-add-cart]');

    card.querySelectorAll('[data-gw-na-swatch]').forEach((swatch) => {
      swatch.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const image = swatch.getAttribute('data-image');
        const alt = swatch.getAttribute('data-alt') || '';
        const url = swatch.getAttribute('data-url');
        const variantId = swatch.getAttribute('data-variant-id');

        if (mainImg instanceof HTMLImageElement && image) {
          mainImg.src = image;
          mainImg.alt = alt;
        }
        if (mediaLink instanceof HTMLAnchorElement && url) mediaLink.href = url;
        if (titleLink instanceof HTMLAnchorElement && url) titleLink.href = url;
        if (cartBtn instanceof HTMLElement && variantId) {
          cartBtn.setAttribute('data-variant-id', variantId);
        }

        card.querySelectorAll('[data-gw-na-swatch]').forEach((btn) => {
          btn.classList.toggle('is-selected', btn === swatch);
          btn.setAttribute('aria-pressed', btn === swatch ? 'true' : 'false');
        });
      });
    });

    const cart = card.querySelector('[data-gw-na-add-cart]');
    cart?.addEventListener('click', async (event) => {
      event.preventDefault();
      const variantId = cart.getAttribute('data-variant-id');
      if (!variantId) return;

      cart.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
        });
        if (!response.ok) throw new Error('add failed');
        document.dispatchEvent(new CustomEvent('cart:update'));
      } catch {
        /* silent */
      } finally {
        cart.removeAttribute('aria-busy');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initGwNaCards(), { once: true });
} else {
  initGwNaCards();
}

document.addEventListener('shopify:section:load', (event) => {
  if (event.target) initGwNaCards(event.target);
});
