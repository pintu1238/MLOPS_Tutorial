// scripts/test-put-asset.js
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
          const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrf || '',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              asset: {
                key: 'snippets/pookie-test.liquid',
                value: '<!-- pookie test -->'
              }
            })
          });
          const text = await r.text();
          return {
            status: r.status,
            csrfPresent: !!csrf,
            response: text.substring(0, 300)
          };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('PUT result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
