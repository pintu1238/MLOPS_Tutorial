(() => {
  const initProduct = (root) => {
    const form = root.querySelector('form.shopify-product-form');
    const variantInput = root.querySelector('[data-variant-id]');
    const price = root.querySelector('[data-price]');
    const comparePrice = root.querySelector('[data-compare-price]');
    const availability = root.querySelector('[data-availability]');
    const addButton = root.querySelector('[data-add-to-cart]');
    const heroImage = root.querySelector('[data-hero-image]');
    const mediaCount = root.querySelector('[data-media-count]');
    const thumbs = [...root.querySelectorAll('[data-media-id]')];
    const variantsNode = root.querySelector('[data-variants]');
    const optionInputs = [...root.querySelectorAll('[data-option-index]')];
    const variants = variantsNode ? JSON.parse(variantsNode.textContent) : [];
    const currency = root.dataset.currency || 'USD';
    const moneyFormat = root.dataset.moneyFormat || '${{amount}}';

    const formatMoney = (cents) => {
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
        return window.Shopify.formatMoney(cents, moneyFormat);
      }
      try {
        return new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency }).format(cents / 100);
      } catch (error) {
        return `${(cents / 100).toFixed(2)} ${currency}`;
      }
    };

    const getSelectedOptions = () => optionInputs.map((input) => input.value);

    const findVariant = () => {
      const selected = getSelectedOptions();
      return variants.find((variant) => selected.every((value, index) => variant[`option${index + 1}`] === value));
    };

    const setActiveMedia = (button) => {
      if (!button || !heroImage) return;
      heroImage.src = button.dataset.mediaSrc;
      heroImage.alt = button.dataset.mediaAlt || '';
      thumbs.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button));
      if (mediaCount) {
        const index = thumbs.indexOf(button) + 1;
        mediaCount.textContent = `${index} / ${thumbs.length}`;
      }
    };

    const updateVariant = () => {
      const variant = findVariant();
      if (!variant) {
        if (variantInput) variantInput.value = '';
        if (addButton) {
          addButton.disabled = true;
          addButton.textContent = addButton.dataset.soldLabel;
        }
        if (availability) {
          availability.textContent = addButton ? addButton.dataset.soldLabel : 'Sold out';
          availability.classList.add('is-unavailable');
        }
        return;
      }

      if (variantInput) variantInput.value = variant.id;
      if (price) {
        price.textContent = formatMoney(variant.price);
        price.dataset.priceValue = variant.price;
      }
      if (comparePrice) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          comparePrice.hidden = false;
          comparePrice.textContent = formatMoney(variant.compare_at_price);
        } else {
          comparePrice.hidden = true;
          comparePrice.textContent = '';
        }
      }
      if (addButton) {
        addButton.disabled = !variant.available;
        addButton.textContent = variant.available ? addButton.dataset.addLabel : addButton.dataset.soldLabel;
      }
      if (availability) {
        availability.textContent = variant.available ? 'In stock' : 'Sold out';
        availability.classList.toggle('is-unavailable', !variant.available);
      }
      if (variant.featured_media && variant.featured_media.id) {
        const matchingThumb = thumbs.find((thumb) => String(thumb.dataset.mediaId) === String(variant.featured_media.id));
        setActiveMedia(matchingThumb);
      }
    };

    optionInputs.forEach((input) => input.addEventListener('change', updateVariant));
    thumbs.forEach((thumb) => thumb.addEventListener('click', () => setActiveMedia(thumb)));

    const quantityInput = root.querySelector('[data-quantity-input]');
    root.querySelector('[data-quantity-decrease]')?.addEventListener('click', () => {
      if (quantityInput) quantityInput.value = Math.max(1, Number(quantityInput.value || 1) - 1);
    });
    root.querySelector('[data-quantity-increase]')?.addEventListener('click', () => {
      if (quantityInput) quantityInput.value = Number(quantityInput.value || 1) + 1;
    });

    form?.addEventListener('submit', () => {
      if (variantInput && !variantInput.value) updateVariant();
    });
    updateVariant();
  };

  const boot = () => document.querySelectorAll('[data-product-section]').forEach(initProduct);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

