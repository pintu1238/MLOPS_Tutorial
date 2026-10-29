// scripts/update-contact-page-content.js
async function main() {
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
    console.log('Clearing old bakery body_html from Contact page (id: 123004911685)...');

    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const m = document.documentElement.innerHTML.match(/"csrfToken":"([^"]+)"/);
          const csrf = m ? m[1] : '';
          const r = await fetch('/store/y9yn6k-me/pages/123004911685.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrf,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              page: {
                id: 123004911685,
                body_html: '',
                template_suffix: 'contact'
              }
            })
          });
          const data = await r.json();
          return { status: r.status, data };
        } catch (e) {
          return { error: e.message };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Update page result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}

main().catch(console.error);
