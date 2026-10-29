// scripts/control-browser.js
const fs = require('fs');

async function sendCmd(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000000);
    const onMsg = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', onMsg);
        resolve(data);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  
  // Find the Shopify admin tab or primary tab
  let targetTab = tabs.find(t => t.url.includes('admin.shopify.com') || t.title.includes('Shopify') || t.title.includes('pookiewear'));
  if (!targetTab) targetTab = tabs[0];

  console.log(`Using tab: ${targetTab.title} (${targetTab.url})`);
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    try {
      await sendCmd(ws, 'Page.enable');
      await sendCmd(ws, 'Runtime.enable');

      // Navigate to the editor if not already there
      const targetUrl = 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor';
      if (!targetTab.url.includes('/editor')) {
        console.log(`Navigating to ${targetUrl}...`);
        await sendCmd(ws, 'Page.navigate', { url: targetUrl });
        // wait 6 seconds for editor to load
        await new Promise(r => setTimeout(r, 6000));
      } else {
        console.log('Already on editor page, waiting 2 seconds...');
        await new Promise(r => setTimeout(r, 2000));
      }

      console.log('Capturing current viewport screenshot...');
      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const imgData = shot?.result?.data || shot?.data;
      if (imgData) {
        fs.writeFileSync('editor-live.png', Buffer.from(imgData, 'base64'));
        console.log('Saved editor-live.png successfully!');
      }

      ws.close();
      process.exit(0);
    } catch (e) {
      console.error(e);
      ws.close();
      process.exit(1);
    }
  };
}

run();
