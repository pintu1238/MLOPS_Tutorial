// scripts/get-csrf-value.js
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
      expression: `(() => {
        const html = document.documentElement.innerHTML;
        const matches = [];
        const regex = /csrf[^"'\s>]{0,100}/gi;
        let m;
        while ((m = regex.exec(html)) !== null && matches.length < 20) {
          matches.push(m[0]);
        }
        return matches;
      })()`,
      returnByValue: true
    });
    console.log('CSRF matches:', evalRes.result?.result?.value);
    ws.close();
  };
}
run();
