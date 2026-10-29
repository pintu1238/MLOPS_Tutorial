// scripts/inspect-theme-editor.js
const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorIframeTab = tabs.find(t => t.url.includes('online-store-web.shopifyapps.com/themes/154203390021/editor'));

  if (!editorIframeTab) {
    console.log('Tab not found!');
    return;
  }

  console.log(`Connecting to: ${editorIframeTab.url}`);
  const ws = new WebSocket(editorIframeTab.webSocketDebuggerUrl);

  const send = (method, params = {}) => new Promise(r => {
    const id = Math.floor(Math.random() * 1000000);
    const onMsg = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === id) { ws.removeEventListener('message', onMsg); r(d); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });

  ws.onopen = async () => {
    await send('Runtime.enable');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            title: document.title,
            sections: Array.from(document.querySelectorAll('[data-tree-item-title], [aria-label*="section" i], button')).map(b => b.innerText.trim()).filter(Boolean).slice(0, 30)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}

main();
