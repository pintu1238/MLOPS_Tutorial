// scripts/inspect-editor-dom.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('/themes/154203390021/editor'));
  if (!editorTab) {
    console.error('No editor tab');
    return;
  }
  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

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
      expression: `document.title`,
      returnByValue: true
    });
    console.log('Title result:', JSON.stringify(evalRes));

    const evalRes2 = await send('Runtime.evaluate', {
      expression: `window.location.href`,
      returnByValue: true
    });
    console.log('Location result:', JSON.stringify(evalRes2));

    ws.close();
  };
}
run();
