const fs = require('fs');
const path = require('path');

const previewHtml = fs.readFileSync(path.join(__dirname, 'preview.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'assets', 'pookie-styles.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'assets', 'pookie-scripts.js'), 'utf8');

const bodyMatch = previewHtml.match(/<body class="pookie-theme-wrapper">([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error('Could not match body');
  process.exit(1);
}

let innerHtml = bodyMatch[1].replace(/<script src="assets\/pookie-scripts\.js"><\/script>/, '');

const standaloneContent = `{% comment %}
  Pookie Hoodie - Complete All-In-One Standalone Section
  You can paste this entire file as a new Section in Shopify (Online Store > Themes > Edit Code > Sections > Add a new section: pookie-standalone.liquid)
  Or use it inside any Page / Product template.
{% endcomment %}

<style>
${css}
</style>

<div class="pookie-theme-wrapper">
${innerHtml.trim()}
</div>

<script>
${js}
</script>

{% schema %}
{
  "name": "Pookie Hoodie Landing",
  "settings": [],
  "presets": [
    {
      "name": "Pookie Hoodie Landing"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(__dirname, 'sections', 'pookie-standalone.liquid'), standaloneContent, 'utf8');
console.log('✅ Generated sections/pookie-standalone.liquid successfully!');
