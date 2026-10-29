async function run() {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const tab = tabs.find(t => t.url && t.url.includes('contact'));
  if (!tab) {
    console.log('No contact tab found');
    return;
  }
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
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button, input[type="submit"]')).map(b => ({
          tag: b.tagName,
          className: b.className,
          text: b.innerText || b.value,
          bg: window.getComputedStyle(b).backgroundColor,
          color: window.getComputedStyle(b).color,
          outerHTML: b.outerHTML
        }));
        return btns;
      })()`,
      returnByValue: true
    });
    console.log('Buttons on contact page:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run().catch(console.error);
