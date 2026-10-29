/**
 * Girls Winter PDP — Sira-style gallery, expandable bundles, size guide, sticky CTA.
 */
import { CartLinesUpdateEvent } from 'https://cdn.shopify.com/storefront/standard-events.js';

class GwProductBundle extends HTMLElement {
  /** @type {AbortController | null} */
  #controller = null;

  /** @type {boolean} */
  #stickySubmitPending = false;

  /** @type {{ show: (index: number) => void } | null} */
  #galleryApi = null;

  /** @type {Record<string, number> | null} */
  #colorGalleryIndexCache = null;

  static #COLOR_FILE_ALIASES = {
    black: ['black'],
    blush: ['blush', 'pink', 'powder-blue', 'powder'],
    red: ['cherry', 'red'],
    burgundy: ['burgundy', 'wine', 'maroon'],
    white: ['white', 'ivory', 'cream'],
    camel: ['camel', 'tan', 'caramel', 'taupe'],
    espresso: ['espresso', 'brown', 'chocolate', 'cognac'],
  };

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    const product = this.#enrichPerfumeProduct(this.#readProduct());

    if (product) {
      this.#bindGallery(signal, product);
      this.#bindTiers(signal, product);
      this.#bindAddToCart(signal, product);
      this.#bindSizeGuide(signal);
      this.#bindSticky(signal);
      this.#bindProductTabs(signal);
    }

    this.#bindMiniReviews(signal);
    this.#bindPdpReviewsCarousel(signal);
    this.#bindUgcVideos(signal);
  }

  /**
   * @param {HTMLElement} root
   * @param {{ track: string, prev: string, next: string, card: string, signal: AbortSignal, centerOnMobile?: boolean }} cfg
   */
  #bindSnapScrollCarousel(root, cfg) {
    const track = root.querySelector(cfg.track);
    const prev = root.querySelector(cfg.prev);
    const next = root.querySelector(cfg.next);
    if (!track) return;

    const centerOnMobile = cfg.centerOnMobile !== false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = () => [...track.querySelectorAll(cfg.card)];
    const useCentered = () => centerOnMobile && window.matchMedia('(max-width: 989px)').matches;

    const getActiveIndex = () => {
      const list = cards();
      if (!list.length) return 0;
      let index = 0;
      let minDist = Infinity;
      if (useCentered()) {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        list.forEach((card, i) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(cardCenter - trackCenter);
          if (dist < minDist) {
            minDist = dist;
            index = i;
          }
        });
        return index;
      }
      const scroll = track.scrollLeft;
      list.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - scroll);
        if (dist < minDist) {
          minDist = dist;
          index = i;
        }
      });
      return index;
    };

    const scrollLeftForCard = (target) => {
      if (!target) return 0;
      let left = target.offsetLeft;
      if (useCentered()) {
        left = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
      }
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      return Math.min(maxScroll, Math.max(0, left));
    };

    const scrollToIndex = (index, behavior) => {
      const list = cards();
      const target = list[Math.min(list.length - 1, Math.max(0, index))];
      if (!target) return;
      track.scrollTo({
        left: scrollLeftForCard(target),
        behavior: behavior || (prefersReducedMotion ? 'auto' : 'smooth'),
      });
    };

    const snapToNearest = () => {
      scrollToIndex(getActiveIndex(), prefersReducedMotion ? 'auto' : 'smooth');
    };

    const updateNav = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const scrollable = maxScroll > 4;
      if (prev instanceof HTMLButtonElement) {
        prev.disabled = !scrollable || track.scrollLeft <= 4;
      }
      if (next instanceof HTMLButtonElement) {
        next.disabled = !scrollable || track.scrollLeft >= maxScroll - 4;
      }
    };

    prev?.addEventListener('click', () => scrollToIndex(getActiveIndex() - 1), { signal: cfg.signal });
    next?.addEventListener('click', () => scrollToIndex(getActiveIndex() + 1), { signal: cfg.signal });

    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScroll = 0;
    let dragMoved = false;
    let dragAxis = null;
    let blockNextClick = false;

    const cancelDrag = () => {
      if (dragPointerId !== null && track.hasPointerCapture(dragPointerId)) {
        track.releasePointerCapture(dragPointerId);
      }
      dragPointerId = null;
      dragAxis = null;
      dragMoved = false;
      track.classList.remove('is-dragging');
    };

    const endDrag = (event) => {
      if (event && dragPointerId !== null && event.pointerId !== dragPointerId) return;
      const didDrag = dragMoved;
      if (dragPointerId !== null && track.hasPointerCapture(dragPointerId)) {
        track.releasePointerCapture(dragPointerId);
      }
      dragPointerId = null;
      dragAxis = null;
      track.classList.remove('is-dragging');
      if (didDrag) {
        blockNextClick = true;
        snapToNearest();
      }
      dragMoved = false;
      updateNav();
    };

    track.addEventListener(
      'pointerdown',
      (event) => {
        if (event.pointerType === 'touch') return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('button, a')) return;
        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragStartScroll = track.scrollLeft;
        dragMoved = false;
        dragAxis = null;
      },
      { capture: true, signal: cfg.signal }
    );

    track.addEventListener(
      'pointermove',
      (event) => {
        if (dragPointerId === null || event.pointerId !== dragPointerId) return;
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;
        if (!dragAxis && (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)) {
          dragAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'x' : 'y';
        }
        if (dragAxis === 'y') {
          cancelDrag();
          return;
        }
        if (Math.abs(deltaX) > 6) {
          dragMoved = true;
          track.classList.add('is-dragging');
          if (track.setPointerCapture && !track.hasPointerCapture(event.pointerId)) {
            track.setPointerCapture(event.pointerId);
          }
          event.preventDefault();
          track.scrollLeft = dragStartScroll - deltaX;
        }
      },
      { passive: false, signal: cfg.signal }
    );

    track.addEventListener('pointerup', endDrag, { signal: cfg.signal });
    track.addEventListener('pointercancel', endDrag, { signal: cfg.signal });
    track.addEventListener('lostpointercapture', () => endDrag(), { signal: cfg.signal });

    track.addEventListener(
      'wheel',
      (event) => {
        const absX = Math.abs(event.deltaX);
        const absY = Math.abs(event.deltaY);
        const horizontal = absX > absY;
        if (!horizontal && !event.shiftKey) {
          window.scrollBy({ top: event.deltaY, left: 0, behavior: 'auto' });
          return;
        }
        const delta = horizontal ? event.deltaX : event.deltaY;
        if (!delta) return;
        track.scrollLeft += delta;
        event.preventDefault();
        updateNav();
      },
      { passive: false, signal: cfg.signal }
    );

    track.addEventListener(
      'click',
      (event) => {
        if (!blockNextClick) return;
        const link = event.target.closest('a');
        if (link && track.contains(link)) event.preventDefault();
        blockNextClick = false;
      },
      { capture: true, signal: cfg.signal }
    );

    track.addEventListener('scroll', updateNav, { passive: true, signal: cfg.signal });
    window.addEventListener(
      'resize',
      () => {
        if (useCentered()) scrollToIndex(getActiveIndex(), 'auto');
        updateNav();
      },
      { signal: cfg.signal }
    );
    scrollToIndex(0, 'auto');
    updateNav();
  }

  #bindPdpReviewsCarousel(signal) {
    const root = this.querySelector('[data-gw-pdp-reviews]');
    if (!root) return;
    this.#bindSnapScrollCarousel(root, {
      track: '[data-gw-pdp-reviews-track]',
      prev: '[data-gw-pdp-reviews-prev]',
      next: '[data-gw-pdp-reviews-next]',
      card: '.gw-pdp-reviews__card',
      signal,
    });
  }

  #bindProductTabs(signal) {
    const root = this.querySelector('[data-gw-pdp-tabs]');
    if (!root) return;

    const tabs = [...root.querySelectorAll('[data-gw-pdp-tab]')];
    const panels = [...root.querySelectorAll('[data-gw-pdp-panel]')];
    if (!tabs.length || !panels.length) return;

    const activate = (tabId) => {
      for (const tab of tabs) {
        const isActive = tab.getAttribute('data-gw-pdp-tab') === tabId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
      }
      for (const panel of panels) {
        const isActive = panel.getAttribute('data-gw-pdp-panel') === tabId;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      }
    };

    for (const tab of tabs) {
      tab.addEventListener(
        'click',
        () => {
          const tabId = tab.getAttribute('data-gw-pdp-tab');
          if (tabId) activate(tabId);
        },
        { signal }
      );
    }
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#controller = null;
  }

  #readProduct() {
    const node = this.querySelector('[data-gw-product-json]');
    if (!node?.textContent) return null;
    try {
      return JSON.parse(node.textContent);
    } catch {
      return null;
    }
  }

  #excludedColorValues = new Set(['white']);

  #filterColorValues(values) {
    return (values || []).filter(
      (value) => !this.#excludedColorValues.has(String(value).trim().toLowerCase())
    );
  }

  #resolveSwatchHex(value) {
    const normalized = String(value).trim().toLowerCase();
    const map = {
      black: '#111111',
      nude: '#e8d4c4',
      tan: '#c4a484',
      burgundy: '#6d2430',
      white: '#ffffff',
      ivory: '#f5f0e8',
      blush: '#e7c1c1',
      sage: '#9caf88',
      olive: '#6b7036',
      cherry: '#9b2335',
      espresso: '#4b3428',
      camel: '#c19a6b',
      rose: '#d9899b',
      navy: '#1f2a44',
      gold: '#c6a15b',
      cognac: '#9c5c3c',
      brown: '#5c4033',
      red: '#b42318',
      pink: '#e8a0b8',
      beige: '#d9c4a8',
      grey: '#9a9a9a',
      gray: '#9a9a9a',
    };
    if (map[normalized]) return map[normalized];
    for (const [key, hex] of Object.entries(map)) {
      if (normalized.includes(key)) return hex;
    }
    return '#c8c8c8';
  }

  #pickerOptions(product) {
    if (this.hasAttribute('data-orviane-demo-active')) {
      return [
        {
          name: 'Size',
          values: ['50 ml', '100 ml', '150 ml', '200 ml', '250 ml'],
        },
      ];
    }

    const named = product.options_with_values || [];
    const onlyDefault =
      named.length === 0 ||
      (named.length === 1 &&
        (named[0].name === 'Title' || named[0].values?.[0] === 'Default Title'));

    if (onlyDefault) {
      if (Boolean(product.is_perfume_product)) {
        return [
          {
            name: 'Size',
            values: ['50 ml', '100 ml', '150 ml', '200 ml', '250 ml'],
          },
        ];
      }
      const isPurse = Boolean(product.is_purse_product);
      return [
        {
          name: 'Color',
          values: ['Black', 'Blush', 'Red', 'Burgundy', 'Camel', 'Espresso'],
        },
        {
          name: 'Size',
          values: isPurse
            ? ['Small', 'Medium', 'Large']
            : ['5', '6', '7', '8', '9', '10', '11', '12'],
        },
      ];
    }

    return named.map((option) => {
      const name = (option.name || '').toLowerCase();
      const values = option.values || [];
      return {
        name: option.name,
        values:
          name === 'color' || name === 'colour' ? this.#filterColorValues(values) : values,
      };
    });
  }

  #normalizeImageRef(url) {
    if (!url) return '';
    const path = String(url).split('?')[0].toLowerCase();
    return path.replace(/_\d+x(\.[a-z0-9]+)$/i, '$1');
  }

  #parseColorFilenameToken(url) {
    const base = this.#normalizeImageRef(url).split('/').pop() || '';
    if (!base || base.includes('pose-')) return null;
    const match = base.match(/(?:ella-)?color-\d+-([a-z0-9-]+)/i);
    if (match) return match[1].toLowerCase();
    return null;
  }

  #tokenMatchesColorName(token, colorName) {
    const colorKey = String(colorName).trim().toLowerCase();
    const aliases =
      GwProductBundle.#COLOR_FILE_ALIASES[colorKey] || [colorKey.replace(/\s+/g, '-')];
    return aliases.some((alias) => {
      const normalized = alias.toLowerCase();
      return token === normalized || token.startsWith(`${normalized}_`) || token.startsWith(normalized);
    });
  }

  #galleryColorNames(product) {
    const named = product.options_with_values || [];
    const onlyDefault =
      named.length === 0 ||
      (named.length === 1 &&
        (named[0].name === 'Title' || named[0].values?.[0] === 'Default Title'));

    if (onlyDefault) {
      return ['Black', 'Blush', 'Red', 'Burgundy', 'Camel', 'Espresso'];
    }

    const colorOption = named.find((option) => {
      const name = (option.name || '').toLowerCase();
      return name === 'color' || name === 'colour';
    });
    return this.#filterColorValues(colorOption?.values || []);
  }

  #buildColorGalleryIndex(product) {
    const urls = product.gallery_image_urls || [];
    const map = {};
    const colors = this.#galleryColorNames(product);

    for (const colorName of colors) {
      let slideIndex = -1;

      for (let i = 0; i < urls.length; i++) {
        const token = this.#parseColorFilenameToken(urls[i]);
        if (!token) continue;
        if (this.#tokenMatchesColorName(token, colorName)) {
          slideIndex = i;
          break;
        }
      }

      if (slideIndex < 0) {
        const targetUrl = this.#imageUrlForColor(product, colorName);
        const targetRef = this.#normalizeImageRef(targetUrl);
        if (targetRef) {
          slideIndex = urls.findIndex((url) => this.#normalizeImageRef(url) === targetRef);
        }
      }

      if (slideIndex >= 0) map[colorName] = slideIndex;
    }

    return map;
  }

  #getColorGalleryIndex(product) {
    if (!this.#colorGalleryIndexCache) {
      this.#colorGalleryIndexCache = this.#buildColorGalleryIndex(product);
    }
    return this.#colorGalleryIndexCache;
  }

  #colorOptionIndex(product) {
    const named = product.options_with_values || [];
    const idx = named.findIndex((option) => {
      const name = (option.name || '').toLowerCase();
      return name === 'color' || name === 'colour';
    });
    return idx >= 0 ? idx : 0;
  }

  #imageUrlForColor(product, colorName) {
    const color = String(colorName).trim();
    const swatches = product.swatch_images || {};
    if (swatches[color]) return swatches[color];

    const swatchKey = Object.keys(swatches).find((key) => key.toLowerCase() === color.toLowerCase());
    if (swatchKey) return swatches[swatchKey];

    const colorIndex = this.#colorOptionIndex(product);
    for (const variant of product.variants || []) {
      const optionValue =
        colorIndex === 0 ? variant.option1 : colorIndex === 1 ? variant.option2 : variant.option3;
      if (optionValue && optionValue.toLowerCase() === color.toLowerCase() && variant.featured_image) {
        return variant.featured_image;
      }
    }

    return null;
  }

  #findSlideIndexForColor(product, colorName) {
    const slides = [...this.querySelectorAll('[data-gw-slide]')];
    if (!slides.length) return 0;

    const colorKey = String(colorName).trim().toLowerCase();
    const indexMap = this.#getColorGalleryIndex(product);
    const mappedKey = Object.keys(indexMap).find((key) => key.toLowerCase() === colorKey);
    if (mappedKey != null && indexMap[mappedKey] >= 0) {
      return Math.min(indexMap[mappedKey], slides.length - 1);
    }

    const labeledIndex = slides.findIndex(
      (slide) => slide.dataset.gwSlideColor?.trim().toLowerCase() === colorKey
    );
    if (labeledIndex >= 0) return labeledIndex;

    const urls = product.gallery_image_urls || [];
    const targetUrl = this.#imageUrlForColor(product, colorName);
    const targetRef = this.#normalizeImageRef(targetUrl);
    if (targetRef) {
      const urlIndex = urls.findIndex((url) => this.#normalizeImageRef(url) === targetRef);
      if (urlIndex >= 0 && urlIndex < slides.length) return urlIndex;
    }

    return -1;
  }

  #showGalleryForColor(product, colorName) {
    if (!this.#galleryApi) return;
    const index = this.#findSlideIndexForColor(product, colorName);
    if (index < 0) return;
    this.#galleryApi.show(index);
  }

  #bindGallery(signal, product) {
    const stage = this.querySelector('[data-gw-gallery-stage]');
    const track = this.querySelector('[data-gw-gallery-track]');
    const surface = this.querySelector('[data-gw-gallery-swipe]') || stage;
    const slides = [...this.querySelectorAll('[data-gw-slide]')];
    const thumbs = [...this.querySelectorAll('[data-gw-gallery-thumb]')];
    const scroller = this.querySelector('.gw-pdp__thumbs');
    const prev = this.querySelector('[data-gw-thumbs-prev]');
    const next = this.querySelector('[data-gw-thumbs-next]');
    if (!stage || !track || !slides.length || !thumbs.length) return;

    let index = 0;
    let dragX = 0;
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let axis = null;
    let moved = false;

    stage.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
    });

    const max = () => slides.length - 1;
    const widthOf = () => stage.getBoundingClientRect().width || 1;

    const apply = (animate = true, syncThumbs = animate) => {
      index = Math.min(Math.max(0, index), max());
      track.style.transition = animate ? 'transform 0.32s ease' : 'none';
      track.style.transform = `translate3d(${-(index * widthOf()) + dragX}px, 0, 0)`;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
      if (prev instanceof HTMLButtonElement) prev.disabled = index === 0;
      if (next instanceof HTMLButtonElement) next.disabled = index === max();
      if (syncThumbs) revealThumb(animate);
    };

    const revealThumb = (animate) => {
      const thumb = thumbs[index];
      if (!thumb || !scroller) return;
      const start = thumb.offsetLeft;
      const end = start + thumb.offsetWidth;
      const viewStart = scroller.scrollLeft;
      const viewEnd = viewStart + scroller.clientWidth;
      let left = viewStart;
      if (end > viewEnd - 1) left = end - scroller.clientWidth;
      else if (start < viewStart + 1) left = start;
      scroller.scrollTo({ left: Math.max(0, left), behavior: animate ? 'smooth' : 'auto' });
    };

    const show = (nextIndex) => {
      index = nextIndex;
      dragX = 0;
      apply(true, true);
    };

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => show(i), { signal });
    });

    prev?.addEventListener('click', () => show(index - 1), { signal });
    next?.addEventListener('click', () => show(index + 1), { signal });

    const point = (event) => {
      if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      if (event.changedTouches && event.changedTouches[0]) {
        return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    const onDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const p = point(event);
      dragging = true;
      axis = null;
      moved = false;
      startX = p.x;
      startY = p.y;
      dragX = 0;
    };

    const onMove = (event) => {
      if (!dragging) return;
      const p = point(event);
      const dx = p.x - startX;
      const dy = p.y - startY;
      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        if (axis === 'x') stage.classList.add('is-dragging');
      }
      if (axis !== 'x') return;
      if (event.cancelable) event.preventDefault();
      moved = true;
      dragX = dx;
      apply(false, false);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (axis === 'x') {
        const threshold = Math.min(40, widthOf() * 0.12);
        if (dragX <= -threshold) index += 1;
        else if (dragX >= threshold) index -= 1;
      }
      dragX = 0;
      axis = null;
      apply(true, true);
    };

    surface.addEventListener('pointerdown', onDown, { signal });
    window.addEventListener('pointermove', onMove, { signal, passive: false });
    window.addEventListener('pointerup', onUp, { signal });
    window.addEventListener('pointercancel', onUp, { signal });
    surface.addEventListener('touchstart', onDown, { signal, passive: true });
    window.addEventListener('touchmove', onMove, { signal, passive: false });
    window.addEventListener('touchend', onUp, { signal });
    window.addEventListener('touchcancel', onUp, { signal });
    surface.addEventListener('mousedown', onDown, { signal });
    window.addEventListener('mousemove', onMove, { signal });
    window.addEventListener('mouseup', onUp, { signal });
    stage.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
    surface.addEventListener(
      'click',
      (event) => {
        if (!moved) return;
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      },
      { signal, capture: true }
    );
    window.addEventListener('resize', () => apply(false, false), { signal });

    this.#galleryApi = { show };
    show(0);

    const activeColor = this.#firstBundleLineColor();
    if (activeColor) this.#showGalleryForColor(product, activeColor);
  }

  #firstBundleLineColor() {
    const expanded = this.querySelector('[data-gw-tier-wrap].is-expanded [data-gw-bundle-lines]');
    const first = expanded?.querySelector('.gw-bundle__line');
    return this.#lineColorValue(first);
  }

  #lineColorValue(lineRow) {
    if (!lineRow) return null;
    const fields = lineRow.querySelectorAll('.gw-bundle__field');
    for (const field of fields) {
      const picker = field.querySelector('.gw-swatch-picker');
      if (!picker) continue;
      const active = picker.querySelector('.gw-swatch-picker__btn.is-active');
      if (active?.dataset.value) return active.dataset.value;
      const hidden = field.querySelector('.gw-bundle__select');
      if (hidden?.value) return hidden.value;
    }
    return null;
  }

  #selectTier(wrap, wraps, product, signal) {
    wraps.forEach((otherWrap) => {
      const otherBtn = otherWrap.querySelector('[data-gw-tier]');
      const otherPanel = otherWrap.querySelector('[data-gw-bundle-lines]');
      if (!otherBtn || !otherPanel) return;

      const active = otherWrap === wrap;
      otherWrap.classList.toggle('is-expanded', active);
      otherBtn.classList.toggle('is-selected', active);
      otherBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      otherBtn.setAttribute('aria-expanded', active ? 'true' : 'false');

      if (!active) {
        otherPanel.hidden = true;
        otherPanel.innerHTML = '';
      }
    });

    const btn = wrap.querySelector('[data-gw-tier]');
    const linesHost = wrap.querySelector('[data-gw-bundle-lines]');
    if (!btn || !linesHost) return;

    const qty = Number(btn.getAttribute('data-gw-tier')) || 1;
    linesHost.hidden = false;
    this.#renderLines(linesHost, product, qty, signal);
    const lineColor = this.#firstBundleLineColor();
    if (lineColor) this.#showGalleryForColor(product, lineColor);
  }

  #bindTiers(signal, product) {
    const wraps = this.querySelectorAll('[data-gw-tier-wrap]');

    wraps.forEach((wrap) => {
      const btn = wrap.querySelector('[data-gw-tier]');
      if (!btn) return;

      btn.addEventListener(
        'click',
        () => {
          this.#selectTier(wrap, wraps, product, signal);
        },
        { signal }
      );
    });

    const preferred =
      [...wraps].find((wrap) => wrap.hasAttribute('data-gw-default')) || wraps[1] || wraps[0];
    if (preferred) this.#selectTier(preferred, wraps, product, signal);
  }

  #renderLines(host, product, quantity, signal) {
    if (!host) return;
    host.innerHTML = '';

    const options = this.#pickerOptions(product);

    for (let i = 0; i < quantity; i++) {
      const row = document.createElement('div');
      row.className = 'gw-bundle__line';
      row.dataset.lineIndex = String(i);

      const indexLabel = document.createElement('span');
      indexLabel.className = 'gw-bundle__line-index';
      indexLabel.textContent = `#${i + 1}`;

      const fields = document.createElement('div');
      fields.className = 'gw-bundle__line-fields';

      options.forEach((option, optionIndex) => {
        const values = option.values || [];
        if (!values.length) return;

        const wrap = document.createElement('div');
        wrap.className = 'gw-bundle__field';

        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.className = 'gw-bundle__select';
        hidden.dataset.optionIndex = String(optionIndex);
        hidden.value = '';
        hidden.required = true;

        const optionName = (option.name || '').toLowerCase();
        let control;
        if (optionName === 'color') {
          control = this.#createColorSwatches({
            product,
            values,
            ariaLabel: `${option.name} item ${i + 1}`,
            signal,
            onChange: (value) => {
              hidden.value = value;
              this.#syncLineVariant(row, product);
            },
            onSelect: (value) => {
              this.#showGalleryForColor(product, value);
            },
          });
        } else if (optionName === 'size' || optionName.includes('ml')) {
          control = this.#createSizeButtons({
            label: option.name,
            values,
            ariaLabel: `${option.name} item ${i + 1}`,
            signal,
            onChange: (value) => {
              hidden.value = value;
              this.#syncLineVariant(row, product);
            },
          });
        } else if (optionName === 'scent' || optionName === 'concentration') {
          control = this.#createSizeButtons({
            label: option.name,
            values,
            ariaLabel: `${option.name} item ${i + 1}`,
            signal,
            onChange: (value) => {
              hidden.value = value;
              this.#syncLineVariant(row, product);
            },
          });
        } else {
          control = this.#createDropdown({
            label: option.name,
            values,
            ariaLabel: `${option.name} item ${i + 1}`,
            signal,
            onChange: (value) => {
              hidden.value = value;
              this.#syncLineVariant(row, product);
            },
          });
        }

        wrap.append(hidden, control);
        fields.appendChild(wrap);
      });

      row.append(indexLabel, fields);
      host.appendChild(row);
      this.#syncLineVariant(row, product);
    }
  }

  #createColorSwatches({ product, values, ariaLabel, signal, onChange, onSelect }) {
    const root = document.createElement('div');
    root.className = 'gw-swatch-picker';

    const label = document.createElement('p');
    label.className = 'gw-swatch-picker__label';
    label.textContent = 'Color: Black';
    root.appendChild(label);

    const row = document.createElement('div');
    row.className = 'gw-swatch-picker__row';
    row.setAttribute('role', 'listbox');
    row.setAttribute('aria-label', ariaLabel);

    const fallbackColors = ['Black', 'Blush', 'Red', 'Burgundy', 'Camel', 'Espresso'];
    const colorValues = this.#filterColorValues(values.length ? values : fallbackColors).slice(0, 7);
    let selected = colorValues[0] || 'Black';

    const setValue = (value) => {
      selected = value;
      label.textContent = `Color: ${value}`;
      row.querySelectorAll('.gw-swatch-picker__btn').forEach((btn) => {
        const active = btn.dataset.value === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      onChange(value);
    };

    colorValues.forEach((value) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gw-swatch-picker__btn';
      btn.dataset.value = value;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-label', value);
      const fill = document.createElement('span');
      fill.className = 'gw-swatch-picker__fill';
      fill.style.backgroundColor = this.#resolveSwatchHex(value);
      fill.setAttribute('aria-hidden', 'true');
      btn.appendChild(fill);
      btn.addEventListener(
        'click',
        () => {
          setValue(value);
          onSelect?.(value);
        },
        { signal }
      );
      row.appendChild(btn);
    });

    setValue(selected);
    root.appendChild(row);
    return root;
  }

  #createSizeButtons({ label, values, ariaLabel, signal, onChange }) {
    const root = document.createElement('div');
    root.className = 'gw-size-picker';

    const head = document.createElement('div');
    head.className = 'gw-size-picker__head';
    const title = document.createElement('span');
    title.className = 'gw-size-picker__label';
    title.textContent = `${label}:`;
    head.appendChild(title);
    root.appendChild(head);

    const row = document.createElement('div');
    row.className = 'gw-size-picker__row';
    row.setAttribute('role', 'listbox');
    row.setAttribute('aria-label', ariaLabel);

    let selected = '';

    const setValue = (value) => {
      selected = value;
      row.querySelectorAll('.gw-size-picker__btn').forEach((btn) => {
        const active = btn.dataset.value === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      onChange(value);
    };

    values.forEach((value) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gw-size-picker__btn';
      btn.dataset.value = value;
      btn.textContent = value;
      btn.setAttribute('role', 'option');
      btn.addEventListener(
        'click',
        () => {
          setValue(value);
        },
        { signal }
      );
      row.appendChild(btn);
    });

    if (values.length) setValue(values[0]);

    root.appendChild(row);
    return root;
  }

  #createDropdown({ label, values, ariaLabel, signal, onChange }) {
    const root = document.createElement('div');
    root.className = 'gw-dd';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'gw-dd__trigger is-placeholder';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', ariaLabel);
    trigger.innerHTML = `<span class="gw-dd__value">${label}</span><span class="gw-dd__caret" aria-hidden="true"></span>`;

    const menu = document.createElement('ul');
    menu.className = 'gw-dd__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    const close = () => {
      root.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    const open = () => {
      this.querySelectorAll('.gw-dd.is-open').forEach((other) => {
        if (other !== root) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.gw-dd__trigger');
          const otherMenu = other.querySelector('.gw-dd__menu');
          otherBtn?.setAttribute('aria-expanded', 'false');
          if (otherMenu) otherMenu.hidden = true;
        }
      });
      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    };

    values.forEach((value) => {
      const item = document.createElement('li');
      item.setAttribute('role', 'option');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gw-dd__option';
      btn.textContent = value;
      btn.dataset.value = value;
      btn.addEventListener(
        'click',
        () => {
          menu.querySelectorAll('.gw-dd__option').forEach((opt) => opt.classList.remove('is-chosen'));
          btn.classList.add('is-chosen');
          const valueEl = trigger.querySelector('.gw-dd__value');
          if (valueEl) valueEl.textContent = value;
          trigger.classList.remove('is-placeholder');
          onChange(value);
          close();
        },
        { signal }
      );
      item.appendChild(btn);
      menu.appendChild(item);
    });

    trigger.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        if (root.classList.contains('is-open')) close();
        else open();
      },
      { signal }
    );

    document.addEventListener(
      'click',
      (event) => {
        if (!root.contains(event.target)) close();
      },
      { signal }
    );

    trigger.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') close();
      },
      { signal }
    );

    root.append(trigger, menu);
    return root;
  }

  #isPlaceholderCatalogTitle(title) {
    const normalized = String(title || '').toLowerCase();
    return /\b(toy|toys|plush|doll|figurine|puzzle|game|lego)\b/.test(normalized);
  }

  #readOrvianeCatalog() {
    const el = document.getElementById('orviane-demo-catalog');
    if (!el?.textContent) return [];
    try {
      return JSON.parse(el.textContent);
    } catch {
      return [];
    }
  }

  #readOrvianeDemoOverlay(product) {
    /** @type {{ slug?: string, title?: string, asset?: string, priceCents?: string }} */
    const overlay = {};
    try {
      const raw = sessionStorage.getItem('orvianeDemoPdp');
      if (raw) Object.assign(overlay, JSON.parse(raw));
    } catch {
      /* ignore */
    }

    const catalog = this.#readOrvianeCatalog();
    if (overlay.slug) {
      const match = catalog.find((item) => item.slug === overlay.slug);
      if (match) {
        overlay.title = overlay.title || match.title || '';
        overlay.asset = overlay.asset || match.asset || '';
        if (!overlay.priceCents && match.priceCents != null) overlay.priceCents = String(match.priceCents);
      }
    }

    const handle = String(product?.handle || '');
    if (!overlay.slug && handle) {
      const match = catalog.find((item) => item.slug && handle.includes(item.slug));
      if (match) {
        overlay.slug = match.slug;
        overlay.title = overlay.title || match.title || '';
        overlay.asset = overlay.asset || match.asset || '';
        if (!overlay.priceCents && match.priceCents != null) overlay.priceCents = String(match.priceCents);
      }
    }

    const serverTitle = this.getAttribute('data-orviane-server-title')?.trim();
    const domTitle = this.querySelector('.gw-pdp__title')?.textContent?.trim();
    const displayTitle = domTitle || serverTitle || product?.title || '';
    if (!overlay.title || this.#isPlaceholderCatalogTitle(overlay.title)) {
      if (displayTitle && !this.#isPlaceholderCatalogTitle(displayTitle)) overlay.title = displayTitle;
    }
    if (!overlay.asset && product?.orviane_demo_asset) overlay.asset = product.orviane_demo_asset;
    if (!overlay.slug && product?.orviane_slug) overlay.slug = product.orviane_slug;

    return overlay;
  }

  #enrichPerfumeProduct(product) {
    if (!product) return null;
    if (!product.is_perfume_product && !this.hasAttribute('data-orviane-demo-active')) return product;

    const overlay = this.#readOrvianeDemoOverlay(product);
    const enriched = { ...product, is_perfume_product: true };
    if (overlay.title) enriched.title = overlay.title;
    if (overlay.asset) enriched.orviane_demo_asset = overlay.asset;
    if (overlay.slug) enriched.orviane_slug = overlay.slug;
    if (overlay.priceCents) enriched.price = overlay.priceCents;
    return enriched;
  }

  #orvianeCartVariantId(product) {
    const fromSetting = product?.orviane_cart_variant_id;
    if (fromSetting) return Number(fromSetting);
    const fallback = product?.variants?.find((v) => v.available) || product?.variants?.[0];
    return fallback?.id ? Number(fallback.id) : null;
  }

  #usesOrvianeCart(product) {
    return Boolean(product?.is_perfume_product);
  }

  #orvianeLineProperties(line, product) {
    const properties = {};
    if (product?.title) properties._orviane_title = product.title;
    if (product?.orviane_demo_asset) properties._orviane_asset = product.orviane_demo_asset;
    else if (product?.featured_image) properties._orviane_featured_image = product.featured_image;
    if (product?.orviane_slug) properties._orviane_slug = product.orviane_slug;

    const selectedTier = this.querySelector('[data-gw-tier].is-selected');
    const tierCents = selectedTier?.getAttribute('data-gw-tier-total-cents');
    if (tierCents) properties._orviane_display_price = String(tierCents);
    else if (product?.price) properties._orviane_display_price = String(product.price);
    line?.querySelectorAll('.gw-bundle__select').forEach((sel) => {
      if (!sel.value) return;
      const field = sel.parentElement;
      if (field?.querySelector('.gw-size-picker__btn')) {
        properties._orviane_size = sel.value;
      }
    });
    return properties;
  }

  #syncLineVariant(row, product) {
    if (this.#usesOrvianeCart(product)) {
      const variantId = this.#orvianeCartVariantId(product);
      row.dataset.variantId = variantId ? String(variantId) : '';
      row.dataset.available = 'true';
      return;
    }

    const selects = row.querySelectorAll('.gw-bundle__select');
    const fallback = product.variants.find((v) => v.available) || product.variants[0];

    if (!selects.length) {
      row.dataset.variantId = fallback?.id ? String(fallback.id) : '';
      row.dataset.available = fallback?.available ? 'true' : 'false';
      return;
    }

    const selected = [];
    let allChosen = true;
    selects.forEach((sel) => {
      selected[Number(sel.dataset.optionIndex)] = sel.value;
      if (!sel.value) allChosen = false;
    });

    const named = product.options_with_values || [];
    const onlyDefault =
      named.length === 0 ||
      (named.length === 1 &&
        (named[0].name === 'Title' || named[0].values?.[0] === 'Default Title'));

    if (onlyDefault || !allChosen) {
      row.dataset.variantId = fallback?.id ? String(fallback.id) : '';
      row.dataset.available = fallback?.available ? 'true' : 'false';
      return;
    }

    const variant = product.variants.find((v) => {
      const o1 = selected[0] ?? v.option1;
      const o2 = selected[1] ?? v.option2;
      const o3 = selected[2] ?? v.option3;
      return v.option1 === o1 && (v.option2 == null || v.option2 === o2) && (v.option3 == null || v.option3 === o3);
    });

    const chosen = variant || fallback;
    row.dataset.variantId = chosen?.id ? String(chosen.id) : '';
    row.dataset.available = chosen?.available ? 'true' : 'false';
  }

  #ensureBundleDefaults(product) {
    const selectedWrap = this.querySelector('[data-gw-tier-wrap].is-expanded');
    if (!selectedWrap) return;

    selectedWrap.querySelectorAll('.gw-bundle__line').forEach((row) => {
      row.querySelectorAll('.gw-bundle__select').forEach((hidden) => {
        if (hidden.value) return;
        const field = hidden.parentElement;
        const swatchBtn = field?.querySelector('.gw-swatch-picker__btn');
        const sizeBtn = field?.querySelector('.gw-size-picker__btn');
        const firstOption = field?.querySelector('.gw-dd__option');
        if (swatchBtn) {
          swatchBtn.click();
          return;
        }
        if (sizeBtn) {
          sizeBtn.click();
          return;
        }
        const value = firstOption?.dataset.value || firstOption?.textContent?.trim() || '';
        if (!value) return;

        hidden.value = value;
        const trigger = field?.querySelector('.gw-dd__trigger');
        const valueEl = trigger?.querySelector('.gw-dd__value');
        if (valueEl) valueEl.textContent = value;
        trigger?.classList.remove('is-placeholder');
        field?.querySelectorAll('.gw-dd__option').forEach((opt) => opt.classList.remove('is-chosen'));
        firstOption?.classList.add('is-chosen');
      });
      this.#syncLineVariant(row, product);
    });
  }

  #bindAddToCart(signal, product) {
    const form = this.querySelector('[data-gw-product-form]');
    if (!form) return;

    form.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
        const product = this.#enrichPerfumeProduct(this.#readProduct());
        if (!product) return;
        const stickyBtn = this.querySelector('[data-gw-sticky-atc]');
        const fromSticky =
          event.submitter === stickyBtn ||
          event.submitter?.getAttribute('data-gw-sticky-atc') != null ||
          this.#stickySubmitPending;
        this.#stickySubmitPending = false;
        if (fromSticky) this.#ensureBundleDefaults(product);

        const btn = form.querySelector('[type="submit"]:not([data-gw-sticky-atc])');
        const errorEl = this.querySelector('[data-gw-cart-error]');
        if (errorEl) errorEl.hidden = true;

        const selectedWrap = this.querySelector('[data-gw-tier-wrap].is-expanded');
        const selectedTier = selectedWrap?.querySelector('[data-gw-tier].is-selected');
        const qty = Number(selectedTier?.getAttribute('data-gw-tier')) || 0;
        const lines = selectedWrap?.querySelectorAll('.gw-bundle__line') ?? [];

        const missing = [...(selectedWrap?.querySelectorAll('.gw-bundle__select') ?? [])].some((sel) => !sel.value);
        if (missing) {
          if (errorEl) {
            errorEl.textContent = 'Choose color and size for each piece.';
            errorEl.hidden = false;
          }
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        /** @type {{ id: number, quantity: number }[]} */
        let items = [];

        if (qty > 0 && lines.length) {
          items = [...lines]
            .map((line) => {
              const item = {
                id: Number(line.dataset.variantId),
                quantity: 1,
              };
              if (this.#usesOrvianeCart(product)) {
                item.properties = this.#orvianeLineProperties(line, product);
              }
              return item;
            })
            .filter((item) => item.id);
        } else if (qty === 0) {
          if (errorEl) {
            errorEl.textContent = 'Choose a bundle option above.';
            errorEl.hidden = false;
          }
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        } else {
          const variantId = this.#usesOrvianeCart(product)
            ? this.#orvianeCartVariantId(product)
            : product.selected_or_first_available_variant?.id || product.variants[0]?.id;
          if (variantId) {
            const item = { id: variantId, quantity: 1 };
            if (this.#usesOrvianeCart(product)) {
              item.properties = this.#orvianeLineProperties(null, product);
            }
            items = [item];
          }
        }

        if (!items.length) {
          if (errorEl) {
            errorEl.textContent = 'Choose an available combination.';
            errorEl.hidden = false;
          }
          return;
        }

        const unavailable = [...lines].some((line) => line.dataset.available === 'false');
        if (unavailable) {
          if (errorEl) {
            errorEl.textContent = 'One or more selections are sold out.';
            errorEl.hidden = false;
          }
          return;
        }

        const setBusy = (busy) => {
          [btn, stickyBtn].forEach((control) => {
            if (!(control instanceof HTMLButtonElement)) return;
            control.disabled = busy;
            if (busy) control.setAttribute('aria-busy', 'true');
            else control.removeAttribute('aria-busy');
          });
        };
        setBusy(true);

        const sectionIds = [...document.querySelectorAll('cart-items-component')]
          .map((el) => (el instanceof HTMLElement ? el.dataset.sectionId : ''))
          .filter(Boolean);

        const deferredEventPromise = CartLinesUpdateEvent.createPromise();

        document.dispatchEvent(
          new CartLinesUpdateEvent({
            action: 'add',
            context: 'product',
            lines: items.map((item) => ({
              merchandiseId: String(item.id),
              quantity: item.quantity,
            })),
            promise: deferredEventPromise.promise,
          })
        );

        try {
          const payload = { items };
          if (sectionIds.length) payload.sections = sectionIds.join(',');

          const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          const response = await res.json();
          if (!res.ok) throw new Error(response?.description || response?.message || 'add_failed');

          const cartRes = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`, {
            headers: { Accept: 'application/json' },
          });
          if (!cartRes.ok) throw new Error('cart_refresh_failed');
          const ajaxCart = await cartRes.json();

          deferredEventPromise.resolve({
            cart: CartLinesUpdateEvent.createCartFromAjaxResponse(ajaxCart),
            detail: {
              sections: response.sections,
              items: ajaxCart.items,
              itemCount: ajaxCart.item_count,
              source: 'gw-product-bundle',
              didError: false,
            },
          });
        } catch (error) {
          deferredEventPromise.reject(error);
          if (errorEl) {
            errorEl.textContent = 'Could not add to cart. Try again.';
            errorEl.hidden = false;
          }
        } finally {
          setBusy(false);
        }
      },
      { signal }
    );
  }

  #bindSizeGuide(signal) {
    const dialog = this.querySelector('[data-gw-size-dialog]');
    if (!(dialog instanceof HTMLDialogElement)) return;

    this.querySelectorAll('[data-gw-size-open]').forEach((btn) => {
      btn.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          dialog.showModal();
        },
        { signal }
      );
    });

    dialog.querySelector('[data-gw-size-close]')?.addEventListener(
      'click',
      () => {
        dialog.close();
      },
      { signal }
    );

    dialog.addEventListener(
      'click',
      (event) => {
        if (event.target === dialog) dialog.close();
      },
      { signal }
    );
  }

  #bindSticky(signal) {
    const bar = this.querySelector('[data-gw-sticky]');
    const form = this.querySelector('[data-gw-product-form]');
    if (!bar || !form) return;

    const squeezeQuery = window.matchMedia('(min-width: 990px)');
    /** @type {IntersectionObserver | null} */
    let observer = null;

    const connectObserver = () => {
      observer?.disconnect();
      const root = squeezeQuery.matches ? document.querySelector('.page-wrapper') : null;
      observer = new IntersectionObserver(
        ([entry]) => {
          bar.classList.toggle('is-visible', Boolean(entry) && !entry.isIntersecting);
        },
        { root, threshold: 0 }
      );
      observer.observe(form);
    };

    connectObserver();
    squeezeQuery.addEventListener('change', connectObserver, { signal });
    signal.addEventListener('abort', () => observer?.disconnect());

    this.querySelectorAll('[data-gw-scroll-offer]').forEach((btn) => {
      btn.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          const target = this.querySelector('[data-gw-offer-anchor]');
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        { signal }
      );
    });

    const stickyAtc = bar.querySelector('[data-gw-sticky-atc]');
    stickyAtc?.addEventListener(
      'click',
      (event) => {
        this.#stickySubmitPending = true;
        const stickyBtn = event.currentTarget;
        if (stickyBtn instanceof HTMLButtonElement && stickyBtn.form === form) return;
        event.preventDefault();
        if (typeof form.requestSubmit === 'function') form.requestSubmit(stickyBtn);
        else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      },
      { signal }
    );
  }

  #bindMiniReviews(signal) {
    const root = this.querySelector('[data-gw-mini-reviews]');
    if (!root) return;
    const viewport = root.querySelector('.gw-pdp__mini-viewport');
    const track = root.querySelector('[data-gw-mini-track]');
    const cards = track ? [...track.children] : [];
    if (!viewport || !track || cards.length === 0) return;

    let index = 0;
    let dragX = 0;
    let startX = 0;
    let dragging = false;

    const gapOf = () => {
      const style = getComputedStyle(track);
      return Number.parseFloat(style.columnGap || style.gap) || 12;
    };

    const step = () => {
      const width = cards[0].getBoundingClientRect().width;
      return width ? width + gapOf() : 0;
    };

    const visibleCount = () => {
      const viewportWidth = viewport.getBoundingClientRect().width;
      const cardStep = step();
      if (!viewportWidth || !cardStep) return 1;
      return Math.max(1, Math.round(viewportWidth / cardStep));
    };

    const max = () => Math.max(0, cards.length - visibleCount());

    const apply = (animate = true) => {
      index = Math.min(Math.max(0, index), max());
      track.style.transition = animate ? 'transform 0.3s ease' : 'none';
      const offset = index * step() - dragX;
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      const prev = root.querySelector('[data-gw-mini-prev]');
      const next = root.querySelector('[data-gw-mini-next]');
      if (prev instanceof HTMLButtonElement) prev.disabled = index === 0;
      if (next instanceof HTMLButtonElement) next.disabled = index >= max();
    };

    root.querySelector('[data-gw-mini-prev]')?.addEventListener(
      'click',
      () => {
        index -= 1;
        dragX = 0;
        apply();
      },
      { signal }
    );
    root.querySelector('[data-gw-mini-next]')?.addEventListener(
      'click',
      () => {
        index += 1;
        dragX = 0;
        apply();
      },
      { signal }
    );

    let dragPointerId = null;
    let startY = 0;
    let dragAxis = null;

    const cancelDrag = () => {
      if (dragPointerId !== null && track.hasPointerCapture(dragPointerId)) {
        track.releasePointerCapture(dragPointerId);
      }
      dragging = false;
      dragPointerId = null;
      dragAxis = null;
      dragX = 0;
      track.classList.remove('is-dragging');
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button, a')) return;
      dragPointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dragX = 0;
      dragging = false;
      dragAxis = null;
    };

    const onPointerMove = (event) => {
      if (dragPointerId === null || event.pointerId !== dragPointerId) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (!dragAxis && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
        dragAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'x' : 'y';
      }
      if (dragAxis === 'y') {
        cancelDrag();
        return;
      }
      if (dragAxis !== 'x') return;
      dragging = true;
      track.classList.add('is-dragging');
      if (track.setPointerCapture && !track.hasPointerCapture(event.pointerId)) {
        try {
          track.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }
      event.preventDefault();
      dragX = deltaX;
      apply(false);
    };

    const onPointerUp = (event) => {
      if (dragPointerId === null) return;
      if (event && event.pointerId !== dragPointerId) return;
      if (track.hasPointerCapture(dragPointerId)) {
        track.releasePointerCapture(dragPointerId);
      }
      const didDrag = dragging;
      const axis = dragAxis;
      dragging = false;
      dragPointerId = null;
      dragAxis = null;
      track.classList.remove('is-dragging');
      if (axis === 'y' || !didDrag) {
        dragX = 0;
        apply(true);
        return;
      }
      const threshold = Math.min(64, step() * 0.18);
      if (dragX <= -threshold) index += 1;
      else if (dragX >= threshold) index -= 1;
      dragX = 0;
      apply(true);
    };

    track.addEventListener('pointerdown', onPointerDown, { capture: true, signal });
    track.addEventListener('pointermove', onPointerMove, { passive: false, signal });
    track.addEventListener('pointerup', onPointerUp, { signal });
    track.addEventListener('pointercancel', onPointerUp, { signal });
    track.addEventListener('lostpointercapture', (event) => {
      if (dragPointerId !== null && event.pointerId === dragPointerId) onPointerUp(event);
    }, { signal });

    window.addEventListener('resize', () => apply(false), { signal });
    requestAnimationFrame(() => apply(false));
  }

  #bindUgcVideos(signal) {
    const videos = [...this.querySelectorAll('[data-gw-ugc] video')];
    if (!videos.length) return;

    const playVideo = (video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.play()?.catch(() => {});
    };

    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.removeAttribute('controls');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting) playVideo(entry.target);
          else entry.target.pause();
        });
      },
      { threshold: 0.2 }
    );

    videos.forEach((video) => {
      observer.observe(video);
      playVideo(video);
    });

    signal.addEventListener('abort', () => observer.disconnect());
  }
}

if (!customElements.get('gw-product-bundle')) {
  customElements.define('gw-product-bundle', GwProductBundle);
}
