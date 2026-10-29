// scripts/find-csrf.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  
  for (const t of tabs) {
    if (!t.webSocketDebuggerUrl) continue;
    if (!t.url.includes('shopify')) continue;

    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((resolve) => {
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
        try {
          await send('Runtime.enable');
          const evalRes = await send('Runtime.evaluate', {
            expression: `(() => {
              const meta = Array.from(document.querySelectorAll('meta')).map(m => ({
                name: m.getAttribute('name'),
                content: m.getAttribute('content')?.substring(0, 30)
              }));
              const cookies = document.cookie;
              return {
                url: window.location.href.substring(0, 60),
                meta: meta.filter(m => m.name),
                hasCsrf: /csrf/i.test(document.documentElement.innerHTML)
              };
            })()`,
            returnByValue: true
          });
          const val = evalRes.result?.result?.value;
          if (val) {
            console.log(`Tab: ${val.url} -> meta:`, val.meta, 'hasCsrf:', val.hasCsrf);
          }
        } catch (e) {}
        ws.close();
        resolve();
      };
      ws.onerror = () => resolve();
    });
  }
}
run();
