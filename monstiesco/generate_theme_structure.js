const fs = require('fs');
const path = require('path');

// 1. layout/theme.liquid
const themeLiquid = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#100f0d">
    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>

    <title>{{ page_title }} - {{ shop.name }}</title>
    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    {{ 'base.css' | asset_url | stylesheet_tag }}
  </head>
  <body class="gradient" style="background:#100f0d; color:#ffffff; margin:0; padding:0; font-family:'Poppins',sans-serif;">
    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>
  </body>
</html>`;
fs.writeFileSync('layout/theme.liquid', themeLiquid);

// 2. templates/index.json
const indexJson = {
  "sections": {
    "monsties_main": {
      "type": "monsties-landing",
      "settings": {
        "product_title": "Monsties Onesie",
        "product_price": "$51.00",
        "compare_price": "$69.00"
      }
    }
  },
  "order": [
    "monsties_main"
  ]
};
fs.writeFileSync('templates/index.json', JSON.stringify(indexJson, null, 2));

// 3. templates/product.json
const productJson = {
  "sections": {
    "monsties_main": {
      "type": "monsties-landing",
      "settings": {
        "product_title": "Monsties Onesie",
        "product_price": "$51.00",
        "compare_price": "$69.00"
      }
    }
  },
  "order": [
    "monsties_main"
  ]
};
fs.writeFileSync('templates/product.json', JSON.stringify(productJson, null, 2));

// 4. config/settings_schema.json
const settingsSchema = [
  {
    "name": "theme_info",
    "theme_name": "Monsties Pro Theme",
    "theme_version": "1.0.0",
    "theme_author": "Monsties Co",
    "theme_documentation_url": "https://monstiesco.com",
    "theme_support_url": "https://monstiesco.com"
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "color",
        "id": "background_color",
        "label": "Background Color",
        "default": "#100f0d"
      },
      {
        "type": "color",
        "id": "accent_color",
        "label": "Accent Color",
        "default": "#00ff66"
      }
    ]
  }
];
fs.writeFileSync('config/settings_schema.json', JSON.stringify(settingsSchema, null, 2));

// 5. config/settings_data.json
const settingsData = {
  "current": {
    "background_color": "#100f0d",
    "accent_color": "#00ff66"
  }
};
fs.writeFileSync('config/settings_data.json', JSON.stringify(settingsData, null, 2));

// 6. locales/en.default.json
const localeEn = {
  "general": {
    "accessibility": {
      "skip_to_content": "Skip to content",
      "close": "Close"
    }
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "buy_now": "Buy it now",
      "sold_out": "Sold out",
      "on_sale": "Sale",
      "regular_price": "Regular price"
    }
  }
};
fs.writeFileSync('locales/en.default.json', JSON.stringify(localeEn, null, 2));

console.log('Generated theme structure successfully!');
