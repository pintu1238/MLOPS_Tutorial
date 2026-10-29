
(function(){
  if (window.__SS_CORE_INIT__) return;
  window.__SS_CORE_INIT__ = true;

  function shopConfig(){
    return window.__SS_SHOP || {};
  }

  function formatAmountMajor(cents){
    var n = Number(cents || 0) / 100;
    if (!isFinite(n)) n = 0;
    return n;
  }

  function money(cents){
    var cfg = shopConfig();
    var major = formatAmountMajor(cents);
    var fmt = cfg.moneyFormat || (cfg.currency === 'INR' ? 'Rs. {{amount}}' : '${{amount}}');
    var amount = major.toFixed(2);
    var amountComma = major.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    var amountNoDecimals = Math.round(major).toLocaleString('en-IN');
    return String(fmt)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, amountComma)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, amountNoDecimals)
      .replace(/\{\{\s*amount\s*\}\}/g, amount);
  }

  if (window.Shopify) {
    Shopify.formatMoney = function(cents){ return money(cents); };
  }
  window.ssMoney = money;

  function $(s, r){ return (r||document).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  var SIRA_HANDLES = [
    'sira-sculpt-4d-compression-leggings-for-lymphedema',
    'sira-sculpt-3d-anti-cellulite-leggings-sculpt-smooth',
    'sira-sculpt-4d-compression-leggings-for-varicose-veins',
    'sira-sculpt-4d-compression-leggings-for-nurses',
    'sirasculpt-3d-lipedema-leggings-drain-lighten',
    'sira-sculpt-4d-lipedema-leggings-offer',
    'sira-sculpt-anti-chafing-3d-shorts',
    'sira-sculpt-4d-compression-leggings-for-tired-swollen-legs',
    'sira-sculpt-belly-brief-offer',
    'sira-sculpt-belly-brief-c-section-offer',
    'sira-sculpt-belly-brief-mom-pooch-offer',
    'sira-sculpt-belly-brief-meno-offer',
    'the-lipedema-handbook',
    'sira-sculpt-magic-body-oil'
  ];
  var SIRA_STATIC = {
    'sira-sculpt-4d-compression-leggings-for-lymphedema': {title:'Sira Sculpt 4D Compression Leggings for Lymphedema', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'Medical-grade 4D compression that drains fluid, eases heaviness and holds the shape of swollen legs all day.'},
    'sira-sculpt-3d-anti-cellulite-leggings-sculpt-smooth': {title:'Sira Sculpt 4D Compression Leggings for Cellulite, Loose Skin & Heavy Legs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/sq_hero_v2.jpg?v=1787160570', price:6495, desc:'4D compression that smooths dimpling, holds loose skin and lightens heavy legs all day.'},
    'sira-sculpt-4d-compression-leggings-for-varicose-veins': {title:'Sira Sculpt 4D Compression Leggings for Varicose Veins', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'Targeted 4D compression that drains fluid, eases aching veins and holds the shape of varicose legs all day.'},
    'sira-sculpt-4d-compression-leggings-for-nurses': {title:'Sira Sculpt 4D Compression Leggings for Nurses & 12-Hour Shifts', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'Built for 12-hour shifts. 4D compression that drains fluid, eases aching legs and holds its shape from the first round to the last.'},
    'sirasculpt-3d-lipedema-leggings-drain-lighten': {title:'Sira Sculpt 4D Lipedema Leggings', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'Medical-grade 4D compression that drains fluid, eases heaviness and holds the shape of lipedema legs all day.'},
    'sira-sculpt-4d-lipedema-leggings-offer': {title:'Sira Sculpt 4D Lipedema Leggings', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'Medical-grade 4D compression that drains fluid, eases heaviness and holds the shape of lipedema legs all day.'},
    'sira-sculpt-anti-chafing-3d-shorts': {title:'Sira Sculpt Anti-Chafing 3D Shorts', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/1_hero_shorts.jpg?v=1786765044', price:4995, desc:'Anti-chafing 3D shorts that stay put, smooth the thigh and keep you comfortable all day.'},
    'sira-sculpt-4d-compression-leggings-for-tired-swollen-legs': {title:'Sira Sculpt 4D Compression Leggings for Tired, Swollen Legs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/a7763c2a-71f2-4749-b52f-683d13fc4758.png?v=1788954313', price:6495, desc:'All-day 4D compression that drains fluid, eases heaviness and holds the shape of tired, swollen legs.'},
    'sira-sculpt-belly-brief-offer': {title:'Sira Sculpt 3D Compression Briefs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/hero_umbrella_v5.jpg?v=1790746940', price:3990, desc:'3D compression briefs that hold the belly, smooth the waist and stay comfortable under clothes.'},
    'sira-sculpt-belly-brief-c-section-offer': {title:'Sira Sculpt 3D Compression Briefs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/hero_csec_v5.jpg?v=1790746961', price:3990, desc:'3D compression briefs that hold the belly, smooth the waist and stay comfortable under clothes.'},
    'sira-sculpt-belly-brief-mom-pooch-offer': {title:'Sira Sculpt 3D Compression Briefs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/hero_mom_v5.jpg?v=1790746954', price:3990, desc:'3D compression briefs that hold the belly, smooth the waist and stay comfortable under clothes.'},
    'sira-sculpt-belly-brief-meno-offer': {title:'Sira Sculpt 3D Compression Briefs', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/hero_meno_v5.jpg?v=1790746947', price:3990, desc:'3D compression briefs that hold the belly, smooth the waist and stay comfortable under clothes.'},
    'the-lipedema-handbook': {title:'The Lipedema Handbook', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/handbook_main.png?v=1788885331', price:2400, desc:'A practical, source-checked guide to understanding lipedema and what actually helps.'},
    'sira-sculpt-magic-body-oil': {title:'Sira Sculpt Magic Body Oil', image:'https://cdn.shopify.com/s/files/1/0927/1246/8796/files/ssm_hero_woman.jpg?v=1788861177', price:5599, desc:'A daily body oil that melts in, layers over compression, and leaves skin looking nourished not greasy.'}
  };
  var SIRA_HANDLE_SET = {};
  SIRA_HANDLES.forEach(function(h){ SIRA_HANDLE_SET[h] = 1; });

  function productHandle(p){
    if(!p) return '';
    var h = String(p.handle || '').toLowerCase().replace(/^\/products\//,'').split(/[?#]/)[0];
    if(h) return h;
    var url = String(p.url || p.product_url || '');
    var m = url.match(/\/products\/([^\/?#]+)/i);
    return m ? decodeURIComponent(m[1]).toLowerCase() : '';
  }

  function isSiraProduct(p){
    if(!p) return false;
    var handle = productHandle(p);
    if(SIRA_HANDLE_SET[handle]) return true;
    if(handle.indexOf('sira') !== -1) return true;
    var vendor = String(p.vendor || '').toLowerCase();
    if(vendor.indexOf('sira') !== -1) return true;
    var title = String(p.title || p.product_title || '').toLowerCase();
    if(/sira\s*sculpt|sirasculpt|lipedema|lymphedema/.test(title)) return true;
    var url = String(p.url || '').toLowerCase();
    if(url.indexOf('/products/sira') !== -1) return true;
    if(/pookie|curvd|monstie/.test(handle + ' ' + vendor)) return false;
    return false;
  }

  function siraItems(items){
    return (items || []).filter(isSiraProduct);
  }

  var catalogCache = null;
  function loadCatalog(){
    if(catalogCache) return Promise.resolve(catalogCache);
    return Promise.all(SIRA_HANDLES.map(function(h){
      return fetch('/products/'+h+'.js', {headers:{'Accept':'application/json'}})
        .then(function(r){ return r.ok ? r.json() : null; })
        .catch(function(){ return null; })
        .then(function(p){
          if(p) return p;
          var st = SIRA_STATIC[h];
          if(!st) return null;
          return {handle:h, title:st.title, featured_image:st.image, price:st.price, vendor:'Sira Sculpt'};
        });
    })).then(function(list){
      catalogCache = list.filter(Boolean);
      return catalogCache;
    });
  }
  function plainText(s){
    return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);
    });
  }
  function formatPrice(p){
    if(!p) return '';
    var v = p.price;
    if(typeof v === 'string' && v.indexOf('$') !== -1) return v;
    if(typeof v === 'string' && v.indexOf('.') !== -1) return '$' + Number(v).toFixed(2);
    if(isLustraItem(p)) return money(Math.round(Number(v || 0) * LUSTRA_PRICE_MULT));
    return money(v);
  }
  function productDesc(p){
    var h = productHandle(p);
    var st = SIRA_STATIC[h] || {};
    return plainText(p.body || p.body_html || p.description || st.desc || '');
  }

  function matchesQuery(p, q){
    if(!q) return true;
    var ql = String(q).toLowerCase();
    var handle = productHandle(p);
    var st = SIRA_STATIC[handle] || {};
    var hay = [
      p.title, st.title, handle.replace(/-/g, ' '), p.vendor, p.product_type, p.type,
      st.desc, p.body, p.body_html, p.description, (p.tags || []).join(' ')
    ].join(' ').toLowerCase().replace(/<[^>]+>/g, ' ');
    if(hay.indexOf(ql) !== -1) return true;
    var words = ql.split(/\s+/).filter(function(w){ return w.length > 1; });
    if(!words.length) return false;
    return words.every(function(w){ return hay.indexOf(w) !== -1; });
  }

  function packSearchProduct(p){
    var h = productHandle(p);
    var img = p.image || p.featured_image;
    if(img && typeof img === 'object') img = img.url || img.src;
    return {
      handle: h,
      title: p.title || '',
      url: p.url || (h ? '/products/' + h : '/search'),
      image: typeof img === 'string' ? img : '',
      price: formatPrice({ price: p.price }),
      body: productDesc(p)
    };
  }

  /** Current-store products only (Shopify Search & Discovery API). */
  function searchStore(q){
    var ql = String(q || '').trim();
    if(!ql) return Promise.resolve([]);
    return fetch(
      '/search/suggest.json?q='+encodeURIComponent(ql)+'&resources[type]=product&resources[limit]=20&resources[options][unavailable_products]=last&resources[options][fields]=title,product_type,variants.title,vendor,tag,body',
      { headers: { Accept: 'application/json' } }
    )
      .then(function(r){ return r.json(); })
      .then(function(data){
        var products = ((((data || {}).resources || {}).results || {}).products || []);
        return products
          .filter(function(p){ return p && !isSiraProduct(p); })
          .map(packSearchProduct);
      })
      .catch(function(){ return []; });
  }

  /* sticky header hide on scroll down */
  var hdr = $('.ss-hdr');
  var lastY = 0;
  if(hdr){
    window.addEventListener('scroll', function(){
      var y = window.scrollY || 0;
      if(y > lastY && y > 80) hdr.classList.add('ss-hdr--hide');
      else hdr.classList.remove('ss-hdr--hide');
      lastY = y;
    }, {passive:true});
  }

  function setHeaderGroupHeight(){
    var group = document.getElementById('header-group');
    if(!group) return;
    document.documentElement.style.setProperty('--header-group-height', group.offsetHeight + 'px');
  }
  setHeaderGroupHeight();
  window.addEventListener('resize', setHeaderGroupHeight, {passive:true});
  if(typeof ResizeObserver !== 'undefined'){
    var headerGroup = document.getElementById('header-group');
    if(headerGroup){
      var headerGroupObserver = new ResizeObserver(setHeaderGroupHeight);
      headerGroupObserver.observe(headerGroup);
    }
  }

  /* Horizon scrolls .page-wrapper at ≥990px (html/body overflow:hidden).
     Mobile uses window scroll. Leaving window.scrollY after a device-mode /
     laptop resize hides the page (header + sticky ATC stay, content blank)
     until refresh. Move the scroll offset onto the active scroller. */
  (function syncPageScrollPort(){
    var mq = window.matchMedia('(min-width: 990px)');
    var lastDesktop = mq.matches;

    function pageWrap(){
      return document.querySelector('.page-wrapper');
    }

    function closeMobileChrome(){
      var menu = document.querySelector('.smd.open');
      if(menu) menu.classList.remove('open');
      var cart = document.querySelector('.scd.open');
      if(cart) cart.classList.remove('open');
      if(document.body && document.body.style.overflow === 'hidden'){
        document.body.style.overflow = '';
      }
    }

    function windowY(){
      return window.scrollY || window.pageYOffset || 0;
    }

    function apply(isDesktop){
      var page = pageWrap();
      if(isDesktop){
        var y = windowY();
        if(y){
          window.scrollTo(0, 0);
          if(page) page.scrollTop = y;
        }
        if(isDesktop !== lastDesktop) closeMobileChrome();
      } else if(lastDesktop){
        var y = page ? page.scrollTop : 0;
        if(page) page.scrollTop = 0;
        if(y) window.scrollTo(0, y);
      }
      lastDesktop = isDesktop;
      setHeaderGroupHeight();
    }

    function onViewportChange(){
      apply(mq.matches);
    }

    if(mq.addEventListener) mq.addEventListener('change', onViewportChange);
    else if(mq.addListener) mq.addListener(onViewportChange);
    window.addEventListener('resize', onViewportChange, {passive:true});
    onViewportChange();
  })();

  /* reveal */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(ents){
    ents.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:.12}) : null;
  $$('.ssh .reveal').forEach(function(el){ if(io) io.observe(el); else el.classList.add('in'); });

  /* cart */
  var cartRoot = $('.scd');
  function setCount(n){
    $$('[data-ss-cart-count]').forEach(function(el){
      el.textContent = n;
      el.classList.toggle('is-on', n>0);
    });
  }
  function openCart(){ if(cartRoot){ cartRoot.classList.add('open'); document.body.style.overflow='hidden'; } }
  function closeCart(){ if(cartRoot){ cartRoot.classList.remove('open'); document.body.style.overflow=''; } }
  window.ssOpenCart = openCart;
  window.ssCloseCart = closeCart;

  function flytekCartFallback(cfg) {
    return cfg.flytekCartImage || cfg.lustraCartImage || '';
  }

  function isLegacyStoreProduct(handle) {
    var h = handle || '';
    return h.indexOf('lustra') !== -1 || h.indexOf('hair-growth') !== -1 || h.indexOf('soft-chews') !== -1 || h.indexOf('sira') !== -1;
  }

  function isFlytekProduct(handle) {
    var h = handle || '';
    return h.indexOf('flytek') !== -1 || h.indexOf('rc-drift') !== -1 || h.indexOf('drift-car') !== -1 || h.indexOf('creatine') !== -1;
  }

  function lineItemImage(it){
    var img = it.image || '';
    if (typeof img === 'object' && img) img = img.url || img.src || '';
    if (img && String(img).indexOf('//') === 0) img = 'https:' + img;
    if (!img && it.featured_image) {
      img = typeof it.featured_image === 'string' ? it.featured_image : (it.featured_image.url || it.featured_image.src || '');
      if (img && String(img).indexOf('//') === 0) img = 'https:' + img;
    }
    var h = productHandle(it);
    var cfg = shopConfig();
    var fallback = flytekCartFallback(cfg);
    if (isLegacyStoreProduct(h) && fallback) {
      img = fallback;
    } else if (!img && (isFlytekProduct(h) || fallback)) {
      img = fallback;
    }
    return img || '';
  }

  function lineCents(it, field){
    return Number(it[field] || 0);
  }

  function itemHtml(it){
    var img = esc(lineItemImage(it));
    var line = lineCents(it, 'final_line_price') || lineCents(it, 'line_price');
    var price = money(line);
    var orig = lineCents(it, 'original_line_price');
    var fin = lineCents(it, 'final_line_price') || lineCents(it, 'line_price');
    var was = (orig && orig > fin) ? '<span class="was">'+money(orig)+'</span>' : '';
    var imgTag = img ? '<img src="'+img+'" alt="" loading="lazy" width="112" height="128">' : '<span class="scd__it-ph" aria-hidden="true"></span>';
    return '<div class="scd__it" data-key="'+esc(it.key)+'">'+
      imgTag+
      '<div class="scd__it-main"><p class="scd__it-t">'+(it.product_title || it.title || '')+'</p>'+
      (it.variant_title && it.variant_title!=='Default Title' ? '<div class="scd__it-v">'+it.variant_title+'</div>' : '')+
      '<div class="scd__qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button><span>'+it.quantity+'</span><button type="button" data-qty="1" aria-label="Increase">+</button></div></div>'+
      '<div class="scd__it-pr"><span class="now">'+price+'</span>'+was+'</div>'+
      '<button class="scd__it-rm" type="button" data-remove aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5h6v2m-8 0l1 12h8l1-12"/></svg></button></div>';
  }

  function renderCart(cart){
    if(!cartRoot) return;
    if (cart && cart.currency) {
      window.__SS_SHOP = window.__SS_SHOP || {};
      window.__SS_SHOP.currency = cart.currency;
    }
    var items = cart.items || [];
    var count = typeof cart.item_count === 'number'
      ? cart.item_count
      : items.reduce(function(n, it){ return n + (it.quantity || 0); }, 0);
    var total = typeof cart.total_price === 'number'
      ? cart.total_price
      : items.reduce(function(n, it){
          return n + (lineCents(it, 'final_line_price') || lineCents(it, 'line_price'));
        }, 0);
    setCount(count);
    var body = $('.scd__body', cartRoot);
    var empty = $('.scd__empty', cartRoot);
    var foot = $('.scd__foot', cartRoot);
    if(!items.length){
      if(body) body.innerHTML = '';
      if(empty) empty.style.display='block';
      if(foot) foot.style.display='none';
      return;
    }
    if(empty) empty.style.display='none';
    if(foot) foot.style.display='block';
    if(body) body.innerHTML = items.map(itemHtml).join('');
    var tot = $('[data-ss-cart-total]', cartRoot);
    if(tot) tot.textContent = money(total);
    var bar = $('.scd__ship-bar span', cartRoot);
    var msg = $('.scd__ship-msg', cartRoot);
    var cfgShip = shopConfig();
    var thresh = (cfgShip.currency === 'INR')
      ? (cfgShip.freeShippingThresholdInr || 149900)
      : 7500;
    var left = Math.max(0, thresh - total);
    if(bar) bar.style.width = Math.min(100, (total/thresh)*100) + '%';
    if(msg){
      msg.innerHTML = left>0 ? 'You are <b>'+money(left)+'</b> away from free shipping' : '<b>You unlocked free shipping</b>';
    }
  }

  function refreshCart(){
    return fetch('/cart.js', {headers:{'Accept':'application/json'}}).then(function(r){return r.json();}).then(renderCart);
  }
  window.ssRefreshCart = refreshCart;

  function changeQty(key, qty){
    return fetch('/cart/change.js', {
      method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({id:key, quantity:qty})
    }).then(function(r){return r.json();}).then(renderCart);
  }

  function checkoutSiraOnly(e){
    if(e) e.preventDefault();
    window.location.href = '/checkout';
  }

  document.addEventListener('click', function(e){
    if(e.target.closest('[data-ss-open-cart]')){ e.preventDefault(); refreshCart().then(openCart); }
    if(e.target.closest('[data-ss-close-cart]')){ e.preventDefault(); closeCart(); }
    if(e.target.closest('[data-ss-open-search]')){ e.preventDefault(); openSearch(); }
    if(e.target.closest('[data-ss-close-search]')){ e.preventDefault(); closeSearch(); }
    if(e.target.closest('[data-ss-checkout]')){ checkoutSiraOnly(e); }
    var goBtn = e.target.closest('.ss-search.open .ss-search__go');
    if(goBtn){
      e.preventDefault();
      var q = searchInput && searchInput.value.trim();
      if(q) window.location.href = '/search?q='+encodeURIComponent(q)+'&type=product&options%5Bprefix%5D=last';
    }
    if(e.target.closest('[data-ss-open-menu]')){ e.preventDefault(); var d=$('.smd'); if(d) d.classList.add('open'); document.body.style.overflow='hidden'; }
    if(e.target.closest('[data-ss-close-menu]')){ e.preventDefault(); var d=$('.smd'); if(d) d.classList.remove('open'); document.body.style.overflow=''; }
    var qtyBtn = e.target.closest('.scd__qty button');
    if(qtyBtn){
      var row = qtyBtn.closest('.scd__it');
      var span = row.querySelector('.scd__qty span');
      var qn = parseInt(span.textContent,10) + parseInt(qtyBtn.getAttribute('data-qty'),10);
      changeQty(row.getAttribute('data-key'), Math.max(0,qn));
    }
    if(e.target.closest('[data-remove]')){
      var row = e.target.closest('.scd__it');
      changeQty(row.getAttribute('data-key'), 0);
    }
  });

  /* search */
  var searchRoot = $('.ss-search');
  var searchInput = searchRoot && $('.ss-search__input', searchRoot);
  var searchResults = searchRoot && $('.ss-search__results', searchRoot);
  function openSearch(){ if(searchRoot){ searchRoot.classList.add('open'); document.body.style.overflow='hidden'; setTimeout(function(){ if(searchInput) searchInput.focus(); }, 50);} }
  function closeSearch(){ if(searchRoot){ searchRoot.classList.remove('open'); document.body.style.overflow=''; } }
  window.ssOpenSearch = openSearch;

  function renderSuggest(products, into){
    var box = into || searchResults;
    if(!box) return;
    if(!products.length){
      box.innerHTML = '<div class="ss-search__empty">No results found for this search. Try another word.</div>';
      box.hidden = false;
      return;
    }
    box.innerHTML = products.map(function(p){
      var img = p.image || p.featured_image || '';
      var url = p.url || ('/products/'+p.handle);
      var price = formatPrice(p);
      var desc = productDesc(p);
      return '<a class="ss-search__item" href="'+esc(url)+'">'+
        (img?'<img class="ss-search__thumb" src="'+esc(img)+'" alt="">':'<span class="ss-search__thumb"></span>')+
        '<div class="ss-search__meta">'+
          '<strong class="ss-search__title">'+esc(p.title||'')+'</strong>'+
          (desc ? '<p class="ss-search__desc">'+esc(desc)+'</p>' : '')+
          (price ? '<span class="ss-search__price">'+esc(price)+'</span>' : '')+
        '</div></a>';
    }).join('');
    box.hidden = false;
  }

  function bindLiveSearch(input, box){
    if(!input || !box) return;
    var timer = null;
    function run(){
      var q = input.value.trim();
      if(q.length<2){ box.innerHTML=''; box.hidden = true; return; }
      searchStore(q).then(function(list){ renderSuggest(list, box); }).catch(function(){
        box.innerHTML = '<div class="ss-search__empty">No results found for this search. Try another word.</div>';
        box.hidden = false;
      });
    }
    input.addEventListener('input', function(){
      clearTimeout(timer);
      timer = setTimeout(run, 120);
    });
    input.addEventListener('focus', function(){
      if(input.value.trim().length>=2 && !box.innerHTML) run();
    });
    input.addEventListener('keydown', function(e){
      if(e.key==='Escape'){
        if(searchRoot && searchRoot.contains(input)) closeSearch();
        else { box.innerHTML=''; box.hidden = true; }
      }
      if(e.key==='Enter' && searchRoot && searchRoot.contains(input)){
        e.preventDefault();
        var q = input.value.trim();
        if(q) window.location.href = '/search?q='+encodeURIComponent(q)+'&type=product&options%5Bprefix%5D=last';
      }
    });
    if(input.value.trim().length>=2) setTimeout(run, 0);
  }

  bindLiveSearch(searchInput, searchResults);
  bindLiveSearch($('.sssr__input'), $('.sssr__live'));

  /* Check Availability / Shop Now → buy box (works with .page-wrapper scroll) */
  window.__ssScroll = 1;
  function scrollToBuy(hash){
    var tg = document.getElementById('ssTiers')
      || document.querySelector('.ssbb')
      || (hash === 'ssc-buy' ? document.getElementById('ssc-buy') : null)
      || document.getElementById('ss-buy')
      || document.getElementById('ssc-buy');
    if(!tg) return false;
    var wrap = document.querySelector('.page-wrapper');
    var offset = 80;
    var wrapStyle = wrap ? window.getComputedStyle(wrap) : null;
    var wrapScrolls = wrap && wrapStyle && (wrapStyle.overflowY === 'auto' || wrapStyle.overflowY === 'scroll') && wrap.scrollHeight > wrap.clientHeight + 8;
    if(wrapScrolls){
      var top = wrap.scrollTop + (tg.getBoundingClientRect().top - wrap.getBoundingClientRect().top) - offset;
      wrap.scrollTo({top: Math.max(0, top), behavior:'smooth'});
    } else {
      var y = tg.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top: Math.max(0, y), behavior:'smooth'});
    }
    return true;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href="#ss-buy"], a[href="#ssc-buy"], .ss-sticky a.cta, .ssc-sticky a.cta');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    var hash = href.indexOf('ssc-buy') !== -1 ? 'ssc-buy' : 'ss-buy';
    if(scrollToBuy(hash)){
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  function jumpHash(){
    var hash = (location.hash || '').replace('#','');
    if(hash === 'ss-buy' || hash === 'ssc-buy') scrollToBuy(hash);
  }
  if(document.readyState === 'complete') setTimeout(jumpHash, 50);
  else window.addEventListener('load', function(){ setTimeout(jumpHash, 50); });

  /* add to cart from product forms — stay on page, no /cart redirect */
  document.addEventListener('submit', function(e){
    var form = e.target.closest('[data-ss-atc-form]')
      || e.target.closest('#ftPdpForm')
      || e.target.closest('form.ft-pdp-form')
      || e.target.closest('#ss-buy form.shopify-product-form')
      || e.target.closest('#ss-buy form');
    if(!form) return;
    e.preventDefault();
    e.stopPropagation();
    if (form.getAttribute('data-ss-atc-busy') === '1') return;
    form.setAttribute('data-ss-atc-busy', '1');
    var fd = new FormData(form);
    fd.delete('return_to');
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    fetch('/cart/add.js', {method:'POST', body: fd, headers:{'Accept':'application/json'}})
      .then(function(r){
        if(!r.ok){
          return r.json().catch(function(){ return {}; }).then(function(err){
            var msg = (err && (err.description || err.message)) || 'Could not add to cart';
            throw new Error(msg);
          });
        }
        return r.json();
      })
      .then(function(){
        return refreshCart().then(function(){
          if (form.hasAttribute('data-ss-open-cart-on-add')) openCart();
        });
      })
      .catch(function(err){
        if(submitBtn){
          var prev = submitBtn.textContent;
          submitBtn.textContent = err && err.message ? String(err.message).slice(0, 48) : 'Try again';
          setTimeout(function(){ submitBtn.textContent = prev; }, 2500);
        }
      })
      .finally(function(){
        form.removeAttribute('data-ss-atc-busy');
        if (submitBtn) submitBtn.disabled = false;
      });
  });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href*="track-order"], a[href*="track-your-order"], a[data-ss-track]');
    if(!a) return;
    try { sessionStorage.setItem('ssWantTrack','1'); } catch (err) {}
  });

  refreshCart();

  window.ssRevScroll = function(dir){
    var g = document.getElementById('ssRevGrid');
    if(!g) return;
    g.scrollBy({left: dir * (g.clientWidth * 0.8), behavior:'smooth'});
  };
})();
