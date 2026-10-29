// scripts/upload-fixed-header.js
const updatedHeaderLiquid = `{% liquid
  assign primary_menu = section.settings.menu
  assign brand_wordmark = section.settings.wordmark | default: 'Pookie Wear'
  assign account_url = routes.account_login_url
  if customer
    assign account_url = routes.account_url
  endif
%}

<header class="site-header" data-site-header>
  <div class="site-header__inner">
    <details class="site-header__mobile-menu">
      <summary class="site-header__control" data-menu-toggle data-disclosure-toggle aria-controls="mobile-menu-drawer" aria-expanded="false">
        {% render 'icon', name: 'menu' %}
        <span class="visually-hidden">{{ 'accessibility.menu' | t }}</span>
      </summary>
      <div id="mobile-menu-drawer" class="site-header__drawer" data-menu-drawer>
        <nav aria-label="{{ 'accessibility.menu' | t | escape }}">
          <ul class="site-header__drawer-list">
            {% if primary_menu != blank %}
              {% for link in primary_menu.links %}
                <li><a href="{{ link.url | escape }}">{{ link.title | escape }}</a></li>
              {% endfor %}
            {% else %}
              <li><a href="{{ routes.root_url | escape }}">Home</a></li>
              <li><a href="/pages/contact">Contact</a></li>
            {% endif %}
            <li class="site-header__mobile-account"><a href="{{ account_url | escape }}">{{ 'customer.account' | t }}</a></li>
          </ul>
        </nav>
      </div>
    </details>

    <nav class="site-header__desktop-nav" aria-label="{{ 'accessibility.menu' | t | escape }}">
      <ul>
        {% if primary_menu != blank %}
          {% for link in primary_menu.links %}
            <li><a href="{{ link.url | escape }}">{{ link.title | escape }}</a></li>
          {% endfor %}
        {% else %}
          <li><a class="{% if request.path == routes.root_url %}is-active{% endif %}" href="{{ routes.root_url | escape }}">Home</a></li>
          <li><a class="{% if request.path contains '/pages/contact' %}is-active{% endif %}" href="/pages/contact">Contact</a></li>
        {% endif %}
      </ul>
    </nav>

    <a class="site-header__wordmark" href="{{ routes.root_url | escape }}" data-wordmark style="display: flex; align-items: center; justify-content: center;">
      {% if section.settings.logo != blank %}
        {{ section.settings.logo | image_url: width: 330 | image_tag: alt: brand_wordmark, loading: 'eager', widths: '110, 130, 220, 260, 330', sizes: '(max-width: 749px) 130px, 110px' }}
      {% else %}
        <img src="{{ 'pookie-logo.png' | asset_url }}" alt="Pookie Wear" width="160" height="52" style="max-height: 52px; width: auto; object-fit: contain; display: block;" loading="eager">
      {% endif %}
    </a>

    <div class="site-header__actions">
      <details class="site-header__search">
        <summary class="site-header__control" data-search-toggle data-disclosure-toggle aria-controls="search-drawer" aria-expanded="false">
          {% render 'icon', name: 'search' %}
          <span class="visually-hidden">{{ 'actions.search' | t }}</span>
        </summary>
        <div id="search-drawer" class="site-header__drawer site-header__drawer--search" data-search-drawer>
          <form action="{{ routes.search_url | escape }}" method="get" role="search">
            <label for="header-search-input">{{ 'actions.search' | t }}</label>
            <input id="header-search-input" type="search" name="q" value="{{ search.terms | escape }}" placeholder="{{ 'actions.search' | t | escape }}">
            <button type="submit">{{ 'actions.submit' | t }}</button>
          </form>
        </div>
      </details>

      <a class="site-header__control" href="{{ account_url | escape }}" data-account-link aria-label="{{ 'customer.account' | t | escape }}">
        {% render 'icon', name: 'account' %}
        <span class="visually-hidden">{{ 'customer.account' | t }}</span>
      </a>

      <button class="site-header__control site-header__cart-toggle" type="button" data-cart-toggle data-dialog-open aria-controls="cart-drawer" aria-expanded="false" aria-label="{{ 'cart.title' | t | escape }}">
        {% render 'icon', name: 'cart' %}
        <span class="site-header__cart-count" data-cart-count>{{ cart.item_count }}</span>
      </button>
    </div>
  </div>
  {% render 'cart-drawer', cart: cart, id: 'cart-drawer' %}
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    { "type": "image_picker", "id": "logo", "label": "Logo" },
    { "type": "text", "id": "wordmark", "label": "Wordmark", "default": "Pookie Wear" },
    { "type": "link_list", "id": "menu", "label": "Navigation menu" }
  ],
  "presets": [{ "name": "Header" }]
}
{% endschema %}
`;

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) return;

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = async () => {
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        const onMsg = e => {
          const d = JSON.parse(e.data);
          if (d.id === curId) {
            ws.removeEventListener('message', onMsg);
            res(d);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Runtime.enable');
    process.stdout.write('Uploading fixed sections/header.liquid... ');
    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const m = document.documentElement.innerHTML.match(/"csrfToken":"([^"]+)"/);
          const csrf = m ? m[1] : '';
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrf,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              asset: {
                key: 'sections/header.liquid',
                value: ${JSON.stringify(updatedHeaderLiquid)}
              }
            })
          });
          const data = await r.json();
          return { status: r.status, data };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    const st = evalRes.result?.result?.value?.status;
    if (st === 200) {
      console.log('OK (200) ✅');
    } else {
      console.log('FAILED ❌', JSON.stringify(evalRes.result?.result?.value));
    }
    ws.close();
  };
}

main().catch(console.error);
