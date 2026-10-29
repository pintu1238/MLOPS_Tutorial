(function () {
  var END_KEY = "lo-sale-end";
  var root = document.documentElement;

  function nextSundayNight(from) {
    var d = new Date(from.getTime());
    var day = d.getDay();
    var add = (7 - day) % 7;
    if (add === 0 && (d.getHours() > 21 || (d.getHours() === 21 && d.getMinutes() >= 59))) add = 7;
    if (add === 0 && day === 0) {
      d.setHours(23, 59, 59, 0);
      if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 7);
      else return d;
    }
    var end = new Date(from.getTime());
    end.setDate(end.getDate() + (add === 0 ? 7 : add));
    end.setHours(23, 59, 59, 0);
    return end;
  }

  function saleWindow() {
    var node = document.querySelector("[data-sale-end]");
    var stored = node ? node.getAttribute("data-sale-end") : "";
    var end = stored ? new Date(stored) : nextSundayNight(new Date());
    if (isNaN(end.getTime()) || end.getTime() <= Date.now()) end = nextSundayNight(new Date());
    var start = new Date(end.getTime() - 4 * 24 * 60 * 60 * 1000);
    return { start: start, end: end };
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function tick() {
    var win = saleWindow();
    var now = Date.now();
    var left = Math.max(0, win.end.getTime() - now);
    var total = Math.max(1, win.end.getTime() - win.start.getTime());
    var gone = Math.min(1, Math.max(0, (now - win.start.getTime()) / total));
    var days = Math.floor(left / 86400000);
    var hours = Math.floor((left % 86400000) / 3600000);
    var mins = Math.floor((left % 3600000) / 60000);
    var secs = Math.floor((left % 60000) / 1000);
    document.querySelectorAll("[data-lo-count]").forEach(function (el) {
      var key = el.getAttribute("data-lo-count");
      var map = { d: days, h: hours, m: mins, s: secs };
      el.textContent = pad(map[key]);
    });
    document.querySelectorAll("[data-lo-fill]").forEach(function (el) {
      el.style.width = Math.round(gone * 100) + "%";
    });
  }

  tick();
  setInterval(tick, 1000);

  var nav = document.querySelector("[data-lo-nav]");
  var openNav = document.querySelector("[data-lo-open-nav]");
  var closeNav = document.querySelector("[data-lo-close-nav]");
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("lo-lock", open);
    if (openNav) openNav.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (openNav) openNav.addEventListener("click", function () { setNav(true); });
  if (closeNav) closeNav.addEventListener("click", function () { setNav(false); });
  if (nav) nav.addEventListener("click", function (e) { if (e.target === nav) setNav(false); });
  document.querySelectorAll("[data-lo-nav] a").forEach(function (a) {
    a.addEventListener("click", function () { setNav(false); });
  });

  var search = document.querySelector("[data-lo-search]");
  var openSearch = document.querySelector("[data-lo-open-search]");
  var closeSearch = document.querySelector("[data-lo-close-search]");
  function setSearch(open) {
    if (!search) return;
    search.classList.toggle("is-open", open);
    document.body.classList.toggle("lo-lock", open && !(nav && nav.classList.contains("is-open")));
    if (open) {
      var input = search.querySelector("input");
      if (input) setTimeout(function () { input.focus(); }, 40);
    }
  }
  if (openSearch) openSearch.addEventListener("click", function () { setSearch(true); });
  if (closeSearch) closeSearch.addEventListener("click", function () { setSearch(false); });
  if (search) search.addEventListener("click", function (e) { if (e.target === search) setSearch(false); });
  var searchInput = search ? search.querySelector("input[type='search']") : null;
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll("[data-lo-card]").forEach(function (card) {
        var hay = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-cat") || "")).toLowerCase();
        card.hidden = q.length > 0 && hay.indexOf(q) === -1;
      });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setSearch(false);
      setNav(false);
    }
  });

  function applyFilter(cat) {
    if (!cat) return;
    document.querySelectorAll("[data-lo-filter]").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-lo-filter") === cat);
    });
    document.querySelectorAll("[data-lo-card]").forEach(function (card) {
      var show = cat === "all" || card.getAttribute("data-cat") === cat;
      card.hidden = !show;
    });
  }

  document.querySelectorAll("[data-lo-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.getAttribute("data-lo-filter"));
      var shelf = document.getElementById("shelf");
      if (shelf) shelf.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var startCat = new URLSearchParams(window.location.search).get("cat");
  if (startCat) applyFilter(startCat);

  var hoverNone = window.matchMedia("(hover: none)").matches;
  document.querySelectorAll("[data-lo-card]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (!hoverNone) return;
      if (e.target.closest("form, button, a")) return;
      card.classList.toggle("is-flipped");
    });
  });

  document.querySelectorAll("[data-lo-cart-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var id = form.querySelector("[name='id']");
      if (!id || !id.value) return;
      var button = form.querySelector("button");
      if (button) button.disabled = true;
      fetch((window.routes && window.routes.cart_add_url ? window.routes.cart_add_url : "/cart/add") + ".js", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ id: Number(id.value), quantity: 1 })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("add");
          return fetch("/cart.js").then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          document.querySelectorAll("[data-cart-count]").forEach(function (el) {
            el.textContent = cart.item_count;
            el.hidden = cart.item_count === 0;
          });
          window.location.href = window.routes && window.routes.cart_url ? window.routes.cart_url : "/cart";
        })
        .catch(function () {
          if (button) {
            button.disabled = false;
            button.textContent = "Try again";
          }
        });
    });
  });
})();
