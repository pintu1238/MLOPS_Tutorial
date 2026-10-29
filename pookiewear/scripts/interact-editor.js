// scripts/interact-editor.js
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

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('/themes/154203390021/editor'));
  
  if (!editorTab) {
    console.error('Editor tab not found');
    process.exit(1);
  }

  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    try {
      await sendCmd(ws, 'Runtime.enable');
      await sendCmd(ws, 'Page.enable');

      // Click the mobile preview button in Shopify Theme Editor top bar
      console.log('Switching to mobile preview mode...');
      const clickMobile = await sendCmd(ws, 'Runtime.evaluate', {
        expression: `
          (() => {
            // Find mobile button in top bar (aria-label or title containing "mobile" or svg icon)
            const btn = document.querySelector('button[aria-label*="Mobile" i], button[title*="Mobile" i], [data-testid="mobile-button"]') 
              || Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('M10') || b.getAttribute('aria-label')?.toLowerCase().includes('mobile'));
            if (btn) {
              btn.click();
              return { success: true, label: btn.getAttribute('aria-label') || 'mobile button clicked' };
            }
            return { success: false };
          })()
        `,
        returnByValue: true
      });
      console.log('Mobile click result:', clickMobile.result?.value);

      await new Promise(r => setTimeout(r, 2000));

      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const imgData = shot?.result?.data || shot?.data;
      if (imgData) {
        fs.writeFileSync('editor-mobile.png', Buffer.from(imgData, 'base64'));
        console.log('Saved editor-mobile.png successfully!');
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
