// scripts/quick-status-screenshots.js
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

async function captureTab(tab, outPath) {
  if (!tab || !tab.webSocketDebuggerUrl) return false;
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  return new Promise((resolve) => {
    ws.onopen = async () => {
      try {
        await sendCmd(ws, 'Page.enable');
        const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
        const data = shot?.result?.data || shot?.data;
        if (data) {
          fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
          console.log(`Saved ${outPath}`);
        }
        ws.close();
        resolve(true);
      } catch (e) {
        console.error(e);
        ws.close();
        resolve(false);
      }
    };
    ws.onerror = () => resolve(false);
  });
}

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  
  // Find Theme Editor tab for pookiewear
  const editorTab = tabs.find(t => t.url.includes('admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor'));
  if (editorTab) {
    await captureTab(editorTab, 'live-editor-current.png');
  }

  // Find Preview tab
  const previewTab = tabs.find(t => t.url.includes('y9yn6k-me.myshopify.com') && t.url.includes('source=visualPreviewInitialLoad'));
  if (previewTab) {
    await captureTab(previewTab, 'live-storefront-current.png');
  }
}

main();
