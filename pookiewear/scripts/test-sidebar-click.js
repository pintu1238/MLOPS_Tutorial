// scripts/test-sidebar-click.js
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

async function clickAt(ws, x, y) {
  console.log(`Clicking at (${x}, ${y})...`);
  await sendCmd(ws, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: x,
    y: y,
    button: 'left',
    clickCount: 1
  });
  await sendCmd(ws, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: x,
    y: y,
    button: 'left',
    clickCount: 1
  });
}

async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('/themes/154203390021/editor'));

  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    try {
      await sendCmd(ws, 'Page.enable');
      
      // Click Desktop view icon (x=1615, y=28)
      console.log('Switching to Desktop view...');
      await clickAt(ws, 1615, 28);
      await new Promise(r => setTimeout(r, 1500));

      // Click on "Featured product" in the left sidebar (x=60, y=268)
      console.log('Clicking on Featured product section in left sidebar...');
      await clickAt(ws, 60, 268);
      await new Promise(r => setTimeout(r, 2000));

      console.log('Capturing screenshot...');
      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const imgData = shot?.result?.data || shot?.data;
      if (imgData) {
        fs.writeFileSync('editor-section-inspector.png', Buffer.from(imgData, 'base64'));
        console.log('Saved editor-section-inspector.png!');
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
