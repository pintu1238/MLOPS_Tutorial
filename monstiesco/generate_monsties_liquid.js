const fs = require('fs');

const liquid = `{% comment %}
  Monsties Landing Page Section
  Store: y9yn6k-me | Theme ID: 154211713093
  Faithful replica of https://monstiesco.com/products/monsties
{% endcomment %}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<style>
  :root {
    --mn-bg: #100f0d;
    --mn-bg-card: #181715;
    --mn-bg-alt: #1c1b18;
    --mn-text: #ffffff;
    --mn-text-muted: #9e9c98;
    --mn-accent: #00ff66;
    --mn-accent-glow: rgba(0, 255, 102, 0.35);
    --mn-primary-btn: #ffffff;
    --mn-primary-btn-text: #000000;
    --mn-border: rgba(255, 255, 255, 0.12);
    --mn-border-focus: #00ff66;
    --mn-star: #ffcc00;
    --mn-radius: 12px;
    --mn-font: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .monsties-wrapper * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: var(--mn-font);
  }

  .monsties-wrapper {
    background-color: var(--mn-bg);
    color: var(--mn-text);
    overflow-x: hidden;
    line-height: 1.5;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }

  .monsties-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* TICKER ANNOUNCEMENT */
  .mn-ticker-wrap {
    background: #000000;
    border-bottom: 1px solid var(--mn-border);
    overflow: hidden;
    white-space: nowrap;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .mn-ticker-move {
    display: inline-flex;
    animation: mnTickerAnim 24s linear infinite;
  }
  .mn-ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0 32px;
    color: #fff;
  }
  @keyframes mnTickerAnim {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* HEADER */
  .mn-header {
    background: rgba(16, 15, 13, 0.95);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--mn-border);
  }
  .mn-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
  }
  .mn-nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
  }
  .mn-nav-links a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    transition: color 0.2s;
  }
  .mn-nav-links a:hover {
    color: var(--mn-accent);
  }
  .mn-logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mn-logo img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }
  .mn-header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .mn-icon-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
  }
  .mn-cart-count {
    position: absolute;
    top: -2px;
    right: -4px;
    background: var(--mn-accent);
    color: #000;
    font-size: 11px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* PRODUCT HERO */
  .mn-hero {
    padding: 40px 0 60px;
  }
  .mn-hero-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 48px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .mn-hero-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  /* GALLERY */
  .mn-gallery {
    position: sticky;
    top: 90px;
  }
  .mn-main-image-wrap {
    position: relative;
    background: #000;
    border-radius: 16px;
    border: 1px solid var(--mn-border);
    overflow: hidden;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mn-main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.25s ease;
  }
  .mn-thumb-carousel {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: thin;
  }
  .mn-thumb-carousel::-webkit-scrollbar {
    height: 4px;
  }
  .mn-thumb-carousel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  .mn-thumb {
    flex: 0 0 76px;
    height: 76px;
    border-radius: 10px;
    border: 2px solid transparent;
    cursor: pointer;
    overflow: hidden;
    background: #000;
    opacity: 0.65;
    transition: all 0.2s ease;
  }
  .mn-thumb.active {
    border-color: var(--mn-accent);
    opacity: 1;
    box-shadow: 0 0 10px var(--mn-accent-glow);
  }
  .mn-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* PRODUCT DETAILS */
  .mn-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .mn-urgency-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    width: fit-content;
  }
  .mn-rating-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .mn-stars {
    color: var(--mn-star);
    letter-spacing: 2px;
    font-size: 16px;
  }
  .mn-rating-text {
    color: #e5e5e5;
    font-weight: 500;
  }
  .mn-title {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #fff;
  }
  @media (max-width: 600px) {
    .mn-title {
      font-size: 28px;
    }
  }
  .mn-price-box {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-top: 4px;
  }
  .mn-price {
    font-size: 30px;
    font-weight: 700;
    color: #fff;
  }
  .mn-compare-price {
    font-size: 20px;
    color: var(--mn-text-muted);
    text-decoration: line-through;
  }
  .mn-sale-pill {
    background: #eb001b;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* SWATCHES */
  .mn-option-label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mn-option-label span.selected-value {
    color: var(--mn-accent);
    font-weight: 700;
  }
  .mn-color-swatches {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .mn-color-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px 6px 6px;
    background: var(--mn-bg-card);
    border: 2px solid var(--mn-border);
    border-radius: 30px;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .mn-color-btn img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  .mn-color-btn:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }
  .mn-color-btn.active {
    border-color: var(--mn-accent);
    background: rgba(0, 255, 102, 0.08);
    box-shadow: 0 0 12px var(--mn-accent-glow);
  }

  /* SIZES */
  .mn-size-pills {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .mn-size-btn {
    min-width: 48px;
    height: 44px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mn-bg-card);
    border: 1.5px solid var(--mn-border);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .mn-size-btn:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
  .mn-size-btn.active {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  .mn-size-guide-link {
    color: var(--mn-text-muted);
    font-size: 13px;
    text-decoration: underline;
    cursor: pointer;
  }
  .mn-size-guide-link:hover {
    color: #fff;
  }

  /* QUANTITY & ACTIONS */
  .mn-actions {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 10px;
  }
  .mn-qty-row {
    display: flex;
    gap: 14px;
  }
  .mn-qty-picker {
    display: inline-flex;
    align-items: center;
    background: var(--mn-bg-card);
    border: 1.5px solid var(--mn-border);
    border-radius: 8px;
    height: 52px;
  }
  .mn-qty-btn {
    width: 44px;
    height: 100%;
    background: none;
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mn-qty-val {
    width: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
  }
  .mn-btn-atc {
    flex: 1;
    height: 52px;
    background: #ffffff;
    color: #000000;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  }
  .mn-btn-atc:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(255, 255, 255, 0.35);
  }
  .mn-btn-buy {
    width: 100%;
    height: 52px;
    background: var(--mn-accent);
    color: #000000;
    font-size: 16px;
    font-weight: 800;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 20px var(--mn-accent-glow);
  }
  .mn-btn-buy:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(0, 255, 102, 0.5);
  }

  /* BULLET POINTS */
  .mn-bullets {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--mn-bg-card);
    border: 1px solid var(--mn-border);
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 10px;
  }
  .mn-bullet-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 600;
  }
  .mn-bullet-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  /* MICRO REVIEWS */
  .mn-micro-reviews {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 10px;
  }
  .mn-micro-quote {
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid var(--mn-accent);
    padding: 12px 16px;
    border-radius: 0 8px 8px 0;
    font-size: 13.5px;
    color: #d1d1d1;
    font-style: italic;
  }
  .mn-micro-author {
    font-weight: 700;
    color: #fff;
    margin-top: 6px;
    font-style: normal;
    font-size: 13px;
  }

  /* ACCORDIONS / GUARANTEES */
  .mn-accordions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    border-top: 1px solid var(--mn-border);
    padding-top: 16px;
  }
  .mn-acc-item {
    border: 1px solid var(--mn-border);
    background: var(--mn-bg-card);
    border-radius: 10px;
    overflow: hidden;
  }
  .mn-acc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    user-select: none;
    font-weight: 600;
    font-size: 15px;
  }
  .mn-acc-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mn-acc-title .material-symbols-outlined {
    font-size: 20px;
    color: var(--mn-accent);
  }
  .mn-acc-arrow {
    transition: transform 0.25s ease;
  }
  .mn-acc-item.open .mn-acc-arrow {
    transform: rotate(180deg);
  }
  .mn-acc-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 20px;
    color: var(--mn-text-muted);
    font-size: 14px;
    line-height: 1.6;
  }
  .mn-acc-item.open .mn-acc-content {
    max-height: 200px;
    padding: 0 20px 16px;
  }

  /* SECTION TITLES */
  .mn-section-heading {
    text-align: center;
    font-size: 34px;
    font-weight: 800;
    margin-bottom: 36px;
    letter-spacing: -0.01em;
  }
  @media (max-width: 600px) {
    .mn-section-heading {
      font-size: 26px;
      margin-bottom: 24px;
    }
  }

  /* FACEBOOK COMMUNITY */
  .mn-facebook-section {
    padding: 60px 0;
    background: #0d0c0a;
    border-top: 1px solid var(--mn-border);
    border-bottom: 1px solid var(--mn-border);
  }
  .mn-fb-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 900px) {
    .mn-fb-grid {
      grid-template-columns: 1fr;
    }
  }
  .mn-fb-card {
    background: #181715;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .mn-fb-top {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }
  .mn-fb-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .mn-fb-user-info {
    flex: 1;
  }
  .mn-fb-user-name {
    font-weight: 700;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #fff;
  }
  .mn-fb-badge {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
  .mn-fb-time {
    font-size: 12px;
    color: var(--mn-text-muted);
  }
  .mn-fb-text {
    padding: 0 16px 14px;
    font-size: 14.5px;
    color: #e5e5e5;
    line-height: 1.45;
  }
  .mn-fb-image-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #000;
    overflow: hidden;
  }
  .mn-fb-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mn-fb-stats {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    color: var(--mn-text-muted);
  }
  .mn-fb-stats span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .mn-fb-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px 16px;
  }
  .mn-fb-act-btn {
    background: none;
    border: none;
    color: #bbb;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;
  }
  .mn-fb-act-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  /* LOGO TICKER */
  .mn-logo-ticker {
    padding: 30px 0;
    background: #100f0d;
    overflow: hidden;
    white-space: nowrap;
  }
  .mn-logo-ticker-track {
    display: inline-flex;
    align-items: center;
    gap: 60px;
    animation: mnLogoScroll 20s linear infinite;
  }
  .mn-logo-ticker-item img {
    height: 38px;
    width: auto;
    object-fit: contain;
    filter: brightness(0.9) grayscale(0.2);
    opacity: 0.8;
  }
  @keyframes mnLogoScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* FEATURES SHOWCASE GRID */
  .mn-features-section {
    padding: 70px 0;
  }
  .mn-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
  @media (max-width: 768px) {
    .mn-features-grid {
      grid-template-columns: 1fr;
    }
  }
  .mn-feat-card {
    background: var(--mn-bg-card);
    border: 1px solid var(--mn-border);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .mn-feat-media {
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #000;
  }
  .mn-feat-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .mn-feat-card:hover .mn-feat-media img {
    transform: scale(1.03);
  }
  .mn-feat-content {
    padding: 24px;
  }
  .mn-feat-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
  }
  .mn-feat-desc {
    font-size: 14.5px;
    color: var(--mn-text-muted);
    line-height: 1.6;
  }

  /* FAQ ACCORDION */
  .mn-faq-section {
    padding: 70px 0;
    background: #0d0c0a;
    border-top: 1px solid var(--mn-border);
    border-bottom: 1px solid var(--mn-border);
  }
  .mn-faq-wrapper {
    max-width: 820px;
    margin: 0 auto;
  }
  .mn-faq-subtitle {
    text-align: center;
    color: var(--mn-accent);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .mn-faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .mn-faq-item {
    background: #181715;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
  }
  .mn-faq-q {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    user-select: none;
  }
  .mn-faq-q-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .mn-faq-q-left .material-symbols-outlined {
    font-size: 22px;
    color: var(--mn-accent);
  }
  .mn-faq-chevron {
    transition: transform 0.25s ease;
  }
  .mn-faq-item.open .mn-faq-chevron {
    transform: rotate(180deg);
  }
  .mn-faq-ans {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 24px;
    font-size: 15px;
    color: #cfcecb;
    line-height: 1.6;
  }
  .mn-faq-item.open .mn-faq-ans {
    max-height: 250px;
    padding: 0 24px 20px;
  }

  /* WHAT FANS SAY */
  .mn-fans-section {
    padding: 70px 0;
  }
  .mn-fans-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media (max-width: 900px) {
    .mn-fans-grid {
      grid-template-columns: 1fr;
    }
  }
  .mn-fan-card {
    background: var(--mn-bg-card);
    border: 1px solid var(--mn-border);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .mn-fan-media {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: #000;
  }
  .mn-fan-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mn-fan-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }
  .mn-fan-stars {
    color: var(--mn-star);
    font-size: 16px;
    letter-spacing: 2px;
  }
  .mn-fan-headline {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }
  .mn-fan-text {
    font-size: 14.5px;
    color: #cfcecb;
    line-height: 1.55;
    flex: 1;
  }
  .mn-fan-author-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .mn-fan-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
  .mn-fan-name {
    font-weight: 700;
    font-size: 14px;
    color: #fff;
  }

  /* STICKY ATC MOBILE BAR */
  .mn-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(16, 15, 13, 0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--mn-border);
    padding: 12px 20px;
    display: none;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  }
  .mn-sticky-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mn-sticky-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
  }
  .mn-sticky-title {
    font-weight: 700;
    font-size: 14px;
    color: #fff;
  }
  .mn-sticky-price {
    font-size: 13px;
    color: var(--mn-accent);
    font-weight: 600;
  }
  .mn-sticky-btn {
    background: #ffffff;
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .mn-sticky-bar.visible {
      display: flex;
    }
  }

  /* SIZE GUIDE MODAL */
  .mn-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .mn-modal-backdrop.open {
    display: flex;
  }
  .mn-modal-box {
    background: #181715;
    border: 1px solid var(--mn-border);
    border-radius: 16px;
    max-width: 600px;
    width: 100%;
    position: relative;
    padding: 24px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .mn-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
  .mn-modal-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  .mn-modal-img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  /* FOOTER */
  .mn-footer {
    background: #000000;
    border-top: 1px solid var(--mn-border);
    padding: 50px 0 30px;
    color: var(--mn-text-muted);
  }
  .mn-footer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
  }
  .mn-footer-logo img {
    height: 42px;
    width: auto;
  }
  .mn-payments-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .mn-payments-row svg {
    height: 24px;
    width: 38px;
    border-radius: 3px;
  }
  .mn-footer-copy {
    font-size: 13px;
    color: #777;
  }
  .mn-footer-copy a {
    color: #999;
    text-decoration: none;
  }
  .mn-footer-copy a:hover {
    color: #fff;
  }
</style>

<div class="monsties-wrapper" id="MonstiesSection-{{ section.id }}">

  <!-- 1. ANNOUNCEMENT TICKER -->
  <div class="mn-ticker-wrap">
    <div class="mn-ticker-move">
      <div class="mn-ticker-item">🌎 Free Worldwide Shipping 🌎</div>
      <div class="mn-ticker-item">🚨 70% SALE ENDS SOON 🚨</div>
      <div class="mn-ticker-item">🛡️ FREE 30 DAY WARRANTY 🛡️</div>
      <div class="mn-ticker-item">🌎 Free Worldwide Shipping 🌎</div>
      <div class="mn-ticker-item">🚨 70% SALE ENDS SOON 🚨</div>
      <div class="mn-ticker-item">🛡️ FREE 30 DAY WARRANTY 🛡️</div>
      <div class="mn-ticker-item">🌎 Free Worldwide Shipping 🌎</div>
      <div class="mn-ticker-item">🚨 70% SALE ENDS SOON 🚨</div>
      <div class="mn-ticker-item">🛡️ FREE 30 DAY WARRANTY 🛡️</div>
      <div class="mn-ticker-item">🌎 Free Worldwide Shipping 🌎</div>
      <div class="mn-ticker-item">🚨 70% SALE ENDS SOON 🚨</div>
      <div class="mn-ticker-item">🛡️ FREE 30 DAY WARRANTY 🛡️</div>
    </div>
  </div>

  <!-- 2. HEADER -->
  <header class="mn-header">
    <div class="monsties-container mn-header-inner">
      <ul class="mn-nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/collections/all">Catalog</a></li>
        <li><a href="/pages/contact">Contact</a></li>
      </ul>

      <a href="/" class="mn-logo">
        <img src="{{ 'dz.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/dz.webp?v=1790661848' }}" alt="MONSTIES" width="180">
      </a>

      <div class="mn-header-actions">
        <a href="/account/login" class="mn-icon-btn" aria-label="Account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </a>
        <a href="/cart" class="mn-icon-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span class="mn-cart-count" id="headerCartCount">{{ cart.item_count | default: 0 }}</span>
        </a>
      </div>
    </div>
  </header>

  <!-- 3. MAIN PRODUCT SECTION -->
  <section class="mn-hero">
    <div class="monsties-container mn-hero-grid">

      <!-- LEFT: GALLERY -->
      <div class="mn-gallery">
        <div class="mn-main-image-wrap">
          <img
            id="mnMainDisplayImage"
            class="mn-main-image"
            src="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}"
            alt="Monsties Onesie"
          >
        </div>

        <div class="mn-thumb-carousel" id="mnThumbList">
          <div class="mn-thumb active" data-src="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}" data-variant="White Ultra">
            <img src="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}" alt="White Ultra">
          </div>
          <div class="mn-thumb" data-src="{{ 'ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png?v=1790663080' }}" data-variant="Original Green">
            <img src="{{ 'ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png?v=1790663080' }}" alt="Original Green">
          </div>
          <div class="mn-thumb" data-src="{{ 'image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png?v=1790663091' }}" data-variant="Mango Loco">
            <img src="{{ 'image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png?v=1790663091' }}" alt="Mango Loco">
          </div>
          <div class="mn-thumb" data-src="{{ 's_5bdabf45-0b29-4461-9e69-ad3ac385969c.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/s_5bdabf45-0b29-4461-9e69-ad3ac385969c.png?v=1790663094' }}" data-variant="Pipeline Punch">
            <img src="{{ 's_5bdabf45-0b29-4461-9e69-ad3ac385969c.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/s_5bdabf45-0b29-4461-9e69-ad3ac385969c.png?v=1790663094' }}" alt="Pipeline Punch">
          </div>
          <div class="mn-thumb" data-src="{{ 'Codex_Image_9_Sept_2026_19_10_57.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_57.png?v=1790663138' }}">
            <img src="{{ 'Codex_Image_9_Sept_2026_19_10_57.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_57.png?v=1790663138' }}" alt="Canister Packaging">
          </div>
          <div class="mn-thumb" data-src="{{ 'Codex_Image_9_Sept_2026_19_11_02_bc214296-aa87-4991-b16e-1a7e70eb0860.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_11_02_bc214296-aa87-4991-b16e-1a7e70eb0860.png?v=1790663134' }}">
            <img src="{{ 'Codex_Image_9_Sept_2026_19_11_02_bc214296-aa87-4991-b16e-1a7e70eb0860.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_11_02_bc214296-aa87-4991-b16e-1a7e70eb0860.png?v=1790663134' }}" alt="Print Lifestyle">
          </div>
          <div class="mn-thumb" data-src="{{ 'monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png?v=1790663139' }}">
            <img src="{{ 'monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png?v=1790663139' }}" alt="Size Guide">
          </div>
        </div>
      </div>

      <!-- RIGHT: PRODUCT OPTIONS & BUY BOX -->
      <div class="mn-details">
        <div class="mn-urgency-badge">
          <span>🔥</span> 200+ orders in the last 24h
        </div>

        <div class="mn-rating-row">
          <span class="mn-stars">★★★★★</span>
          <span class="mn-rating-text">Excellent 4.9 | 150+ Reviews</span>
        </div>

        <h1 class="mn-title">{{ section.settings.product_title | default: 'Monsties Onesie' }}</h1>

        <div class="mn-price-box">
          <span class="mn-price" id="mnDisplayPrice">$51.00</span>
          <span class="mn-compare-price">$69.00</span>
          <span class="mn-sale-pill">SAVE $18.00</span>
        </div>

        <!-- COLOR SELECTOR -->
        <div>
          <div class="mn-option-label">
            Color: <span class="selected-value" id="mnSelectedColorText">White Ultra</span>
          </div>
          <div class="mn-color-swatches" id="mnColorList">
            <button type="button" class="mn-color-btn active" data-color="White Ultra" data-img="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}">
              <img src="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}" alt="White">
              White Ultra
            </button>
            <button type="button" class="mn-color-btn" data-color="Original Green" data-img="{{ 'ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png?v=1790663080' }}">
              <img src="{{ 'ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/ssa_9a39dd59-39e2-41cc-9f4a-da75428407e8.png?v=1790663080' }}" alt="Green">
              Original Green
            </button>
            <button type="button" class="mn-color-btn" data-color="Mango Loco" data-img="{{ 'image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png?v=1790663091' }}">
              <img src="{{ 'image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/image_f5ec7093-3fc6-46b2-a764-0d8c4b381fc0.png?v=1790663091' }}" alt="Mango">
              Mango Loco
            </button>
            <button type="button" class="mn-color-btn" data-color="Pipeline Punch" data-img="{{ 's_5bdabf45-0b29-4461-9e69-ad3ac385969c.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/s_5bdabf45-0b29-4461-9e69-ad3ac385969c.png?v=1790663094' }}">
              <img src="{{ 's_5bdabf45-0b29-4461-9e69-ad3ac385969c.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/s_5bdabf45-0b29-4461-9e69-ad3ac385969c.png?v=1790663094' }}" alt="Pipeline">
              Pipeline Punch
            </button>
          </div>
        </div>

        <!-- SIZE SELECTOR -->
        <div>
          <div class="mn-option-label">
            <span>Size: <span class="selected-value" id="mnSelectedSizeText">M</span></span>
            <span class="mn-size-guide-link" id="mnOpenSizeModal">Size Guide</span>
          </div>
          <div class="mn-size-pills" id="mnSizeList">
            <button type="button" class="mn-size-btn" data-size="XS">XS</button>
            <button type="button" class="mn-size-btn" data-size="S">S</button>
            <button type="button" class="mn-size-btn active" data-size="M">M</button>
            <button type="button" class="mn-size-btn" data-size="L">L</button>
            <button type="button" class="mn-size-btn" data-size="XL">XL</button>
            <button type="button" class="mn-size-btn" data-size="2XL">2XL</button>
            <button type="button" class="mn-size-btn" data-size="3XL">3XL</button>
          </div>
        </div>

        <!-- QUANTITY & CTA BUTTONS -->
        <div class="mn-actions">
          <div class="mn-qty-row">
            <div class="mn-qty-picker">
              <button type="button" class="mn-qty-btn" id="mnQtyMinus">-</button>
              <div class="mn-qty-val" id="mnQtyVal">1</div>
              <button type="button" class="mn-qty-btn" id="mnQtyPlus">+</button>
            </div>
            <button type="button" class="mn-btn-atc" id="mnAddToCartBtn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              ADD TO CART
            </button>
          </div>
          <button type="button" class="mn-btn-buy" id="mnBuyNowBtn">
            BUY IT NOW - $51.00
          </button>
        </div>

        <!-- HIGHLIGHT BULLETS -->
        <div class="mn-bullets">
          <div class="mn-bullet-item">
            <span class="mn-bullet-icon">⚡</span>
            <span>Every Claw Detail Where It Should Be</span>
          </div>
          <div class="mn-bullet-item">
            <span class="mn-bullet-icon">🪶</span>
            <span>Griffin Print Chest to Back</span>
          </div>
          <div class="mn-bullet-item">
            <span class="mn-bullet-icon">🫳</span>
            <span>Pull Ring Canister, Not a Boring Box</span>
          </div>
        </div>

        <!-- MICRO TESTIMONIAL QUOTES -->
        <div class="mn-micro-reviews">
          <div class="mn-micro-quote">
            "honestly didn't expect much but the sherpa is so thick?? the griffin print on the chest is way cleaner in person than the pictures. my boyfriend keeps stealing it."
            <div class="mn-micro-author">— Cara</div>
          </div>
          <div class="mn-micro-quote">
            "the canister thing is so sick. my mate opened it thinking it was an actual drink and the onesie just shot out. worth it for that alone honestly but the onesie itself is proper cosy too."
            <div class="mn-micro-author">— Mia</div>
          </div>
          <div class="mn-micro-quote">
            "ok I was skeptical about white but it doesn't look cheap at all. the vine detail down the legs is really nice and the zip isn't flimsy like other ones I've bought. living in this now."
            <div class="mn-micro-author">— Jake</div>
          </div>
        </div>

        <!-- ACCORDIONS / GUARANTEES -->
        <div class="mn-accordions">
          <div class="mn-acc-item open">
            <div class="mn-acc-header">
              <div class="mn-acc-title">
                <span class="material-symbols-outlined">verified_user</span>
                <span>30-day Money Back Guarantee</span>
              </div>
              <span class="mn-acc-arrow">▼</span>
            </div>
            <div class="mn-acc-content">
              Not what you expected? No stress. Send it back within 30 days of delivery and we'll refund you in full. No questions, no hassle.
            </div>
          </div>

          <div class="mn-acc-item">
            <div class="mn-acc-header">
              <div class="mn-acc-title">
                <span class="material-symbols-outlined">local_shipping</span>
                <span>Shipping Timeframe</span>
              </div>
              <span class="mn-acc-arrow">▼</span>
            </div>
            <div class="mn-acc-content">
              Most orders are processed and shipped within 4 to 7 business days. Because we're a small team and every onesie is inspected before it leaves us, it can take up to 25 days.<br><br>
              Once shipped, delivery is 6 to 10 business days and you'll get a tracking number straight to your inbox.
            </div>
          </div>

          <div class="mn-acc-item">
            <div class="mn-acc-header">
              <div class="mn-acc-title">
                <span class="material-symbols-outlined">redeem</span>
                <span>Ordering as a Gift?</span>
              </div>
              <span class="mn-acc-arrow">▼</span>
            </div>
            <div class="mn-acc-content">
              We can ship direct to whoever you're gifting. Just enter their address at checkout.<br><br>
              If it's for a birthday or special occasion, give yourself at least 3 weeks lead time just to be safe.
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- 4. FACEBOOK COMMUNITY TESTIMONIALS -->
  <section class="mn-facebook-section">
    <div class="monsties-container">
      <h2 class="mn-section-heading">Love from Our Facebook Community 🫶</h2>

      <div class="mn-fb-grid">
        <!-- Post 1: Megan T. -->
        <div class="mn-fb-card">
          <div class="mn-fb-top">
            <img class="mn-fb-avatar" src="{{ 'Screenshot_2026-09-28_at_18.01.34.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.01.34.png?v=1790614901' }}" alt="Megan T.">
            <div class="mn-fb-user-info">
              <div class="mn-fb-user-name">
                Megan T.
                <svg class="mn-fb-badge" viewBox="0 0 122.88 116.87"><polygon fill="#0866FF" points="61.37 8.24 80.43 0 90.88 17.79 111.15 22.32 109.15 42.85 122.88 58.43 109.2 73.87 111.15 94.55 91 99 80.43 116.87 61.51 108.62 42.45 116.87 32 99.08 11.73 94.55 13.73 74.01 0 58.43 13.68 42.99 11.73 22.32 31.88 17.87 42.45 0 61.37 8.24 61.37 8.24"/><path fill="#fff" d="M37.92,65c-6.07-6.53,3.25-16.26,10-10.1,2.38,2.17,5.84,5.34,8.24,7.49L74.66,39.66C81.1,33,91.27,42.78,84.91,49.48L61.67,77.2a7.13,7.13,0,0,1-9.9.44C47.83,73.89,42.05,68.5,37.92,65Z"/></svg>
              </div>
              <div class="mn-fb-time">2d ago</div>
            </div>
          </div>
          <div class="mn-fb-text">
            facetimed my friend the second I put it on. she ordered one before we hung up lol
          </div>
          <div class="mn-fb-image-wrap">
            <img src="{{ 'fb1.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fb1.webp?v=1790614887' }}" alt="Megan wearing Monsties" loading="lazy">
          </div>
          <div class="mn-fb-stats">
            <span>👍❤️ 412</span>
            <span>26 Comments</span>
          </div>
          <div class="mn-fb-actions">
            <button class="mn-fb-act-btn">👍 Like</button>
            <button class="mn-fb-act-btn">💬 Comment</button>
            <button class="mn-fb-act-btn">↗️ Share</button>
          </div>
        </div>

        <!-- Post 2: Josh A. -->
        <div class="mn-fb-card">
          <div class="mn-fb-top">
            <img class="mn-fb-avatar" src="{{ 'Screenshot_2026-09-28_at_18.01.47.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.01.47.png?v=1790614914' }}" alt="Josh A.">
            <div class="mn-fb-user-info">
              <div class="mn-fb-user-name">
                Josh A.
                <svg class="mn-fb-badge" viewBox="0 0 122.88 116.87"><polygon fill="#0866FF" points="61.37 8.24 80.43 0 90.88 17.79 111.15 22.32 109.15 42.85 122.88 58.43 109.2 73.87 111.15 94.55 91 99 80.43 116.87 61.51 108.62 42.45 116.87 32 99.08 11.73 94.55 13.73 74.01 0 58.43 13.68 42.99 11.73 22.32 31.88 17.87 42.45 0 61.37 8.24 61.37 8.24"/><path fill="#fff" d="M37.92,65c-6.07-6.53,3.25-16.26,10-10.1,2.38,2.17,5.84,5.34,8.24,7.49L74.66,39.66C81.1,33,91.27,42.78,84.91,49.48L61.67,77.2a7.13,7.13,0,0,1-9.9.44C47.83,73.89,42.05,68.5,37.92,65Z"/></svg>
              </div>
              <div class="mn-fb-time">4d ago</div>
            </div>
          </div>
          <div class="mn-fb-text">
            wore it to asda. three people stopped me. no regrets
          </div>
          <div class="mn-fb-image-wrap">
            <img src="{{ 'fb2.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fb2.webp?v=1790614923' }}" alt="Josh wearing Monsties" loading="lazy">
          </div>
          <div class="mn-fb-stats">
            <span>👍🔥 638</span>
            <span>47 Comments</span>
          </div>
          <div class="mn-fb-actions">
            <button class="mn-fb-act-btn">👍 Like</button>
            <button class="mn-fb-act-btn">💬 Comment</button>
            <button class="mn-fb-act-btn">↗️ Share</button>
          </div>
        </div>

        <!-- Post 3: Ethan W. -->
        <div class="mn-fb-card">
          <div class="mn-fb-top">
            <img class="mn-fb-avatar" src="{{ 'Screenshot_2026-09-28_at_18.02.12.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.02.12.png?v=1790614940' }}" alt="Ethan W.">
            <div class="mn-fb-user-info">
              <div class="mn-fb-user-name">
                Ethan W.
                <svg class="mn-fb-badge" viewBox="0 0 122.88 116.87"><polygon fill="#0866FF" points="61.37 8.24 80.43 0 90.88 17.79 111.15 22.32 109.15 42.85 122.88 58.43 109.2 73.87 111.15 94.55 91 99 80.43 116.87 61.51 108.62 42.45 116.87 32 99.08 11.73 94.55 13.73 74.01 0 58.43 13.68 42.99 11.73 22.32 31.88 17.87 42.45 0 61.37 8.24 61.37 8.24"/><path fill="#fff" d="M37.92,65c-6.07-6.53,3.25-16.26,10-10.1,2.38,2.17,5.84,5.34,8.24,7.49L74.66,39.66C81.1,33,91.27,42.78,84.91,49.48L61.67,77.2a7.13,7.13,0,0,1-9.9.44C47.83,73.89,42.05,68.5,37.92,65Z"/></svg>
              </div>
              <div class="mn-fb-time">1w ago</div>
            </div>
          </div>
          <div class="mn-fb-text">
            haven't taken it off since it came. pizza tastes better in it I swear
          </div>
          <div class="mn-fb-image-wrap">
            <img src="{{ 'fb3.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fb3.webp?v=1790614948' }}" alt="Ethan wearing Monsties" loading="lazy">
          </div>
          <div class="mn-fb-stats">
            <span>👍🍕 519</span>
            <span>33 Comments</span>
          </div>
          <div class="mn-fb-actions">
            <button class="mn-fb-act-btn">👍 Like</button>
            <button class="mn-fb-act-btn">💬 Comment</button>
            <button class="mn-fb-act-btn">↗️ Share</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. HORIZONTAL BRAND TICKER -->
  <div class="mn-logo-ticker">
    <div class="mn-logo-ticker-track">
      <div class="mn-logo-ticker-item"><img src="{{ 'target.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/target.svg?v=1790615017' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'efe.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/efe.webp?v=1790615025' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'fefe.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fefe.svg?v=1790615033' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'gege.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/gege.svg?v=1790615042' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'target.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/target.svg?v=1790615017' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'efe.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/efe.webp?v=1790615025' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'fefe.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fefe.svg?v=1790615033' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'gege.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/gege.svg?v=1790615042' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'target.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/target.svg?v=1790615017' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'efe.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/efe.webp?v=1790615025' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'fefe.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fefe.svg?v=1790615033' }}" alt="Brand Icon"></div>
      <div class="mn-logo-ticker-item"><img src="{{ 'gege.svg' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/gege.svg?v=1790615042' }}" alt="Brand Icon"></div>
    </div>
  </div>

  <!-- 6. QUALITY & FEATURE SHOWCASE -->
  <section class="mn-features-section">
    <div class="monsties-container">
      <h2 class="mn-section-heading">Designed for Pure Cosiness & Attitude</h2>

      <div class="mn-features-grid">
        <div class="mn-feat-card">
          <div class="mn-feat-media">
            <img src="{{ 'Screenshot_2026-09-28_at_17.05.57.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_17.05.57.png?v=1790611567' }}" alt="Double Sherpa Lining" loading="lazy">
          </div>
          <div class="mn-feat-content">
            <h3 class="mn-feat-title">Double-Lined Ultra Sherpa Fleece</h3>
            <p class="mn-feat-desc">Not the thin, scratchy polyester found on cheap costumes. We use heavy double-lined cloud sherpa so you can walk outside in the freezing cold and stay totally toasty.</p>
          </div>
        </div>

        <div class="mn-feat-card">
          <div class="mn-feat-media">
            <img src="{{ 'Screenshot_2026-09-28_at_17.08.04.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_17.08.04.png?v=1790611695' }}" alt="Dye Sublimation" loading="lazy">
          </div>
          <div class="mn-feat-content">
            <h3 class="mn-feat-title">Permanent Dye Sublimation Print</h3>
            <p class="mn-feat-desc">The monster claws and griffin crest are heat-fused right into the fibers. Zero plastic feel, zero peeling, and zero cracking—even after dozens of machine washes.</p>
          </div>
        </div>

        <div class="mn-feat-card">
          <div class="mn-feat-media">
            <img src="{{ 'wf.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/wf.webp?v=1790611582' }}" alt="Canister Packaging" loading="lazy">
          </div>
          <div class="mn-feat-content">
            <h3 class="mn-feat-title">Pull-Ring Drink Canister Packaging</h3>
            <p class="mn-feat-desc">Unboxing should be an experience. Your onesie comes vacuum-sealed in a gigantic energy-drink style canister with a pull-ring top that shoots out the onesie upon opening.</p>
          </div>
        </div>

        <div class="mn-feat-card">
          <div class="mn-feat-media">
            <img src="{{ 'rf.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/rf.webp?v=1790611576' }}" alt="Heavy Duty Hardware" loading="lazy">
          </div>
          <div class="mn-feat-content">
            <h3 class="mn-feat-title">Reinforced Heavy Duty Dual Zipper</h3>
            <p class="mn-feat-desc">Built with custom matte-black steel pulls and anti-snag teeth. Smooth gliding from collar to hip so you can jump in and out in seconds without caught fabric.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. FAQ ACCORDION -->
  <section class="mn-faq-section">
    <div class="monsties-container mn-faq-wrapper">
      <div class="mn-faq-subtitle">MOST COMMON</div>
      <h2 class="mn-section-heading">ASKED QUESTIONS</h2>

      <div class="mn-faq-list">
        <div class="mn-faq-item open">
          <div class="mn-faq-q">
            <div class="mn-faq-q-left">
              <span class="material-symbols-outlined">device_thermostat</span>
              <span>Is it actually warm or just looks cool?</span>
            </div>
            <span class="mn-faq-chevron">▼</span>
          </div>
          <div class="mn-faq-ans">
            The sherpa is double lined, not single layer like most onesies at this price. You can wear it outside with nothing underneath and still be warm.
          </div>
        </div>

        <div class="mn-faq-item">
          <div class="mn-faq-q">
            <div class="mn-faq-q-left">
              <span class="material-symbols-outlined">verified_user</span>
              <span>Will the white stain easily?</span>
            </div>
            <span class="mn-faq-chevron">▼</span>
          </div>
          <div class="mn-faq-ans">
            The outer fabric is treated so surface marks wipe off. Machine wash cold inside out and it comes out the same.
          </div>
        </div>

        <div class="mn-faq-item">
          <div class="mn-faq-q">
            <div class="mn-faq-q-left">
              <span class="material-symbols-outlined">diamond</span>
              <span>Is the print going to crack or peel?</span>
            </div>
            <span class="mn-faq-chevron">▼</span>
          </div>
          <div class="mn-faq-ans">
            It's dye sublimated into the fabric not printed on top. So it won't crack, peel or fade after washing.
          </div>
        </div>

        <div class="mn-faq-item">
          <div class="mn-faq-q">
            <div class="mn-faq-q-left">
              <span class="material-symbols-outlined">straighten</span>
              <span>Does it run big or small?</span>
            </div>
            <span class="mn-faq-chevron">▼</span>
          </div>
          <div class="mn-faq-ans">
            It's designed to be roomy not skin tight. If you're between sizes go with your normal one, it's already got a relaxed fit.
          </div>
        </div>

        <div class="mn-faq-item">
          <div class="mn-faq-q">
            <div class="mn-faq-q-left">
              <span class="material-symbols-outlined">directions_walk</span>
              <span>Can I actually wear this outside?</span>
            </div>
            <span class="mn-faq-chevron">▼</span>
          </div>
          <div class="mn-faq-ans">
            People wear them to the supermarket, on dog walks, on the school run. It looks like a full tracksuit from a distance, not a costume.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. WHAT FANS SAY -->
  <section class="mn-fans-section">
    <div class="monsties-container">
      <h2 class="mn-section-heading">What Fans Say</h2>

      <div class="mn-fans-grid">
        <!-- Fan 1: Ryan K. -->
        <div class="mn-fan-card">
          <div class="mn-fan-media">
            <img src="{{ 'pdcds.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/pdcds.webp?v=1790615144' }}" alt="Morning Brew" loading="lazy">
          </div>
          <div class="mn-fan-content">
            <div class="mn-fan-stars">★★★★★</div>
            <h3 class="mn-fan-headline">Morning Brew Hit Different</h3>
            <p class="mn-fan-text">stood outside in the rain with a coffee and didn't feel a thing. the sherpa is genuinely warm not just soft for the sake of it. hood up, zip up, I could stand out here all day</p>
            <div class="mn-fan-author-row">
              <img class="mn-fan-avatar" src="{{ 'Screenshot_2026-09-28_at_18.11.41.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.11.41.png?v=1790615510' }}" alt="Ryan K.">
              <span class="mn-fan-name">Ryan K.</span>
            </div>
          </div>
        </div>

        <!-- Fan 2: Dan M. -->
        <div class="mn-fan-card">
          <div class="mn-fan-media">
            <img src="{{ 'fsdf.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/fsdf.webp?v=1790615152' }}" alt="Taking Photos" loading="lazy">
          </div>
          <div class="mn-fan-content">
            <div class="mn-fan-stars">★★★★★</div>
            <h3 class="mn-fan-headline">My Girlfriend Won't Stop Taking Photos of Me</h3>
            <p class="mn-fan-text">I was just making a cup of tea and she pulled her phone out again. the print detail up close is mad though I'll give her that. the griffins on the chest look even better in person than online</p>
            <div class="mn-fan-author-row">
              <img class="mn-fan-avatar" src="{{ 'Screenshot_2026-09-28_at_18.11.52.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.11.52.png?v=1790615520' }}" alt="Dan M.">
              <span class="mn-fan-name">Dan M.</span>
            </div>
          </div>
        </div>

        <!-- Fan 3: Callum J. -->
        <div class="mn-fan-card">
          <div class="mn-fan-media">
            <img src="{{ 'dsfds.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/dsfds.webp?v=1790615163' }}" alt="Gaming Uniform" loading="lazy">
          </div>
          <div class="mn-fan-content">
            <div class="mn-fan-stars">★★★★★</div>
            <h3 class="mn-fan-headline">Gaming Uniform Now</h3>
            <p class="mn-fan-text">my girlfriend took this from the door and I didn't even know. I wear it every single session now. it's warm without being sweaty and the back print looks hard apparently. her words not mine</p>
            <div class="mn-fan-author-row">
              <img class="mn-fan-avatar" src="{{ 'Screenshot_2026-09-28_at_18.12.03.png' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/Screenshot_2026-09-28_at_18.12.03.png?v=1790615531' }}" alt="Callum J.">
              <span class="mn-fan-name">Callum J.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. STICKY MOBILE ATC BAR -->
  <div class="mn-sticky-bar" id="mnStickyBar">
    <div class="mn-sticky-left">
      <img id="mnStickyThumb" class="mn-sticky-thumb" src="{{ 'Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/Codex_Image_9_Sept_2026_19_10_47_15ecca40-ddfa-4710-8e44-1f9de5b27746.png?v=1790663047' }}" alt="Monsties">
      <div>
        <div class="mn-sticky-title">Monsties Onesie</div>
        <div class="mn-sticky-price">$51.00 • <span id="mnStickyVariant">White / M</span></div>
      </div>
    </div>
    <button class="mn-sticky-btn" id="mnStickyBtn">ADD TO CART</button>
  </div>

  <!-- 10. SIZE GUIDE MODAL -->
  <div class="mn-modal-backdrop" id="mnSizeModal">
    <div class="mn-modal-box">
      <button class="mn-modal-close" id="mnCloseSizeModal">&times;</button>
      <h3 class="mn-modal-title">Monsties Size Guide (XS - 3XL)</h3>
      <img class="mn-modal-img" src="{{ 'monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png' | asset_url | default: 'https://cdn.shopify.com/s/files/1/1020/4433/6502/files/monsties-size-guide-xs-3xl_1_e2950a5f-126f-477c-86a6-6fb6cb434ca4.png?v=1790663139' }}" alt="Size Guide Chart">
    </div>
  </div>

  <!-- 11. FOOTER -->
  <footer class="mn-footer">
    <div class="monsties-container mn-footer-inner">
      <div class="mn-footer-logo">
        <img src="{{ 'dz.webp' | asset_url | default: 'https://monstiesco.com/cdn/shop/files/dz.webp?v=1790661848' }}" alt="MONSTIES">
      </div>

      <div class="mn-payments-row">
        <!-- Visa -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1532cb"/><path d="M15 16l3-8h2l-3 8h-2zm9-8c-.5-.2-1.3-.4-2.2-.4-2.5 0-4.2 1.3-4.2 3.1 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.3.8 1.3 1.2 0 .7-.8 1-1.6 1-.9 0-1.6-.2-2.3-.5l-.3 1.5c.6.3 1.6.5 2.6.5 2.7 0 4.4-1.3 4.4-3.2 0-1.1-.7-2-2.1-2.6-.9-.5-1.4-.8-1.4-1.3 0-.4.5-.9 1.5-.9.8 0 1.5.2 1.9.4l.5-1.5zm6.5 5.3l.8-2.2.5 2.2h-1.3zm2.5 2.7l-1.6-7.8h-1.8c-.4 0-.8.2-.9.6l-3.2 7.2h2.1l.4-1.2h2.6l.2 1.2h2.2zm-18.5 0l2.2-7.8h-2.1l-1.3 5.4-.5-1-1.1-3.8c-.1-.4-.5-.6-.9-.6h-3.4l-.1.4c.7.2 1.5.5 2 1l2.5 6.4h2.7z" fill="#fff"/></svg>
        <!-- Mastercard -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1c1c1c"/><circle cx="15" cy="12" r="7" fill="#eb001b"/><circle cx="23" cy="12" r="7" fill="#f79e1b"/><path d="M19 6.8c1.6 1.4 2.6 3.4 2.6 5.2s-1 3.8-2.6 5.2c-1.6-1.4-2.6-3.4-2.6-5.2s1-3.8 2.6-5.2z" fill="#ff5f00"/></svg>
        <!-- Apple Pay -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#fff" stroke="#ddd"/><path d="M12.5 12c0-2 .8-3 2-3-.5-.7-1.3-1-2.2-1-1.2 0-2 .6-2.5.6-.5 0-1.4-.6-2.2-.6-1.3 0-2.8 1-3.5 2.5-1.2 2.2-.3 5.5 1 7.2.6.9 1.3 1.8 2.2 1.8.8 0 1.2-.6 2.2-.6 1 0 1.4.6 2.2.6 1 0 1.6-.9 2.2-1.8.7-1 1-2 1-2.1-1.7-.6-1.6-2.6.4-2.6zm-1.5-4.5c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.5-.5 2-1.1z" fill="#000"/><text x="18" y="15.5" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#000">Pay</text></svg>
        <!-- Google Pay -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#fff" stroke="#ddd"/><text x="10" y="15.5" font-family="sans-serif" font-size="8" font-weight="700" fill="#4285F4">G</text><text x="17" y="15.5" font-family="sans-serif" font-size="7" font-weight="600" fill="#5F6368">Pay</text></svg>
        <!-- Amex -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#0071ce"/><text x="8" y="15" font-family="sans-serif" font-size="6.5" font-weight="800" fill="#fff" letter-spacing="1">AMEX</text></svg>
        <!-- PayPal -->
        <svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#fff" stroke="#ddd"/><text x="6" y="15.5" font-family="sans-serif" font-size="7" font-weight="800" font-style="italic" fill="#003087">Pay</text><text x="19" y="15.5" font-family="sans-serif" font-size="7" font-weight="800" font-style="italic" fill="#0079C1">Pal</text></svg>
      </div>

      <div class="mn-footer-copy">
        &copy; {{ 'now' | date: '%Y' }}, MONSTIES2. Powered by Shopify.<br>
        <a href="/policies/privacy-policy">Privacy policy</a> • <a href="/policies/terms-of-service">Terms of service</a> • <a href="/policies/refund-policy">Refund policy</a>
      </div>
    </div>
  </footer>

</div>

<script>
  (function() {
    // Gallery & Swatches
    var mainImage = document.getElementById('mnMainDisplayImage');
    var thumbs = document.querySelectorAll('.mn-thumb');
    var colorBtns = document.querySelectorAll('.mn-color-btn');
    var sizeBtns = document.querySelectorAll('.mn-size-btn');
    var selectedColorText = document.getElementById('mnSelectedColorText');
    var selectedSizeText = document.getElementById('mnSelectedSizeText');
    var stickyThumb = document.getElementById('mnStickyThumb');
    var stickyVariant = document.getElementById('mnStickyVariant');

    var currentColor = "White Ultra";
    var currentSize = "M";

    function updateStickyInfo() {
      if (stickyVariant) {
        stickyVariant.textContent = currentColor + " / " + currentSize;
      }
    }

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        thumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        var src = thumb.getAttribute('data-src');
        if (mainImage && src) {
          mainImage.src = src;
        }
      });
    });

    colorBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        colorBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentColor = btn.getAttribute('data-color');
        if (selectedColorText) selectedColorText.textContent = currentColor;
        var imgUrl = btn.getAttribute('data-img');
        if (mainImage && imgUrl) {
          mainImage.src = imgUrl;
        }
        if (stickyThumb && imgUrl) {
          stickyThumb.src = imgUrl;
        }
        // Sync thumbnail
        thumbs.forEach(function(t) {
          if (t.getAttribute('data-variant') === currentColor) {
            thumbs.forEach(function(th) { th.classList.remove('active'); });
            t.classList.add('active');
          }
        });
        updateStickyInfo();
      });
    });

    sizeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sizeBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentSize = btn.getAttribute('data-size');
        if (selectedSizeText) selectedSizeText.textContent = currentSize;
        updateStickyInfo();
      });
    });

    // Quantity selector
    var qtyVal = document.getElementById('mnQtyVal');
    var qtyPlus = document.getElementById('mnQtyPlus');
    var qtyMinus = document.getElementById('mnQtyMinus');
    var qty = 1;

    if (qtyPlus && qtyMinus && qtyVal) {
      qtyPlus.addEventListener('click', function() {
        qty++;
        qtyVal.textContent = qty;
      });
      qtyMinus.addEventListener('click', function() {
        if (qty > 1) {
          qty--;
          qtyVal.textContent = qty;
        }
      });
    }

    // Accordions
    var accItems = document.querySelectorAll('.mn-acc-item');
    accItems.forEach(function(item) {
      var header = item.querySelector('.mn-acc-header');
      if (header) {
        header.addEventListener('click', function() {
          var isOpen = item.classList.contains('open');
          accItems.forEach(function(i) { i.classList.remove('open'); });
          if (!isOpen) item.classList.add('open');
        });
      }
    });

    // FAQ Accordion
    var faqItems = document.querySelectorAll('.mn-faq-item');
    faqItems.forEach(function(item) {
      var header = item.querySelector('.mn-faq-q');
      if (header) {
        header.addEventListener('click', function() {
          var isOpen = item.classList.contains('open');
          faqItems.forEach(function(i) { i.classList.remove('open'); });
          if (!isOpen) item.classList.add('open');
        });
      }
    });

    // Size Guide Modal
    var sizeModal = document.getElementById('mnSizeModal');
    var openSizeModal = document.getElementById('mnOpenSizeModal');
    var closeSizeModal = document.getElementById('mnCloseSizeModal');

    if (openSizeModal && sizeModal) {
      openSizeModal.addEventListener('click', function() {
        sizeModal.classList.add('open');
      });
    }
    if (closeSizeModal && sizeModal) {
      closeSizeModal.addEventListener('click', function() {
        sizeModal.classList.remove('open');
      });
      sizeModal.addEventListener('click', function(e) {
        if (e.target === sizeModal) sizeModal.classList.remove('open');
      });
    }

    // Sticky Bottom Bar
    var stickyBar = document.getElementById('mnStickyBar');
    var atcBtn = document.getElementById('mnAddToCartBtn');
    window.addEventListener('scroll', function() {
      if (!stickyBar || !atcBtn) return;
      var rect = atcBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });

    // Add to Cart / Checkout trigger
    function handleAddToCart() {
      var btn = document.getElementById('mnAddToCartBtn');
      if (!btn) return;
      var orig = btn.innerHTML;
      btn.innerHTML = '<span>ADDING...</span>';
      setTimeout(function() {
        btn.innerHTML = '<span>ADDED! ✓</span>';
        var badge = document.getElementById('headerCartCount');
        if (badge) {
          badge.textContent = parseInt(badge.textContent || '0', 10) + qty;
        }
        setTimeout(function() {
          btn.innerHTML = orig;
        }, 1500);
      }, 500);
    }

    if (atcBtn) atcBtn.addEventListener('click', handleAddToCart);
    var stickyBtn = document.getElementById('mnStickyBtn');
    if (stickyBtn) stickyBtn.addEventListener('click', handleAddToCart);

    var buyNow = document.getElementById('mnBuyNowBtn');
    if (buyNow) {
      buyNow.addEventListener('click', function() {
        handleAddToCart();
        setTimeout(function() {
          window.location.href = '/checkout';
        }, 600);
      });
    }
  })();
</script>

{% schema %}
{
  "name": "Monsties Landing Page",
  "settings": [
    {
      "type": "text",
      "id": "product_title",
      "label": "Product Title",
      "default": "Monsties Onesie"
    },
    {
      "type": "text",
      "id": "product_price",
      "label": "Price",
      "default": "$51.00"
    },
    {
      "type": "text",
      "id": "compare_price",
      "label": "Compare Price",
      "default": "$69.00"
    }
  ],
  "presets": [
    {
      "name": "Monsties Product Landing Page"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync('sections/monsties-landing.liquid', liquid);
console.log('Saved sections/monsties-landing.liquid (' + liquid.length + ' bytes)');
