
(function(){
  function $(s, r){ return (r||document).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function money(cents){
    var n = Number(cents || 0) / 100;
    if (!isFinite(n)) n = 0;
    return '$' + n.toFixed(2);
  }
  if (window.Shopify) {
    Shopify.money_format = '${{amount}}';
    Shopify.formatMoney = function(cents){ return money(cents); };
  }

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
  loadCatalog();

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

  function searchSira(q){
    var ql = String(q || '').trim().toLowerCase();
    function pack(p){
      var h = productHandle(p);
      var st = SIRA_STATIC[h] || {};
      return {
        handle: h,
        title: st.title || p.title,
        url: '/products/' + h,
        image: st.image || (typeof p.featured_image === 'string' ? p.featured_image : (p.featured_image && (p.featured_image.url || p.featured_image.src))) || (p.image && (p.image.url || p.image.src || (typeof p.image === 'string' ? p.image : ''))) || '',
        price: formatPrice({price: st.price || p.price}),
        body: productDesc(p)
      };
    }
    var fromStatic = SIRA_HANDLES.map(function(h){
      var st = SIRA_STATIC[h];
      if(!st) return null;
      var p = {handle:h, title:st.title, featured_image:st.image, price:st.price, body:st.desc, vendor:'Sira Sculpt'};
      return matchesQuery(p, ql) ? pack(p) : null;
    }).filter(Boolean);
    var fromCatalog = loadCatalog().then(function(list){
      return list.filter(function(p){ return matchesQuery(p, ql); }).map(pack);
    });
    var fromSuggest = fetch(
      '/search/suggest.json?q='+encodeURIComponent(q)+'&resources[type]=product&resources[limit]=20&resources[options][unavailable_products]=last&resources[options][fields]=title,product_type,variants.title,vendor,tag,body',
      {headers:{'Accept':'application/json'}}
    ).then(function(r){ return r.json(); }).then(function(data){
      return siraItems((((data||{}).resources||{}).results||{}).products || []).filter(function(p){
        return matchesQuery(p, ql) || String(p.title||'').toLowerCase().indexOf(ql) !== -1;
      }).map(pack);
    }).catch(function(){ return []; });

    return Promise.all([Promise.resolve(fromStatic), fromCatalog, fromSuggest]).then(function(parts){
      var seen = {};
      var out = [];
      parts[0].concat(parts[1]).concat(parts[2]).forEach(function(p){
        var h = productHandle(p);
        if(!h || seen[h] || !isSiraProduct(p)) return;
        seen[h] = 1;
        out.push(p);
      });
      return out;
    });
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

  function itemHtml(it){
    var img = (it.image || (it.featured_image && it.featured_image.url) || '');
    var price = money(it.final_line_price || it.line_price || 0);
    var was = (it.original_line_price && it.original_line_price > it.final_line_price) ? '<span class="was">'+money(it.original_line_price)+'</span>' : '';
    return '<div class="scd__it" data-key="'+it.key+'">'+
      '<img src="'+img+'" alt="">'+
      '<div class="scd__it-main"><p class="scd__it-t">'+(it.product_title || it.title || '')+'</p>'+
      (it.variant_title && it.variant_title!=='Default Title' ? '<div class="scd__it-v">'+it.variant_title+'</div>' : '')+
      '<div class="scd__qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button><span>'+it.quantity+'</span><button type="button" data-qty="1" aria-label="Increase">+</button></div></div>'+
      '<div class="scd__it-pr"><span class="now">'+price+'</span>'+was+'</div>'+
      '<button class="scd__it-rm" type="button" data-remove aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5h6v2m-8 0l1 12h8l1-12"/></svg></button></div>';
  }

  function renderCart(cart){
    if(!cartRoot) return;
    var items = siraItems(cart.items || []);
    var count = items.reduce(function(n, it){ return n + (it.quantity || 0); }, 0);
    var total = items.reduce(function(n, it){ return n + (it.final_line_price || it.line_price || 0); }, 0);
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
    var thresh = 7500;
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
    fetch('/cart.js', {headers:{'Accept':'application/json'}}).then(function(r){return r.json();}).then(function(cart){
      var updates = {};
      (cart.items || []).forEach(function(it){
        if(!isSiraProduct(it)) updates[it.key] = 0;
      });
      function go(){ window.location.href = '/checkout'; }
      if(!Object.keys(updates).length) return go();
      return fetch('/cart/update.js', {
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({updates: updates})
      }).then(go).catch(go);
    });
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
      searchSira(q).then(function(list){ renderSuggest(list, box); }).catch(function(){
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

  /* add to cart from product forms */
  document.addEventListener('submit', function(e){
    var form = e.target.closest('[data-ss-atc-form]') || e.target.closest('#ss-buy form.shopify-product-form') || e.target.closest('#ss-buy form');
    if(!form) return;
    e.preventDefault();
    var fd = new FormData(form);
    fetch('/cart/add.js', {method:'POST', body: fd, headers:{'Accept':'application/json'}})
      .then(function(r){ if(!r.ok) throw r; return r.json(); })
      .then(function(){ return refreshCart(); })
      .then(openCart)
      .catch(function(){ form.submit(); });
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
