// scripts/scroll-preview-shot.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const previewTab = tabs.find(t => t.type === 'iframe' && t.url.includes('y9yn6k-me.myshopify.com') && t.url.includes('source=visualPreviewInitialLoad'));
  if (!previewTab) {
    console.error('Preview iframe tab not found');
    return;
  }

  const ws = new WebSocket(previewTab.webSocketDebuggerUrl);
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
    console.log('Scrolling preview iframe...');
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 1000);`
    });

    await new Promise(r => setTimeout(r, 1000));
    ws.close();

    // Now capture from main editor tab
    const editorTab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
    const wsEditor = new WebSocket(editorTab.webSocketDebuggerUrl);
    wsEditor.onopen = async () => {
      let eId = 1;
      function sendE(method, params = {}) {
        return new Promise(res => {
          const curId = eId++;
          const onMsg = e => {
            const d = JSON.parse(e.data);
            if (d.id === curId) {
              wsEditor.removeEventListener('message', onMsg);
              res(d);
            }
          };
          wsEditor.addEventListener('message', onMsg);
          wsEditor.send(JSON.stringify({ id: curId, method, params }));
        });
      }

      await sendE('Page.enable');
      const shot = await sendE('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        fs.writeFileSync('editor-live-scrolled.png', Buffer.from(shot.result.data, 'base64'));
        console.log('📸 Saved editor-live-scrolled.png!');
      }
      wsEditor.close();
    };
  };
}

main().catch(console.error);
