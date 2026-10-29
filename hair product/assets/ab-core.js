(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function initGallery(root) {
    if (!root || root.dataset.abGalBound) return;
    root.dataset.abGalBound = "1";
    var main = qs("[data-ab-main]", root);
    var thumbs = qsa("[data-ab-thumb]", root);
    if (!main || !thumbs.length) return;
    var i = 0;
    function show(idx) {
      i = (idx + thumbs.length) % thumbs.length;
      var btn = thumbs[i];
      var src = btn.getAttribute("data-src");
      var alt = btn.getAttribute("data-alt") || "";
      if (src) main.src = src;
      if (alt) main.alt = alt;
      thumbs.forEach(function (t, j) {
        t.classList.toggle("is-on", j === i);
        t.setAttribute("aria-selected", j === i ? "true" : "false");
      });
    }
    thumbs.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        show(idx);
      });
    });
    var prev = qs("[data-ab-prev]", root);
    var next = qs("[data-ab-next]", root);
    if (prev) prev.addEventListener("click", function () {
      show(i - 1);
    });
    if (next) next.addEventListener("click", function () {
      show(i + 1);
    });
    if (main) {
      main.addEventListener("click", function () {
        if (!main.src) return;
        var w = window.open("", "_blank");
        if (w) {
          w.document.write('<img src="' + main.src + '" alt="" style="max-width:100%">');
        }
      });
    }
  }

  function initAttachModal() {
    var modal = qs("[data-ab-attach-modal]");
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = "1";
    var panel = qs(".ab-modal__panel", modal);
    var title = qs("[data-ab-modal-title]", modal);
    var body = qs("[data-ab-modal-body]", modal);
    var img = qs("[data-ab-modal-img]", modal);
    var lastFocus = null;

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    function open(card) {
      lastFocus = card;
      if (title) title.textContent = card.getAttribute("data-title") || "";
      if (body) body.textContent = card.getAttribute("data-desc") || "";
      if (img) {
        var src = card.getAttribute("data-img");
        if (src) img.src = src;
        img.alt = card.getAttribute("data-title") || "";
      }
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = qs(".ab-modal__close", modal);
      if (closeBtn) closeBtn.focus();
    }

    qsa("[data-ab-attach-card]").forEach(function (card) {
      card.addEventListener("click", function () {
        open(card);
      });
    });
    qs(".ab-modal__backdrop", modal)?.addEventListener("click", close);
    qs(".ab-modal__close", modal)?.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      qsa(".ab-reveal").forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    qsa(".ab-reveal").forEach(function (el) {
      io.observe(el);
    });
  }

  function initQty(root) {
    if (!root) return;
    var input = qs("[data-ab-qty]", root);
    if (!input) return;
    qs("[data-ab-minus]", root)?.addEventListener("click", function () {
      var v = Math.max(1, parseInt(input.value, 10) - 1);
      input.value = String(v);
    });
    qs("[data-ab-plus]", root)?.addEventListener("click", function () {
      var v = Math.min(10, parseInt(input.value, 10) + 1);
      input.value = String(v);
    });
  }

  function initPdpSticky() {
    var bar = qs("[data-ab-pdp-sticky]");
    if (!bar) return;
    var show = function () {
      bar.classList.toggle("is-show", window.scrollY > 420);
    };
    window.addEventListener("scroll", show, { passive: true });
    show();
    qs("[data-ab-sticky-cta]", bar)?.addEventListener("click", function () {
      var t = qs("#ab-buy") || qs(".ab-buy");
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function boot() {
    qsa("[data-ab-gallery]").forEach(initGallery);
    initAttachModal();
    initReveal();
    qsa("[data-ab-buy]").forEach(initQty);
    initPdpSticky();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
