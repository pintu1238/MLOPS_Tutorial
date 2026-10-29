// scripts/test-eval.js
async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  console.log('Tab url:', tab.url);

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
      expression: `(() => {
        const m = document.documentElement.innerHTML.match(/"csrfToken":"([^"]+)"/);
        return { csrf: m ? m[1].substring(0, 10) : 'none', title: document.title };
      })()`,
      returnByValue: true
    });

    console.log('Eval result:', evalRes);
    ws.close();
  };
}

main().catch(console.error);
