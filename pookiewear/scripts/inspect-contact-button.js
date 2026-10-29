// Use built-in WebSocket

async function run() {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const tab = tabs.find(t => t.url && (t.url.includes('contact') || t.url.includes('154203390021')));
  if (!tab) return;
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

    // Navigate to contact page with preview_theme_id
    await send('Page.navigate', { url: 'https://y9yn6k-me.myshopify.com/pages/contact?preview_theme_id=154203390021' });
    await new Promise(r => setTimeout(r, 3000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.contact-form__submit-btn') || document.querySelector('button[type="submit"]') || document.querySelector('.contact form button');
        if (!btn) return { notFound: true, body: document.body.innerHTML.substring(0, 500) };
        const cs = window.getComputedStyle(btn);
        return {
          tagName: btn.tagName,
          className: btn.className,
          bg: cs.backgroundColor,
          color: cs.color,
          outerHTML: btn.outerHTML
        };
      })()`,
      returnByValue: true
    });
    console.log('Contact button details:', evalRes.result?.result?.value);
    ws.close();
  };
}
run().catch(console.error);
