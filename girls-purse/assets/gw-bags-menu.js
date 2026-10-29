/**
 * Click-to-open Bags category panel (header + mobile drawer).
 */

const ROOT_SELECTOR = '[data-gw-bags-menu]';
const TRIGGER_SELECTOR = '[data-gw-bags-trigger]';
const PANEL_SELECTOR = '[data-gw-bags-panel]';

/** @type {AbortController | null} */
let docController = null;

function closeAll(exceptRoot) {
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (exceptRoot && root === exceptRoot) return;
    setOpen(root, false);
  });
}

/**
 * @param {Element} root
 * @param {boolean} open
 */
function setOpen(root, open) {
  const trigger = root.querySelector(TRIGGER_SELECTOR);
  const panel = root.querySelector(PANEL_SELECTOR);
  if (!(trigger instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  trigger.classList.toggle('is-open', open);
  panel.toggleAttribute('hidden', !open);
  root.classList.toggle('is-open', open);
}

/**
 * @param {Element} root
 */
function bindRoot(root) {
  if (root.getAttribute('data-gw-bags-bound') === 'true') return;
  root.setAttribute('data-gw-bags-bound', 'true');

  const trigger = root.querySelector(TRIGGER_SELECTOR);
  const panel = root.querySelector(PANEL_SELECTOR);
  if (!(trigger instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      setOpen(root, false);
    } else {
      closeAll(root);
      setOpen(root, true);
    }
  });

  panel.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

function onDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest(ROOT_SELECTOR)) return;
  closeAll();
}

function onDocumentKeydown(event) {
  if (event.key !== 'Escape') return;
  closeAll();
}

function init() {
  document.querySelectorAll(ROOT_SELECTOR).forEach(bindRoot);

  if (!docController) {
    docController = new AbortController();
    const { signal } = docController;
    document.addEventListener('click', onDocumentClick, { signal });
    document.addEventListener('keydown', onDocumentKeydown, { signal });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

document.addEventListener('shopify:section:load', init);
