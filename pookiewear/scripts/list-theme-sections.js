// scripts/list-theme-sections.js
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
        const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json');
        const d = await r.json();
        return d.assets.map(a => a.key).filter(k => k.includes('header') || k.includes('footer') || k.includes('contact'));
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Matching assets:', evalRes.result.value);
    ws.close();
  };
}

main().catch(console.error);
