/**
 * Girls Purse wishlist — localStorage + header drawer UI.
 */
export const GW_WISHLIST_EVENT = 'gw:wishlistupdate';
const STORAGE_KEY = 'gp-wishlist';
const LEGACY_KEY = 'gw-bs-saved';

/**
 * @typedef {{ id: string, title: string, url: string, image: string, price?: string }} WishlistItem
 */

/** @returns {WishlistItem[]} */
export function readWishlist() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
  } catch {
    return [];
  }
}

/** @param {WishlistItem[]} items */
export function writeWishlist(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* private mode */
  }
  document.dispatchEvent(new CustomEvent(GW_WISHLIST_EVENT, { detail: { items } }));
}

/** @param {WishlistItem} item */
export function toggleWishlistItem(item) {
  const list = readWishlist();
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    list.splice(index, 1);
    writeWishlist(list);
    return false;
  }
  list.push(item);
  writeWishlist(list);
  return true;
}

/** @param {string} id */
export function removeWishlistItem(id) {
  const list = readWishlist().filter((entry) => entry.id !== id);
  writeWishlist(list);
}

/** @param {string} id */
export function isInWishlist(id) {
  return readWishlist().some((entry) => entry.id === id);
}

function parseToggleButton(button) {
  const id = button.dataset.wishlistId;
  if (!id) return null;
  return {
    id,
    title: button.dataset.wishlistTitle || '',
    url: button.dataset.wishlistUrl || '',
    image: button.dataset.wishlistImage || '',
    price: button.dataset.wishlistPrice || '',
  };
}

function syncToggleButtons() {
  const list = readWishlist();
  const ids = new Set(list.map((item) => item.id));
  document.querySelectorAll('[data-gw-wishlist-toggle]').forEach((button) => {
    const id = button.dataset.wishlistId;
    if (!id) return;
    button.setAttribute('aria-pressed', ids.has(id) ? 'true' : 'false');
  });
}

function syncCountBadges() {
  const count = readWishlist().length;
  document.querySelectorAll('[data-gw-wishlist-count]').forEach((el) => {
    el.textContent = count < 100 ? String(count) : '';
    el.classList.toggle('hidden', count === 0);
  });
  document.querySelectorAll('[data-gw-wishlist-bubble]').forEach((bubble) => {
    bubble.classList.toggle('visually-hidden', count === 0);
    bubble.classList.toggle('gw-wishlist-bubble--active', count > 0);
  });
}

function renderDrawerList() {
  const root = document.querySelector('[data-gw-wishlist-list]');
  const empty = document.querySelector('[data-gw-wishlist-empty]');
  if (!root) return;

  const items = readWishlist();
  root.replaceChildren();

  if (items.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  const list = document.createElement('ul');
  list.className = 'gw-wishlist__items';
  list.setAttribute('role', 'list');

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'gw-wishlist__item';

    const link = document.createElement('a');
    link.className = 'gw-wishlist__thumb';
    link.href = item.url || '#';
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      img.width = 120;
      img.height = 150;
      img.loading = 'lazy';
      link.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'gw-wishlist__body';

    const titleLink = document.createElement('a');
    titleLink.className = 'gw-wishlist__name';
    titleLink.href = item.url || '#';
    titleLink.textContent = item.title || '';

    body.appendChild(titleLink);

    if (item.price) {
      const price = document.createElement('p');
      price.className = 'gw-wishlist__price';
      price.textContent = item.price;
      body.appendChild(price);
    }

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'gw-wishlist__remove button-unstyled';
    remove.setAttribute('data-gw-wishlist-remove', item.id);
    remove.textContent = root.dataset.removeLabel || 'Remove';

    body.appendChild(remove);
    li.append(link, body);
    list.appendChild(li);
  }

  root.appendChild(list);
}

function refreshWishlistUi() {
  syncToggleButtons();
  syncCountBadges();
  renderDrawerList();
}

function handleDocumentClick(event) {
  const toggle = event.target.closest('[data-gw-wishlist-toggle]');
  if (toggle) {
    event.preventDefault();
    event.stopPropagation();
    const item = parseToggleButton(toggle);
    if (!item) return;
    toggleWishlistItem(item);
    return;
  }

  const removeBtn = event.target.closest('[data-gw-wishlist-remove]');
  if (removeBtn) {
    event.preventDefault();
    const id = removeBtn.getAttribute('data-gw-wishlist-remove');
    if (id) removeWishlistItem(id);
  }
}

function migrateLegacySaved() {
  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* noop */
  }
}

function boot() {
  migrateLegacySaved();
  refreshWishlistUi();
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener(GW_WISHLIST_EVENT, refreshWishlistUi);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) refreshWishlistUi();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
