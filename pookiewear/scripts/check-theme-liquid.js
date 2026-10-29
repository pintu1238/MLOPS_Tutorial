const fs = require('fs');

async function run() {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = async () => {
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        const onMsg = e => {
          const d = JSON.parse(e.data);
          if (d.id === curId) { ws.removeEventListener('message', onMsg); res(d); }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }
    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json?asset[key]=layout/theme.liquid');
        const d = await r.json();
        return d.asset ? d.asset.value : null;
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    const val = evalRes.result?.result?.value;
    console.log('Result:', evalRes.result?.result);
    console.log('theme.liquid length:', val ? val.length : 'null');
    console.log('has pookie-styles?', val && val.includes('pookie-styles.css'));
    console.log('has pookie-scripts?', val && val.includes('pookie-scripts.js'));
    if (val) fs.writeFileSync('layout-theme-live.liquid', val);
    ws.close();
  };
}
run().catch(console.error);
