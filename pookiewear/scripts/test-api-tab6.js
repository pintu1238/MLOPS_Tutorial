// scripts/test-api-tab6.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) {
    console.error('Tab 6 not found');
    return;
  }
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
    await send('Runtime.enable');
    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json');
          return { status: r.status, type: r.headers.get('content-type') };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Fetch result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
