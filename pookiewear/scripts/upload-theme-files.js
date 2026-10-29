// scripts/upload-theme-files.js
const fs = require('fs');
const path = require('path');

const filesToUpload = [
  // Assets
  { key: 'assets/pookie-styles.css', local: 'assets/pookie-styles.css' },
  { key: 'assets/pookie-scripts.js', local: 'assets/pookie-scripts.js' },

  // Snippets
  { key: 'snippets/pookie-bundle-card.liquid', local: 'snippets/pookie-bundle-card.liquid' },

  // Sections
  { key: 'sections/pookie-top-bar.liquid', local: 'sections/pookie-top-bar.liquid' },
  { key: 'sections/header.liquid', local: 'sections/header.liquid' },
  { key: 'sections/contact-form.liquid', local: 'sections/contact-form.liquid' },
  { key: 'sections/footer.liquid', local: 'sections/footer.liquid' },
  { key: 'sections/pookie-main-product.liquid', local: 'sections/pookie-main-product.liquid' },
  { key: 'sections/pookie-reviews.liquid', local: 'sections/pookie-reviews.liquid' },
  { key: 'sections/pookie-guarantee.liquid', local: 'sections/pookie-guarantee.liquid' }
];

async function main() {
  const root = path.resolve(__dirname, '..');
  const payload = filesToUpload.map(f => ({
    key: f.key,
    value: fs.readFileSync(path.join(root, f.local), 'utf8')
  }));

  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === 'C43B2633F3986DF68E6AD70F68C898E2');
  if (!tab) {
    console.error('Tab C43B2633F3986DF68E6AD70F68C898E2 not found');
    process.exit(1);
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

    console.log(`Uploading ${payload.length} files to theme 154203390021...`);

    for (const file of payload) {
      process.stdout.write(`Uploading ${file.key}... `);
      const evalRes = await send('Runtime.evaluate', {
        expression: `(async () => {
          try {
            const m = document.documentElement.innerHTML.match(/"csrfToken":"([^"]+)"/);
            const csrf = m ? m[1] : '';
            const fileData = ${JSON.stringify(file)};
            const r = await fetch('/store/y9yn6k-me/themes/154203390021/assets.json', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrf,
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                asset: {
                  key: fileData.key,
                  value: fileData.value
                }
              })
            });
            const data = await r.json();
            return { status: r.status, ok: r.ok, key: data.asset?.key, errors: data.errors };
          } catch (e) {
            return { error: e.message };
          }
        })()`,
        awaitPromise: true,
        returnByValue: true
      });

      const out = evalRes.result?.result?.value;
      if (out && out.ok) {
        console.log(`OK (status ${out.status}, key: ${out.key})`);
      } else {
        console.log(`FAILED`, JSON.stringify(out));
      }
    }

    ws.close();
    console.log('All uploads complete!');
  };
}

main().catch(console.error);
