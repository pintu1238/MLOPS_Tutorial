(function () {
  function getColors() {
    var el = document.getElementById('ftPdpColors');
    if (!el) return [];
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return [];
    }
  }

  function formatMoney(cents, format) {
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      return Shopify.formatMoney(cents, format);
    }
    return '₹' + (cents / 100).toFixed(0);
  }

  function normalizeSrc(src) {
    if (!src) return '';
    if (src.indexOf('//') === 0) src = 'https:' + src;
    return src;
  }

  function buildMainTrack(mainEl, main, btns) {
    var existing = mainEl.querySelector('[data-ft-pdp-main-viewport]');
    if (existing) return existing;

    var viewport = document.createElement('div');
    viewport.className = 'ft-pdp__main-viewport';
    viewport.setAttribute('data-ft-pdp-main-viewport', '');

    var track = document.createElement('div');
    track.className = 'ft-pdp__main-track';
    track.setAttribute('data-ft-pdp-main-track', '');

    var alt = main ? main.alt : '';
    btns.forEach(function (btn, i) {
      var videoSrc = btn.getAttribute('data-ft-pdp-video-src');
      if (videoSrc) {
        var slide = document.createElement('div');
        slide.className = 'ft-pdp__main-slide ft-pdp__main-slide--video';
        var video = document.createElement('video');
        video.className = 'ft-pdp__main-img ft-pdp__main-video';
        video.src = normalizeSrc(videoSrc);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.preload = 'auto';
        video.draggable = false;
        video.setAttribute('disablepictureinpicture', '');
        slide.appendChild(video);
        track.appendChild(slide);
        return;
      }

      var src = normalizeSrc(btn.getAttribute('data-src'));
      var img = document.createElement('img');
      img.className = 'ft-pdp__main-img ft-pdp__main-slide';
      img.src = src;
      img.srcset = src;
      img.removeAttribute('sizes');
      img.alt = alt;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.draggable = false;
      if (i === 0) img.id = 'ftPdpMain';
      track.appendChild(img);
    });

    viewport.appendChild(track);
    if (main) main.replaceWith(viewport);
    else mainEl.insertBefore(viewport, mainEl.firstChild);

    return viewport;
  }

  function syncPdpSlideMedia(track, slideIndex) {
    if (!track) return;
    track.querySelectorAll('video').forEach(function (video) {
      video.pause();
    });
    var slide = track.children[slideIndex];
    if (!slide) return;
    var video = slide.querySelector('video');
    if (!video) return;
    video.muted = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function initGallery(root) {
    var mainEl = root.querySelector('.ft-pdp__main');
    var main = root.querySelector('#ftPdpMain');
    var thumbs = root.querySelector('[data-ft-pdp-thumbs]');
    if (!mainEl || !thumbs) return;

    var btns = thumbs.querySelectorAll('[data-ft-pdp-thumb]');
    if (!btns.length) return;

    var viewport = buildMainTrack(mainEl, main, btns);
    var track = viewport.querySelector('[data-ft-pdp-main-track]');
    if (!track) return;

    var index = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var slideMs = reducedMotion ? 0 : 420;
    var dragActive = false;
    var dragStartX = 0;
    var dragStartIndex = 0;
    var viewportW = 1;

    function applyTransform(percent, animate) {
      track.style.transition = animate && slideMs
        ? 'transform ' + slideMs + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
      track.style.transform = 'translate3d(' + percent + '%, 0, 0)';
    }

    function scrollThumbIntoView(i) {
      try {
        var tr = thumbs.getBoundingClientRect();
        var br = btns[i].getBoundingClientRect();
        thumbs.scrollLeft += (br.left + br.right) / 2 - (tr.left + tr.right) / 2;
      } catch (e) {}
    }

    function show(i, animate) {
      if (!btns.length) return;
      if (i < 0) i = btns.length - 1;
      if (i >= btns.length) i = 0;
      index = i;
      btns.forEach(function (b, n) {
        b.classList.toggle('on', n === i);
      });
      applyTransform(-index * 100, animate !== false);
      scrollThumbIntoView(i);
      syncPdpSlideMedia(track, i);
    }

    show(0, false);

    thumbs.querySelectorAll('.ft-pdp__thumb-preview').forEach(function (preview) {
      preview.muted = true;
      var thumbPlay = preview.play();
      if (thumbPlay && typeof thumbPlay.catch === 'function') {
        thumbPlay.catch(function () {});
      }
    });

    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ft-pdp-thumb]');
      if (!b) return;
      var next = Array.prototype.indexOf.call(btns, b);
      if (next === index) return;
      show(next, true);
    });

    var thumbPrev = root.querySelector('[data-ft-pdp-thumb-prev]');
    var thumbNext = root.querySelector('[data-ft-pdp-thumb-next]');
    if (thumbPrev) thumbPrev.addEventListener('click', function () { show(index - 1, true); });
    if (thumbNext) thumbNext.addEventListener('click', function () { show(index + 1, true); });

    var mainPrev = root.querySelector('[data-ft-pdp-main-prev]');
    var mainNext = root.querySelector('[data-ft-pdp-main-next]');
    if (mainPrev) mainPrev.addEventListener('click', function () { show(index - 1, true); });
    if (mainNext) mainNext.addEventListener('click', function () { show(index + 1, true); });

    var isDown = false;
    var startX = 0;
    var scrollStart = 0;

    thumbs.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX;
      scrollStart = thumbs.scrollLeft;
      thumbs.classList.add('is-dragging');
    });
    thumbs.addEventListener('mouseleave', function () { isDown = false; thumbs.classList.remove('is-dragging'); });
    thumbs.addEventListener('mouseup', function () { isDown = false; thumbs.classList.remove('is-dragging'); });
    thumbs.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      thumbs.scrollLeft = scrollStart - (e.pageX - startX);
    });

    var touchX = 0;
    thumbs.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    thumbs.addEventListener('touchmove', function (e) {
      var dx = touchX - e.touches[0].clientX;
      thumbs.scrollLeft += dx;
      touchX = e.touches[0].clientX;
    }, { passive: true });

    function endMainDrag(clientX) {
      if (!dragActive) return;
      dragActive = false;
      viewport.classList.remove('is-dragging');
      var dx = clientX - dragStartX;
      if (Math.abs(dx) > viewportW * 0.12) {
        show(dx < 0 ? index + 1 : index - 1, true);
      } else {
        show(index, true);
      }
    }

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragActive = true;
      dragStartX = e.clientX;
      dragStartIndex = index;
      viewportW = viewport.offsetWidth || 1;
      viewport.classList.add('is-dragging');
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
      applyTransform(-index * 100, false);
    });

    viewport.addEventListener('pointermove', function (e) {
      if (!dragActive) return;
      var dx = e.clientX - dragStartX;
      var offsetPct = (-dragStartIndex * 100) + (dx / viewportW * 100);
      var min = -(btns.length - 1) * 100;
      if (offsetPct > 0) offsetPct *= 0.35;
      else if (offsetPct < min) offsetPct = min + (offsetPct - min) * 0.35;
      applyTransform(offsetPct, false);
    });

    viewport.addEventListener('pointerup', function (e) {
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}
      endMainDrag(e.clientX);
    });

    viewport.addEventListener('pointercancel', function (e) {
      endMainDrag(e.clientX);
    });
  }

  function buildColorPicker(colors, selected, inputName, ariaLabel) {
    var current = colors.find(function (c) { return c.label === selected; }) || colors[0] || { label: 'Default', thumb: '' };
    var options = colors.map(function (c) {
      var on = c.label === current.label;
      return (
        '<button type="button" class="pk-dd__opt' + (on ? ' is-on' : '') + '" role="option" aria-selected="' + on + '" data-value="' + c.label + '">' +
        '<span class="pk-dd__lbl">' + c.label + '</span></button>'
      );
    }).join('');
    return (
      '<div class="pk-dd" data-pk-dd>' +
      '<input type="hidden" name="' + inputName + '" value="' + current.label + '">' +
      '<button type="button" class="pk-dd__btn" aria-haspopup="listbox" aria-expanded="false" aria-label="' + ariaLabel + '">' +
      '<span class="pk-dd__lbl">' + current.label + '</span>' +
      '<span class="pk-dd__chev" aria-hidden="true"></span></button>' +
      '<div class="pk-dd__menu" role="listbox" hidden>' + options + '</div></div>'
    );
  }

  function closeAllPkDd(except) {
    document.querySelectorAll('[data-pk-dd].is-open').forEach(function (dd) {
      if (except && dd === except) return;
      dd.classList.remove('is-open');
      var btn = dd.querySelector('.pk-dd__btn');
      var menu = dd.querySelector('.pk-dd__menu');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
    });
  }

  function setPdpMainHero(root, src) {
    if (!src || !root) return;
    src = normalizeSrc(src);
    var main = root.querySelector('#ftPdpMain');
    if (main) {
      main.src = src;
      main.srcset = src;
      main.removeAttribute('sizes');
    }
    var firstThumb = root.querySelector('[data-ft-pdp-thumb]');
    if (firstThumb) firstThumb.setAttribute('data-src', src);
    var firstSlide = root.querySelector('[data-ft-pdp-main-track] .ft-pdp__main-slide');
    if (firstSlide && firstSlide !== main) {
      firstSlide.src = src;
      firstSlide.srcset = src;
      firstSlide.removeAttribute('sizes');
    }
  }

  function wireColorPickers(picks, colors, root) {
    picks.querySelectorAll('[data-pk-dd]').forEach(function (dd) {
      var btn = dd.querySelector('.pk-dd__btn');
      var menu = dd.querySelector('.pk-dd__menu');
      var hidden = dd.querySelector('input[type="hidden"]');
      if (!btn || !menu || !hidden) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = dd.classList.contains('is-open');
        closeAllPkDd();
        if (!open) {
          dd.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          menu.hidden = false;
        }
      });

      menu.querySelectorAll('.pk-dd__opt').forEach(function (opt) {
        opt.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var val = opt.getAttribute('data-value');
          hidden.value = val;
          var picked = colors.find(function (c) { return c.label === val; });
          var lbl = btn.querySelector('.pk-dd__lbl');
          if (picked && lbl) lbl.textContent = picked.label;
          setPdpMainHero(root, picked && (picked.hero || picked.thumb));
          menu.querySelectorAll('.pk-dd__opt').forEach(function (o) {
            var on = o.getAttribute('data-value') === val;
            o.classList.toggle('is-on', on);
            o.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          closeAllPkDd();
        });
      });
    });
  }

  if (!window.__ftPdpDdDocClose) {
    window.__ftPdpDdDocClose = true;
    document.addEventListener('click', function () { closeAllPkDd(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllPkDd();
    });
  }

  function initTiers(root) {
    var colors = getColors();
    var unit = parseInt(root.getAttribute('data-unit-price'), 10) || 0;
    var compare = parseInt(root.getAttribute('data-compare-unit'), 10) || unit;
    var format = root.getAttribute('data-money-format') || '{{amount}}';
    var qtyInput = root.querySelector('[data-ft-pdp-qty-input]');
    var atcPrice = root.querySelector('[data-ft-pdp-atc-price]');
    var tiers = root.querySelectorAll('[data-ft-pdp-tier]');

    function updateAtcPrice(qty) {
      if (atcPrice) atcPrice.textContent = formatMoney(unit * qty, format);
    }

    function fillTier(tier) {
      var q = parseInt(tier.getAttribute('data-qty'), 10) || 1;
      var nowEl = tier.querySelector('[data-tier-now]');
      var wasEl = tier.querySelector('[data-tier-was]');
      var eachEl = tier.querySelector('[data-tier-each]');
      var saveEl = tier.querySelector('[data-tier-save]');
      if (nowEl) nowEl.textContent = formatMoney(unit * q, format);
      if (wasEl) wasEl.textContent = formatMoney(compare * q, format);
      if (eachEl) eachEl.textContent = formatMoney(unit, format) + ' each';
      if (saveEl) saveEl.textContent = 'Save ' + formatMoney((compare - unit) * q, format);

      var picks = tier.querySelector('[data-ft-pdp-picks]');
      if (!picks || picks.dataset.built === '1') return;
      picks.dataset.built = '1';
      var html = '';
      for (var i = 1; i <= q; i++) {
        var color = colors[(i - 1) % colors.length] || { label: 'Default', thumb: '' };
        html += '<div class="pk">' +
          '<span class="lab">Car ' + i + '</span>' +
          buildColorPicker(colors, color.label, 'properties[Color ' + i + ']', 'Color for car ' + i) +
          '</div>';
      }
      picks.innerHTML = html;
      picks.addEventListener('click', function (e) { e.stopPropagation(); });
      picks.addEventListener('mousedown', function (e) { e.stopPropagation(); });
      wireColorPickers(picks, colors, root);
    }

    tiers.forEach(fillTier);

    function selectTier(tier) {
      tiers.forEach(function (t) { t.classList.remove('sel'); });
      tier.classList.add('sel');
      var q = parseInt(tier.getAttribute('data-qty'), 10) || 1;
      if (qtyInput) qtyInput.value = String(q);
      updateAtcPrice(q);
    }

    tiers.forEach(function (tier) {
      tier.addEventListener('click', function (e) {
        if (e.target.closest('[data-pk-dd]')) return;
        selectTier(tier);
      });
    });

    var selected = root.querySelector('[data-ft-pdp-tier].sel') || tiers[0];
    if (selected) selectTier(selected);
  }

  function init(root) {
    initGallery(root);
    initTiers(root);
  }

  function boot() {
    document.querySelectorAll('[data-ft-pdp]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
