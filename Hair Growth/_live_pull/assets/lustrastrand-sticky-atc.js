(function () {
  var bar = document.querySelector('[data-ls-sticky-atc]');
  if (!bar) return;

  document.body.classList.add('ls-has-sticky-atc');

  var variantId = bar.getAttribute('data-variant-id');
  var btn = bar.querySelector('[data-ls-sticky-add]');
  var toast = document.querySelector('[data-ls-toast]');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function openCart() {
    var link = document.querySelector('[data-ss-open-cart]');
    if (link) {
      link.click();
      return;
    }
    window.location.href = '/cart';
  }

  function refreshCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) {
        return r.json();
      })
      .then(function (cart) {
        document.querySelectorAll('[data-ss-cart-count]').forEach(function (el) {
          var n = cart.item_count || 0;
          el.textContent = n;
          el.classList.toggle('is-on', n > 0);
        });
        return cart;
      })
      .catch(function () {});
  }

  if (btn && variantId) {
    btn.addEventListener('click', function () {
      btn.disabled = true;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('add failed');
          return r.json();
        })
        .then(function () {
          return refreshCart();
        })
        .then(function () {
          showToast('Added to cart ✓');
          openCart();
        })
        .catch(function () {
          showToast('Could not add — try again');
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }
})();
