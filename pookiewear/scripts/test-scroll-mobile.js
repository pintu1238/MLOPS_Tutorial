// scripts/test-scroll-mobile.js
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

async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('/themes/154203390021/editor'));

  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    try {
      await sendCmd(ws, 'Page.enable');
      
      // Scroll down inside the mobile preview frame (around x=580, y=500)
      console.log('Dispatching mouse wheel scroll down...');
      await sendCmd(ws, 'Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 580,
        y: 500,
        deltaX: 0,
        deltaY: 1200
      });
      
      await new Promise(r => setTimeout(r, 1500));

      console.log('Capturing screenshot after scroll...');
      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const imgData = shot?.result?.data || shot?.data;
      if (imgData) {
        fs.writeFileSync('editor-mobile-scrolled.png', Buffer.from(imgData, 'base64'));
        console.log('Saved editor-mobile-scrolled.png!');
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
