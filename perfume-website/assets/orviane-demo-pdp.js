(() => {
  const STORAGE_KEY = 'orvianeDemoPdp';

  const readCatalog = () => {
    const el = document.getElementById('orviane-demo-catalog');
    if (!el?.textContent) return [];
    try {
      return JSON.parse(el.textContent);
    } catch {
      return [];
    }
  };

  /** @param {string} raw */
  function parsePayload(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function readFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('orviane_slug');
    const catalog = readCatalog();
    const fromSlug = slug ? catalog.find((item) => item.slug === slug) : null;

    const title = params.get('orviane_title') || fromSlug?.title || '';
    const asset = params.get('orviane_asset') || fromSlug?.asset || '';
    const assetUrl = params.get('orviane_asset_url') || '';
    const price =
      params.get('orviane_price') ||
      (fromSlug?.priceCents != null ? String(fromSlug.priceCents) : '');
    const compare =
      fromSlug?.compareCents != null ? String(fromSlug.compareCents) : '';
    if (!title && !asset && !assetUrl && !slug) return null;
    return {
      slug: slug || fromSlug?.slug || '',
      title: title || '',
      asset: asset || '',
      assetUrl: assetUrl || '',
      priceCents: price ? String(price) : '',
      compareCents: compare ? String(compare) : '',
    };
  }

  function readDemo() {
    const fromUrl = readFromUrl();
    const fromStore = parsePayload(sessionStorage.getItem(STORAGE_KEY));
    const base = fromUrl && (fromUrl.title || fromUrl.assetUrl || fromUrl.asset || fromUrl.slug) ? fromUrl : null;
    if (base) {
      const catalog = readCatalog();
      const match = catalog.find((item) => item.slug && item.slug === base.slug);
      if (match) {
        if (!base.priceCents && match.priceCents != null) base.priceCents = String(match.priceCents);
        if (!base.compareCents && match.compareCents != null) base.compareCents = String(match.compareCents);
        if (!base.title) base.title = match.title || '';
        if (!base.asset) base.asset = match.asset || '';
      }
      return base;
    }
    return fromStore;
  }

  function formatMoney(cents) {
    const value = Number(cents);
    if (!Number.isFinite(value)) return '';
    if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(value, window.theme?.moneyFormat);
    }
    return `$${(value / 100).toFixed(2)}`;
  }

  function assetUrlFromFilename(filename) {
    if (!filename) return '';
    const bundle = document.querySelector('gw-product-bundle');
    const base = bundle?.getAttribute('data-orviane-asset-base');
    if (base) return `${base}${filename}`;
    const link = document.querySelector(`link[href*="${filename}"]`);
    if (link instanceof HTMLLinkElement && link.href) return link.href;
    return '';
  }

  function applyDemoPricing(demo) {
    const unitCents = parseInt(demo?.priceCents, 10);
    if (!Number.isFinite(unitCents)) return;

    let compareUnit = parseInt(demo?.compareCents, 10);
    if (!Number.isFinite(compareUnit)) {
      const catalog = readCatalog();
      const match = catalog.find((item) => item.slug === demo.slug);
      compareUnit = match?.compareCents ?? Math.round(unitCents * 1.674);
    }

    document.querySelectorAll('[data-gw-tier-wrap]').forEach((wrap) => {
      const btn = wrap.querySelector('[data-gw-tier]');
      if (!btn) return;
      const qty = parseInt(btn.getAttribute('data-gw-tier'), 10) || 1;
      const percentOff = parseInt(wrap.getAttribute('data-gw-percent-off'), 10) || 0;
      const useCompareMultiplier = wrap.getAttribute('data-gw-use-compare-multiplier') === 'true';

      const rawTotal = unitCents * qty;
      const tierTotal = Math.round((rawTotal * (100 - percentOff)) / 100);
      let tierCompare = rawTotal;
      if (useCompareMultiplier) tierCompare = compareUnit * qty;

      const priceEl = btn.querySelector('.gw-pdp__tier-price');
      const compareEl = btn.querySelector('.gw-pdp__tier-prices s');
      const perUnitEl = btn.querySelector('.gw-pdp__tier-per-unit');
      if (priceEl) priceEl.textContent = formatMoney(tierTotal);
      if (compareEl) compareEl.textContent = formatMoney(tierCompare);
      btn.setAttribute('data-gw-tier-price', formatMoney(tierTotal));
      btn.setAttribute('data-gw-tier-compare', formatMoney(tierCompare));
      if (perUnitEl && qty > 0) {
        const note = perUnitEl.textContent || '';
        if (note.includes('[price]')) {
          perUnitEl.textContent = note.replace('[price]', formatMoney(Math.round(tierTotal / qty)));
        }
      }
    });

    const stickyPrice = document.querySelector('.gw-pdp-sticky__price');
    if (stickyPrice) {
      const activeTier = document.querySelector('.gw-pdp__tier[aria-pressed="true"]');
      if (activeTier?.dataset?.gwTierPrice) stickyPrice.textContent = activeTier.dataset.gwTierPrice;
    }
  }

  function applyDemo(demo) {
    if (!demo) return;

    const bundle = document.querySelector('gw-product-bundle');
    if (bundle) {
      bundle.setAttribute('data-orviane-demo-active', 'true');
    }

    const title = demo.title?.trim();
    if (title) {
      document.querySelectorAll('.gw-pdp__title, .gw-pdp-sticky__title').forEach((el) => {
        el.textContent = title;
      });
      document.title = title;
    }

    applyDemoPricing(demo);

    let imgUrl = demo.assetUrl?.trim();
    if (!imgUrl && demo.asset) {
      imgUrl = assetUrlFromFilename(demo.asset);
    }

    const gallerySlides = document.querySelectorAll('[data-gw-slide] .gw-pdp__main-img');
    const hasMultiAngleGallery = gallerySlides.length > 1;

    if (imgUrl && !hasMultiAngleGallery) {
      document.querySelectorAll('.gw-pdp__main-img').forEach((img, index) => {
        if (img instanceof HTMLImageElement) {
          img.src = index === 0 ? imgUrl : img.src;
          img.alt = title || img.alt;
          if (index === 0) img.srcset = '';
        }
      });
      const firstThumb = document.querySelector('[data-gw-gallery-thumb] img');
      if (firstThumb instanceof HTMLImageElement) {
        firstThumb.src = imgUrl;
      }
    } else if (title) {
      document.querySelectorAll('.gw-pdp__main-img').forEach((img) => {
        if (img instanceof HTMLImageElement) {
          img.alt = title;
        }
      });
    }
  }

  function initPdp() {
    if (!document.body.classList.contains('gw-product-page')) return;
    const demo = readDemo();
    if (demo) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }
    applyDemo(demo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPdp);
  } else {
    initPdp();
  }
})();
