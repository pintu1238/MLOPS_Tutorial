// scripts/take-live-screenshot.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('admin.shopify.com') || t.title.includes('Edit pookiewear'));
  
  if (!editorTab) {
    console.error('Editor tab not found!');
    process.exit(1);
  }

  console.log(`Connecting to: ${editorTab.title}`);
  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
    }
  };

  ws.onopen = async () => {
    try {
      await send('Page.enable');
      console.log('Capturing screenshot of Theme Editor...');
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.result && shot.result.data) {
        fs.writeFileSync('editor-screenshot.png', Buffer.from(shot.result.data, 'base64'));
        console.log('Saved editor-screenshot.png successfully!');
      }
      ws.close();
      process.exit(0);
    } catch (err) {
      console.error(err);
      ws.close();
      process.exit(1);
    }
  };
}

main();
