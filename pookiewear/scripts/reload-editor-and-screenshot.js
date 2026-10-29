// scripts/reload-editor-and-screenshot.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.type === 'page' && t.url.includes('/editor'));
  if (!editorTab) {
    console.error('Editor tab not found');
    return;
  }

  console.log(`Connecting to editor tab: ${editorTab.title}`);
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
    console.log('Reloading editor tab...');
    await send('Page.reload', { ignoreCache: true });

    console.log('Waiting 8 seconds for editor to render completely...');
    await new Promise(r => setTimeout(r, 8000));

    console.log('Capturing live editor screenshot...');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync('editor-pookie-live.png', Buffer.from(shot.result.data, 'base64'));
      console.log('📸 Saved editor-pookie-live.png successfully!');
    } else {
      console.error('Failed to capture screenshot');
    }

    ws.close();
  };
}

main().catch(console.error);
