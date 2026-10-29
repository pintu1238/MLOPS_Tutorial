// scripts/verify-contact-and-header.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.type === 'page' && t.url.includes('/editor'));
  if (!editorTab) {
    console.error('Editor tab not found');
    return;
  }

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

    console.log('Reloading contact page editor...');
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 6000));

    const shotContact = await send('Page.captureScreenshot', { format: 'png' });
    if (shotContact.result?.data) {
      fs.writeFileSync('contact-page-final.png', Buffer.from(shotContact.result.data, 'base64'));
      console.log('📸 Saved contact-page-final.png!');
    }

    // Now navigate to Home page in Theme Editor
    console.log('Navigating editor back to Home page...');
    await send('Page.navigate', { url: 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor' });
    await new Promise(r => setTimeout(r, 7000));

    const shotHome = await send('Page.captureScreenshot', { format: 'png' });
    if (shotHome.result?.data) {
      fs.writeFileSync('home-page-final.png', Buffer.from(shotHome.result.data, 'base64'));
      console.log('📸 Saved home-page-final.png!');
    }

    ws.close();
  };
}

main().catch(console.error);
