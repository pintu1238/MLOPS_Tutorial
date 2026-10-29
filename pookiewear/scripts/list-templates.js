// scripts/list-templates.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) return;

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
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
      expression: `(async () => {
        try {
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json');
          const data = await r.json();
          const templates = (data.assets || []).filter(a => a.key.startsWith('templates/'));
          return templates.map(t => t.key);
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Templates in theme:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
