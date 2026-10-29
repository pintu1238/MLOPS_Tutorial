(function () {
  function readThemeAssetSample() {
    var el = document.getElementById('ftPdpThemeAssetSample');
    if (!el) return '';
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return '';
    }
  }

  function themeAssetUrl(filename) {
    var sample = readThemeAssetSample();
    if (!sample || !filename) return '';
    var marker = 'tc-mp-shop-01.jpg';
    if (sample.indexOf(marker) !== -1) return sample.replace(marker, filename);
    var slash = sample.lastIndexOf('/');
    if (slash < 0) return '';
    var query = sample.indexOf('?');
    var suffix = query >= 0 ? sample.substring(query) : '';
    return sample.substring(0, slash + 1) + filename + suffix;
  }

  function catalogFamilyFromName(name) {
    var s = String(name || '');
    if (/tc-mp-arrival/.test(s)) return 'arrival';
    if (/tc-mp-drift/.test(s)) return 'drift';
    return 'shop';
  }

  function familyMax(family) {
    if (family === 'arrival') return 12;
    if (family === 'drift') return 10;
    return 32;
  }

  function productAssetPrefix(index, family) {
    var max = familyMax(family);
    var s = Math.max(1, Math.min(max, parseInt(index, 10) || 1));
    var base = 'tc-mp-shop-';
    if (family === 'drift') base = 'tc-mp-drift-';
    else if (family === 'arrival') base = 'tc-mp-arrival-';
    if (s < 10) return base + '0' + s;
    return base + s;
  }

  function heroAssetName(index, family) {
    return productAssetPrefix(index, family) + '.jpg';
  }

  /** Catalog PDP frames. Arrival products keep their own hero — never shop-car shots. */
  function catalogGalleryAssetNames(seed, family) {
    var s = parseInt(seed, 10) || 0;
    var max = familyMax(family);
    if (s < 1 || s > max) return null;
    if (family === 'arrival') {
      var arrivalHero = heroAssetName(s, family);
      if (s === 11) {
        var ap = productAssetPrefix(s, family);
        return [arrivalHero, ap + '-g02-kit.jpg', ap + '-g03-side.jpg', ap + '-g06-remote.jpg'];
      }
      return [arrivalHero];
    }
    var pfx = productAssetPrefix(s, family);
    return [
      heroAssetName(s, family),
      pfx + '-g02-kit.jpg',
      pfx + '-g03-drift.jpg',
      pfx + '-g04-tires.jpg',
      pfx + '-g05-leds.jpg',
      pfx + '-g06-remote.jpg',
      pfx + '-g07-details.jpg',
      pfx + '-g08-action.jpg',
      pfx + '-g09-complete.jpg',
      pfx + '-g10-cyan.jpg',
      pfx + '-g11-red.jpg',
      pfx + '-g12-yellow.jpg'
    ];
  }

  function seedAssetNames(seed, family) {
    var catalog = catalogGalleryAssetNames(seed, family);
    if (catalog) return catalog;
    if (family === 'arrival') return [heroAssetName(seed, 'arrival')];
    var s = Math.max(1, Math.min(32, parseInt(seed, 10) || 1));
    function wrap(n) {
      while (n > 32) n -= 32;
      while (n < 1) n += 32;
      return n;
    }
    function file(n) {
      n = wrap(n);
      return n < 10 ? 'tc-mp-shop-0' + n + '.jpg' : 'tc-mp-shop-' + n + '.jpg';
    }
    return [file(s), file(s + 10), file(s + 5), file(s + 15)];
  }

  function catalogDescAssetNames(seed, family) {
    var s = parseInt(seed, 10) || 0;
    var max = familyMax(family);
    if (s < 1 || s > max) return null;
    var pfx = productAssetPrefix(s, family);
    return [
      pfx + '-d01-about.jpg',
      pfx + '-d02-box.jpg',
      pfx + '-d03-features.jpg',
      pfx + '-d04-battery.jpg',
      pfx + '-d05-precision.jpg',
      pfx + '-d06-ready.jpg'
    ];
  }

  function applyCatalogDescBanners() {
    var params = new URLSearchParams(window.location.search);
    var seed = params.get('tc_seed') || '';
    var img = params.get('tc_img') || '';
    try {
      var stored = JSON.parse(sessionStorage.getItem('tcMpPdpPreview') || 'null');
      if (stored) {
        if (!seed && stored.seed) seed = String(stored.seed);
        if (!img && stored.img) img = stored.img;
      }
    } catch (e) {
      /* ignore */
    }
    if (!seed && img) {
      var match = String(img).match(/tc-mp-(?:shop|drift|arrival)-(\d{2})/);
      if (match) seed = String(parseInt(match[1], 10));
    }
    if (!seed) return;
    var files = catalogDescAssetNames(seed, catalogFamilyFromName(img));
    if (!files) return;
    var stack = document.querySelector('[data-ft-pdp-desc-stack]');
    if (!stack) return;
    var imgs = stack.querySelectorAll('img');
    if (!imgs.length) return;
    var first = imgs[0].getAttribute('data-ft-pdp-desc-file') || imgs[0].getAttribute('src') || '';
    if (first.indexOf(files[0]) !== -1) return;
    files.forEach(function (file, i) {
      if (!imgs[i]) return;
      var url = themeAssetUrl(file);
      if (!url) return;
      imgs[i].src = url;
      imgs[i].setAttribute('data-ft-pdp-desc-file', file);
    });
  }

  function parseCatalogPreview() {
    var params = new URLSearchParams(window.location.search);
    var title = params.get('tc_title') || '';
    var seed = params.get('tc_seed') || '';
    var img = params.get('tc_img') || '';
    try {
      var stored = JSON.parse(sessionStorage.getItem('tcMpPdpPreview') || 'null');
      if (stored) {
        if (!title && stored.title) title = stored.title;
        if (!seed && stored.seed) seed = String(stored.seed);
        if (!img && stored.img) img = stored.img;
      }
    } catch (e) {
      /* ignore */
    }
    if (!title && !seed && !img) return null;

    if (!seed && img) {
      var imgSeedMatch = String(img).match(/tc-mp-(?:shop|drift|arrival)-(\d{2})/);
      if (imgSeedMatch) seed = String(parseInt(imgSeedMatch[1], 10));
    }

    var family = catalogFamilyFromName(img);
    var files = seed ? seedAssetNames(seed, family) : [];
    if (img) {
      var hero = files[0] || img;
      files = files.filter(function (f) {
        return f !== img;
      });
      if (files.indexOf(img) === -1) {
        files.unshift(img);
      }
      if (hero && files[0] !== hero && files.indexOf(hero) === -1) {
        files.unshift(hero);
      }
    }
    var urls = files.map(themeAssetUrl).filter(Boolean);
    if (!urls.length) return null;
    return { title: title, urls: urls, family: family };
  }

  function applyArrivalCopy(root) {
    var params = new URLSearchParams(window.location.search);
    var img = params.get('tc_img') || '';
    if (catalogFamilyFromName(img) !== 'arrival') return;
    root.setAttribute('data-ft-catalog-family', 'arrival');
    var rows = root.querySelectorAll('.ft-pdp-features .row .tx');
    if (rows[0]) {
      rows[0].innerHTML = '<b>Ready to play</b><span>Full-function remote control out of the box</span>';
    }
    if (rows[1]) {
      rows[1].innerHTML = '<b>2.4 GHz remote</b><span>Lag-free control included</span>';
    }
    var labels = ['1 Set', '2 Sets', '3 Sets'];
    root.querySelectorAll('.tier .tt').forEach(function (el, i) {
      if (labels[i]) el.textContent = labels[i];
    });
  }

  function applyCatalogPreview(root) {
    var preview = parseCatalogPreview();
    if (!preview || !preview.urls.length) return false;

    var titleEl = root.querySelector('.ft-pdp-title');
    if (titleEl && preview.title) titleEl.textContent = preview.title;

    var stickyThumb = root.querySelector('[data-ft-sticky-thumb]');
    if (stickyThumb && preview.urls[0]) stickyThumb.src = preview.urls[0];

    var thumbs = root.querySelector('[data-ft-pdp-thumbs]');
    if (!thumbs) return false;

    var existingThumbs = thumbs.querySelectorAll('[data-ft-pdp-thumb]');
    var existingSrc = existingThumbs.length
      ? (existingThumbs[0].getAttribute('data-src') || '')
      : '';
    var thumbsAlreadyMatch = preview.urls.length === existingThumbs.length &&
      preview.urls[0] && existingSrc.indexOf(preview.urls[0].split('?')[0].split('/').pop()) !== -1;
    if (preview.family !== 'arrival' && existingThumbs.length >= 8) {
      return true;
    }
    if (thumbsAlreadyMatch) {
      return true;
    }

    thumbs.innerHTML = '';
    preview.urls.forEach(function (url, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ssg__th' + (i === 0 ? ' on' : '');
      btn.setAttribute('data-ft-pdp-thumb', '');
      btn.setAttribute('data-src', url);
      btn.setAttribute('aria-label', 'View image ' + (i + 1));
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.width = 120;
      img.height = 120;
      btn.appendChild(img);
      thumbs.appendChild(btn);
    });
    return true;
  }

  document.addEventListener(
    'click',
    function (e) {
      var link = e.target.closest('.tc-mp-shop-all__card a[href*="/products/"]');
      if (!link) return;
      var card = link.closest('.tc-mp-shop-all__card');
      if (!card) return;
      var title = card.getAttribute('data-card-title') || '';
      var seed = card.getAttribute('data-tc-seed') || card.getAttribute('data-card-order') || '';
      var subtitle = card.getAttribute('data-card-subtitle') || '';
      var imgEl = card.querySelector('.tc-mp-shop-all__card-img');
      var imgFile = '';
      if (imgEl) {
        var src = imgEl.getAttribute('data-default-src') || imgEl.getAttribute('src') || '';
        var match = src.match(/tc-mp-(?:shop|drift|arrival)-\d+\.jpg/);
        if (match) imgFile = match[0];
      }
      try {
        sessionStorage.setItem(
          'tcMpPdpPreview',
          JSON.stringify({ title: title, seed: seed, img: imgFile, subtitle: subtitle })
        );
      } catch (err) {
        /* ignore */
      }
    },
    true
  );

  function getColors() {
    var params = new URLSearchParams(window.location.search);
    var img = params.get('tc_img') || '';
    var root = document.querySelector('[data-ft-pdp]');
    var family = (root && root.getAttribute('data-ft-catalog-family')) || catalogFamilyFromName(img);
    if (family === 'arrival' || /tc-mp-arrival/.test(img)) return [];
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

      var slide = document.createElement('div');
      slide.className = 'ft-pdp__main-slide';
      var src = normalizeSrc(btn.getAttribute('data-src'));
      var img = document.createElement('img');
      img.className = 'ft-pdp__main-img';
      img.src = src;
      img.srcset = src;
      img.removeAttribute('sizes');
      img.alt = alt;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.draggable = false;
      if (i === 0) img.id = 'ftPdpMain';
      slide.appendChild(img);
      track.appendChild(slide);
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

    function measureViewport() {
      viewportW = viewport.offsetWidth || 1;
      return viewportW;
    }

    function applyTransform(offsetPx, animate) {
      track.style.transition = animate && slideMs
        ? 'transform ' + slideMs + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
      track.style.transform = 'translate3d(' + offsetPx + 'px, 0, 0)';
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
      measureViewport();
      applyTransform(-index * viewportW, animate !== false);
      scrollThumbIntoView(i);
      syncPdpSlideMedia(track, i);
    }

    root.__ftPdpShowSlide = function (i, animate) {
      show(i, animate);
    };

    measureViewport();
    show(0, false);
    window.addEventListener('resize', function () {
      measureViewport();
      applyTransform(-index * viewportW, false);
    }, { passive: true });

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
      measureViewport();
      viewport.classList.add('is-dragging');
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
      applyTransform(-index * viewportW, false);
    });

    viewport.addEventListener('pointermove', function (e) {
      if (!dragActive) return;
      var dx = e.clientX - dragStartX;
      var offsetPx = -dragStartIndex * viewportW + dx;
      var min = -(btns.length - 1) * viewportW;
      if (offsetPx > 0) offsetPx *= 0.35;
      else if (offsetPx < min) offsetPx = min + (offsetPx - min) * 0.35;
      applyTransform(offsetPx, false);
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

  function assetFileName(url) {
    return String(url || '')
      .split('?')[0]
      .split('#')[0]
      .split('/')
      .pop();
  }

  var COLORWAY_KEYS = {
    'Cyan blue': 'g10-cyan',
    'Racing red': 'g11-red',
    'Volt yellow': 'g12-yellow'
  };

  function colorwayThumbIndex(root, picked) {
    if (!root || !picked) return -1;
    var thumbs = root.querySelectorAll('[data-ft-pdp-thumb]');
    var key = picked.key || COLORWAY_KEYS[picked.label] || '';
    var heroFile = assetFileName(picked.hero || picked.thumb);
    var i;
    for (i = 0; i < thumbs.length; i++) {
      var file = assetFileName(thumbs[i].getAttribute('data-src'));
      if (key && file.indexOf(key) !== -1) return i;
      if (heroFile && file === heroFile) return i;
    }
    return -1;
  }

  function setPdpMainHero(root, src) {
    if (!src || !root) return;
    src = normalizeSrc(src);
    var slideImg =
      root.querySelector('[data-ft-pdp-main-track] .ft-pdp__main-slide img#ftPdpMain') ||
      root.querySelector('#ftPdpMain') ||
      root.querySelector('[data-ft-pdp-main-track] .ft-pdp__main-slide img');
    if (slideImg) {
      slideImg.src = src;
      slideImg.srcset = src;
      slideImg.removeAttribute('sizes');
    }
    var stickyThumb = root.querySelector('[data-ft-sticky-thumb]');
    if (stickyThumb) stickyThumb.src = src;
  }

  function showPickedColorway(root, picked) {
    if (!root || !picked) return;
    var idx = colorwayThumbIndex(root, picked);
    if (idx >= 0) {
      if (typeof root.__ftPdpShowSlide === 'function') {
        root.__ftPdpShowSlide(idx, true);
      } else {
        var thumb = root.querySelectorAll('[data-ft-pdp-thumb]')[idx];
        if (thumb) thumb.click();
      }
      var src = root.querySelectorAll('[data-ft-pdp-thumb]')[idx].getAttribute('data-src');
      var stickyThumb = root.querySelector('[data-ft-sticky-thumb]');
      if (stickyThumb && src) stickyThumb.src = src;
      return;
    }
    setPdpMainHero(root, picked.hero || picked.thumb);
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
          showPickedColorway(root, picked);
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
    var sticky = root.querySelector('[data-ft-sticky-atc]');
    var stickyPrice = root.querySelector('[data-ft-sticky-price]');
    var stickyTitle = root.querySelector('[data-ft-sticky-title]');
    var tiers = root.querySelectorAll('[data-ft-pdp-tier]');

    function updateAtcPrice(qty) {
      var money = formatMoney(unit * qty, format);
      if (atcPrice) atcPrice.textContent = money;
      if (stickyPrice) stickyPrice.textContent = money;
      if (stickyTitle && sticky) {
        var one = sticky.getAttribute('data-label-one') || 'CAR';
        var other = sticky.getAttribute('data-label-other') || 'CARS';
        stickyTitle.textContent = qty + ' ' + (qty === 1 ? one : other);
      }
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
      if (!colors.length) {
        picks.innerHTML = '';
        return;
      }
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

  function initSticky(root) {
    var sticky = root.querySelector('[data-ft-sticky-atc]');
    if (!sticky) return;

    var form = root.querySelector('#ftPdpForm');
    if (form && !form.getAttribute('data-ss-atc-form')) {
      form.setAttribute('data-ss-atc-form', 'true');
    }

    var change = sticky.querySelector('[data-ft-sticky-change]');
    if (change) {
      change.addEventListener('click', function () {
        var target = root.querySelector('#ftPdpTiers') || root.querySelector('[data-ft-pdp-tiers]');
        if (!target) return;
        var header = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-group-height'),
          10
        ) || 80;
        var y = target.getBoundingClientRect().top + window.pageYOffset - header - 16;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    var stickyThumb = sticky.querySelector('[data-ft-sticky-thumb]');
    var main = root.querySelector('#ftPdpMain');
    if (stickyThumb && main && (main.currentSrc || main.src)) {
      stickyThumb.src = main.currentSrc || main.src;
    }
  }

  function init(root) {
    applyCatalogPreview(root);
    applyArrivalCopy(root);
    initGallery(root);
    initTiers(root);
    initSticky(root);
  }

  function boot() {
    document.querySelectorAll('[data-ft-pdp]').forEach(init);
    applyCatalogDescBanners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
