(function () {
  var bar = document.querySelector('[data-ls-sticky-atc]');
  if (!bar) return;

  document.body.classList.add('ls-has-sticky-atc');

  var btn = bar.querySelector('[data-ls-sticky-add]');
  var priceEl = bar.querySelector('[data-ls-sticky-price]');
  var toast = document.querySelector('[data-ls-toast]');
  var buyRoot = document.querySelector('[data-hs-pdp]');
  var scrollTargetAttr = bar.getAttribute('data-scroll-target');
  var scrollTarget = scrollTargetAttr ? scrollTargetAttr.trim() : '';
  var targetEl = scrollTarget ? document.querySelector(scrollTarget) : null;

  function variantIdFromBuyBox() {
    if (!buyRoot) return bar.getAttribute('data-variant-id');
    var input = buyRoot.querySelector('[data-hs-variant-id]');
    return (input && input.value) || bar.getAttribute('data-variant-id');
  }

  function qtyFromChewsTier() {
    var tier = document.querySelector('#ssTiers .tier.sel');
    if (!tier) return null;
    var n = parseInt(tier.getAttribute('data-qty'), 10);
    return isFinite(n) && n > 0 ? n : null;
  }

  function qtyFromBuyBox() {
    var tierQty = qtyFromChewsTier();
    if (tierQty) return tierQty;
    if (!buyRoot) return 1;
    var qty = buyRoot.querySelector('[data-hs-qty]');
    var n = parseInt(qty && qty.value, 10);
    return isFinite(n) && n > 0 ? Math.min(10, n) : 1;
  }

  function syncPriceFromChewsTier() {
    if (!priceEl) return;
    var tier = document.querySelector('#ssTiers .tier.sel');
    if (!tier) return;
    var now = tier.querySelector('[data-now]');
    if (now && now.textContent) priceEl.textContent = now.textContent.trim();
  }

  function syncPriceFromBuyBox() {
    if (!buyRoot || !priceEl) return;
    var main = buyRoot.querySelector('[data-hs-price]');
    if (main && main.textContent) priceEl.textContent = main.textContent.trim();
  }

  document.addEventListener('ls:buybox-update', function (e) {
    var d = e.detail || {};
    if (priceEl && d.priceText) priceEl.textContent = d.priceText;
    if (d.variantId) bar.setAttribute('data-variant-id', d.variantId);
    if (btn) btn.disabled = d.available === false;
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function openCart() {
    if (typeof window.ssOpenCart === 'function') {
      if (typeof window.ssRefreshCart === 'function') {
        window.ssRefreshCart().then(window.ssOpenCart);
      } else {
        window.ssOpenCart();
      }
      return;
    }
    var link = document.querySelector('[data-ss-open-cart]');
    if (link) {
      link.click();
      return;
    }
    window.location.href = '/cart';
  }

  function refreshCart() {
    if (typeof window.ssRefreshCart === 'function') return window.ssRefreshCart();
    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .catch(function () {});
  }

  function updateVisibility() {
    if (!targetEl) {
      bar.classList.add('is-visible');
      bar.setAttribute('aria-hidden', 'false');
      return;
    }
    var rect = targetEl.getBoundingClientRect();
    var show = rect.bottom < 0 || window.scrollY > rect.height * 0.55;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  syncPriceFromBuyBox();
  syncPriceFromChewsTier();
  document.addEventListener('click', function (e) {
    if (e.target.closest('#ssTiers .tier')) {
      setTimeout(syncPriceFromChewsTier, 0);
    }
  });
  document.addEventListener('ls:chews-tier', function () {
    syncPriceFromChewsTier();
  });
  updateVisibility();

  if (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled || btn.getAttribute('data-ls-sticky-busy') === '1') return;
      btn.setAttribute('data-ls-sticky-busy', '1');
      btn.disabled = true;
      var id = parseInt(variantIdFromBuyBox(), 10);
      var quantity = qtyFromBuyBox();
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: id, quantity: quantity }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('add failed');
          return r.json();
        })
        .then(refreshCart)
        .then(function () {
          showToast('Added to cart ✓');
          openCart();
        })
        .catch(function () {
          showToast('Could not add — try again');
        })
        .finally(function () {
          btn.removeAttribute('data-ls-sticky-busy');
          btn.disabled = false;
          syncPriceFromBuyBox();
        });
    });
  }
})();
