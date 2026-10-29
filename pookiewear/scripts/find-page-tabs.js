// scripts/find-page-tabs.js
async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const pageTabs = tabs.filter(t => t.type === 'page');
  pageTabs.forEach(t => console.log(`PAGE TAB: ${t.id} - ${t.url}`));
}
main().catch(console.error);
