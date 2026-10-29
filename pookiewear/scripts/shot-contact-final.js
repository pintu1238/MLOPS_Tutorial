// scripts/shot-contact-final.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.type === 'page' && t.url.includes('/editor'));
  if (!editorTab) return;

  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);
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

    console.log('Navigating to contact page in editor...');
    await send('Page.navigate', { url: 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor?previewPath=%2Fpages%2Fcontact' });
    await new Promise(r => setTimeout(r, 6500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync('contact-page-rendered.png', Buffer.from(shot.result.data, 'base64'));
      console.log('📸 Saved contact-page-rendered.png!');
    }

    ws.close();
  };
}

main().catch(console.error);
