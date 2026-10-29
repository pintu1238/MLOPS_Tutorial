(function () {
  const money = (cents) => {
    const format = window.CURVD.moneyFormat || "₹{{amount}}";
    const amount = (cents / 100).toFixed(2);
    const withComma = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const noDec = (cents / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return format
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, withComma)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, noDec)
      .replace(/\{\{\s*amount\s*\}\}/g, amount);
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function closeCustomSelects(except) {
    $$(".custom-select.is-open").forEach((wrap) => {
      if (except && (wrap === except || wrap.contains(except))) return;
      const menu = $(".custom-select__menu", wrap);
      const trigger = $(".custom-select__trigger", wrap);
      if (menu) menu.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
    });
  }

  function initCustomSelects(root = document) {
    $$("select:not([data-custom-native])", root).forEach((select) => {
      if (select.closest(".custom-select")) return;
      if (select.multiple || select.size > 1) return;

      const wrap = document.createElement("div");
      wrap.className = "custom-select";
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      select.classList.add("custom-select__native");
      select.setAttribute("data-custom-native", "");

      const label = select.getAttribute("aria-label") || select.name || "Choose an option";
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "custom-select__trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-label", label);

      const valueEl = document.createElement("span");
      valueEl.className = "custom-select__value";

      const chevron = document.createElement("span");
      chevron.className = "custom-select__chevron";
      chevron.setAttribute("aria-hidden", "true");

      trigger.append(valueEl, chevron);

      const menu = document.createElement("ul");
      menu.className = "custom-select__menu";
      menu.setAttribute("role", "listbox");
      menu.hidden = true;

      const sync = () => {
        const current = select.options[select.selectedIndex];
        valueEl.textContent = current ? current.text : "";
        $$(".custom-select__option", menu).forEach((item) => {
          item.classList.toggle("is-selected", item.dataset.value === select.value);
        });
      };

      const buildOptions = () => {
        menu.replaceChildren();
        [...select.options].forEach((opt) => {
          const item = document.createElement("li");
          item.className = "custom-select__option";
          item.setAttribute("role", "option");
          item.dataset.value = opt.value;
          item.textContent = opt.text;
          if (opt.selected) item.classList.add("is-selected");
          if (opt.disabled) {
            item.classList.add("is-disabled");
            item.setAttribute("aria-disabled", "true");
          }
          item.addEventListener("click", (event) => {
            event.stopPropagation();
            if (opt.disabled) return;
            select.value = opt.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            sync();
            closeCustomSelects();
          });
          menu.appendChild(item);
        });
      };

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (wrap.classList.contains("is-open")) {
          closeCustomSelects();
          return;
        }
        closeCustomSelects(wrap);
        buildOptions();
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        wrap.classList.add("is-open");
      });

      select.addEventListener("change", sync);
      wrap.append(trigger, menu);
      sync();
    });
  }

  document.addEventListener("click", () => closeCustomSelects());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCustomSelects();
  });

  function openOverlay(on) {
    const overlay = $(".overlay");
    if (!overlay) return;
    overlay.classList.toggle("is-open", on);
  }

  function closeAll() {
    $$(".drawer, .search-modal, .account-modal, .modal").forEach((el) => el.classList.remove("is-open"));
    openOverlay(false);
    document.body.style.overflow = "";
  }

  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const announce = $("[data-announce]");
  if (announce) {
    const track = $(".announce__track", announce);
    const groups = $$(".announce__group", announce);
    const seed = groups[0];
    if (track && seed) {
      const marked = seed.querySelectorAll("[data-shopify-editor-block]");
      const unitCount = marked.length || 4;
      const unit = [...seed.children].slice(0, unitCount).map((node) => node.cloneNode(true));
      const fillAnnounce = () => {
        seed.replaceChildren(...unit.map((node) => node.cloneNode(true)));
        const needed = announce.offsetWidth || window.innerWidth;
        while (seed.scrollWidth < needed && seed.children.length < 120) {
          unit.forEach((node) => seed.append(node.cloneNode(true)));
        }
        groups.slice(1).forEach((group) => {
          group.replaceChildren(...[...seed.children].map((node) => node.cloneNode(true)));
        });
        track.style.animationDuration = Math.max(20, seed.scrollWidth / 80) + "s";
      };
      fillAnnounce();
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fillAnnounce, 150);
      });
    }
  }

  document.addEventListener("click", (event) => {
    const openSearch = event.target.closest("[data-open-search]");
    const openAccount = event.target.closest("[data-open-account]");
    const openCart = event.target.closest("[data-open-cart]");
    const openNav = event.target.closest("[data-open-nav]");
    const openFilter = event.target.closest("[data-open-filter]");
    const closer = event.target.closest("[data-close]");
    if (openSearch) {
      event.preventDefault();
      closeAll();
      $(".search-modal").classList.add("is-open");
      document.body.style.overflow = "hidden";
      const input = $(".search-modal input[type='search']");
      if (input) input.focus();
    } else if (openAccount) {
      event.preventDefault();
      const pop = $(".account-modal");
      const willOpen = !pop.classList.contains("is-open");
      closeAll();
      if (willOpen) {
        pop.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
    } else if (openCart) {
      event.preventDefault();
      closeAll();
      $(".drawer--cart").classList.add("is-open");
      openOverlay(true);
      document.body.style.overflow = "hidden";
      loadCart();
    } else if (openNav) {
      event.preventDefault();
      closeAll();
      $(".drawer--nav").classList.add("is-open");
      openOverlay(true);
      document.body.style.overflow = "hidden";
    } else if (openFilter) {
      event.preventDefault();
      closeAll();
      const filter = $(".drawer--filter");
      if (filter) {
        filter.classList.add("is-open");
        openOverlay(true);
        document.body.style.overflow = "hidden";
      }
    } else if (
      closer ||
      event.target.classList.contains("overlay") ||
      event.target.classList.contains("account-modal") ||
      event.target.classList.contains("search-modal")
    ) {
      closeAll();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  async function loadCart() {
    const res = await fetch("/cart.js", { headers: { Accept: "application/json" } });
    const cart = await res.json();
    renderCart(cart);
  }

  function renderCart(cart) {
    const body = $("[data-cart-body]");
    const count = $("[data-cart-count]");
    const sub = $("[data-cart-subtotal]");
    if (count) {
      count.textContent = cart.item_count;
      count.hidden = cart.item_count === 0;
    }
    const title = $("[data-cart-title]");
    if (title) title.textContent = `Cart • ${cart.item_count}`;
    const foot = $("[data-cart-foot]");
    if (foot) foot.hidden = cart.item_count === 0;
    if (sub) sub.textContent = money(cart.total_price);
    if (!body) return;
    if (!cart.items.length) {
      body.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
      return;
    }
    body.innerHTML = cart.items.map((item) => `
      <article class="cart-line">
        <a href="${item.url}"><img src="${item.image || ""}" alt=""></a>
        <div>
          <a href="${item.url}"><strong>${item.product_title}</strong></a>
          <div class="muted">${item.variant_title || ""}</div>
          <div>${money(item.final_line_price)}</div>
          <div class="qty">
            <button type="button" data-qty="${item.key}" data-delta="-1" aria-label="Decrease">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty="${item.key}" data-delta="1" aria-label="Increase">+</button>
          </div>
          <button class="line-remove" type="button" data-remove="${item.key}">Remove</button>
        </div>
      </article>
    `).join("");
  }

  document.addEventListener("click", async (event) => {
    const qty = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (!qty && !remove) return;
    const key = (qty || remove).dataset.qty || remove.dataset.remove;
    const current = Number(event.target.closest(".cart-line")?.querySelector(".qty span")?.textContent || 1);
    const next = remove ? 0 : Math.max(0, current + Number(qty.dataset.delta));
    const res = await fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity: next })
    });
    renderCart(await res.json());
  });

  async function addItems(items) {
    const res = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || "Could not add to cart");
    }
    await loadCart();
    closeAll();
    $(".drawer--cart").classList.add("is-open");
    openOverlay(true);
    document.body.style.overflow = "hidden";
  }

  const searchInput = $(".search-modal input[type='search']");
  let searchTimer;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(async () => {
        const q = searchInput.value.trim();
        const box = $(".search-results");
        if (q.length < 2) { box.innerHTML = ""; return; }
        const url = `/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await res.json();
        const products = data.resources?.results?.products || [];
        box.innerHTML = products.map((p) => `
          <a class="search-hit" href="${p.url}">
            <img src="${p.image || ""}" alt="">
            <span>${p.title}</span>
            <span>${p.price}</span>
          </a>
        `).join("") || '<p>No products found.</p>';
      }, 200);
    });
  }

  $$("[data-popular]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (!searchInput) return;
      searchInput.value = link.dataset.popular;
      searchInput.dispatchEvent(new Event("input"));
      searchInput.focus();
    });
  });

  $$("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  const slides = $$("[data-slide]");
  if (slides.length) {
    let index = 0;
    const dots = $$("[data-dot]");
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => { slide.hidden = n !== index; });
      dots.forEach((dot, n) => dot.classList.toggle("is-active", n === index));
    };
    show(0);
    if (slides.length > 1) setInterval(() => show(index + 1), 5000);
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.dot))));
  }

  $$("[data-hotspot]").forEach((wrap) => {
    const btn = wrap.querySelector("[data-hotspot-btn]") || wrap;
    const card = wrap.querySelector(".hotspot__card");
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = wrap.classList.contains("is-open");
      $$("[data-hotspot]").forEach((el) => el.classList.remove("is-open"));
      wrap.classList.toggle("is-open", !open);
    });
    if (card) card.addEventListener("click", (event) => event.stopPropagation());
  });
  document.addEventListener("click", () => {
    $$("[data-hotspot]").forEach((el) => el.classList.remove("is-open"));
  });

  function variantFromOptions(product, selected) {
    return product.variants.find((variant) =>
      variant.options.every((value, i) => value === selected[i])
    );
  }

  function initProduct(root) {
    const dataEl = $("[data-product-json]", root);
    if (!dataEl) return;
    const product = JSON.parse(dataEl.textContent);
    const selected = product.variants.find((v) => v.available)?.options.slice() || product.variants[0].options.slice();
    const idInput = $("[data-variant-id]", root);
    const priceEl = $("[data-price]", root);
    const compareEl = $("[data-compare]", root);
    const atc = $("[data-add]", root);

    const paint = () => {
      $$("[data-option]", root).forEach((wrap) => {
        const index = Number(wrap.dataset.option);
        $$("[data-value]", wrap).forEach((btn) => {
          btn.classList.toggle("is-active", btn.dataset.value === selected[index]);
        });
      });
      const variant = variantFromOptions(product, selected);
      if (!variant) return;
      idInput.value = variant.id;
      if (priceEl) priceEl.textContent = money(variant.price);
      if (compareEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          compareEl.hidden = false;
          compareEl.textContent = money(variant.compare_at_price);
        } else compareEl.hidden = true;
      }
      if (atc) {
        atc.disabled = !variant.available;
        atc.textContent = variant.available ? "Add to cart" : "Sold out";
      }
      const main = $("[data-gallery-main]", root);
      if (main && variant.featured_image && root.dataset.bundleKind !== "leggings") main.src = variant.featured_image.src;
      updateBundlePrices(root, variant.price);
      syncBundleSelects(root);
    };

    root.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-value]");
      if (!choice || !root.contains(choice)) return;
      const index = Number(choice.closest("[data-option]").dataset.option);
      selected[index] = choice.dataset.value;
      paint();
    });

    const thumbsBtns = $$("[data-thumb]", root);
    const thumbs = $("[data-thumbs]", root);
    const viewport = $("[data-gallery-viewport]", root);
    const galleryStage = $(".gallery__stage", root);
    const slides = $$(".gallery__slide", root);
    const isMobileGallery = () => window.matchMedia("(max-width: 991px)").matches;
    const scroller = () => (isMobileGallery() && galleryStage ? galleryStage : viewport);
    const currentThumb = () => {
      const i = thumbsBtns.findIndex((el) => el.classList.contains("is-active"));
      return i < 0 ? 0 : i;
    };
    const slideStep = () => {
      const slide = slides[0];
      if (!slide) return 0;
      const gap = parseFloat(getComputedStyle(slide.parentElement).gap) || 8;
      return slide.getBoundingClientRect().width + gap;
    };
    const scrollToSlide = (index, behavior) => {
      const el = scroller();
      if (!el || !slides[index]) return;
      const slide = slides[index];
      const left = slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2;
      el.scrollTo({ left: Math.max(0, left), behavior: behavior === "smooth" ? "smooth" : "auto" });
    };
    const nearestSlide = () => {
      const el = scroller();
      if (!el || !slides.length) return 0;
      const viewCenter = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((el, idx) => {
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - viewCenter);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      return best;
    };
    const setThumb = (index, scroll) => {
      const n = thumbsBtns.length || slides.length;
      if (!n) return;
      const next = ((index % n) + n) % n;
      const btn = thumbsBtns[next];
      const main = $("[data-gallery-main]", root);
      if (main && btn) main.src = btn.dataset.thumb;
      thumbsBtns.forEach((el) => el.classList.remove("is-active"));
      if (btn) btn.classList.add("is-active");
      const badges = $("[data-gallery-badges]", root);
      if (badges) badges.hidden = next !== 0;
      if (scroll !== false && scroller() && isMobileGallery() && slides.length) {
        scrollToSlide(next, scroll === "smooth" ? "smooth" : "auto");
      }
    };
    thumbsBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => setThumb(index, "smooth"));
    });
    const stepGallery = (dir) => {
      if (isMobileGallery() && scroller() && slides.length) {
        const max = Math.max(0, slides.length - 1);
        let i = nearestSlide() + dir;
        i = Math.max(0, Math.min(max, i));
        setThumb(i, "smooth");
        return;
      }
      setThumb(currentThumb() + dir, "smooth");
    };
    $("[data-gallery-prev]", root)?.addEventListener("click", () => stepGallery(-1));
    $("[data-gallery-next]", root)?.addEventListener("click", () => stepGallery(1));
    $("[data-thumbs-up]", root)?.addEventListener("click", () => {
      if (isMobileGallery()) stepGallery(-1);
      else thumbs?.scrollBy({ top: -110, left: -110, behavior: "smooth" });
    });
    $("[data-thumbs-down]", root)?.addEventListener("click", () => {
      if (isMobileGallery()) stepGallery(1);
      else thumbs?.scrollBy({ top: 110, left: 110, behavior: "smooth" });
    });
    if (slides.length && (viewport || galleryStage)) {
      let ticking = false;
      let galleryDrag = null;
      const galleryCanScroll = () => {
        const el = scroller();
        return el && isMobileGallery() && el.scrollWidth > el.clientWidth + 1;
      };

      const onGalleryScroll = () => {
        if (ticking || galleryDrag) return;
        ticking = true;
        requestAnimationFrame(() => {
          const i = nearestSlide();
          setThumb(i, false);
          ticking = false;
        });
      };
      viewport?.addEventListener("scroll", onGalleryScroll, { passive: true });
      galleryStage?.addEventListener("scroll", onGalleryScroll, { passive: true });

      const endGalleryDrag = () => {
        if (!galleryDrag) return;
        galleryDrag = null;
        galleryStage?.classList.remove("is-dragging");
        viewport?.classList.remove("is-dragging");
      };

      const onGalleryMouseDown = (event) => {
        const el = scroller();
        if (!el || !galleryCanScroll()) return;
        if (event.target.closest(".gallery__arrow")) return;
        if (event.button !== 0) return;
        event.preventDefault();
        galleryDrag = { x: event.clientX, scroll: el.scrollLeft };
        el.classList.add("is-dragging");
        const onMove = (moveEvent) => {
          moveEvent.preventDefault();
          el.scrollLeft = galleryDrag.scroll - (moveEvent.clientX - galleryDrag.x);
        };
        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          endGalleryDrag();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      };
      galleryStage?.addEventListener("mousedown", onGalleryMouseDown);
      viewport?.addEventListener("mousedown", onGalleryMouseDown);
    }
    if (thumbsBtns.length || slides.length) setThumb(0, false);

    const form = $("[data-product-form], .product-form", root);
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bundle = $("input[name='bundle']:checked", root);
        const qty = bundle ? Number(bundle.value) : 1;
        const rows = $$("[data-bundle-row]", root).slice(0, qty);
        const itemsMap = new Map();
        if (!rows.length) {
          itemsMap.set(idInput.value, 1);
        } else {
          rows.forEach((row) => {
            const opts = product.options.map((_, i) => $(`[data-bundle-opt="${i}"]`, row).value);
            const variant = variantFromOptions(product, opts) || product.variants.find((v) => String(v.id) === idInput.value);
            const id = String(variant.id);
            itemsMap.set(id, (itemsMap.get(id) || 0) + 1);
          });
        }
        const items = Array.from(itemsMap, ([id, quantity]) => ({ id: Number(id), quantity }));
        const stickyAdd = document.querySelector("[data-sticky-add]");
        atc.disabled = true;
        if (stickyAdd) stickyAdd.disabled = true;
        try { await addItems(items); }
        catch (error) { window.alert(error.message); }
        atc.disabled = false;
        if (stickyAdd && !atc.hasAttribute("data-sold-out")) stickyAdd.disabled = false;
      });
    }

    $$("input[name='bundle']", root).forEach((radio) => {
      radio.addEventListener("change", () => placeBundleRows(root));
    });
    $$(".offer-wrap", root).forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("select, a, button, .bundle-rows")) return;
        const radio = $("input[name='bundle']", card);
        if (!radio || radio.checked) return;
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
    placeBundleRows(root);
    paint();
  }

  function placeBundleRows(root) {
    const radio = $("input[name='bundle']:checked", root);
    if (!radio) return;
    const wrap = radio.closest(".offer-wrap");
    const rows = $("[data-bundle-rows]", root);
    const count = Number(radio.value);
    if (wrap && rows) wrap.appendChild(rows);
    $$("[data-bundle-row]", root).forEach((row, index) => {
      row.hidden = index >= count;
    });
    $$(".offer-wrap", root).forEach((card) => card.classList.toggle("is-on", card.contains(radio)));
    $$(".offer", root).forEach((card) => card.classList.toggle("is-on", card.contains(radio)));
  }

  function updateBundlePrices(root, unit) {
    const kind = root.dataset.bundleKind;
    const deals = kind === "leggings"
      ? { 2: [unit, unit * 2], 3: [Math.round(unit * 1.5), unit * 3], 4: [Math.round(unit * 1.6), unit * 4] }
      : { 2: [unit, unit * 2], 3: [Math.round(unit * 3 * 0.47), unit * 3], 4: [unit * 2, unit * 4] };
    const prefix = kind === "leggings" ? "YOU SAVE" : "SAVE";
    Object.entries(deals).forEach(([qty, [pay, was]]) => {
      const el = $(`[data-deal="${qty}"]`, root);
      if (el) el.innerHTML = `<strong>${money(pay)}</strong> <s>${money(was)}</s>`;
      const save = $(`[data-save="${qty}"]`, root);
      if (save) save.textContent = `${prefix} ${money(was - pay)}`;
    });
    const per = $("[data-per-pair]", root);
    if (per) per.textContent = `(${money(Math.round(unit * 1.6 / 4))} per pair)`;
  }

  function syncBundleSelects(root) {
    const selected = $$("[data-option]", root).map((wrap) => $(".choice.is-active", wrap)?.dataset.value);
    $$("[data-bundle-row]", root).forEach((row) => {
      if (row.dataset.touched === "1") return;
      selected.forEach((value, i) => {
        const sel = $(`[data-bundle-opt="${i}"]`, row);
        if (sel && value) sel.value = value;
      });
    });
    $$("[data-bundle-row] select", root).forEach((sel) => {
      sel.addEventListener("change", () => { sel.closest("[data-bundle-row]").dataset.touched = "1"; });
    });
  }

  $$("[data-product]").forEach(initProduct);

  document.querySelector("[data-sticky-add]")?.addEventListener("click", () => {
    document.querySelector("[data-product] [data-product-form] [data-add], [data-product] form [data-add]")?.click();
  });

  document.addEventListener("click", async (event) => {
    const qv = event.target.closest("[data-quick]");
    if (!qv) return;
    event.preventDefault();
    const handle = qv.dataset.quick;
    const res = await fetch(`/products/${handle}.js`);
    const product = await res.json();
    const modal = $(".quick-modal");
    const card = $(".quick-modal .modal__card");
    const image = product.images[0] || "";
    const options = product.options.map((name, index) => `
      <div class="option-row" data-option="${index}">
        <span>${name}</span>
        <div class="choices">
          ${[...new Set(product.variants.map((v) => v.options[index]))].map((value) =>
            `<button type="button" class="choice" data-value="${value}">${value}</button>`
          ).join("")}
        </div>
      </div>
    `).join("");
    card.innerHTML = `
      <button class="close-x" type="button" data-close aria-label="Close">×</button>
      <div><img src="${image}" alt="" style="width:100%;height:100%;object-fit:cover"></div>
      <div style="padding:22px" data-product>
        <script type="application/json" data-product-json>${JSON.stringify(product).replace(/</g, "\\u003c")}</script>
        <h2>${product.title}</h2>
        <div class="price price--lg"><span data-price></span> <s data-compare hidden></s></div>
        <form data-product-form>
          <input type="hidden" name="id" data-variant-id>
          ${options}
          <button class="btn" type="submit" data-add>Add to cart</button>
        </form>
        <p style="margin-top:12px"><a href="${product.url}">View full details</a></p>
      </div>
    `;
    modal.classList.add("is-open");
    initProduct(card);
    initCustomSelects(card);
  });

  document.addEventListener("click", (event) => {
    const root = $("[data-locale]");
    if (!root) return;
    const list = $(".locale__list", root);
    const toggle = $("[data-locale-toggle]", root);
    if (!list || !toggle) return;
    if (event.target.closest("[data-locale-toggle]")) {
      event.preventDefault();
      const willOpen = list.hasAttribute("hidden");
      list.toggleAttribute("hidden", !willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      return;
    }
    if (!root.contains(event.target)) {
      list.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const root = $("[data-locale]");
    if (!root) return;
    const list = $(".locale__list", root);
    const toggle = $("[data-locale-toggle]", root);
    if (!list || list.hasAttribute("hidden")) return;
    list.setAttribute("hidden", "");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });

  $$("[data-card]").forEach((card) => {
    const img = $("[data-card-img]", card);
    const showColor = (btn) => {
      if (!img || !btn.dataset.image) return;
      img.src = btn.dataset.image;
      $$("[data-card-color]", card).forEach((el) => el.classList.remove("is-active"));
      btn.classList.add("is-active");
    };
    $$("[data-card-color]", card).forEach((btn) => {
      btn.addEventListener("mouseenter", () => showColor(btn));
      btn.addEventListener("focus", () => showColor(btn));
      btn.addEventListener("click", () => showColor(btn));
    });
  });

  const trackTabs = $$("[data-track-tab]");
  if (trackTabs.length) {
    const showTrack = (name) => {
      trackTabs.forEach((tab) => {
        const on = tab.dataset.trackTab === name;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      $$("[data-track-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.trackPanel !== name;
      });
      const result = $("[data-track-result]");
      if (result) result.hidden = true;
    };
    trackTabs.forEach((tab) => tab.addEventListener("click", () => showTrack(tab.dataset.trackTab)));
    $$(".track-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const result = $("[data-track-result]");
        if (!result) return;
        const panel = form.dataset.trackPanel;
        if (panel === "number") {
          const num = ($("#TrackNumber")?.value || "").trim();
          if (!num) { result.hidden = false; result.innerHTML = "Enter a tracking number to continue."; return; }
          const url = "https://t.17track.net/en#nums=" + encodeURIComponent(num);
          result.hidden = false;
          result.innerHTML = `<p>Looking up <strong>${num}</strong>.</p><p><a href="${url}" target="_blank" rel="noopener">Open tracking details</a></p>`;
          window.open(url, "_blank", "noopener");
        } else {
          const order = ($("#TrackOrderNumber")?.value || "").trim();
          const contact = ($("#TrackOrderEmail")?.value || "").trim();
          if (!order || !contact) { result.hidden = false; result.innerHTML = "Enter your order number and email or phone number."; return; }
          result.hidden = false;
          result.innerHTML = `<p>If order <strong>${order}</strong> was placed with <strong>${contact}</strong>, tracking is sent to that email once the label is created. It can take up to 24 hours to appear.</p><p><a href="/account/login">Log in to view your orders</a></p>`;
        }
      });
    });
  }

  $$("[data-happy]").forEach((viewport) => {
    const track = $("[data-happy-track]", viewport);
    const section = viewport.closest(".happy");
    if (!track || !section) return;
    let index = 0;
    const cards = () => [...track.children];
    const step = () => {
      const card = cards()[0];
      if (!card) return 0;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const visibleCount = () => {
      const size = step();
      if (!size) return 5;
      return Math.max(1, Math.round(viewport.clientWidth / size));
    };
    const maxIndex = () => Math.max(0, cards().length - visibleCount());
    const apply = () => {
      track.style.transform = "translateX(" + (-index * step()) + "px)";
    };
    const go = (dir) => {
      const max = maxIndex();
      index += dir;
      if (index > max) index = 0;
      if (index < 0) index = max;
      apply();
    };
    $("[data-happy-prev]", section)?.addEventListener("click", () => go(-1));
    $("[data-happy-next]", section)?.addEventListener("click", () => go(1));
    window.addEventListener("resize", () => {
      index = Math.min(index, maxIndex());
      apply();
    });
  });

  const helpSearch = $("[data-help-search] input");
  if (helpSearch) {
    helpSearch.addEventListener("input", () => {
      const q = helpSearch.value.trim().toLowerCase();
      $$("[data-help-item]").forEach((item) => {
        const hay = item.textContent.toLowerCase();
        item.classList.toggle("help-item-hidden", q.length > 0 && !hay.includes(q));
      });
    });
  }

  const helpPage = $("[data-help-page]");
  if (helpPage) {
    const home = $("[data-help-home]", helpPage);
    const contact = $("[data-help-contact]", helpPage);
    const showHelpContact = (on) => {
      if (home) home.hidden = on;
      if (contact) contact.hidden = !on;
      if (on) {
        if (location.hash !== "#contact") history.replaceState(null, "", "#contact");
        window.scrollTo(0, 0);
      } else if (location.hash === "#contact") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    };
    $("[data-open-help-contact]", helpPage)?.addEventListener("click", (event) => {
      event.preventDefault();
      showHelpContact(true);
    });
    $("[data-help-home-link]", helpPage)?.addEventListener("click", (event) => {
      event.preventDefault();
      showHelpContact(false);
    });
    const posted = contact && (contact.querySelector(".notice") || contact.querySelector(".errors") || location.hash === "#contact" || /contact_posted=true/.test(location.search));
    if (posted) showHelpContact(true);
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    $$(".footer-acc").forEach((el) => el.removeAttribute("open"));
  }

  $$("[data-review-ticker]").forEach((bar) => {
    const items = $$(".review-bar__item", bar);
    if (items.length < 2) return;
    let i = 0;
    const paint = () => {
      items.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
    };
    paint();
    setInterval(() => {
      i = (i + 1) % items.length;
      paint();
    }, 3500);
  });

  $$(".reels-carousel").forEach((wrap) => {
    const track = $(".reels", wrap);
    const cards = $$(".reel", wrap);
    if (!track || !cards.length) return;
    let i = 0;
    let drag = null;
    const mobile = () => window.matchMedia("(max-width: 991px)").matches;

    const cardScrollLeft = (index) => {
      const card = cards[index];
      if (!card) return 0;
      return Math.max(0, card.offsetLeft);
    };

    const syncIndex = () => {
      if (!mobile()) return;
      const x = wrap.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, idx) => {
        const dist = Math.abs(card.offsetLeft - x);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      i = best;
    };

    const scrollToIndex = (index, smooth) => {
      if (!mobile()) return;
      const next = Math.max(0, Math.min(index, cards.length - 1));
      i = next;
      wrap.scrollTo({ left: cardScrollLeft(next), behavior: smooth ? "smooth" : "auto" });
    };

    const resetDesktop = () => {
      track.style.transform = "";
      wrap.scrollLeft = 0;
      wrap.classList.remove("is-dragging");
      drag = null;
    };

    $("[data-reels-prev]", wrap)?.addEventListener("click", () => {
      if (!mobile()) return;
      syncIndex();
      scrollToIndex(i - 1, true);
    });
    $("[data-reels-next]", wrap)?.addEventListener("click", () => {
      if (!mobile()) return;
      syncIndex();
      scrollToIndex(i + 1, true);
    });

    const canScroll = () => wrap.scrollWidth > wrap.clientWidth + 1;

    wrap.addEventListener(
      "scroll",
      () => {
        if (!mobile() || drag) return;
        syncIndex();
      },
      { passive: true }
    );

    const endDrag = () => {
      if (!drag) return;
      drag = null;
      wrap.classList.remove("is-dragging");
      syncIndex();
    };

    const onDragMove = (clientX) => {
      if (!drag) return;
      wrap.scrollLeft = drag.scroll - (clientX - drag.x);
    };

    const startDrag = (clientX) => {
      drag = { x: clientX, scroll: wrap.scrollLeft };
      wrap.classList.add("is-dragging");
    };

    const onMouseDown = (event) => {
      if (!canScroll()) return;
      if (event.target.closest(".peek-nav")) return;
      if (event.button !== 0) return;
      event.preventDefault();
      startDrag(event.clientX);
      const onMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        onDragMove(moveEvent.clientX);
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        endDrag();
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
    wrap.addEventListener("mousedown", onMouseDown);
    track.addEventListener("mousedown", onMouseDown);

    window.addEventListener("resize", () => {
      if (!mobile()) resetDesktop();
      else syncIndex();
    });
    if (!mobile()) resetDesktop();
  });

  $$(".reel video").forEach((video) => {
    video.controls = false;
    video.removeAttribute("controls");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    if (!video.getAttribute("src") && video.dataset.src) video.src = video.dataset.src;
    const play = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    play();
    video.addEventListener("pause", () => {
      if (document.visibilityState === "visible") play();
    });
  });

  $$(".reason-carousel").forEach((wrap) => {
    const track = $(".reason-photos", wrap);
    const cards = $$("article", track);
    if (!track || !cards.length) return;
    let i = 0;
    const apply = () => {
      const mobile = window.matchMedia("(max-width: 991px)").matches;
      i = ((i % cards.length) + cards.length) % cards.length;
      if (!mobile) {
        track.style.transform = "";
        return;
      }
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 10;
      const cardW = cards[0].getBoundingClientRect().width + gap;
      const offset = (wrap.getBoundingClientRect().width - cards[0].getBoundingClientRect().width) / 2;
      track.style.transform = `translateX(${offset - i * cardW}px)`;
    };
    $("[data-reason-prev]", wrap)?.addEventListener("click", () => {
      i -= 1;
      apply();
    });
    $("[data-reason-next]", wrap)?.addEventListener("click", () => {
      i += 1;
      apply();
    });
    window.addEventListener("resize", apply);
    apply();
  });

  initCustomSelects(document);
})();
