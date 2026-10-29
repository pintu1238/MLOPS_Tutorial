// scripts/inspect-tab10.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('code-editor.shopifycdn.com/0.5.3/index.html'));
  if (!tab) {
    console.error('Tab 10 not found');
    return;
  }
  console.log('Connecting to:', tab.title, tab.url);
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
      expression: `(() => {
        return {
          keys: Object.keys(window).filter(k => !k.startsWith('webkit')),
          vscode: typeof acquireVsCodeApi,
          url: window.location.href
        };
      })()`,
      returnByValue: true
    });
    console.log('Tab 10 window:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
