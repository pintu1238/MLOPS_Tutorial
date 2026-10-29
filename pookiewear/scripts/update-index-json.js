// scripts/update-index-json.js
const fs = require('fs');

const pookieIndexTemplate = {
  sections: {
    top_bar: {
      type: "pookie-top-bar",
      settings: {}
    },
    main_product: {
      type: "pookie-main-product",
      settings: {}
    },
    story_banners: {
      type: "pookie-story-banners",
      settings: {}
    },
    reviews: {
      type: "pookie-reviews",
      settings: {}
    },
    guarantee: {
      type: "pookie-guarantee",
      settings: {}
    },
    sticky_bar: {
      type: "pookie-sticky-bar",
      settings: {}
    }
  },
  order: [
    "top_bar",
    "main_product",
    "story_banners",
    "reviews",
    "guarantee",
    "sticky_bar"
  ]
};

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) {
    console.error('Tab 6 not found');
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
    console.log('Updating templates/index.json in theme...');

    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const m = document.documentElement.innerHTML.match(/"csrfToken":"([^"]+)"/);
          const csrf = m ? m[1] : '';
          const newContent = ${JSON.stringify(JSON.stringify(pookieIndexTemplate, null, 2))};

          const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrf,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              asset: {
                key: 'templates/index.json',
                value: newContent
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

    console.log('Update result:', JSON.stringify(evalRes.result?.result?.value, null, 2));
    ws.close();
  };
}

main().catch(console.error);
