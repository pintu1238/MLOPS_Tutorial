// scripts/shot-contact-page.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) return;

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

    await send('Page.enable');
    const targetUrl = 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor?previewPath=%2Fpages%2Fcontact';
    console.log(`Navigating editor to contact page: ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });

    await new Promise(r => setTimeout(r, 7000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync('contact-page-preview.png', Buffer.from(shot.result.data, 'base64'));
      console.log('📸 Saved contact-page-preview.png successfully!');
    }
    ws.close();
  };
}

main().catch(console.error);
