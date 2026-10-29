// scripts/inspect-buttons.js
async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const editorTab = tabs.find(t => t.url.includes('/themes/154203390021/editor'));

  const ws = new WebSocket(editorTab.webSocketDebuggerUrl);

  const send = (method, params = {}) => new Promise(r => {
    const id = Math.floor(Math.random() * 1000000);
    const onMsg = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === id) { ws.removeEventListener('message', onMsg); r(d); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });

  ws.onopen = async () => {
    await send('Runtime.enable');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return Array.from(document.querySelectorAll('button')).map((b, i) => ({
            index: i,
            text: b.innerText.trim(),
            ariaLabel: b.getAttribute('aria-label'),
            title: b.getAttribute('title'),
            className: b.className
          })).filter(b => b.text || b.ariaLabel || b.title);
        })()
      `,
      returnByValue: true
    });
    console.log('Eval response:', JSON.stringify(evalRes));
    ws.close();
  };
}
main();
