// scripts/back-to-home.js
async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.type === 'page' && t.url.includes('/editor'));
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

    await send('Page.enable');
    await send('Page.navigate', { url: 'https://admin.shopify.com/store/y9yn6k-me/themes/154203390021/editor' });
    await new Promise(r => setTimeout(r, 4000));
    ws.close();
  };
}

main().catch(console.error);
