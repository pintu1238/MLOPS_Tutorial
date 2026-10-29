// scripts/check-contact-and-header.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) {
    console.error('Shopify tab not found');
    return;
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = async () => {
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        const onMsg = e => {
          const d = JSON.parse(e.data);
          if (d.id === curId) {
            ws.removeEventListener('message', onMsg);
            res(d);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Runtime.enable');

    // 1. Check settings_data.json
    console.log('Fetching settings_data.json...');
    const settingsRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json?asset[key]=config/settings_data.json');
          const data = await r.json();
          return JSON.parse(data.asset?.value || '{}');
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    // 2. Check header-group.json
    console.log('Fetching sections/header-group.json...');
    const headerRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json?asset[key]=sections/header-group.json');
          const data = await r.json();
          return JSON.parse(data.asset?.value || '{}');
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    // 3. Check templates/page.contact.json
    console.log('Fetching templates/page.contact.json...');
    const contactRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json?asset[key]=templates/page.contact.json');
          const data = await r.json();
          return JSON.parse(data.asset?.value || '{}');
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    const fs = require('fs');
    fs.writeFileSync('header-group.json', JSON.stringify(headerRes.result?.result?.value, null, 2));
    fs.writeFileSync('settings-data.json', JSON.stringify(settingsRes.result?.result?.value, null, 2));
    fs.writeFileSync('page-contact-current.json', JSON.stringify(contactRes.result?.result?.value, null, 2));

    console.log('Header Group sections:', Object.keys(headerRes.result?.result?.value?.sections || {}));
    console.log('Contact Page sections:', Object.keys(contactRes.result?.result?.value?.sections || {}));
    ws.close();
  };
}

run().catch(console.error);
