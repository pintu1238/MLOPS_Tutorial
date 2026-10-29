// scripts/read-theme-asset.js
const path = 'sections/header.liquid';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
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

    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json?asset[key]=sections/header.liquid');
        const d = await r.json();
        return d.asset ? d.asset.value : null;
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Result length:', evalRes.result.value ? evalRes.result.value.length : 'null');
    if (evalRes.result.value) {
      require('fs').writeFileSync('sections/header.liquid', evalRes.result.value);
      console.log('Saved to sections/header.liquid');
    }
    ws.close();
  };
}

main().catch(console.error);
