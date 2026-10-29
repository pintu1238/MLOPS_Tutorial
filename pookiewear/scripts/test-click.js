// scripts/test-click.js
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
      
      // Click on the Mobile view icon in the top toolbar
      // In the 1910 width layout:
      // Phone icon is around x=1640, y=28
      await clickAt(ws, 1640, 28);
      
      // Wait 2 seconds for animation/re-render
      await new Promise(r => setTimeout(r, 2000));

      console.log('Capturing screenshot after click...');
      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const imgData = shot?.result?.data || shot?.data;
      if (imgData) {
        fs.writeFileSync('editor-after-mobile-click.png', Buffer.from(imgData, 'base64'));
        console.log('Saved editor-after-mobile-click.png!');
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
