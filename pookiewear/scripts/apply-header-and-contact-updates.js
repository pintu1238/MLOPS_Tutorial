// scripts/apply-header-and-contact-updates.js
const fs = require('fs');

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
      {% if section.settings.logo != blank and section.settings.logo contains 'schicht' == false %}
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

const updatedHeaderGroupJson = JSON.stringify({
  type: "header",
  name: "Header group",
  sections: {
    header: {
      type: "header",
      settings: {}
    }
  },
  order: [
    "header"
  ]
}, null, 2);

const updatedContactLiquid = `{% if page.handle == 'contact' or section.settings.render_on_all_pages %}
  <section class="contact-form pookie-contact-section" data-section-id="{{ section.id }}">
    <div class="contact-form__panel">
      {% if section.settings.eyebrow != blank %}<p class="contact-form__eyebrow">{{ section.settings.eyebrow }}</p>{% endif %}
      <h1 class="pookie-contact-title">{{ section.settings.heading | default: 'Get in touch' }}</h1>
      {% if section.settings.body != blank %}<p class="pookie-contact-desc">{{ section.settings.body }}</p>{% endif %}
      {% capture contact_form_id %}ContactForm-{{ section.id }}{% endcapture %}
      {% form 'contact', id: contact_form_id %}
        {% render 'form-status', form: form, success_message: 'forms.success' %}
        <div class="contact-form__fields">
          <div class="contact-field-wrap">
            <label class="visually-hidden" for="ContactName-{{ section.id }}">{{ section.settings.name_label | default: 'Name' | escape }}</label>
            <input id="ContactName-{{ section.id }}" type="text" name="contact[name]" autocomplete="name" placeholder="{{ section.settings.name_label | default: 'Name' | escape }}" required>
          </div>
          <div class="contact-field-wrap">
            <label class="visually-hidden" for="ContactEmail-{{ section.id }}">{{ section.settings.email_label | default: 'Email' | escape }}</label>
            <input id="ContactEmail-{{ section.id }}" type="email" name="contact[email]" autocomplete="email" placeholder="{{ section.settings.email_label | default: 'Email' | escape }} *" required>
          </div>
          <div class="contact-form__wide contact-field-wrap">
            <label class="visually-hidden" for="ContactPhone-{{ section.id }}">Phone number</label>
            <input id="ContactPhone-{{ section.id }}" type="tel" name="contact[phone]" autocomplete="tel" placeholder="Phone number">
          </div>
          <div class="contact-form__wide contact-field-wrap">
            <label class="visually-hidden" for="ContactMessage-{{ section.id }}">{{ section.settings.message_label | default: 'Comment' | escape }}</label>
            <textarea id="ContactMessage-{{ section.id }}" name="contact[body]" rows="8" placeholder="{{ section.settings.message_label | default: 'Comment' | escape }}" required></textarea>
          </div>
        </div>
        <button type="submit" class="pookie-contact-submit">{{ section.settings.submit_label | default: 'Send' | escape }}</button>
      {% endform %}
    </div>
  </section>
{% endif %}

{% stylesheet %}
  .pookie-contact-section {
    font-family: 'Poppins', sans-serif;
    max-width: 740px !important;
    margin: 0 auto !important;
    padding: 48px 20px 80px !important;
  }
  .pookie-contact-section .contact-form__panel {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
  .pookie-contact-title {
    font-family: 'Poppins', sans-serif !important;
    text-align: center !important;
    margin: 0 0 36px !important;
    font-size: 36px !important;
    line-height: 1.25 !important;
    font-weight: 700 !important;
    color: #1a1a1a !important;
  }
  .pookie-contact-desc {
    text-align: center;
    color: #666;
    margin: -20px 0 30px;
    font-size: 15px;
  }
  .pookie-contact-section .contact-form__fields {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 16px !important;
    margin-bottom: 20px;
  }
  .pookie-contact-section .contact-form__wide {
    grid-column: 1 / -1 !important;
  }
  .pookie-contact-section input,
  .pookie-contact-section textarea {
    width: 100% !important;
    border: 1px solid #dcdcdc !important;
    border-radius: 8px !important;
    padding: 14px 18px !important;
    font-size: 15px !important;
    font-family: 'Poppins', sans-serif !important;
    background-color: #ffffff !important;
    color: #1a1a1a !important;
    box-sizing: border-box !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
  }
  .pookie-contact-section input:focus,
  .pookie-contact-section textarea:focus {
    border-color: #bc7c3e !important;
    box-shadow: 0 0 0 3px rgba(188, 124, 62, 0.15) !important;
    outline: none !important;
  }
  .pookie-contact-submit {
    width: 100% !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 16px 32px !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    letter-spacing: 0.5px !important;
    background: #000000 !important;
    color: #ffffff !important;
    cursor: pointer !important;
    transition: background 0.2s ease, transform 0.1s ease !important;
    display: block !important;
  }
  .pookie-contact-submit:hover {
    background: #bc7c3e !important;
  }
  .pookie-contact-submit:active {
    transform: scale(0.99);
  }
  @media(max-width: 600px) {
    .pookie-contact-section {
      padding: 30px 16px 60px !important;
    }
    .pookie-contact-title {
      font-size: 28px !important;
      margin-bottom: 24px !important;
    }
    .pookie-contact-section .contact-form__fields {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Contact form",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Get in touch" },
    { "type": "textarea", "id": "body", "label": "Body" },
    { "type": "text", "id": "name_label", "label": "Name label", "default": "Name" },
    { "type": "text", "id": "email_label", "label": "Email label", "default": "Email" },
    { "type": "text", "id": "message_label", "label": "Message label", "default": "Comment" },
    { "type": "text", "id": "submit_label", "label": "Submit label", "default": "Send" },
    { "type": "text", "id": "success_message", "label": "Success message", "default": "Thanks. Your message is on its way." },
    { "type": "checkbox", "id": "render_on_all_pages", "label": "Render on every page", "default": false }
  ],
  "presets": [{ "name": "Contact form" }]
}
{% endschema %}
`;

const updatedPageContactJson = JSON.stringify({
  sections: {
    top_bar: {
      type: "pookie-top-bar",
      settings: {}
    },
    contact: {
      type: "contact-form",
      settings: {
        heading: "Get in touch",
        eyebrow: "",
        body: "",
        name_label: "Name",
        email_label: "Email",
        message_label: "Comment",
        submit_label: "Send",
        render_on_all_pages: true
      }
    }
  },
  order: [
    "top_bar",
    "contact"
  ]
}, null, 2);

const files = [
  { key: 'sections/header.liquid', value: updatedHeaderLiquid },
  { key: 'sections/header-group.json', value: updatedHeaderGroupJson },
  { key: 'sections/contact-form.liquid', value: updatedContactLiquid },
  { key: 'templates/page.contact.json', value: updatedPageContactJson }
];

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

    for (const f of files) {
      process.stdout.write(`Updating ${f.key}... `);
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
                  key: ${JSON.stringify(f.key)},
                  value: ${JSON.stringify(f.value)}
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
    }

    ws.close();
  };
}

main().catch(console.error);
