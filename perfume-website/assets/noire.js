(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isOrvianeCartLine = (item) => {
    const props = item?.properties || {};
    return Boolean(
      props._orviane_title ||
        props['_orviane_title'] ||
        props._orviane_asset ||
        props['_orviane_asset'] ||
        props._orviane_slug ||
        props['_orviane_slug']
    );
  };

  const updateNoireCartCountBadge = (visibleQty) => {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      if (visibleQty > 0) {
        el.textContent = String(visibleQty);
        el.removeAttribute('hidden');
      } else {
        el.textContent = '0';
        el.setAttribute('hidden', '');
      }
    });
  };

  const purgeNonOrvianeCartLines = async () => {
    if (!document.body.classList.contains('noire-theme')) return;
    const root = window.Shopify?.routes?.root || '/';
    try {
      const response = await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const cart = await response.json();
      const updates = {};
      let visibleQty = 0;
      for (const item of cart.items || []) {
        if (isOrvianeCartLine(item)) {
          visibleQty += item.quantity;
        } else {
          updates[item.key] = 0;
        }
      }
      if (Object.keys(updates).length > 0) {
        const updateRes = await fetch(`${root}cart/update.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ updates }),
        });
        if (updateRes.ok) {
          window.location.reload();
          return;
        }
      }
      updateNoireCartCountBadge(visibleQty);
    } catch {
      /* cart cleanup is best-effort */
    }
  };

  purgeNonOrvianeCartLines();

  const getAriaControlledElement = (control) => {
    const id = control?.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };

  document.querySelectorAll('[data-noire-villain-filter-toggle]').forEach((toggle) => {
    const panelId = toggle.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    toggle.addEventListener('click', () => {
      const open = panel.hasAttribute('hidden');
      panel.toggleAttribute('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  const header = document.querySelector('[data-noire-header]');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.querySelectorAll('[data-noire-mega-trigger]').forEach((trigger) => {
    const panel = getAriaControlledElement(trigger);
    if (!panel) return;
    const close = () => {
      panel.classList.remove('is-open');
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    trigger.addEventListener('click', () => {
      const open = !panel.classList.contains('is-open');
      document.querySelectorAll('.noire-mega.is-open').forEach((el) => {
        el.classList.remove('is-open');
        el.hidden = true;
      });
      panel.classList.toggle('is-open', open);
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  });

  document.querySelectorAll('[data-noire-drawer-open]').forEach((openBtn) => {
    const drawer = getAriaControlledElement(openBtn);
    if (!drawer) return;
    const closeEls = drawer.querySelectorAll('[data-noire-drawer-close]');
    const open = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      const focusable = drawer.querySelector('button, a, input');
      if (focusable) focusable.focus();
    };
    const close = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      openBtn.focus();
    };
    openBtn.addEventListener('click', open);
    closeEls.forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  });

  const revealItems = document.querySelectorAll('.noire-reveal');
  const showReveal = (el) => el.classList.add('is-visible');

  if (!prefersReducedMotion && revealItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
    );
    revealItems.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        showReveal(el);
        observer.unobserve(el);
      }
    });
  } else {
    revealItems.forEach(showReveal);
  }

  const readOrvianeDemoCatalog = () => {
    const el = document.getElementById('orviane-demo-catalog');
    if (!el?.textContent) return [];
    try {
      return JSON.parse(el.textContent);
    } catch {
      return [];
    }
  };

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('[data-orviane-nav]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute('href');
      if (!href) return;
      event.preventDefault();

      const slug = link.getAttribute('data-orviane-slug') || '';
      const title = link.getAttribute('data-orviane-title') || '';
      const asset = link.getAttribute('data-orviane-asset') || '';
      const assetUrl = link.getAttribute('data-orviane-asset-url') || '';
      const price = link.getAttribute('data-orviane-price') || '';

      const pathname = href.split('?')[0].split('#')[0];
      const url = new URL(pathname.startsWith('/') ? pathname : `/${pathname}`, window.location.origin);
      url.search = '';
      url.searchParams.set('view', 'orviane');
      if (slug) url.searchParams.set('orviane_slug', slug);
      else if (title) url.searchParams.set('orviane_title', title);
      if (asset) url.searchParams.set('orviane_asset', asset);
      if (price) url.searchParams.set('orviane_price', price);
      const themeId = window.theme?.themeId;
      if (themeId) url.searchParams.set('preview_theme_id', String(themeId));

      const payload = { slug, title, asset, assetUrl, priceCents: price };
      const catalog = readOrvianeDemoCatalog();
      const match = catalog.find((item) => item.slug === slug);
      if (match) {
        payload.title = match.title || payload.title;
        payload.asset = match.asset || payload.asset;
        payload.priceCents = String(match.priceCents ?? payload.priceCents);
      }
      sessionStorage.setItem('orvianeDemoPdp', JSON.stringify(payload));
      window.location.assign(url.toString());
    },
    true
  );

  const predictiveSuggestUrl = () => {
    const base = window.theme?.routes?.predictiveSearch || '/search/suggest';
    return base.endsWith('.json') ? base : `${base}.json`;
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  let noireSearchCatalogCache = null;
  const getNoireSearchCatalog = () => {
    if (noireSearchCatalogCache) return noireSearchCatalogCache;
    const el = document.querySelector('script[id^="noire-search-catalog-"]');
    if (!el?.textContent) {
      noireSearchCatalogCache = [];
      return noireSearchCatalogCache;
    }
    try {
      noireSearchCatalogCache = JSON.parse(el.textContent);
    } catch {
      noireSearchCatalogCache = [];
    }
    return noireSearchCatalogCache;
  };

  const titleMatchesQuery = (title, query) => {
    const haystack = String(title || '').toLowerCase();
    const needle = String(query || '').toLowerCase().trim();
    if (!needle) return false;
    if (haystack.includes(needle)) return true;
    return needle.split(/\s+/).every((part) => part.length > 0 && haystack.includes(part));
  };

  const catalogItemMatchesQuery = (item, query) => {
    const haystack = `${item?.title || ''} ${item?.url || ''}`.toLowerCase();
    return titleMatchesQuery(haystack, query);
  };

  const isPerfumeStoreProduct = (product) => {
    const title = String(product?.title || '').toLowerCase();
    const tagText = Array.isArray(product?.tags) ? product.tags.join(' ').toLowerCase() : '';
    if (tagText.includes('demo-footwear') || tagText.includes('footwear') || tagText.includes('solmarch')) {
      return false;
    }
    return (
      title.includes('orviane') ||
      title.includes('parfum') ||
      title.includes('fragrance') ||
      title.includes('oud') ||
      title.includes('noir')
    );
  };

  const formatProductPrice = (price, priceCents) => {
    if (priceCents != null && priceCents !== '') {
      const cents = Number(priceCents);
      if (!Number.isNaN(cents) && typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
        return window.Shopify.formatMoney(cents, window.theme?.moneyFormat);
      }
    }
    if (price == null || price === '') return '';
    const cents = Math.round(parseFloat(price, 10) * 100);
    if (Number.isNaN(cents)) return String(price);
    if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents, window.theme?.moneyFormat);
    }
    return String(price);
  };

  const closePredictivePanel = (panel, input) => {
    if (!panel) return;
    panel.hidden = true;
    panel.innerHTML = '';
    if (input) input.setAttribute('aria-expanded', 'false');
  };

  document.querySelectorAll('[data-noire-predictive-search]').forEach((form) => {
    const input = form.querySelector('input[type="search"], input[name="q"]');
    const panelId = form.dataset.suggestionsId;
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!input || !panel) return;

    let activeFetch = null;
    let debounceTimer = null;

    const renderSuggestions = (products, query) => {
      if (!products.length) {
        panel.innerHTML = '<p class="noire-header__search-suggestions-empty">No fragrances found</p>';
        panel.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        return;
      }

      const items = products
        .map((product, index) => {
          const title = escapeHtml(product.title || '');
          const url = escapeHtml(product.url || '#');
          const image =
            (typeof product.image === 'string' ? product.image : product.image?.url) ||
            product.featured_image?.url ||
            '';
          const price = formatProductPrice(product.price_min ?? product.price, product.priceCents);
          const media = image
            ? `<div class="noire-header__search-suggestion-media"><img src="${image}" alt="" width="40" height="40" loading="lazy"></div>`
            : '<div class="noire-header__search-suggestion-media" aria-hidden="true"></div>';
          return `<li class="noire-header__search-suggestion" role="option" id="noire-suggest-${panelId}-${index}">
            <a class="noire-header__search-suggestion-link" href="${url}">
              ${media}
              <span class="noire-header__search-suggestion-copy">
                <span class="noire-header__search-suggestion-title">${title}</span>
                ${price ? `<span class="noire-header__search-suggestion-price">${price}</span>` : ''}
              </span>
            </a>
          </li>`;
        })
        .join('');

      const searchUrl = window.theme?.routes?.search || '/search';
      const viewAll = `${searchUrl}?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;

      panel.innerHTML = `<ul class="noire-header__search-suggestions-list" role="listbox" aria-label="Product suggestions">
        ${items}
      </ul>
      <p class="noire-header__search-suggestions-footer"><a href="${viewAll}">View all results</a></p>`;
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };

    const fetchSuggestions = (query) => {
      const localMatches = getNoireSearchCatalog()
        .filter((item) => catalogItemMatchesQuery(item, query))
        .slice(0, 8);
      if (localMatches.length) {
        renderSuggestions(localMatches, query);
        return;
      }

      if (activeFetch) activeFetch.abort();
      const controller = new AbortController();
      activeFetch = controller;

      const url = new URL(predictiveSuggestUrl(), window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('resources[type]', 'product');
      url.searchParams.set('resources[limit]', '12');
      url.searchParams.set('resources[options][unavailable_products]', 'hide');

      fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error('Search failed');
          return response.json();
        })
        .then((data) => {
          if (controller.signal.aborted) return;
          const products = (data?.resources?.results?.products || []).filter(isPerfumeStoreProduct).slice(0, 8);
          renderSuggestions(products, query);
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          closePredictivePanel(panel, input);
        })
        .finally(() => {
          if (activeFetch === controller) activeFetch = null;
        });
    };

    const scheduleFetch = () => {
      const query = input.value.trim();
      if (!query.length) {
        closePredictivePanel(panel, input);
        return;
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchSuggestions(query), 220);
    };

    input.addEventListener('input', scheduleFetch);
    input.addEventListener('focus', scheduleFetch);

    form.addEventListener('submit', () => {
      closePredictivePanel(panel, input);
    });

    document.addEventListener('click', (event) => {
      if (form.contains(event.target) || panel.contains(event.target)) return;
      closePredictivePanel(panel, input);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePredictivePanel(panel, input);
        input.blur();
      }
    });
  });

  document.querySelectorAll('[data-noire-finder]').forEach((form) => {
    const result = form.querySelector('[data-noire-finder-result]');
    const link = form.querySelector('[data-noire-finder-link]');
    const base = form.dataset.collectionUrl || '/collections/all';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const family = form.querySelector('[name="scent_family"]')?.value;
      const warmth = form.querySelector('[name="warmth"]')?.value;
      const occasion = form.querySelector('[name="occasion"]')?.value;
      const intensity = form.querySelector('[name="intensity"]')?.value;
      const tags = [family, warmth, occasion, intensity].filter(Boolean);
      const url = tags.length ? `${base}/${tags.map((t) => encodeURIComponent(t)).join('+')}` : base;
      if (link) {
        link.href = url;
        link.textContent = form.dataset.resultLabel || 'View matching fragrances';
      }
      if (result) result.hidden = false;
    });
  });

  document.querySelectorAll('[data-noire-featured]').forEach((section) => {
    const main = section.querySelector('[data-noire-featured-main]');
    section.querySelectorAll('[data-noire-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        const alt = btn.dataset.alt || '';
        if (!main || !src) return;
        main.src = src;
        main.alt = alt;
        section.querySelectorAll('[data-noire-thumb]').forEach((b) => b.classList.toggle('is-active', b === btn));
      });
    });
    const variantJson = section.querySelector('[data-variants]');
    const variantInput = section.querySelector('[data-variant-id]');
    const priceEl = section.querySelector('[data-price]');
    const addBtn = section.querySelector('[data-add-to-cart]');
    if (!variantJson || !variantInput) return;
    const variants = JSON.parse(variantJson.textContent);
    const selects = section.querySelectorAll('[data-option-index]');
    const syncVariant = () => {
      const options = [...selects].map((s) => s.value);
      const match = variants.find((v) => v.options.every((opt, i) => opt === options[i]));
      if (!match) return;
      variantInput.value = match.id;
      if (priceEl && typeof window.Shopify !== 'undefined' && typeof window.Shopify.formatMoney === 'function') {
        priceEl.textContent = window.Shopify.formatMoney(match.price, window.theme.moneyFormat);
      } else if (priceEl && match.price) {
        priceEl.dataset.priceValue = match.price;
      }
      if (addBtn) {
        addBtn.disabled = !match.available;
        addBtn.textContent = match.available ? addBtn.dataset.addLabel : addBtn.dataset.soldLabel;
      }
    };
    selects.forEach((s) => s.addEventListener('change', syncVariant));
  });

  const filterToggle = document.querySelector('[data-noire-filter-toggle]');
  const filterPanel = document.querySelector('[data-mobile-filters]');
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', () => {
      const open = filterPanel.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /**
   * @param {HTMLElement} rail
   * @param {{ track: string, prev: string, next: string, card: string, centerOnMobile?: boolean }} cfg
   */
  const bindNoireSnapCarousel = (rail, cfg) => {
    if (rail.dataset.noireCarouselBound === 'true') return;
    rail.dataset.noireCarouselBound = 'true';

    const track = rail.querySelector(cfg.track);
    const prev = rail.querySelector(cfg.prev);
    const next = rail.querySelector(cfg.next);
    if (!track) return;

    const centerOnMobile = cfg.centerOnMobile !== false;
    const cards = () => [...track.querySelectorAll(cfg.card)];
    const useCentered = () => centerOnMobile && window.matchMedia('(max-width: 749px)').matches;

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
      const atStart = track.scrollLeft <= 4;
      const atEnd = track.scrollLeft >= maxScroll - 4;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    };

    prev?.addEventListener('click', () => scrollToIndex(getActiveIndex() - 1));
    next?.addEventListener('click', () => scrollToIndex(getActiveIndex() + 1));

    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScroll = 0;
    let dragMoved = false;
    let dragAxis = null;
    let blockNextClick = false;

    const releaseDragCapture = () => {
      if (dragPointerId !== null && track.hasPointerCapture?.(dragPointerId)) {
        track.releasePointerCapture(dragPointerId);
      }
    };

    const cancelDrag = () => {
      releaseDragCapture();
      dragPointerId = null;
      dragAxis = null;
      dragMoved = false;
      track.classList.remove('is-dragging');
    };

    const endDrag = (event) => {
      if (event && dragPointerId !== null && event.pointerId !== dragPointerId) return;
      const didDrag = dragMoved;
      releaseDragCapture();
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

    const isCarouselDragLink = (el) =>
      el instanceof HTMLAnchorElement &&
      (el.classList.contains('noire-discover-cat__media') ||
        el.classList.contains('noire-watch-shop__card-link'));

    const canStartDrag = (event) => {
      if (event.pointerType === 'touch') return false;
      if (event.pointerType === 'mouse' && event.button !== 0) return false;
      if (event.target.closest('button, .noire-category-card__cta, .noire-discover-cat__btn')) return false;
      const link = event.target.closest('a');
      if (link && !isCarouselDragLink(link)) return false;
      return true;
    };

    const applyDragScroll = (clientX, clientY, event) => {
      if (dragPointerId === null) return;
      const deltaX = clientX - dragStartX;
      const deltaY = clientY - dragStartY;
      if (!dragMoved && Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return;
      if (!dragMoved && Math.abs(deltaY) > Math.abs(deltaX) * 1.25) {
        cancelDrag();
        return;
      }
      dragMoved = true;
      track.classList.add('is-dragging');
      event?.preventDefault();
      track.scrollLeft = dragStartScroll - deltaX;
      updateNav();
    };

    track.addEventListener(
      'pointerdown',
      (event) => {
        if (!canStartDrag(event)) return;
        event.preventDefault();
        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragStartScroll = track.scrollLeft;
        dragMoved = false;
        dragAxis = null;
        if (track.setPointerCapture) {
          try {
            track.setPointerCapture(event.pointerId);
          } catch {
            /* ignore */
          }
        }
      },
      { capture: true }
    );

    track.addEventListener(
      'pointermove',
      (event) => {
        if (dragPointerId === null || event.pointerId !== dragPointerId) return;
        applyDragScroll(event.clientX, event.clientY, event);
      },
      { passive: false }
    );

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', (event) => {
      if (dragPointerId !== null && event.pointerId === dragPointerId) endDrag(event);
    });

    track.addEventListener(
      'mousedown',
      (event) => {
        if (window.PointerEvent) return;
        if (!canStartDrag(event)) return;
        event.preventDefault();
        dragPointerId = 'mouse-fallback';
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragStartScroll = track.scrollLeft;
        dragMoved = false;

        const onMouseMove = (moveEvent) => {
          if (dragPointerId !== 'mouse-fallback') return;
          applyDragScroll(moveEvent.clientX, moveEvent.clientY, moveEvent);
        };

        const onMouseUp = (upEvent) => {
          if (dragPointerId !== 'mouse-fallback') return;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          const didDrag = dragMoved;
          dragPointerId = null;
          track.classList.remove('is-dragging');
          if (didDrag) {
            blockNextClick = true;
            snapToNearest();
          }
          dragMoved = false;
          updateNav();
          if (didDrag) upEvent.preventDefault();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      },
      { capture: true }
    );

    track.addEventListener(
      'wheel',
      (event) => {
        const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
        if (!horizontal && !event.shiftKey) return;
        const delta = horizontal ? event.deltaX : event.deltaY;
        if (!delta) return;
        track.scrollLeft += delta;
        event.preventDefault();
        updateNav();
      },
      { passive: false }
    );

    track.addEventListener(
      'click',
      (event) => {
        const link = event.target.closest('a');
        const isPrimaryCta =
          link &&
          (link.classList.contains('noire-category-card__cta') ||
            link.classList.contains('noire-discover-cat__btn'));
        if (isPrimaryCta) {
          blockNextClick = false;
          return;
        }
        if (!blockNextClick) return;
        if (link && track.contains(link)) {
          event.preventDefault();
        }
        blockNextClick = false;
      },
      true
    );

    track.addEventListener('scroll', updateNav, { passive: true });
    const syncLayout = () => {
      if (useCentered()) {
        scrollToIndex(getActiveIndex(), 'auto');
      }
      updateNav();
    };
    window.addEventListener('resize', syncLayout);
    scrollToIndex(0, 'auto');
    updateNav();
  };

  const initNoireCarousels = (root = document) => {
    root.querySelectorAll('[data-noire-watch-shop]').forEach((rail) => {
      bindNoireSnapCarousel(rail, {
        track: '[data-noire-watch-track]',
        prev: '[data-noire-watch-prev]',
        next: '[data-noire-watch-next]',
        card: '.noire-watch-shop__card',
      });
    });

    root.querySelectorAll('[data-noire-discover-cat]').forEach((rail) => {
      bindNoireSnapCarousel(rail, {
        track: '[data-noire-discover-track]',
        prev: '[data-noire-discover-prev]',
        next: '[data-noire-discover-next]',
        card: '.noire-discover-cat__card',
      });
    });

    root.querySelectorAll('[data-noire-categories-col]').forEach((rail) => {
      bindNoireSnapCarousel(rail, {
        track: '[data-noire-categories-track]',
        prev: '[data-noire-categories-prev]',
        next: '[data-noire-categories-next]',
        card: '.noire-categories__slide',
      });
    });
  };

  initNoireCarousels();

  document.addEventListener('shopify:section:load', (event) => {
    if (event.target instanceof HTMLElement) initNoireCarousels(event.target);
  });

  document.querySelectorAll('[data-noire-product-card]').forEach((card) => {
    const hover = card.querySelector('[data-hover-image]');
    if (!hover) return;
    card.addEventListener('mouseenter', () => {
      hover.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      hover.style.opacity = '0';
    });
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-noire-villain-add-to-cart]');
    if (!form) return;
    event.preventDefault();

    const variantId = form.querySelector('[name="id"]')?.value;
    const button = form.querySelector('button[type="submit"]');
    if (!variantId || !button || button.disabled) return;

    const properties = {};
    form.querySelectorAll('input[name^="properties["]').forEach((input) => {
      if (!(input instanceof HTMLInputElement) || !input.name) return;
      const match = input.name.match(/^properties\[(.+)\]$/);
      if (match && input.value) properties[match[1]] = input.value;
    });

    const cartAddBase = window.theme?.routes?.cartAdd || '/cart/add';
    const cartAddUrl = cartAddBase.endsWith('.js') ? cartAddBase : `${cartAddBase}.js`;

    button.disabled = true;
    fetch(cartAddUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: Number(variantId),
        quantity: Number(form.querySelector('[name="quantity"]')?.value) || 1,
        ...(Object.keys(properties).length ? { properties } : {}),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Add to cart failed');
        window.location.reload();
      })
      .catch(() => {
        form.removeAttribute('data-noire-villain-add-to-cart');
        form.submit();
      })
      .finally(() => {
        button.disabled = false;
      });
  });

  const padCountdown = (value) => String(Math.max(0, value)).padStart(2, '0');

  const initSaleCountdown = () => {
    document.querySelectorAll('[data-noire-countdown]:not([data-noire-countdown-init])').forEach((root) => {
      const endRaw = root.getAttribute('data-end');
      if (!endRaw) return;
      root.dataset.noireCountdownInit = 'true';

      const endMs = Date.parse(endRaw);
      if (!Number.isFinite(endMs)) return;

      const daysEl = root.querySelector('[data-countdown-days]');
      const hoursEl = root.querySelector('[data-countdown-hours]');
      const minutesEl = root.querySelector('[data-countdown-minutes]');
      const secondsEl = root.querySelector('[data-countdown-seconds]');
      if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

      const tick = () => {
        const diff = endMs - Date.now();
        if (diff <= 0) {
          daysEl.textContent = '00';
          hoursEl.textContent = '00';
          minutesEl.textContent = '00';
          secondsEl.textContent = '00';
          return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = padCountdown(days);
        hoursEl.textContent = padCountdown(hours);
        minutesEl.textContent = padCountdown(minutes);
        secondsEl.textContent = padCountdown(seconds);
      };

      tick();
      window.setInterval(tick, 1000);
    });
  };

  initSaleCountdown();

  document.addEventListener('shopify:section:load', () => {
    initSaleCountdown();
  });
})();
