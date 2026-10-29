// scripts/check-tabs.js
async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  tabs.forEach((t, i) => {
    console.log(`[${i}] ${t.id} - ${t.title} - ${t.url}`);
  });
}
main().catch(console.error);
