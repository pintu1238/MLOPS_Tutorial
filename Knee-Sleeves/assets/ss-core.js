
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
    if(typeof v === 'string' && /Rs\.|₹|\$|€|£/.test(v)) return v;
    if(typeof v === 'string' && v.indexOf('.') !== -1) {
      var major = Number(v);
      if(isFinite(major)) return money(Math.round(major * 100));
    }
    if(typeof v === 'number') {
      if(v > 0 && v < 100000 && v % 1 !== 0) return money(Math.round(v * 100));
      return money(v);
    }
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

  function isRcCatalogProduct(p){
    if(!p) return false;
    var handle = productHandle(p);
    if(isFlytekProduct(handle)) return true;
    var vendor = String(p.vendor || '').toLowerCase();
    if(vendor.indexOf('flytek') !== -1 || vendor.indexOf('torqvolt') !== -1) return true;
    var type = String(p.type || p.product_type || '').toLowerCase();
    if(type.indexOf('remote control') !== -1 || type.indexOf('rc ') !== -1) return true;
    var tags = (p.tags || []).join(' ').toLowerCase();
    if(/\bflytek\b|\brc-drift\b|\brc\b|torqvolt/.test(tags)) return true;
    var title = String(p.title || p.product_title || '').toLowerCase();
    if(/\bflytek\b|remote control|\brc\b|drift car|crawler/.test(title)) return true;
    return false;
  }

  function isFlexoraProduct(p){
    if(!p) return false;
    if(isRcCatalogProduct(p)) return false;
    var handle = productHandle(p);
    if(/flexora|ks-mp|knee-sleeve|knee-support/.test(handle)) return true;
    var vendor = String(p.vendor || '').toLowerCase();
    if(vendor.indexOf('flexora') !== -1) return true;
    var type = String(p.type || p.product_type || '').toLowerCase();
    if(/knee|sleeve|brace|support|orthotic|compression|wrist|ankle|elbow|calf/.test(type)) return true;
    var tags = (p.tags || []).join(' ').toLowerCase();
    if(/flexora|ks-mp|knee-sleeve|orthotic|compression sleeve/.test(tags)) return true;
    var title = String(p.title || p.product_title || '').toLowerCase();
    if(/knee sleeve|knee support|knee brace|wrist support|ankle support|elbow support|calf support|compression sleeve/.test(title)) return true;
    return false;
  }

  function isStoreProduct(p){
    if(!p) return false;
    if(isLegacyStoreProduct(p)) return false;
    if(isSiraProduct(p)) return false;
    var scope = String(shopConfig().searchScope || '').toLowerCase();
    if(scope === 'torqvolt' || scope === 'rc') return isRcCatalogProduct(p);
    if(scope === 'flexora' || scope === 'ks-mp') return isFlexoraProduct(p);
    return true;
  }

  function packSearchProduct(p){
    var h = productHandle(p);
    var img = p.image || p.featured_image;
    if(img && typeof img === 'object') img = img.url || img.src;
    if(img && String(img).indexOf('//') === 0) img = 'https:' + img;
    var priceVal = p.price;
    if(priceVal == null && p.price_min != null) priceVal = p.price_min;
    return {
      handle: h,
      title: p.title || '',
      url: p.url || (h ? '/products/' + h : '/search'),
      image: typeof img === 'string' ? img : '',
      price: formatPrice({ price: priceVal }),
      body: productDesc(p)
    };
  }

  function searchUrl(q){
    return '/search?q='+encodeURIComponent(q)+'&type=product&options%5Bprefix%5D=last';
  }

  var RC_SEARCH_HINT = /\b(rc|car|cars|remote|drift|crawler|flytek|torqvolt|hobby|truck|monster|rtr|4wd|4x4|control)\b/i;
  var rcCatalogPromise = null;
  var THEME_CATALOG_CACHE = null;
  var themeCatalogLoadPromise = null;
  var RV_KEY = 'tcMpRecentlyViewed';
  var RV_LIMIT = 8;

  function themeCatalog(){
    if(THEME_CATALOG_CACHE) return THEME_CATALOG_CACHE;
    var el = document.getElementById('tcMpSearchCatalog');
    if(!el){
      THEME_CATALOG_CACHE = [];
      return THEME_CATALOG_CACHE;
    }
    try {
      THEME_CATALOG_CACHE = JSON.parse(el.textContent || '[]') || [];
    } catch (e) {
      THEME_CATALOG_CACHE = [];
    }
    if(!Array.isArray(THEME_CATALOG_CACHE)) THEME_CATALOG_CACHE = [];
    return THEME_CATALOG_CACHE;
  }

  function ksMpCatalogProductPath(){
    var cfg = shopConfig();
    var path = String(cfg.catalogProductPath || cfg.flytekProductUrl || '').trim();
    if(!path) path = '/products/flytek-curve-rc-drift-car-4x4';
    return path.split('?')[0].split('#')[0];
  }

  function rewriteKsMpCatalogUrl(url){
    var u = String(url || '').trim();
    if(!u || u.indexOf('/products/') !== 0) return u;
    var target = ksMpCatalogProductPath();
    return u.replace(/^\/products\/[^/?#]+/, target);
  }

  function hydrateCatalogAssets(list){
    var base = window.__KS_MP_ASSET_BASE || '';
    return (list || []).map(function(p){
      var row = Object.assign({}, p);
      if(row.asset && (!row.image || String(row.image).indexOf('http') !== 0)){
        row.image = base + row.asset;
      }
      if(row.url) row.url = rewriteKsMpCatalogUrl(row.url);
      return row;
    });
  }

  function ensureThemeCatalogLoaded(){
    if(THEME_CATALOG_CACHE && THEME_CATALOG_CACHE.length) return Promise.resolve(THEME_CATALOG_CACHE);
    if(themeCatalogLoadPromise) return themeCatalogLoadPromise;
    var inline = themeCatalog();
    if(inline.length){
      THEME_CATALOG_CACHE = hydrateCatalogAssets(inline);
      return Promise.resolve(THEME_CATALOG_CACHE);
    }
    var el = document.getElementById('tcMpSearchCatalog');
    var src = el && el.getAttribute('data-catalog-src');
    if(!src){
      return Promise.resolve([]);
    }
    themeCatalogLoadPromise = fetch(src, { headers: { Accept: 'application/json' } })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(list){
        THEME_CATALOG_CACHE = hydrateCatalogAssets(Array.isArray(list) ? list : []);
        return THEME_CATALOG_CACHE;
      })
      .catch(function(){
        THEME_CATALOG_CACHE = [];
        return [];
      });
    return themeCatalogLoadPromise;
  }

  function flexoraScope(){
    var scope = String(shopConfig().searchScope || '').toLowerCase();
    return scope === 'flexora' || scope === 'ks-mp';
  }

  function formatInrRupees(n){
    var major = Number(n || 0);
    if(!isFinite(major)) major = 0;
    return 'Rs. ' + major.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' INR';
  }

  function packThemeProduct(p){
    if(!p) return null;
    var rupees = Number(p.price || p.rupees || 0);
    var compare = Number(p.compare || p.compareRupees || 0);
    return {
      id: p.id || p.asset || p.title || '',
      title: p.title || '',
      url: String(p.url || '').trim(),
      image: p.image || '',
      asset: p.asset || '',
      seed: p.seed || '',
      tag: p.tag || '',
      subtitle: p.subtitle || '',
      body: p.subtitle || p.body || '',
      rupees: rupees,
      compareRupees: compare,
      price: rupees ? formatInrRupees(rupees) : (p.price || ''),
      compare: compare > rupees ? formatInrRupees(compare) : ''
    };
  }

  function searchThemeCatalog(q){
    var items = themeCatalog();
    var ql = String(q || '').toLowerCase().trim();
    var matched = items;
    if(ql){
      var words = ql.split(/\s+/).filter(Boolean);
      matched = items.filter(function(p){
        var hay = [p.title, p.subtitle, p.tag, p.body, p.asset, p.id].join(' ').toLowerCase();
        if(hay.indexOf(ql) !== -1) return true;
        return words.every(function(w){ return hay.indexOf(w) !== -1; });
      });
      matched = matched.slice().sort(function(a, b){
        var at = String(a.title || '').toLowerCase();
        var bt = String(b.title || '').toLowerCase();
        var aStarts = at.indexOf(ql) === 0 ? 0 : 1;
        var bStarts = bt.indexOf(ql) === 0 ? 0 : 1;
        if(aStarts !== bStarts) return aStarts - bStarts;
        var ai = at.indexOf(ql);
        var bi = bt.indexOf(ql);
        if(ai < 0) ai = 999;
        if(bi < 0) bi = 999;
        if(ai !== bi) return ai - bi;
        return at.localeCompare(bt);
      });
    }
    return matched.map(packThemeProduct).filter(Boolean);
  }

  function readRecentlyViewed(){
    try {
      var list = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function writeRecentlyViewed(list){
    try { localStorage.setItem(RV_KEY, JSON.stringify((list || []).slice(0, RV_LIMIT))); } catch (e) {}
  }

  function rememberViewed(item){
    var packed = packThemeProduct(item);
    if(!packed || !packed.title) return;
    var list = readRecentlyViewed().filter(function(x){
      return x.id !== packed.id && x.title !== packed.title;
    });
    list.unshift(packed);
    writeRecentlyViewed(list);
  }
  window.tcMpRememberViewed = rememberViewed;

  function rememberCurrentPdp(){
    if(!document.querySelector('[data-ft-pdp]')) return;
    var params = new URLSearchParams(window.location.search);
    var title = params.get('tc_title') || '';
    var seed = params.get('tc_seed') || '';
    var img = params.get('tc_img') || '';
    try {
      var stored = JSON.parse(sessionStorage.getItem('tcMpPdpPreview') || 'null');
      if(stored){
        if(!title && stored.title) title = stored.title;
        if(!seed && stored.seed) seed = String(stored.seed);
        if(!img && stored.img) img = stored.img;
      }
    } catch (e) {}
    var match = null;
    if(title || seed || img){
      match = themeCatalog().filter(function(p){
        if(title && p.title === title) return true;
        if(img && (p.asset === img || String(p.asset) === decodeURIComponent(img))) return true;
        if(seed && String(p.seed) === String(seed) && String(p.asset || '').indexOf('shop') !== -1) return true;
        return false;
      })[0];
    }
    if(match){
      rememberViewed(Object.assign({}, match, { url: window.location.pathname + window.location.search }));
      return;
    }
    var titleEl = document.querySelector('.ft-pdp-title');
    var pageTitle = title || (titleEl && titleEl.textContent.trim()) || '';
    if(!pageTitle) return;
    var main = document.querySelector('#ftPdpMain');
    rememberViewed({
      id: img || (seed ? 'seed-' + seed : pageTitle),
      title: pageTitle,
      image: main ? (main.currentSrc || main.src || '') : '',
      asset: img,
      seed: seed,
      url: window.location.pathname + window.location.search
    });
  }

  function normalizeStoreProduct(p){
    if(!p) return p;
    var img = p.image || p.featured_image;
    if(!img && p.images && p.images.length) img = p.images[0];
    if(img && typeof img === 'object') img = img.src || img.url || '';
    var price = p.price;
    if(price == null && p.variants && p.variants[0]) price = p.variants[0].price;
    return Object.assign({}, p, {
      image: img,
      price: price,
      body: p.body_html || p.body,
      tags: p.tags || []
    });
  }

  function loadRcCatalog(){
    if(rcCatalogPromise) return rcCatalogPromise;
    var cfg = shopConfig();
    var handles = cfg.rcProductHandles;
    if(handles && handles.length){
      rcCatalogPromise = Promise.all(handles.map(function(h){
        return fetch('/products/'+encodeURIComponent(h)+'.js', { headers: { Accept: 'application/json' } })
          .then(function(r){ return r.ok ? r.json() : null; })
          .catch(function(){ return null; });
      })).then(function(list){
        return list.filter(Boolean).map(normalizeStoreProduct).filter(isStoreProduct);
      });
      return rcCatalogPromise;
    }
    rcCatalogPromise = fetch('/collections/all/products.json?limit=250', { headers: { Accept: 'application/json' } })
      .then(function(r){ return r.json(); })
      .then(function(data){
        return (data.products || []).map(normalizeStoreProduct).filter(isStoreProduct);
      })
      .catch(function(){ return []; });
    return rcCatalogPromise;
  }

  function rcSuggestFallback(q, queries){
    var scope = String(shopConfig().searchScope || '').toLowerCase();
    if(scope === 'flexora' || scope === 'ks-mp') return Promise.resolve({ products: [], queries: queries || [] });
    if(!RC_SEARCH_HINT.test(q)) return Promise.resolve({ products: [], queries: queries || [] });
    return loadRcCatalog().then(function(catalog){
      var matched = catalog.filter(function(p){ return matchesQuery(p, q); });
      if(!matched.length) matched = catalog;
      return {
        products: matched.slice(0, 8).map(packSearchProduct),
        queries: queries || []
      };
    });
  }

  /** Theme catalog first, then live Shopify products scoped to this store theme. */
  function searchStore(q){
    var ql = String(q || '').trim();
    return ensureThemeCatalogLoaded().then(function(){
      var local = searchThemeCatalog(ql);
      if(local.length){
        return { products: local.slice(0, 12), queries: [] };
      }
      if(!ql) return { products: [], queries: [] };
      if(flexoraScope()){
        return { products: [], queries: [] };
      }
      return fetch(
        '/search/suggest.json?q='+encodeURIComponent(ql)+'&resources[type]=product,query&resources[limit]=8&resources[limit_scope]=each&resources[options][unavailable_products]=last&resources[options][fields]=title,product_type,variants.title,vendor,tag,body',
        { headers: { Accept: 'application/json' } }
      )
        .then(function(r){ return r.json(); })
        .then(function(data){
          var results = ((data || {}).resources || {}).results || {};
          var products = (results.products || [])
            .filter(isStoreProduct)
            .map(packSearchProduct);
          var queries = (results.queries || []).map(function(item){
            return {
              text: item.text || item.styled_text || '',
              url: item.url || searchUrl(item.text || '')
            };
          }).filter(function(item){ return item.text; });
          if(products.length) return { products: products, queries: queries };
          return rcSuggestFallback(ql, queries);
        })
        .catch(function(){
          return rcSuggestFallback(ql, []);
        });
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

  function setHeaderGroupHeight(){
    var group = document.getElementById('header-group');
    if(!group) return;
    var headerEl = group.querySelector('.ks-mp-header');
    var groupHeight = group.offsetHeight;
    if (!groupHeight) {
      groupHeight = 0;
      group.querySelectorAll('.ks-mp-header-offers-section, .ks-mp-header-countdown-section, .ks-mp-header-section').forEach(function (el) {
        groupHeight += el.offsetHeight;
      });
    }
    document.documentElement.style.setProperty('--header-group-height', groupHeight + 'px');
    if(headerEl){
      var barH = headerEl.offsetHeight;
      document.documentElement.style.setProperty('--header-height', barH + 'px');
      document.documentElement.style.setProperty('--ks-mp-header-bar-height', barH + 'px');
    }
  }

  setHeaderGroupHeight();
  function resetBodyScrollLock(){
    var menu = document.querySelector('.smd');
    var cart = document.querySelector('.scd');
    var cartOpen = cart && cart.classList.contains('open');
    var searchRoot = document.querySelector('.ss-search');
    var searchOpen = searchRoot && searchRoot.classList.contains('open');
    var menuOpen = menu && menu.classList.contains('open');
    if(!menuOpen && !cartOpen && !searchOpen) document.body.style.overflow = '';
  }
  function recoverAfterBreakpointChange(){
    document.documentElement.style.height = '';
    document.body.style.height = '';
    var wrap = document.querySelector('.page-wrapper');
    if (wrap) {
      wrap.style.height = '';
      wrap.style.overflow = '';
    }
    resetBodyScrollLock();
    setHeaderGroupHeight();
  }
  window.addEventListener('resize', function(){
    setHeaderGroupHeight();
    resetBodyScrollLock();
  }, {passive:true});
  if (window.matchMedia) {
    var deskQuery = window.matchMedia('(min-width: 990px)');
    if (deskQuery.addEventListener) {
      deskQuery.addEventListener('change', recoverAfterBreakpointChange);
    } else if (deskQuery.addListener) {
      deskQuery.addListener(recoverAfterBreakpointChange);
    }
  }
  if(typeof ResizeObserver !== 'undefined'){
    var headerGroup = document.getElementById('header-group');
    if(headerGroup){
      var headerGroupObserver = new ResizeObserver(setHeaderGroupHeight);
      headerGroupObserver.observe(headerGroup);
    }
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

  function flytekCartFallback(cfg) {
    if (flexoraScope()) {
      return cfg.flexoraCartImage || cfg.flytekCartImage || cfg.lustraCartImage || '';
    }
    return cfg.flytekCartImage || cfg.lustraCartImage || '';
  }

  function isFlexoraCartLine(it){
    if(!it) return false;
    if(lineItemProperty(it, '_catalog_title') || lineItemProperty(it, '_catalog_image')) return true;
    var h = productHandle(it);
    if(flexoraScope() && isFlytekProduct(h)) return true;
    if(isFlytekProduct(h)) return false;
    return isFlexoraProduct({
      handle: h,
      title: it.product_title || it.title,
      vendor: it.vendor,
      type: it.product_type,
      tags: []
    });
  }

  function cartLinesForScope(items){
    if(!flexoraScope()) return items || [];
    return (items || []).filter(isFlexoraCartLine);
  }

  function isLegacyStoreProduct(arg) {
    var h = typeof arg === 'string' ? arg : productHandle(arg);
    h = h || '';
    if(h.indexOf('lustra') !== -1 || h.indexOf('hair-growth') !== -1 || h.indexOf('soft-chews') !== -1 || h.indexOf('sira') !== -1) return true;
    if(h.indexOf('gp-') === 0) return true;
    var p = typeof arg === 'string' ? null : arg;
    if(!p) return false;
    var vendor = String(p.vendor || '').toLowerCase();
    if(vendor.indexOf('girls purse') !== -1 || vendor.indexOf('lustra') !== -1) return true;
    var tags = (p.tags || []).join(' ').toLowerCase();
    if(/\bdemo-purse\b|\bgp-purse\b|\bgp-new-arrival\b/.test(tags)) return true;
    var type = String(p.type || p.product_type || '').toLowerCase();
    if(/handbag|shoulder bag|mini bag|crossbody|tote|clutch|purse/.test(type) && !isFlytekProduct(h)) return true;
    return false;
  }

  function isFlytekProduct(handle) {
    var h = handle || '';
    return h.indexOf('flytek') !== -1 || h.indexOf('rc-drift') !== -1 || h.indexOf('drift-car') !== -1;
  }

  function lineItemProperty(it, key) {
    var props = it && it.properties;
    if (!props) return '';
    if (Array.isArray(props)) {
      for (var i = 0; i < props.length; i++) {
        var row = props[i];
        if (row && row.name === key) return String(row.value != null ? row.value : '');
      }
      return '';
    }
    if (typeof props === 'object') return String(props[key] != null ? props[key] : '');
    return '';
  }

  function lineItemDisplayTitle(it) {
    var catalogTitle = lineItemProperty(it, '_catalog_title');
    if (catalogTitle) return catalogTitle;
    var h = productHandle(it);
    if (flexoraScope() && isFlytekProduct(h)) {
      return 'FLEXORA support gear';
    }
    return it.product_title || it.title || '';
  }

  function lineItemImage(it){
    var catalogImg = lineItemProperty(it, '_catalog_image');
    if (catalogImg) {
      if (String(catalogImg).indexOf('//') === 0) catalogImg = 'https:' + catalogImg;
      return catalogImg;
    }
    var h = productHandle(it);
    var cfg = shopConfig();
    if (flexoraScope() && isFlytekProduct(h)) {
      var flexoraFallback = flytekCartFallback(cfg);
      if (flexoraFallback) return flexoraFallback;
    }
    var img = it.image || '';
    if (typeof img === 'object' && img) img = img.url || img.src || '';
    if (img && String(img).indexOf('//') === 0) img = 'https:' + img;
    if (!img && it.featured_image) {
      img = typeof it.featured_image === 'string' ? it.featured_image : (it.featured_image.url || it.featured_image.src || '');
      if (img && String(img).indexOf('//') === 0) img = 'https:' + img;
    }
    var fallback = flytekCartFallback(cfg);
    if (!img && isLegacyStoreProduct(h) && fallback) {
      img = fallback;
    } else if (!img && isFlytekProduct(h) && fallback) {
      img = fallback;
    }
    return img || '';
  }

  function flexoraPdpCatalogMeta(form) {
    var pdp = (form && form.closest('[data-ft-pdp]')) || document.querySelector('[data-ft-pdp]');
    if (!pdp || !flexoraScope()) return null;
    var isKsMp =
      pdp.getAttribute('data-ft-catalog-family') === 'ks-mp' ||
      !!pdp.querySelector('.ft-pdp-stage--ks-mp');
    if (!isKsMp) return null;
    var titleEl = pdp.querySelector('.ft-pdp-title');
    var title = titleEl && String(titleEl.textContent || '').trim();
    var imgEl =
      pdp.querySelector('#ftPdpMain') ||
      pdp.querySelector('.ft-pdp__main-img') ||
      pdp.querySelector('[data-ft-pdp-main-track] img');
    var image = imgEl && imgEl.src ? String(imgEl.src) : '';
    if (!image) {
      var sticky = pdp.querySelector('[data-ft-sticky-thumb]');
      if (sticky && sticky.src) image = String(sticky.src);
    }
    if (!image) {
      var activeThumb = pdp.querySelector('[data-ft-pdp-thumb].on');
      if (activeThumb) {
        image = activeThumb.getAttribute('data-src') || '';
        if (!image) {
          var timg = activeThumb.querySelector('img');
          if (timg && timg.src) image = String(timg.src);
        }
      }
    }
    return { title: title, image: image };
  }

  function applyFlexoraCatalogProps(form, fd) {
    if (!flexoraScope() || !fd) return fd;
    var meta = flexoraPdpCatalogMeta(form);
    if (meta && meta.title) fd.set('properties[_catalog_title]', meta.title);
    if (meta && meta.image) fd.set('properties[_catalog_image]', meta.image);
    return fd;
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
      '<div class="scd__it-main"><p class="scd__it-t">'+esc(lineItemDisplayTitle(it))+'</p>'+
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
    var allItems = cart.items || [];
    var items = cartLinesForScope(allItems);
    var count = items.reduce(function(n, it){ return n + (it.quantity || 0); }, 0);
    var total = items.reduce(function(n, it){
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

  function catalogAddFormData(variantId, title, image) {
    var fd = new FormData();
    fd.append('id', String(variantId));
    fd.append('quantity', '1');
    fd.append('properties[_catalog_title]', title || 'FLEXORA support');
    if (image) fd.append('properties[_catalog_image]', image);
    return fd;
  }

  function catalogAddFromElement(el) {
    var card = el.closest('.tc-mp-shop-all__card, .ks-mp-bs__card');
    var cfg = shopConfig();
    var variantId = el.getAttribute('data-atc-variant-id') || (card && card.getAttribute('data-atc-variant-id'));
    if (!variantId && cfg.flexoraCatalogVariantId) {
      variantId = String(cfg.flexoraCatalogVariantId);
    }
    if (!variantId) {
      var href = el.getAttribute('href') || '';
      var match = href.match(/[?&]id=(\d+)/);
      if (match) variantId = match[1];
    }
    if (!variantId) return Promise.reject(new Error('Missing variant'));
    var title = el.getAttribute('data-catalog-title') || (card && card.getAttribute('data-catalog-title')) || (card && card.getAttribute('data-card-title')) || 'FLEXORA support';
    var image = el.getAttribute('data-catalog-image') || (card && card.getAttribute('data-catalog-image')) || '';
    var fd = catalogAddFormData(variantId, title, image);
    return fetch('/cart/add.js', {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (err) {
          var msg = (err && (err.description || err.message)) || 'Could not add to cart';
          throw new Error(msg);
        });
      }
      return r.json();
    });
  }

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
    var clearRecent = e.target.closest('[data-ss-clear-recent]');
    if(clearRecent){
      e.preventDefault();
      writeRecentlyViewed([]);
      if(searchResults && !(searchInput && searchInput.value.trim())) renderIdle(searchResults);
      var liveBox = $('.sssr__live');
      var liveInput = $('.sssr__input');
      if(liveBox && liveInput && !liveInput.value.trim()) renderIdle(liveBox);
    }
    var rememberLink = e.target.closest('[data-tc-remember]');
    if(rememberLink){
      rememberViewed({
        id: rememberLink.getAttribute('data-id'),
        title: rememberLink.getAttribute('data-title'),
        image: rememberLink.getAttribute('data-image'),
        asset: rememberLink.getAttribute('data-asset'),
        seed: rememberLink.getAttribute('data-seed'),
        rupees: rememberLink.getAttribute('data-rupees'),
        compareRupees: rememberLink.getAttribute('data-compare-rupees'),
        url: rememberLink.getAttribute('data-url') || rememberLink.getAttribute('href')
      });
    }
    var shopCard = e.target.closest('.tc-mp-shop-all__card');
    if(shopCard && e.target.closest('a[href]') && !e.target.closest('[data-tc-mp-catalog-add], .tc-mp-shop-all__btn--add, .tc-mp-shop-all__cta--grid-two-add, [data-tc-remember]')){
      var cardTitle = shopCard.getAttribute('data-catalog-title') || shopCard.getAttribute('data-card-title') || '';
      if(cardTitle){
        var catalogMatch = themeCatalog().filter(function(p){ return p.title === cardTitle; })[0];
        var cardLink = e.target.closest('a[href]');
        if(catalogMatch){
          rememberViewed(Object.assign({}, catalogMatch, { url: cardLink && cardLink.getAttribute('href') }));
        } else {
          rememberViewed({
            id: shopCard.getAttribute('data-tc-seed') || cardTitle,
            title: cardTitle,
            image: shopCard.getAttribute('data-catalog-image') || '',
            seed: shopCard.getAttribute('data-tc-seed') || '',
            rupees: shopCard.getAttribute('data-card-price') || '',
            url: cardLink && cardLink.getAttribute('href')
          });
        }
      }
    }
    if(e.target.closest('[data-ss-checkout]')){ checkoutSiraOnly(e); }
    var catalogAdd = e.target.closest('[data-tc-mp-catalog-add]');
    if (catalogAdd) {
      e.preventDefault();
      if (catalogAdd.disabled) return;
      catalogAddFromElement(catalogAdd)
        .then(function () { return refreshCart(); })
        .then(openCart)
        .catch(function () {});
      return;
    }
    var catalogAddLink = e.target.closest('a.tc-mp-shop-all__btn--add, a.tc-mp-shop-all__cta--grid-two-add');
    if (catalogAddLink && catalogAddLink.closest('.tc-mp-shop-all')) {
      e.preventDefault();
      catalogAddFromElement(catalogAddLink)
        .then(function () { return refreshCart(); })
        .then(openCart)
        .catch(function () {});
    }
    var goBtn = e.target.closest('.ss-search.open .ss-search__go');
    if(goBtn){
      e.preventDefault();
      var q = searchInput && searchInput.value.trim();
      if(q) window.location.href = searchUrl(q);
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
  function openSearch(){
    if(!searchRoot) return;
    searchRoot.classList.add('open');
    document.body.style.overflow='hidden';
    if(searchResults && !(searchInput && searchInput.value.trim())) renderIdle(searchResults);
    setTimeout(function(){ if(searchInput) searchInput.focus(); }, 50);
  }
  function closeSearch(){ if(searchRoot){ searchRoot.classList.remove('open'); document.body.style.overflow=''; } }
  window.ssOpenSearch = openSearch;

  function rememberAttrs(p){
    return ' data-tc-remember="1" data-id="'+esc(p.id||'')+'" data-title="'+esc(p.title||'')+'" data-image="'+esc(p.image||'')+'" data-asset="'+esc(p.asset||'')+'" data-seed="'+esc(p.seed||'')+'" data-rupees="'+esc(p.rupees||'')+'" data-compare-rupees="'+esc(p.compareRupees||'')+'" data-url="'+esc(p.url||'')+'"';
  }

  function priceHtml(p){
    var now = p.price || formatPrice(p) || '';
    var was = p.compare || '';
    if(was && now){
      return '<span class="ss-search__price"><s class="ss-search__was">'+esc(was)+'</s> <span class="ss-search__now">'+esc(now)+'</span></span>';
    }
    return now ? '<span class="ss-search__price"><span class="ss-search__now">'+esc(now)+'</span></span>' : '';
  }

  function productRow(p){
    var img = p.image || '';
    var url = p.url || (p.handle ? '/products/'+p.handle : '/search');
    var desc = plainText(p.subtitle || p.tag || '');
    if(desc.length > 72) desc = desc.slice(0, 69) + '…';
    return '<a class="ss-search__item" href="'+esc(url)+'"'+rememberAttrs(p)+'>'+
      (img?'<img class="ss-search__thumb" src="'+esc(img)+'" alt="">':'<span class="ss-search__thumb"></span>')+
      '<div class="ss-search__meta">'+
        '<strong class="ss-search__title">'+esc(p.title||'')+'</strong>'+
        (desc ? '<p class="ss-search__desc">'+esc(desc)+'</p>' : '')+
        priceHtml(p)+
      '</div></a>';
  }

  function productCard(p){
    var img = p.image || '';
    var url = p.url || '/search';
    return '<a class="ss-search__card" href="'+esc(url)+'"'+rememberAttrs(p)+'>'+
      (img?'<img src="'+esc(img)+'" alt="'+esc(p.title||'')+'">':'<span class="ss-search__card-ph" aria-hidden="true"></span>')+
      '<span class="ss-search__card-title">'+esc(p.title||'')+'</span>'+
      priceHtml(p)+
    '</a>';
  }

  function renderIdle(box){
    if(!box) return;
    ensureThemeCatalogLoaded().then(function(){
      var recent = readRecentlyViewed();
      var html = '';
      if(recent.length){
        html += '<div class="ss-search__section ss-search__rv">';
        html += '<div class="ss-search__section-head"><h3>Recently viewed</h3><button type="button" class="ss-search__clear" data-ss-clear-recent>CLEAR</button></div>';
        html += '<div class="ss-search__cards">'+ recent.map(productCard).join('') +'</div>';
        html += '</div>';
      }
      var featured = searchThemeCatalog('').slice(0, 8);
      if(featured.length){
        html += '<div class="ss-search__section">';
        html += '<div class="ss-search__section-head"><h3>Products</h3></div>';
        html += '<div class="ss-search__cards">'+ featured.map(productCard).join('') +'</div>';
        html += '</div>';
      }
      box.innerHTML = html;
      box.hidden = !html;
    });
  }

  function renderSuggest(payload, into){
    var box = into || searchResults;
    if(!box) return;
    var products = (payload && payload.products) ? payload.products : (payload || []);
    var queries = (payload && payload.queries) ? payload.queries : [];
    if(!Array.isArray(products)) products = [];

    if(!products.length && !queries.length){
      box.innerHTML = flexoraScope()
        ? '<div class="ss-search__empty">No FLEXORA products found. Try knee, wrist, ankle, or brace.</div>'
        : '<div class="ss-search__empty">No RC products found. Try ridge, drift, crawler, or FLYTEK.</div>';
      box.hidden = false;
      return;
    }

    var html = '';
    if(queries.length){
      html += '<div class="ss-search__queries" role="list">';
      queries.forEach(function(item){
        var href = item.url || searchUrl(item.text);
        html += '<a class="ss-search__query" role="listitem" href="'+esc(href)+'">'+esc(item.text)+'</a>';
      });
      html += '</div>';
    }
    html += '<div class="ss-search__section"><div class="ss-search__section-head"><h3>Products</h3></div>';
    html += products.map(productRow).join('');
    html += '</div>';
    box.innerHTML = html;
    box.hidden = false;
  }

  function bindLiveSearch(input, box){
    if(!input || !box) return;
    var timer = null;
    function run(){
      var q = input.value.trim();
      if(q.length<1){ renderIdle(box); return; }
      searchStore(q).then(function(list){ renderSuggest(list, box); }).catch(function(){
        box.innerHTML = '<div class="ss-search__empty">No results found for this search. Try another word.</div>';
        box.hidden = false;
      });
    }
    input.addEventListener('input', function(){
      clearTimeout(timer);
      timer = setTimeout(run, 80);
    });
    input.addEventListener('focus', function(){
      if(!input.value.trim()) renderIdle(box);
      else if(!box.innerHTML) run();
    });
    input.addEventListener('keydown', function(e){
      if(e.key==='Escape'){
        if(searchRoot && searchRoot.contains(input)) closeSearch();
        else { box.innerHTML=''; box.hidden = true; }
      }
      if(e.key==='Enter' && searchRoot && searchRoot.contains(input)){
        e.preventDefault();
        var q = input.value.trim();
        if(q) window.location.href = searchUrl(q);
      }
    });
    if(input.value.trim().length>=1) setTimeout(run, 0);
    else if(searchRoot && searchRoot.contains(input)) setTimeout(function(){ renderIdle(box); }, 0);
  }

  bindLiveSearch(searchInput, searchResults);
  bindLiveSearch($('.sssr__input'), $('.sssr__live'));

  function fillCatalogSearchPage(){
    var mount = document.getElementById('tcMpCatalogSearchMount');
    if(!mount) return;
    var q = mount.getAttribute('data-q') || '';
    if(!q){
      mount.hidden = true;
      return;
    }
    var matches = searchThemeCatalog(q);
    if(!matches.length){
      mount.hidden = true;
      return;
    }
    mount.hidden = false;
    mount.innerHTML = matches.map(function(p){
      return '<article class="tc-mp-shop-all__card" role="listitem" data-card-title="'+esc(p.title)+'" data-tc-seed="'+esc(p.seed||'')+'" data-catalog-title="'+esc(p.title)+'" data-catalog-image="'+esc(p.image||'')+'">'+
        '<a class="tc-mp-shop-all__media-link" href="'+esc(p.url)+'"'+rememberAttrs(p)+'>'+
        '<div class="tc-mp-shop-all__media">'+(p.image?'<img class="tc-mp-shop-all__card-img" src="'+esc(p.image)+'" alt="'+esc(p.title)+'" width="800" height="800">':'')+'</div></a>'+
        '<div class="tc-mp-shop-all__body"><h2 class="tc-mp-shop-all__name"><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2>'+
        (p.subtitle?'<p class="tc-mp-shop-all__meta tc-mp-shop-all__grid-only">'+esc(p.subtitle)+'</p>':'')+
        '<p class="tc-mp-shop-all__price tc-mp-shop-all__grid-only">'+priceHtml(p)+'</p></div></article>';
    }).join('');
    var empty = document.querySelector('.tc-mp-search__empty');
    if(empty) empty.hidden = true;
    var shopifyGrid = document.getElementById('tcMpShopifySearchGrid');
    if(shopifyGrid) shopifyGrid.hidden = true;
    var countEl = document.querySelector('.tc-mp-shop-all__sub');
    if(countEl) countEl.textContent = matches.length + ' results for “' + q + '”';
  }
  fillCatalogSearchPage();
  rememberCurrentPdp();

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

  function isTorqvoltAtcForm(form) {
    if (!form || form.tagName !== 'FORM') return false;
    if (form.getAttribute('data-ss-atc-form')) return true;
    if (form.classList && form.classList.contains('ft-pdp-form')) return true;
    if (form.id === 'ftPdpForm') return true;
    if (form.closest && form.closest('[data-ft-pdp]')) return true;
    var action = form.getAttribute('action') || '';
    return action.indexOf('/cart/add') !== -1 && document.querySelector('[data-ft-pdp]');
  }

  /* add to cart from product forms */
  document.addEventListener('submit', function(e){
    var form = e.target.closest('[data-ss-atc-form]') || e.target.closest('#ss-buy form.shopify-product-form') || e.target.closest('#ss-buy form');
    if (!form && isTorqvoltAtcForm(e.target)) form = e.target;
    if (!form && e.target.closest) form = e.target.closest('form.ft-pdp-form, form#ftPdpForm');
    if(!form) return;
    e.preventDefault();
    if (form.getAttribute('data-ss-atc-busy') === '1') return;
    form.setAttribute('data-ss-atc-busy', '1');
    var fd = new FormData(form);
    applyFlexoraCatalogProps(form, fd);
    var submitBtns = Array.prototype.slice.call(form.querySelectorAll('[type="submit"]'));
    if (form.id) {
      Array.prototype.forEach.call(document.querySelectorAll('[type="submit"][form="' + form.id + '"]'), function (btn) {
        if (submitBtns.indexOf(btn) === -1) submitBtns.push(btn);
      });
    }
    var submitBtn = submitBtns[0] || null;
    submitBtns.forEach(function (btn) { btn.disabled = true; });
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
      .then(function(){ return refreshCart(); })
      .then(openCart)
      .catch(function(err){
        if(submitBtn){
          var prev = submitBtn.textContent;
          submitBtn.textContent = err && err.message ? String(err.message).slice(0, 48) : 'Try again';
          setTimeout(function(){ submitBtn.textContent = prev; }, 2500);
        } else {
          form.submit();
        }
      })
      .finally(function(){
        form.removeAttribute('data-ss-atc-busy');
        submitBtns.forEach(function (btn) { btn.disabled = false; });
      });
  }, true);

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href*="track-order"], a[href*="track-your-order"], a[data-ss-track]');
    if(!a) return;
    try { sessionStorage.setItem('ssWantTrack','1'); } catch (err) {}
  });

  ensureThemeCatalogLoaded().then(refreshCart);

  window.ssRevScroll = function(dir){
    var g = document.getElementById('ssRevGrid');
    if(!g) return;
    g.scrollBy({left: dir * (g.clientWidth * 0.8), behavior:'smooth'});
  };
})();
