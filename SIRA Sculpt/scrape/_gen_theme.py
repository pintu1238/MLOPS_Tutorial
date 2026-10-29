# -*- coding: utf-8 -*-
import os, json, textwrap

ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\theme"
SEC = os.path.join(ROOT, "sections")
SNIP = os.path.join(ROOT, "snippets")
TPL = os.path.join(ROOT, "templates")
AST = os.path.join(ROOT, "assets")
EXT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt\scrape\extracted"

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", os.path.relpath(path, ROOT), len(content))

SCHEMA_END = """
{% schema %}
{
  "name": "%s",
  "tag": "section",
  "class": "%s",
  "settings": [],
  "presets": [{ "name": "%s" }]
}
{% endschema %}
"""

def schema(name, cls=None):
    cls = cls or name.lower().replace(" ", "-")
    return SCHEMA_END % (name, cls, name)

# ---------- JS ----------
w(os.path.join(AST, "ss-core.js"), r"""
(function(){
  function $(s, r){ return (r||document).querySelector(s); }
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function money(cents){
    try { return (window.Shopify && Shopify.formatMoney) ? Shopify.formatMoney(cents) : ('$'+(cents/100).toFixed(2)); }
    catch(e){ return '$'+(cents/100).toFixed(2); }
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
      '<div class="scd__it-main"><p class="scd__it-t">'+it.product_title+'</p>'+
      (it.variant_title && it.variant_title!=='Default Title' ? '<div class="scd__it-v">'+it.variant_title+'</div>' : '')+
      '<div class="scd__qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button><span>'+it.quantity+'</span><button type="button" data-qty="1" aria-label="Increase">+</button></div></div>'+
      '<div class="scd__it-pr"><span class="now">'+price+'</span>'+was+'</div>'+
      '<button class="scd__it-rm" type="button" data-remove aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5h6v2m-8 0l1 12h8l1-12"/></svg></button></div>';
  }

  function renderCart(cart){
    if(!cartRoot) return;
    setCount(cart.item_count||0);
    var body = $('.scd__body', cartRoot);
    var empty = $('.scd__empty', cartRoot);
    var foot = $('.scd__foot', cartRoot);
    if(!cart.items || !cart.items.length){
      if(body) body.innerHTML = '';
      if(empty) empty.style.display='block';
      if(foot) foot.style.display='none';
      return;
    }
    if(empty) empty.style.display='none';
    if(foot) foot.style.display='block';
    if(body) body.innerHTML = cart.items.map(itemHtml).join('');
    var tot = $('[data-ss-cart-total]', cartRoot);
    if(tot) tot.textContent = money(cart.total_price||0);
    var bar = $('.scd__ship-bar span', cartRoot);
    var msg = $('.scd__ship-msg', cartRoot);
    var thresh = 7500;
    var left = Math.max(0, thresh - (cart.total_price||0));
    if(bar) bar.style.width = Math.min(100, ((cart.total_price||0)/thresh)*100) + '%';
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

  document.addEventListener('click', function(e){
    if(e.target.closest('[data-ss-open-cart]')){ e.preventDefault(); refreshCart().then(openCart); }
    if(e.target.closest('[data-ss-close-cart]')){ e.preventDefault(); closeCart(); }
    if(e.target.closest('[data-ss-open-search]')){ e.preventDefault(); openSearch(); }
    if(e.target.closest('[data-ss-close-search]')){ e.preventDefault(); closeSearch(); }
    if(e.target.closest('[data-ss-open-menu]')){ e.preventDefault(); var d=$('.smd'); if(d) d.classList.add('open'); document.body.style.overflow='hidden'; }
    if(e.target.closest('[data-ss-close-menu]')){ e.preventDefault(); var d=$('.smd'); if(d) d.classList.remove('open'); document.body.style.overflow=''; }
    var qtyBtn = e.target.closest('.scd__qty button');
    if(qtyBtn){
      var row = qtyBtn.closest('.scd__it');
      var span = row.querySelector('.scd__qty span');
      var q = parseInt(span.textContent,10) + parseInt(qtyBtn.getAttribute('data-qty'),10);
      changeQty(row.getAttribute('data-key'), Math.max(0,q));
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
  var t = null;
  function openSearch(){ if(searchRoot){ searchRoot.classList.add('open'); document.body.style.overflow='hidden'; setTimeout(function(){ if(searchInput) searchInput.focus(); }, 50);} }
  function closeSearch(){ if(searchRoot){ searchRoot.classList.remove('open'); document.body.style.overflow=''; } }
  window.ssOpenSearch = openSearch;

  function renderSuggest(data){
    if(!searchResults) return;
    var products = (((data||{}).resources||{}).results||{}).products || [];
    if(!products.length){
      searchResults.innerHTML = '<div class="ss-search__empty">No products found. Try another search.</div>';
      return;
    }
    searchResults.innerHTML = products.map(function(p){
      var img = p.image || '';
      var url = p.url || ('/products/'+p.handle);
      var price = p.price || '';
      return '<a class="ss-search__item" href="'+url+'">'+
        (img?'<img src="'+img+'" alt="">':'')+
        '<div><strong>'+p.title+'</strong><span>'+price+'</span></div></a>';
    }).join('');
  }

  if(searchInput){
    searchInput.addEventListener('input', function(){
      var q = searchInput.value.trim();
      clearTimeout(t);
      if(q.length<2){ if(searchResults) searchResults.innerHTML=''; return; }
      t = setTimeout(function(){
        var url = '/search/suggest.json?q='+encodeURIComponent(q)+'&resources[type]=product&resources[limit]=8&resources[options][unavailable_products]=last';
        fetch(url, {headers:{'Accept':'application/json'}}).then(function(r){return r.json();}).then(renderSuggest).catch(function(){});
      }, 180);
    });
    searchInput.addEventListener('keydown', function(e){
      if(e.key==='Escape') closeSearch();
      if(e.key==='Enter'){
        var q = searchInput.value.trim();
        if(q) window.location.href = '/search?q='+encodeURIComponent(q)+'&type=product';
      }
    });
  }

  /* add to cart from product forms */
  document.addEventListener('submit', function(e){
    var form = e.target.closest('[data-ss-atc-form]');
    if(!form) return;
    e.preventDefault();
    var fd = new FormData(form);
    fetch('/cart/add.js', {method:'POST', body: fd, headers:{'Accept':'application/json'}})
      .then(function(r){ if(!r.ok) throw r; return r.json(); })
      .then(function(){ return refreshCart(); })
      .then(openCart)
      .catch(function(){ form.submit(); });
  });

  refreshCart();

  window.ssRevScroll = function(dir){
    var g = document.getElementById('ssRevGrid');
    if(!g) return;
    g.scrollBy({left: dir * (g.clientWidth * 0.8), behavior:'smooth'});
  };
})();
""")

# ---------- HEADER ----------
w(os.path.join(SEC, "ss-header.liquid"), r"""
<link rel="stylesheet" href="{{ 'ss-core.css' | asset_url }}" media="all">
<script src="{{ 'ss-core.js' | asset_url }}" defer></script>

<header class="ss-hdr" data-sticky>
  <div class="ss-hdr__bar">
    <button class="ss-hdr__burger" type="button" data-ss-open-menu aria-label="Menu">
      <svg viewBox="0 0 18 16" fill="none"><path d="M1 .5h16M1 8h16M1 15.5h16" stroke="currentColor" stroke-width="1.4"/></svg>
    </button>
    <nav class="ss-hdr__nav" aria-label="Main">
      <a href="/" {% if request.page_type == 'index' %}aria-current="page"{% endif %}>Home</a>
      <a href="/collections/best-sellers" {% if collection.handle == 'best-sellers' %}aria-current="page"{% endif %}>Shop</a>
      <a href="/pages/track-order" {% if page.handle == 'track-order' %}aria-current="page"{% endif %}>Track Your Order</a>
      <a href="/pages/contact" {% if page.handle == 'contact' %}aria-current="page"{% endif %}>Contact Us</a>
    </nav>
    <a class="ss-hdr__logo" href="/" aria-label="Sira Sculpt">
      <img src="{{ 'ss_logo_header2.png' | asset_url }}" alt="SIRA SCULPT" width="160" height="51">
    </a>
    <div class="ss-hdr__icons">
      <button class="ss-hdr__icon" type="button" data-ss-open-search aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </button>
      <a class="ss-hdr__icon" href="{{ routes.account_login_url }}" aria-label="Log in">
        <svg viewBox="0 0 18 19" fill="currentColor"><path fill-rule="evenodd" d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z"/></svg>
      </a>
      <a class="ss-hdr__icon ss-hdr__icon--cart" href="{{ routes.cart_url }}" data-ss-open-cart aria-label="Cart" role="button">
        <svg viewBox="0 0 36.52 45.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="M12.88,10.4H41.23l2.5,27.78a5,5,0,0,1-5,5.47H15.25a5,5,0,0,1-5-5.49Z" transform="translate(-8.73 -0.14)"/><path d="M19.62,15.51V9.1a7.46,7.46,0,0,1,14.92,0v6.41" transform="translate(-8.73 -0.14)"/></svg>
        <span class="ss-hdr__count" data-ss-cart-count>0</span>
      </a>
    </div>
  </div>
</header>

<div class="ss-search" role="dialog" aria-label="Search">
  <div class="ss-search__overlay" data-ss-close-search></div>
  <div class="ss-search__panel">
    <div class="ss-search__row">
      <input class="ss-search__input" type="search" placeholder="Search" aria-label="Search">
      <button class="ss-search__go" type="button" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </button>
      <button class="ss-search__x" type="button" data-ss-close-search aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 18 17"><path d="M1 1l16 15M17 1L1 16" stroke="currentColor" stroke-width="1.6"/></svg>
      </button>
    </div>
    <div class="ss-search__results"></div>
  </div>
</div>

<div class="smd" role="dialog" aria-label="Menu">
  <div class="smd__overlay" data-ss-close-menu></div>
  <div class="smd__panel">
    <div class="smd__head">
      <div class="smd__title">Menu</div>
      <button class="smd__x" type="button" data-ss-close-menu aria-label="Close">✕</button>
    </div>
    <div class="smd__body">
      <div class="smd__label">Shop</div>
      <a class="smd__prod" href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">
        <span class="smd__thumb"><img src="{{ 'ss_hero_leggings.png' | asset_url }}" alt=""></span>
        <span class="smd__pname">3D Lipedema Leggings</span><span class="smd__chev">›</span>
      </a>
      <a class="smd__prod" href="/products/sira-sculpt-anti-chafing-3d-shorts">
        <span class="smd__thumb"><img src="{{ 'ss_prod_shorts.png' | asset_url }}" alt=""></span>
        <span class="smd__pname">Anti-Chafing Shorts</span><span class="smd__chev">›</span>
      </a>
      <a class="smd__prod" href="/products/sira-anti-cellulite-oil">
        <span class="smd__thumb"><img src="{{ 'ss_prod_oil.png' | asset_url }}" alt=""></span>
        <span class="smd__pname">Anti-Cellulite Oil</span><span class="smd__chev">›</span>
      </a>
      <a class="smd__prod" href="/products/sira-sculpt-3d-sculpting-sleeves">
        <span class="smd__thumb"><img src="{{ 'ss_prod_sleeve.png' | asset_url }}" alt=""></span>
        <span class="smd__pname">3D Sculpting Sleeves</span><span class="smd__chev">›</span>
      </a>
      <div class="smd__label">Pages</div>
      <a class="smd__link" href="/"><span class="smd__ltxt">Home</span><span class="smd__chev">›</span></a>
      <a class="smd__link" href="/collections/best-sellers"><span class="smd__ltxt">Shop</span><span class="smd__chev">›</span></a>
      <a class="smd__link" href="/pages/track-order"><span class="smd__ltxt">Track Your Order</span><span class="smd__chev">›</span></a>
      <a class="smd__link" href="/pages/contact"><span class="smd__ltxt">Contact Us</span><span class="smd__chev">›</span></a>
      <a class="smd__link" href="{{ routes.account_login_url }}"><span class="smd__ltxt">Log in</span><span class="smd__chev">›</span></a>
    </div>
  </div>
</div>

<style>
  .ss-hdr--hide{transform:translateY(-100%);transition:transform .28s ease;}
  .ss-hdr{transition:transform .28s ease;}
</style>
""" + schema("Sira Header", "ss-header-section"))

# ---------- CART ----------
w(os.path.join(SEC, "ss-cart-drawer.liquid"), r"""
<div class="scd" role="dialog" aria-label="Cart">
  <div class="scd__overlay" data-ss-close-cart></div>
  <div class="scd__panel">
    <div class="scd__head">
      <div class="scd__title">Your bag <b data-ss-cart-count></b></div>
      <button class="scd__x" type="button" data-ss-close-cart aria-label="Close">×</button>
    </div>
    <div class="scd__ship">
      <div class="scd__ship-msg">Add items to unlock free shipping</div>
      <div class="scd__ship-bar"><span></span></div>
    </div>
    <div class="scd__body"></div>
    <div class="scd__empty" style="display:none">
      <h3>Your bag is empty</h3>
      <p>The sculpting essentials are waiting.</p>
      <a class="scd__checkout" href="/collections/best-sellers"><span>Shop Sira Sculpt</span></a>
    </div>
    <div class="scd__foot" style="display:none">
      <div class="scd__deal">
        <div class="scd__deal-row"><span>Subtotal</span><span data-ss-cart-total></span></div>
      </div>
      <a class="scd__checkout" href="/checkout"><span>Checkout</span></a>
      <button class="scd__cont" type="button" data-ss-close-cart>Continue shopping</button>
    </div>
  </div>
</div>
""" + schema("Sira Cart Drawer", "ss-cart-section"))

# ---------- FOOTER ----------
w(os.path.join(SEC, "ss-footer.liquid"), r"""
<footer class="sfoot" role="contentinfo">
  <div class="sfoot__wrap sfoot__main">
    <div class="sfoot__brand">
      <a href="/" class="sfoot__logo-link">
        <img class="sfoot__logo-img" src="{{ 'ss_logo_footer2.png' | asset_url }}" alt="Sira Sculpt" width="250" loading="lazy">
      </a>
      <p class="sfoot__tag">3D sculpting leggings that smooth, lift and hold you in, no creams, no routines, just wear them.</p>
      <div class="sfoot__social"></div>
    </div>
    <nav class="sfoot__cols" aria-label="Footer">
      <div class="sfoot__col">
        <h3 class="sfoot__col-h">The Good Stuff</h3>
        <ul>
          <li><a href="/products/sirasculpt-3d-lipedema-leggings-drain-lighten">3D Lipedema Leggings</a></li>
          <li><a href="/products/sira-sculpt-anti-chafing-3d-shorts">Anti-Chafing Shorts</a></li>
          <li><a href="/products/sira-anti-cellulite-oil">Anti-Cellulite Oil</a></li>
          <li><a href="/products/sira-sculpt-3d-sculpting-sleeves">3D Sculpting Sleeves</a></li>
        </ul>
      </div>
      <div class="sfoot__col">
        <h3 class="sfoot__col-h">The Nitty-Gritty</h3>
        <ul>
          <li><a href="/policies/shipping-policy">Shipping</a></li>
          <li><a href="/policies/refund-policy">Returns & Refunds</a></li>
          <li><a href="/pages/4d-compression-leggings">More About 4D Leggings</a></li>
        </ul>
      </div>
    </nav>
    <div class="sfoot__news">
      <h3 class="sfoot__col-h">Join the Sira Sculpt list</h3>
      <p class="sfoot__news-sub">First dibs on drops, offers and restocks. No spam, ever.</p>
      {% form 'customer', class: 'sfoot__form' %}
        <input type="hidden" name="contact[tags]" value="newsletter">
        <div class="sfoot__field">
          <input type="email" name="contact[email]" required placeholder="your@email.com" aria-label="Email" class="sfoot__input">
          <button type="submit" class="sfoot__sub">Join</button>
        </div>
      {% endform %}
    </div>
  </div>
  <div class="sfoot__wrap sfoot__legal">
    <p class="sfoot__fp-text"></p>
    <div class="sfoot__pay" aria-label="Accepted payment methods">
      {% render 'ss-payment-icons' %}
    </div>
  </div>
  <div class="sfoot__bar">
    <div class="sfoot__wrap sfoot__bar-inner">
      <p class="sfoot__copy">&copy; {{ 'now' | date: '%Y' }} Sira Sculpt. Sculpted the easy way.</p>
      <ul class="sfoot__policies">
        <li><a href="/policies/privacy-policy">Privacy</a></li>
        <li><a href="/policies/refund-policy">Refunds</a></li>
        <li><a href="/policies/terms-of-service">Terms</a></li>
        <li><a href="/policies/shipping-policy">Shipping</a></li>
        <li><a href="/pages/data-sharing-opt-out">Your Privacy Choices</a></li>
      </ul>
    </div>
  </div>
</footer>
""" + schema("Sira Footer", "ss-footer-section"))

print("core chrome done")
print("ok")
