/**
 * Luxe Step footwear scope on a shared Shopify catalog (winter uses demo-winter).
 */

export const GW_FOOTWEAR_PRODUCT_TAG = 'demo-footwear';

const TAG_TOKEN = `tag:${GW_FOOTWEAR_PRODUCT_TAG}`;

/**
 * @param {string} query
 * @returns {string}
 */
export function scopeFootwearSearchQuery(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) return TAG_TOKEN;
  if (trimmed.toLowerCase().includes(TAG_TOKEN.toLowerCase())) return trimmed;
  return `${TAG_TOKEN} ${trimmed}`;
}

/**
 * @param {string} terms
 * @returns {string}
 */
export function displayFootwearSearchTerms(terms) {
  return (terms || '')
    .replace(new RegExp(`\\s*${TAG_TOKEN}\\s*`, 'gi'), ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {HTMLFormElement | null | undefined} form
 */
export function applyFootwearScopeToSearchForm(form) {
  if (!form) return;
  form.addEventListener('submit', () => {
    const input = form.querySelector('input[name="q"]');
    if (!(input instanceof HTMLInputElement)) return;
    input.value = scopeFootwearSearchQuery(input.value);
  });
}
