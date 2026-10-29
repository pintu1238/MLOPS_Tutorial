// scripts/shot-tab6.js
const fs = require('fs');
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) {
    console.error('Tab 6 not found');
    return;
  }
  console.log('Connecting to:', tab.title, tab.url);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
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

  ws.onopen = async () => {
    await send('Page.enable');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync('code-editor-actual.png', Buffer.from(shot.result.data, 'base64'));
      console.log('Saved code-editor-actual.png!');
    }
    ws.close();
  };
}
run();
