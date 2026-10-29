/** Shared 8 studio shot prompts per SKU (use with fw-gen reference). */
export const SHOT_PROMPTS = [
  'Professional e-commerce product photo, pure white studio background, front three-quarter view of the EXACT same shoe as the reference, sharp focus, no people, no text, no other products.',
  'Same exact shoe as reference, side profile studio shot, white background, single product only.',
  'Same exact shoe as reference, top-down view showing pair arranged neatly, white background.',
  'Same exact shoe as reference, extreme close-up of toe box and material texture, macro product detail.',
  'Same exact shoe as reference, heel and sole detail angle, white studio background.',
  'Same exact shoe as reference, worn on feet of a model walking, lower legs only, gender matches product, urban sidewalk, shoe must match reference.',
  'Same exact shoe as reference, lifestyle studio shot on minimal pedestal, soft shadow, editorial footwear.',
  'Same exact shoe as reference, three-quarter back angle showing heel counter, clean studio background.',
];

export function titleFromHandle(handle) {
  return handle
    .split('-')
    .map((w) => (w === 'womens' ? "Women's" : w === 'mens' ? "Men's" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/Womens/g, "Women's")
    .replace(/Mens/g, "Men's");
}
