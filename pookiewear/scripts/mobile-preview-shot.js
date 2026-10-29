// scripts/mobile-preview-shot.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
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

    await send('Runtime.enable');
    await send('Page.enable');

    // Click mobile button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label*="Mobile" i], button[title*="Mobile" i]');
        if (btn) btn.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 2000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync('editor-live-mobile.png', Buffer.from(shot.result.data, 'base64'));
      console.log('📸 Saved editor-live-mobile.png!');
    }
    ws.close();
  };
}

main().catch(console.error);
