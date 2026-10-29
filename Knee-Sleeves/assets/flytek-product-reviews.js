(function () {
  var STORAGE_PREFIX = 'ft-rev-votes-';
  var LOCAL_REVIEWS_PREFIX = 'ft-user-reviews-';
  var STAR_PATH =
    'M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z';

  function parseTs(value) {
    var n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignore quota */
    }
  }

  function starSvg() {
    return (
      '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="' +
      STAR_PATH +
      '"></path></svg>'
    );
  }

  function starsHtml(rating) {
    var html = '<span class="ft-reviews-widget__stars ft-rev-item__rating-stars" aria-hidden="true">';
    for (var i = 1; i <= 5; i += 1) {
      html +=
        '<svg viewBox="0 0 20 20" focusable="false"><path fill="' +
        (i <= rating ? 'currentColor' : '#e5e7eb') +
        '" d="' +
        STAR_PATH +
        '"></path></svg>';
    }
    return html + '</span>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function reviewCardHtml(review) {
    var initial = (review.author || 'C').charAt(0).toUpperCase();
    var color = review.color || '#1f2937';
    return (
      '<article class="ft-rev-item" data-ft-rev-item data-rating="' +
      review.rating +
      '" data-timestamp="' +
      review.timestamp +
      '" data-review-id="' +
      escapeHtml(review.id) +
      '">' +
      '<div class="ft-rev-item__head"><div class="ft-rev-item__user">' +
      '<span class="ft-rev-item__avatar" style="background:' +
      color +
      ';">' +
      escapeHtml(initial) +
      '</span><div><div class="ft-rev-item__name-row"><span class="ft-rev-item__name">' +
      escapeHtml(review.author) +
      '</span></div>' +
      (review.location
        ? '<p class="ft-rev-item__loc">' + escapeHtml(review.location) + '</p>'
        : '') +
      '</div></div><time class="ft-rev-item__date">' +
      escapeHtml(review.date || 'Today') +
      '</time></div>' +
      '<div class="ft-rev-item__rating" aria-label="' +
      review.rating +
      ' out of 5 stars">' +
      starsHtml(review.rating) +
      '</div>' +
      (review.title ? '<h3 class="ft-rev-item__title">' + escapeHtml(review.title) + '</h3>' : '') +
      '<p class="ft-rev-item__body">' +
      escapeHtml(review.body) +
      '</p>' +
      (review.product
        ? '<div class="ft-rev-item__purchase"><strong>' +
          escapeHtml(review.product) +
          '</strong></div>'
        : '') +
      '<div class="ft-rev-item__helpful"><span>Was this helpful?</span>' +
      '<div class="ft-rev-item__vote-row">' +
      '<button type="button" class="ft-rev-item__vote" data-ft-rev-vote="up" data-review-id="' +
      escapeHtml(review.id) +
      '" data-base-count="0" aria-pressed="false">👍 <span data-ft-rev-count>0</span></button>' +
      '<button type="button" class="ft-rev-item__vote" data-ft-rev-vote="down" data-review-id="' +
      escapeHtml(review.id) +
      '" data-base-count="0" aria-pressed="false">👎 <span data-ft-rev-count>0</span></button>' +
      '</div></div></article>'
    );
  }

  function initWidget(root) {
    if (!root || root.dataset.ftReviewsInit === 'true') return;
    root.dataset.ftReviewsInit = 'true';

    var sectionId = root.dataset.sectionId || 'default';
    var productHandle = root.dataset.productHandle || 'product';
    var pageSize = parseInt(root.dataset.pageSize || '5', 10);
    if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 5;
    var list = root.querySelector('[data-ft-reviews-list]');
    var sort = root.querySelector('[data-ft-reviews-sort]');
    var loadBtn = root.querySelector('[data-ft-reviews-load]');
    var writeBtns = root.querySelectorAll('[data-ft-reviews-write]');
    var writeDialog = root.querySelector('[data-ft-reviews-write-dialog]');
    var photosDialog = root.querySelector('[data-ft-reviews-photos-dialog]');
    var photoTriggers = root.querySelectorAll('[data-ft-reviews-photos-open]');
    var countEl = root.querySelector('[data-ft-reviews-count]');
    var localKey = LOCAL_REVIEWS_PREFIX + productHandle;
    var visibleCount = pageSize;

    function getItems() {
      return list ? Array.from(list.querySelectorAll('[data-ft-rev-item]')) : [];
    }

    function updateCount() {
      if (!countEl) return;
      var template = countEl.dataset.countTemplate || 'Reviews [count]';
      countEl.textContent = template.replace('[count]', String(getItems().length));
    }

    function sortItems(mode) {
      var items = getItems();
      items
        .slice()
        .sort(function (a, b) {
          if (mode === 'highest') {
            return parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10);
          }
          if (mode === 'lowest') {
            return parseInt(a.dataset.rating, 10) - parseInt(b.dataset.rating, 10);
          }
          return parseTs(b.dataset.timestamp) - parseTs(a.dataset.timestamp);
        })
        .forEach(function (node) {
          list.appendChild(node);
        });
    }

    function applyPagination() {
      var items = getItems();
      items.forEach(function (node, index) {
        if (index >= visibleCount) node.setAttribute('hidden', '');
        else node.removeAttribute('hidden');
      });
      if (loadBtn) {
        if (visibleCount >= items.length) loadBtn.setAttribute('hidden', '');
        else loadBtn.removeAttribute('hidden');
      }
    }

    function bindVotes(scope) {
      (scope || root).querySelectorAll('[data-ft-rev-vote]').forEach(function (btn) {
        if (btn.dataset.ftRevBound === 'true') return;
        btn.dataset.ftRevBound = 'true';
        var reviewId = btn.dataset.reviewId;
        var voteKey = STORAGE_PREFIX + sectionId + '-' + reviewId;
        var stored = null;
        try {
          stored = localStorage.getItem(voteKey);
        } catch (e) {
          stored = null;
        }

        var upBtn = root.querySelector('[data-ft-rev-vote="up"][data-review-id="' + reviewId + '"]');
        var downBtn = root.querySelector('[data-ft-rev-vote="down"][data-review-id="' + reviewId + '"]');
        var upCount = upBtn ? upBtn.querySelector('[data-ft-rev-count]') : null;
        var downCount = downBtn ? downBtn.querySelector('[data-ft-rev-count]') : null;
        var baseUp = upBtn ? parseInt(upBtn.dataset.baseCount || '0', 10) : 0;
        var baseDown = downBtn ? parseInt(downBtn.dataset.baseCount || '0', 10) : 0;

        function renderCounts(vote) {
          if (upCount) upCount.textContent = String(baseUp + (vote === 'up' ? 1 : 0));
          if (downCount) downCount.textContent = String(baseDown + (vote === 'down' ? 1 : 0));
          if (upBtn) upBtn.setAttribute('aria-pressed', vote === 'up' ? 'true' : 'false');
          if (downBtn) downBtn.setAttribute('aria-pressed', vote === 'down' ? 'true' : 'false');
        }

        renderCounts(stored);

        btn.addEventListener('click', function () {
          var type = btn.dataset.ftRevVote;
          var current = stored === type ? null : type;
          try {
            if (current) localStorage.setItem(voteKey, current);
            else localStorage.removeItem(voteKey);
          } catch (e) {
            /* ignore */
          }
          stored = current;
          renderCounts(stored);
        });
      });
    }

    function injectLocalReviews() {
      var saved = readJson(localKey, []);
      if (!list || !saved.length) return;
      saved
        .slice()
        .reverse()
        .forEach(function (review) {
          if (list.querySelector('[data-review-id="' + review.id + '"]')) return;
          list.insertAdjacentHTML('afterbegin', reviewCardHtml(review));
        });
    }

    injectLocalReviews();
    bindVotes(root);
    updateCount();

    if (sort) {
      sort.addEventListener('change', function () {
        sortItems(sort.value);
        applyPagination();
      });
    }

    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        visibleCount = Math.min(getItems().length, visibleCount + pageSize);
        applyPagination();
      });
    }

    applyPagination();

    function openDialog(dialog) {
      if (!dialog) return;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }

    function closeDialog(dialog) {
      if (!dialog) return;
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }

    function wireDialog(dialog) {
      if (!dialog) return;
      dialog.querySelectorAll('[data-ft-reviews-dialog-close]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          closeDialog(dialog);
        });
      });
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeDialog(dialog);
      });
    }

    wireDialog(writeDialog);
    wireDialog(photosDialog);

    writeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog(writeDialog);
        var first = writeDialog && writeDialog.querySelector('input, select, textarea, button');
        if (first) first.focus();
      });
    });

    root.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-ft-reviews-photos-open]');
      if (!trigger || !root.contains(trigger)) return;
      openDialog(photosDialog);
    });

    var starWrap = root.querySelector('[data-ft-review-stars]');
    var ratingInput = root.querySelector('[data-ft-review-rating]');
    if (starWrap && ratingInput) {
      var starBtns = Array.from(starWrap.querySelectorAll('[data-ft-star]'));
      function paintStars(value) {
        starBtns.forEach(function (btn) {
          var on = parseInt(btn.dataset.ftStar, 10) <= value;
          btn.classList.toggle('is-on', on);
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
      starBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var value = parseInt(btn.dataset.ftStar, 10);
          ratingInput.value = String(value);
          paintStars(value);
        });
      });
    }

    var fileInput = root.querySelector('[data-ft-review-photos]');

    var reviewForm = root.querySelector('form.ft-reviews-write-form') || root.querySelector('form[id^="ftReviewsWrite-"]');
    var formStatus = root.querySelector('[data-ft-reviews-form-status]');
    if (reviewForm) {
      reviewForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var firstName = reviewForm.querySelector('[data-ft-review-first]');
        var lastName = reviewForm.querySelector('[data-ft-review-last]');
        var emailInput = reviewForm.querySelector('[data-ft-review-email]');
        var countryInput = reviewForm.querySelector('[data-ft-review-country]');
        var productInput = reviewForm.querySelector('[data-ft-review-product]');
        var titleInput = reviewForm.querySelector('[data-ft-review-title]');
        var bodyInput = reviewForm.querySelector('[data-ft-review-body]');
        var nameHidden = reviewForm.querySelector('[data-ft-review-name]');
        var composedBody = reviewForm.querySelector('[data-ft-review-composed]');
        var ratingValue = ratingInput ? parseInt(ratingInput.value, 10) : 0;

        if (!ratingValue) {
          if (formStatus) {
            formStatus.hidden = false;
            formStatus.className = 'ft-reviews-widget__error';
            formStatus.textContent = 'Please choose a star rating.';
          }
          return;
        }

        if (!reviewForm.reportValidity()) return;

        var author = [firstName && firstName.value, lastName && lastName.value]
          .filter(Boolean)
          .join(' ')
          .trim();
        var product = productInput ? productInput.value : '';
        var country = countryInput ? countryInput.value : '';
        var photoNames = fileInput
          ? Array.from(fileInput.files || []).map(function (file) {
              return file.name;
            })
          : [];
        var message = bodyInput ? bodyInput.value : '';
        var composed =
          'Product: ' +
          product +
          '\nCountry: ' +
          country +
          '\nRating: ' +
          ratingValue +
          '/5\nTitle: ' +
          (titleInput ? titleInput.value : '') +
          '\n\n' +
          message +
          (photoNames.length ? '\n\nPhotos: ' + photoNames.join(', ') : '') +
          (author ? '\n\n— ' + author : '');

        if (nameHidden) nameHidden.value = author;
        if (composedBody) composedBody.value = composed;

        var localReview = {
          id: 'local-' + Date.now(),
          author: author || 'Customer',
          location: country,
          date: 'Today',
          rating: ratingValue,
          title: titleInput ? titleInput.value : '',
          body: message,
          product: product,
          timestamp: 2000000000 * 86400 + Date.now(),
          color: '#ea580c',
        };
        var saved = readJson(localKey, []);
        saved.unshift(localReview);
        writeJson(localKey, saved);
        if (list) list.insertAdjacentHTML('afterbegin', reviewCardHtml(localReview));
        bindVotes(list);
        updateCount();
        visibleCount = Math.max(visibleCount, pageSize);
        if (sort) sortItems(sort.value);
        applyPagination();

        var submitBtn = reviewForm.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        var formData = new FormData(reviewForm);
        fetch(reviewForm.action || '/contact', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'text/html' },
        })
          .catch(function () {
            /* still keep the on-page review */
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
            reviewForm.reset();
            if (ratingInput) ratingInput.value = '';
            if (starWrap) {
              starWrap.querySelectorAll('[data-ft-star]').forEach(function (btn) {
                btn.classList.remove('is-on');
                btn.setAttribute('aria-pressed', 'false');
              });
            }
            if (formStatus) {
              formStatus.hidden = false;
              formStatus.className = 'ft-reviews-widget__success';
              formStatus.textContent = 'Thanks! Your review was added.';
            }
            window.setTimeout(function () {
              closeDialog(writeDialog);
              if (formStatus) formStatus.hidden = true;
            }, 700);
          });
      });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-ft-reviews]').forEach(initWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var root = event.target.querySelector('[data-ft-reviews]');
    if (root) {
      root.dataset.ftReviewsInit = 'false';
      initWidget(root);
    }
  });
})();
