/**
 * assets/pookie-scripts.js - Interactive Controls for Pookie Hoodie Replica
 */
(function() {
  'use strict';

  const PookieController = {
    init: function() {
      this.initCountdown();
      this.initGallery();
      this.initBundles();
      this.initAccordions();
      this.initStickyBar();
      this.initModal();
      this.initVariantPills();
      this.initColorSelect();
    },

    // 1. Persistent Countdown Timer (Days, Hrs, Min, Sec)
    initCountdown: function() {
      const STORAGE_KEY = 'fsc_pookie_deadline';
      const DURATION_HOURS = 3;

      let endTime = localStorage.getItem(STORAGE_KEY);
      if (!endTime || isNaN(endTime) || Number(endTime) <= Date.now()) {
        endTime = Date.now() + (DURATION_HOURS * 3600 * 1000) + (21 * 60 * 1000) + (44 * 1000);
        localStorage.setItem(STORAGE_KEY, endTime);
      }

      function pad(n) { return n < 10 ? '0' + n : String(n); }

      function update() {
        const remaining = Math.max(0, Math.floor((Number(endTime) - Date.now()) / 1000));
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;

        const daysEl = document.getElementById('pookie-cd-days');
        const hoursEl = document.getElementById('pookie-cd-hours');
        const minEl = document.getElementById('pookie-cd-mins');
        const secEl = document.getElementById('pookie-cd-secs');

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minEl) minEl.textContent = pad(minutes);
        if (secEl) secEl.textContent = pad(seconds);
      }

      update();
      setInterval(update, 1000);
    },

    // 2. Gallery Viewer & Arrows
    initGallery: function() {
      const mainImg = document.getElementById('pookie-main-image');
      const thumbs = document.querySelectorAll('.pookie-gallery-thumb');
      const track = document.getElementById('pookie-gallery-thumbs-track');
      const prevBtn = document.getElementById('pookie-gallery-prev');
      const nextBtn = document.getElementById('pookie-gallery-next');

      if (!mainImg || !thumbs.length) return;

      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', function() {
          thumbs.forEach(t => t.classList.remove('is-active'));
          this.classList.add('is-active');

          const newSrc = this.getAttribute('data-full-src') || this.querySelector('img')?.src;
          if (newSrc && mainImg) {
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
              mainImg.src = newSrc;
              mainImg.style.opacity = '1';
            }, 100);
          }
        });
      });

      if (prevBtn && track) {
        prevBtn.addEventListener('click', () => {
          track.scrollBy({ left: -160, behavior: 'smooth' });
        });
      }

      if (nextBtn && track) {
        nextBtn.addEventListener('click', () => {
          track.scrollBy({ left: 160, behavior: 'smooth' });
        });
      }
    },

    // 3. Size Pill Variant Selection
    initVariantPills: function() {
      const pills = document.querySelectorAll('.pookie-size-pill');
      const sizeLabel = document.getElementById('pookie-selected-size-label');

      pills.forEach((pill) => {
        pill.addEventListener('click', function() {
          pills.forEach(p => p.classList.remove('is-selected'));
          this.classList.add('is-selected');

          const size = this.getAttribute('data-size');
          if (sizeLabel) sizeLabel.textContent = size;
        });
      });
    },

    // Color Selector
    initColorSelect: function() {
      const select = document.getElementById('pookie-color-select');
      const label = document.getElementById('pookie-selected-color-label');
      if (select && label) {
        select.addEventListener('change', function() {
          label.textContent = this.value;
        });
      }
    },

    // 4. Bundle Tier Selection & Price Calculation (Accordion Mode)
    initBundles: function() {
      const tiers = document.querySelectorAll('.pookie-bundle-tier');
      const preorderBtn = document.getElementById('pookie-atc-button');
      const mainPriceDisplay = document.querySelector('.pookie-price-current');

      if (!tiers.length) return;

      const PRICES = {
        '1': 5900,
        '2': 10620,
        '3': 15045
      };

      const formatPrice = (amount) => 'Rs. ' + amount.toLocaleString('en-IN') + '.00';

      function updateActiveTier(tier) {
        tiers.forEach(t => {
          t.classList.remove('is-selected');
          const radio = t.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });

        tier.classList.add('is-selected');
        const activeRadio = tier.querySelector('input[type="radio"]');
        if (activeRadio) activeRadio.checked = true;

        const tierIndex = tier.getAttribute('data-tier');
        let currentTotal = PRICES[tierIndex] || 5900;

        // Calculate add-on checkboxes inside selected tier
        const addons = tier.querySelectorAll('.pookie-addon-checkbox:checked');
        addons.forEach(add => {
          currentTotal += Number(add.getAttribute('data-price') || 0);
        });

        if (mainPriceDisplay) {
          mainPriceDisplay.textContent = formatPrice(currentTotal);
        }

        if (preorderBtn) {
          preorderBtn.textContent = 'PREORDER NOW';
        }
      }

      tiers.forEach((tier) => {
        tier.addEventListener('click', function(e) {
          // If clicking an input, select or label, let the change event handle it
          if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION' || e.target.tagName === 'INPUT') {
            return;
          }
          updateActiveTier(this);
        });

        const checkboxes = tier.querySelectorAll('.pookie-addon-checkbox');
        checkboxes.forEach(cb => {
          cb.addEventListener('change', () => updateActiveTier(tier));
        });
      });
    },

    // 5. Accordion Drawers
    initAccordions: function() {
      const headers = document.querySelectorAll('.pookie-accordion-header');
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const item = this.closest('.pookie-accordion-item');
          if (!item) return;

          const wasOpen = item.classList.contains('is-open');
          document.querySelectorAll('.pookie-accordion-item').forEach(i => i.classList.remove('is-open'));

          if (!wasOpen) {
            item.classList.add('is-open');
          }
        });
      });
    },

    // 6. Sticky Bottom Add-to-Cart Bar
    initStickyBar: function() {
      const stickyBar = document.getElementById('pookie-sticky-bar');
      const targetBtn = document.getElementById('pookie-atc-button');
      const stickyBtn = document.getElementById('pookie-sticky-btn');

      if (!stickyBar || !targetBtn) return;

      window.addEventListener('scroll', () => {
        const rect = targetBtn.getBoundingClientRect();
        if (rect.bottom < 0) {
          stickyBar.classList.add('is-visible');
        } else {
          stickyBar.classList.remove('is-visible');
        }
      });

      if (stickyBtn) {
        stickyBtn.addEventListener('click', () => {
          targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    },

    // 7. Size Chart Modal
    initModal: function() {
      const openBtn = document.getElementById('pookie-open-size-chart');
      const closeBtn = document.getElementById('pookie-close-size-chart');
      const modal = document.getElementById('pookie-size-chart-modal');

      if (!modal) return;

      if (openBtn) {
        openBtn.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('is-active');
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('is-active');
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-active');
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PookieController.init());
  } else {
    PookieController.init();
  }

  window.PookieController = PookieController;
})();
