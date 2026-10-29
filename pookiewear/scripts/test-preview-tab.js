// scripts/test-preview-tab.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const previewTab = tabs.find(t => t.url.startsWith('https://y9yn6k-me.myshopify.com'));
  
  if (!previewTab) {
    console.error('Preview iframe tab not found!');
    process.exit(1);
  }

  console.log(`Connecting to Preview Tab: ${previewTab.title} (${previewTab.url})`);
  const ws = new WebSocket(previewTab.webSocketDebuggerUrl);

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
      await send('Runtime.enable');
      await send('Page.enable');

      // Evaluate some checks on the live preview page
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          ({
            title: document.title,
            sectionsCount: document.querySelectorAll('.shopify-section').length,
            hasPookieElements: !!document.querySelector('.pookie-bundle-tier, .pookie-bundle-wrap, .pookie-main-wrap'),
            bodyClasses: document.body.className,
            heading: document.querySelector('h1, h2')?.textContent?.trim()
          })
        `,
        returnByValue: true
      });

      console.log('Page Diagnostics:', JSON.stringify(evalRes.result.value, null, 2));

      console.log('Capturing screenshot...');
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const data = shot?.result?.data || shot?.data;
      if (data) {
        fs.writeFileSync('storefront-preview.png', Buffer.from(data, 'base64'));
        console.log('Saved storefront-preview.png successfully!');
      } else {
        console.log('Screenshot response was:', JSON.stringify(shot));
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
