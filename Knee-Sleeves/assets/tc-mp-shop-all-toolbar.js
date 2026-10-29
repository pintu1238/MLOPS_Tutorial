/**
 * Shop All toolbar — grid columns, sort, and catalog card filters.
 */
class TcMpShopAllToolbar extends HTMLElement {
  #abort = new AbortController();
  #listPage = 1;

  #normalizeCategoryKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  #cardCategoryList(card) {
    const raw = card.dataset.cardCategories || card.dataset.cardTags || '';
    return raw
      .split(',')
      .map((c) => this.#normalizeCategoryKey(c))
      .filter(Boolean);
  }

  #categoryMatches(cardCategories, key) {
    if (!key) return false;
    const needle = this.#normalizeCategoryKey(key);
    return cardCategories.some((cat) => cat === needle || cat.startsWith(`${needle}-`) || needle.startsWith(`${cat}-`));
  }

  connectedCallback() {
    const { signal } = (this.#abort = new AbortController());
    const section = this.closest('.tc-mp-shop-all');
    if (!section) return;

    this.grid = section.querySelector('.tc-mp-shop-all__grid');
    this.cards = () => Array.from(section.querySelectorAll('.tc-mp-shop-all__card'));
    this.collectionUrl = this.dataset.collectionUrl || '';
    this.storeSort = this.dataset.storeSort === 'true';

    this.#bindColumns(signal);
    this.#bindSort(signal);
    this.#bindFilterDrawer(signal);
    this.#bindFilters(signal);
    this.#bindColorSwatches(signal, section);
    this.#bindListPagination(signal, section);
    this.#bindResponsiveColumns(signal);

    const dialog = this.querySelector('[data-filter-dialog]');
    if (dialog) {
      this.#applyBudgetFromUrl(dialog);
      this.#applyCategoryFromUrl(dialog);
      this.#applyPinnedCategory(dialog);
      this.#applyFilters(dialog);
    } else this.#applyListPagination();

    this.#applySortFromUrl();
  }

  #applyBudgetFromUrl(dialog) {
    const budget = new URLSearchParams(window.location.search).get('budget');
    if (!budget) return;
    const input = dialog.querySelector(`[data-filter-category][value="${budget}"]`);
    if (!input) return;
    input.checked = true;
  }

  #applyCategoryFromUrl(dialog) {
    const category = new URLSearchParams(window.location.search).get('category');
    if (!category) return;
    const input = dialog.querySelector(`[data-filter-category][value="${category}"]`);
    if (!input) return;
    input.checked = true;
  }

  #applyPinnedCategory(dialog) {
    const pinned = (this.dataset.initialCategory || '').trim();
    if (!pinned) return;
    const input = dialog.querySelector(`[data-filter-category][value="${pinned}"]`);
    if (!input) return;
    input.checked = true;
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #applyCardColorSwatch(card, swatch) {
    if (!card || !swatch) return;
    const img = card.querySelector('.tc-mp-shop-all__card-img');
    const nextSrc = swatch.getAttribute('data-color-image');
    if (!img || !nextSrc) return;

    img.src = nextSrc;
    img.removeAttribute('srcset');
    card.dataset.catalogImage = nextSrc;

    const colorLabel = swatch.getAttribute('data-color-label') || swatch.getAttribute('aria-label') || '';
    if (colorLabel) card.dataset.catalogColor = colorLabel;

    card.querySelectorAll('[data-color-image]').forEach((btn) => {
      btn.classList.toggle('is-active', btn === swatch);
    });
  }

  #bindColorSwatches(signal, section) {
    section.addEventListener(
      'click',
      (event) => {
        const swatch = event.target.closest('[data-color-image]');
        if (!swatch) return;
        event.preventDefault();
        event.stopPropagation();

        const card = swatch.closest('.tc-mp-shop-all__card');
        if (!card || !card.closest('[data-tc-mp-layout-grid]')) return;
        this.#applyCardColorSwatch(card, swatch);
      },
      { signal }
    );

    section.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const swatch = event.target.closest('[data-color-image]');
        if (!swatch) return;
        event.preventDefault();
        const card = swatch.closest('.tc-mp-shop-all__card');
        if (!card || !card.closest('[data-tc-mp-layout-grid]')) return;
        this.#applyCardColorSwatch(card, swatch);
      },
      { signal }
    );
  }

  #bindColumns(signal) {
    this.querySelectorAll('[data-columns]').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          let cols = btn.getAttribute('data-columns');
          cols = this.#clampColumnCount(cols);
          this.#setColumns(cols);
          this.dataset.userColumns = cols;
          this.querySelectorAll('[data-columns]').forEach((b) => {
            const match = b.getAttribute('data-columns') === cols;
            b.classList.toggle('is-active', match);
            b.setAttribute('aria-pressed', match ? 'true' : 'false');
          });
          this.#listPage = 1;
          const dialog = this.querySelector('[data-filter-dialog]');
          if (dialog) this.#applyFilters(dialog);
          else this.#applyListPagination();
        },
        { signal }
      );
    });
  }

  #bindListPagination(signal, section) {
    const nav = section.querySelector('[data-list-pagination]');
    if (!nav) return;

    nav.querySelector('[data-list-prev]')?.addEventListener(
      'click',
      () => {
        this.#listPage = Math.max(1, (this.#listPage || 1) - 1);
        this.#applyListPagination();
      },
      { signal }
    );

    nav.querySelector('[data-list-next]')?.addEventListener(
      'click',
      () => {
        this.#listPage = (this.#listPage || 1) + 1;
        this.#applyListPagination();
      },
      { signal }
    );
  }

  #isListMode() {
    return Boolean(this.grid?.classList.contains('tc-mp-shop-all__grid--list'));
  }

  #getActiveColumns() {
    if (this.#isListMode()) return 'list';
    for (const n of [2, 3, 4, 5]) {
      if (this.grid?.classList.contains(`tc-mp-shop-all__grid--cols-${n}`)) return String(n);
    }
    return '4';
  }

  #getPerPageForView() {
    const cols = this.#getActiveColumns();
    if (cols === 'list') return Number(this.dataset.listPerPage || 8);
    if (cols === '2') return Number(this.dataset.grid2PerPage || 12);
    if (cols === '3') return Number(this.dataset.grid3PerPage || 15);
    if (cols === '4') return Number(this.dataset.grid4PerPage || 24);
    if (cols === '5') return Number(this.dataset.grid5PerPage || 30);
    return 0;
  }

  #cardsInSyncedGrid(grid) {
    if (!grid || grid === this.grid) return [];
    return Array.from(grid.querySelectorAll('.tc-mp-bs__card, .tc-mp-shop-all__card'));
  }

  #applyPageToCards(cards, page, perPage) {
    cards.forEach((card, index) => {
      const onPage = index >= (page - 1) * perPage && index < page * perPage;
      card.style.display = onPage ? '' : 'none';
    });
    return cards.some((card) => card.style.display !== 'none');
  }

  #resetSyncedSections() {
    this.#layoutGrids().forEach((grid) => {
      if (grid === this.grid) return;
      this.#cardsInSyncedGrid(grid).forEach((card) => {
        card.style.display = '';
      });
      const root = grid.closest('.tc-mp-bs, .tc-mp-new-arrivals');
      if (root) root.style.display = '';
    });
  }

  #applySyncedPagination(page, perPage) {
    this.#layoutGrids().forEach((grid) => {
      if (grid === this.grid) return;
      const cards = this.#cardsInSyncedGrid(grid);
      this.#applyPageToCards(cards, page, perPage);
      const root = grid.closest('.tc-mp-bs, .tc-mp-new-arrivals');
      if (root) root.style.display = '';
    });
  }

  #applyListPagination() {
    const section = this.closest('.tc-mp-shop-all');
    const nav = section?.querySelector('[data-list-pagination]');
    const serverPagination = section?.querySelector('.tc-mp-shop-all__pagination');
    const perPage = this.#getPerPageForView();
    const matched = this.cards().filter((card) => !card.hidden);

    if (!perPage) {
      matched.forEach((card) => {
        card.style.display = '';
      });
      this.#resetSyncedSections();
      if (nav) nav.hidden = true;
      if (serverPagination) serverPagination.hidden = false;
      return;
    }

    if (serverPagination) serverPagination.hidden = true;

    let page = this.#listPage || 1;
    const totalPages = Math.max(1, Math.ceil(matched.length / perPage));
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    this.#listPage = page;

    this.#applyPageToCards(matched, page, perPage);
    this.#applySyncedPagination(page, perPage);

    if (nav) {
      const showNav = matched.length > perPage;
      nav.hidden = !showNav;
      const status = nav.querySelector('[data-list-status]');
      if (status) status.textContent = `Page ${page} of ${totalPages}`;
      const prev = nav.querySelector('[data-list-prev]');
      const next = nav.querySelector('[data-list-next]');
      if (prev) prev.disabled = page <= 1;
      if (next) next.disabled = page >= totalPages;
    }
  }

  #layoutGrids() {
    return document.querySelectorAll('[data-tc-mp-layout-grid]');
  }

  #setColumns(cols) {
    const clamped = this.#clampColumnCount(cols);
    this.#layoutGrids().forEach((grid) => this.#applyColumnsToGrid(grid, clamped));
  }

  #applyColumnsToGrid(grid, cols) {
    if (!grid) return;
    grid.classList.remove(
      'tc-mp-shop-all__grid--list',
      'tc-mp-shop-all__grid--cols-2',
      'tc-mp-shop-all__grid--cols-3',
      'tc-mp-shop-all__grid--cols-4',
      'tc-mp-shop-all__grid--cols-5',
      'tc-mp-shop-all__grid--cols-6'
    );
    if (cols === 'list') {
      grid.classList.add('tc-mp-shop-all__grid--list');
    } else {
      grid.classList.add(`tc-mp-shop-all__grid--cols-${cols}`);
    }
  }

  #maxColumns() {
    const raw = this.dataset.maxColumns;
    const max = parseInt(raw || '6', 10);
    if (!Number.isFinite(max) || max < 2) return 6;
    return max;
  }

  #clampColumnCount(cols) {
    if (cols === 'list') return 'list';
    const n = parseInt(cols, 10);
    if (!Number.isFinite(n)) return '4';
    return String(Math.min(this.#maxColumns(), Math.max(2, n)));
  }

  #columnsForViewport() {
    const max = this.#maxColumns();
    const w = window.innerWidth;
    if (w < 768) return 'list';
    if (w < 900) return String(Math.min(2, max));
    if (w <= 1050) return String(Math.min(2, max));
    if (w <= 1500) return String(Math.min(3, max));
    return String(Math.min(4, max));
  }

  #clearLayoutGridCardVisibility() {
    this.#layoutGrids().forEach((grid) => {
      grid.querySelectorAll('.tc-mp-shop-all__card, .tc-mp-bs__card').forEach((card) => {
        if (card.hidden) return;
        card.style.display = '';
      });
    });
    this.#resetSyncedSections();
  }

  #applyResponsiveColumns() {
    const userChoice = this.dataset.userColumns;
    if (userChoice === 'list') {
      this.#setColumns('list');
      this.querySelectorAll('[data-columns]').forEach((b) => {
        const match = b.getAttribute('data-columns') === 'list';
        b.classList.toggle('is-active', match);
        b.setAttribute('aria-pressed', match ? 'true' : 'false');
      });
      this.#listPage = 1;
      this.#clearLayoutGridCardVisibility();
      const dialog = this.querySelector('[data-filter-dialog]');
      if (dialog) this.#applyFilters(dialog);
      else this.#applyListPagination();
      return;
    }
    const cols = this.#columnsForViewport();
    this.#setColumns(cols);
    this.querySelectorAll('[data-columns]').forEach((b) => {
      const match = b.getAttribute('data-columns') === cols;
      b.classList.toggle('is-active', match);
      b.setAttribute('aria-pressed', match ? 'true' : 'false');
    });
    this.#listPage = 1;
    this.#clearLayoutGridCardVisibility();
    const dialog = this.querySelector('[data-filter-dialog]');
    if (dialog) this.#applyFilters(dialog);
    else this.#applyListPagination();
  }

  #bindResponsiveColumns(signal) {
    const schedule = () => this.#applyResponsiveColumns();

    schedule();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', schedule, { once: true, signal });
    }

    let resizeTimer;
    const onViewportChange = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(schedule, 100);
    };
    window.addEventListener('resize', onViewportChange, { signal });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange, { signal });
    }
  }

  #bindSort(signal) {
    const root = this.querySelector('[data-sort-root]');
    if (!root) return;
    const toggle = root.querySelector('[data-sort-toggle]');
    const menu = root.querySelector('[data-sort-menu]');

    const close = () => {
      root.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    };

    toggle?.addEventListener(
      'click',
      (e) => {
        e.stopPropagation();
        const open = !root.classList.contains('is-open');
        root.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      },
      { signal }
    );

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) close();
    }, { signal });

    root.querySelectorAll('[data-sort-value]').forEach((opt) => {
      opt.addEventListener(
        'click',
        () => {
          const value = opt.getAttribute('data-sort-value');
          const label = opt.textContent?.trim() || '';
          root.querySelectorAll('[data-sort-value]').forEach((o) => {
            o.classList.toggle('is-selected', o === opt);
          });
          const status = root.querySelector('[data-sort-label]');
          if (status) status.textContent = label;
          close();
          if (this.storeSort && value && this.collectionUrl) {
            const url = new URL(this.collectionUrl, window.location.origin);
            if (window.location.search.includes('view=')) {
              const view = new URLSearchParams(window.location.search).get('view');
              if (view) url.searchParams.set('view', view);
            }
            const shopifySort = value === 'relevance' ? 'best-selling' : value;
            url.searchParams.set('sort_by', shopifySort);
            window.location.assign(url.toString());
            return;
          }
          this.#applySort(value);
        },
        { signal }
      );
    });
  }

  #sortOptionLabel(sortBy) {
    const root = this.querySelector('[data-sort-root]');
    if (!root) return '';
    const opt = root.querySelector(`[data-sort-value="${sortBy}"]`);
    return opt?.textContent?.trim() || '';
  }

  #updateSortUi(sortBy) {
    const root = this.querySelector('[data-sort-root]');
    if (!root || !sortBy) return;
    root.querySelectorAll('[data-sort-value]').forEach((o) => {
      o.classList.toggle('is-selected', o.getAttribute('data-sort-value') === sortBy);
    });
    const status = root.querySelector('[data-sort-label]');
    const label = this.#sortOptionLabel(sortBy);
    if (status && label) status.textContent = label;
  }

  #persistSortInUrl(sortBy) {
    if (!sortBy || this.storeSort) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortBy);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      /* ignore */
    }
  }

  #applySortFromUrl() {
    if (this.storeSort) return;
    const sortBy = new URLSearchParams(window.location.search).get('sort_by');
    if (!sortBy) return;
    this.#applySort(sortBy, { skipUrl: true });
    this.#updateSortUi(sortBy);
  }

  #cardSortKey(card) {
    const raw = card.dataset.cardOrder || '';
    const asNum = Number(raw);
    if (raw !== '' && !Number.isNaN(asNum)) return asNum;
    return String(raw).toLowerCase();
  }

  #compareSortKeys(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  }

  #applySort(sortBy, { skipUrl = false } = {}) {
    const normalized = sortBy === 'relevance' ? 'best-selling' : sortBy;
    this.#sortCards(normalized);
    this.#listPage = 1;
    const dialog = this.querySelector('[data-filter-dialog]');
    if (dialog) this.#applyFilters(dialog);
    else this.#applyListPagination();
    if (!skipUrl) this.#persistSortInUrl(normalized);
    this.#updateSortUi(normalized);
  }

  #sortCards(sortBy) {
    const cards = this.cards();
    if (!this.grid || cards.length === 0) return;

    const sorted = [...cards].sort((a, b) => {
      const titleA = (a.dataset.cardTitle || '').toLowerCase();
      const titleB = (b.dataset.cardTitle || '').toLowerCase();
      const priceA = Number(a.dataset.cardPrice || 0);
      const priceB = Number(b.dataset.cardPrice || 0);
      const orderA = this.#cardSortKey(a);
      const orderB = this.#cardSortKey(b);

      switch (sortBy) {
        case 'title-ascending':
          return titleA.localeCompare(titleB);
        case 'title-descending':
          return titleB.localeCompare(titleA);
        case 'price-ascending':
          return priceA - priceB;
        case 'price-descending':
          return priceB - priceA;
        case 'created-ascending':
          return this.#compareSortKeys(orderA, orderB);
        case 'created-descending':
          return this.#compareSortKeys(orderB, orderA);
        case 'best-selling':
        case 'manual':
        case 'relevance':
        default:
          return this.#compareSortKeys(orderA, orderB);
      }
    });

    sorted.forEach((card) => this.grid.appendChild(card));
  }

  #bindFilterDrawer(signal) {
    const dialog = this.querySelector('[data-filter-dialog]');
    const openBtn = this.querySelector('[data-filter-open]');
    const closeBtn = this.querySelector('[data-filter-close]');

    openBtn?.addEventListener('click', () => {
      if (!dialog) return;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }, { signal });
    closeBtn?.addEventListener('click', () => dialog?.close(), { signal });
    dialog?.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    }, { signal });

    dialog?.querySelector('[data-filter-apply]')?.addEventListener(
      'click',
      () => {
        this.#applyFilters(dialog);
        dialog.close();
      },
      { signal }
    );

    dialog?.querySelector('[data-filter-clear]')?.addEventListener(
      'click',
      () => {
        dialog.querySelectorAll('[data-filter-category]').forEach((el) => {
          el.checked = false;
        });
        const inStock = dialog.querySelector('[data-filter-in-stock]');
        const outStock = dialog.querySelector('[data-filter-out-stock]');
        if (inStock) inStock.checked = true;
        if (outStock) outStock.checked = true;
        const priceMax = dialog.querySelector('[data-price-max]');
        const priceMin = dialog.querySelector('[data-price-min]');
        const rangeMax = dialog.querySelector('[data-range-max]');
        const rangeMin = dialog.querySelector('[data-range-min]');
        if (rangeMin) rangeMin.value = rangeMin.min || '0';
        if (priceMin) priceMin.value = rangeMin?.min || '0';
        if (rangeMax && priceMax) {
          rangeMax.value = priceMax.max || priceMax.value;
          priceMax.value = rangeMax.max || priceMax.value;
        }
        this.#applyFilters(dialog);
      },
      { signal }
    );
  }

  #bindFilters(signal) {
    const dialog = this.querySelector('[data-filter-dialog]');
    if (!dialog) return;

    const apply = () => this.#applyFilters(dialog);
    dialog.querySelectorAll('[data-filter-category], [data-filter-in-stock], [data-filter-out-stock]').forEach((el) => {
      el.addEventListener('change', apply, { signal });
    });
    dialog.querySelectorAll('input[data-price-min], input[data-price-max]').forEach((el) => {
      el.addEventListener('input', apply, { signal });
    });

    const rangeMin = dialog.querySelector('[data-range-min]');
    const rangeMax = dialog.querySelector('[data-range-max]');
    const priceMinInput = dialog.querySelector('[data-price-min]');
    const priceMaxInput = dialog.querySelector('[data-price-max]');

    const syncRange = () => {
      if (!rangeMin || !rangeMax || !priceMinInput || !priceMaxInput) return;
      priceMinInput.value = rangeMin.value;
      priceMaxInput.value = rangeMax.value;
      apply();
    };

    rangeMin?.addEventListener('input', () => {
      if (Number(rangeMin.value) > Number(rangeMax?.value || 0)) rangeMin.value = rangeMax.value;
      syncRange();
    }, { signal });
    rangeMax?.addEventListener('input', () => {
      if (Number(rangeMax.value) < Number(rangeMin?.value || 0)) rangeMax.value = rangeMin.value;
      syncRange();
    }, { signal });

    priceMinInput?.addEventListener('change', () => {
      if (rangeMin) rangeMin.value = priceMinInput.value;
      apply();
    }, { signal });
    priceMaxInput?.addEventListener('change', () => {
      if (rangeMax) rangeMax.value = priceMaxInput.value;
      apply();
    }, { signal });
  }

  #applyFilters(dialog) {
    const inStock = dialog.querySelector('[data-filter-in-stock]');
    const outStock = dialog.querySelector('[data-filter-out-stock]');
    const min = Number(dialog.querySelector('[data-price-min]')?.value || 0);
    const maxRaw = dialog.querySelector('[data-price-max]')?.value;
    const max = maxRaw === '' || maxRaw == null ? Infinity : Number(maxRaw);

    const showIn = inStock?.checked === true;
    const showOut = outStock?.checked === true;
    const selectedCategories = [...dialog.querySelectorAll('[data-filter-category]:checked')].map(
      (input) => input.value
    );

    let visibleCount = 0;

    this.cards().forEach((card) => {
      let visible = true;
      const isPlaceholder = card.dataset.placeholderCard === 'true';
      const price = Number(card.dataset.cardPrice || 0);
      const available = card.dataset.inStock !== 'false';
      const cardCategories = this.#cardCategoryList(card);

      if (isPlaceholder) {
        if (selectedCategories.length === 0) {
          visible = false;
        } else if (!selectedCategories.some((key) => this.#categoryMatches(cardCategories, key))) {
          visible = false;
        }
      }

      if (price < min || price > max) visible = false;

      if (!showIn && !showOut) {
        visible = false;
      } else if (available && !showIn) {
        visible = false;
      } else if (!available && !showOut) {
        visible = false;
      }

      if (selectedCategories.length > 0) {
        const categoryMatch = selectedCategories.some((key) => this.#categoryMatches(cardCategories, key));
        if (!categoryMatch) visible = false;
      }

      card.hidden = !visible;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    const priceMaxDefault = Number(
      dialog.dataset.priceMax ||
        dialog.querySelector('[data-price-max]')?.getAttribute('max') ||
        dialog.querySelector('[data-range-max]')?.max ||
        0
    );
    const priceFiltered = min > 0 || (Number.isFinite(max) && priceMaxDefault > 0 && max < priceMaxDefault);

    const openBtn = this.querySelector('[data-filter-open]');
    if (openBtn) {
      const active =
        selectedCategories.length +
        (showIn && showOut ? 0 : 1) +
        (priceFiltered ? 1 : 0);
      openBtn.dataset.activeFilters = String(active);
      openBtn.classList.toggle('has-active-filters', active > 0);
    }

    const section = this.closest('.tc-mp-shop-all');
    let empty = section?.querySelector('[data-filter-empty]');
    if (visibleCount === 0 && this.grid) {
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'tc-mp-shop-all__filter-empty';
        empty.dataset.filterEmpty = '';
        empty.textContent = 'No products match your filters.';
        this.grid.after(empty);
      }
    } else if (empty) {
      empty.remove();
    }

    this.#listPage = 1;
    this.#applyListPagination();
  }
}

if (!customElements.get('tc-mp-shop-all-toolbar')) {
  customElements.define('tc-mp-shop-all-toolbar', TcMpShopAllToolbar);
}
