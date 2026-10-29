// scripts/inspect-iframe-editor.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const iframeTab = tabs.find(t => t.url.includes('online-store-web.shopifyapps.com/themes/154203390021/editor'));
  if (!iframeTab) {
    console.error('No iframe editor tab');
    return;
  }
  console.log('Connecting to:', iframeTab.url.substring(0, 80));
  const ws = new WebSocket(iframeTab.webSocketDebuggerUrl);

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
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
        return {
          title: document.title,
          buttons: btns.slice(0, 20)
        };
      })()`,
      returnByValue: true
    });
    console.log('Result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
