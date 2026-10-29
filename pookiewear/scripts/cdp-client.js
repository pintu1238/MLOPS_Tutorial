// scripts/cdp-client.js
// Direct CDP Client using Node 24 native fetch & WebSocket

async function inspectBrave() {
  const cdpPort = 9222;
  try {
    const res = await fetch(`http://127.0.0.1:${cdpPort}/json`);
    const tabs = await res.json();
    console.log(`Found ${tabs.length} tabs in Brave:`);
    tabs.forEach((t, i) => {
      console.log(`[${i}] ${t.title} (${t.url})`);
    });
    return tabs;
  } catch (err) {
    console.error(`Cannot connect to Brave on port ${cdpPort}: ${err.message}`);
    return null;
  }
}

async function captureTabScreenshot(targetUrlSubstring, outputPath) {
  const fs = require('fs');
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes(targetUrlSubstring) || t.title.includes(targetUrlSubstring));
  
  if (!tab || !tab.webSocketDebuggerUrl) {
    console.error(`Tab matching "${targetUrlSubstring}" not found!`);
    return false;
  }

  console.log(`Connecting to tab: "${tab.title}" (${tab.url})`);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  return new Promise((resolve, reject) => {
    let msgId = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      return new Promise((resCallback) => {
        const id = msgId++;
        callbacks.set(id, resCallback);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onopen = async () => {
      try {
        await send('Page.enable');
        const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
        if (screenshotRes.result && screenshotRes.result.data) {
          fs.writeFileSync(outputPath, Buffer.from(screenshotRes.result.data, 'base64'));
          console.log(`📸 Screenshot saved to: ${outputPath}`);
        }
        ws.close();
        resolve(true);
      } catch (e) {
        ws.close();
        reject(e);
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        cb(data);
      }
    };

    ws.onerror = (err) => {
      reject(err);
    };
  });
}

module.exports = { inspectBrave, captureTabScreenshot };

if (require.main === module) {
  inspectBrave();
}
