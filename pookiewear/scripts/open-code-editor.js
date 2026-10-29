// scripts/open-code-editor.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const themeTab = tabs.find(t => t.type === 'page' && t.url.includes('/themes') && !t.url.includes('/editor'));
  if (!themeTab) {
    console.error('No theme library tab');
    return;
  }

  const ws = new WebSocket(themeTab.webSocketDebuggerUrl);
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
    const targetUrl = 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021';
    console.log(`Navigating tab to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 6000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    if (shot.result && shot.result.data) {
      fs.writeFileSync('code-editor-screenshot.png', Buffer.from(shot.result.data, 'base64'));
      console.log('Saved code-editor-screenshot.png!');
    }
    ws.close();
  };
}
run();
