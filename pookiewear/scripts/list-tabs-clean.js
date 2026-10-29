// scripts/list-tabs-clean.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  tabs.forEach((t, idx) => {
    console.log(`[${idx}] id: ${t.id} | title: "${t.title}" | type: ${t.type} | url: ${t.url.substring(0, 100)}`);
  });
}
run();
