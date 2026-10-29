// scripts/inspect-themes-page.js
async function run() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const themeTab = tabs.find(t => t.url.includes('online-store-web.shopifyapps.com/themes') && !t.url.includes('/editor'));
  if (!themeTab) {
    console.error('No themes iframe tab');
    return;
  }
  console.log('Connecting to:', themeTab.url.substring(0, 80));
  const ws = new WebSocket(themeTab.webSocketDebuggerUrl);

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
        const text = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button, a')).map(b => ({
          tag: b.tagName,
          text: b.innerText.trim(),
          ariaLabel: b.getAttribute('aria-label'),
          href: b.getAttribute('href')
        })).filter(b => b.text || b.ariaLabel);
        return {
          buttons: buttons.slice(0, 30),
          snippet: text.substring(0, 300)
        };
      })()`,
      returnByValue: true
    });
    console.log('Result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}
run();
