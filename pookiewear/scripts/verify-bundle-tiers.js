const fs = require('fs');

async function sendCmd(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000000);
    const onMsg = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', onMsg);
        resolve(data);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.id === '4FD181B465135B5DBF14EB856036B2F6') || tabs.find(t => t.type === 'page' && t.url.includes('y9yn6k-me.myshopify.com'));
  if (!tab) {
    console.error('Storefront tab not found');
    process.exit(1);
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = async () => {
    await sendCmd(ws, 'Page.enable');
    await sendCmd(ws, 'Runtime.enable');

    async function screenshot(name) {
      const shot = await sendCmd(ws, 'Page.captureScreenshot', { format: 'png' });
      const data = shot?.result?.data || shot?.data;
      if (data) {
        fs.writeFileSync(name, Buffer.from(data, 'base64'));
        console.log(`Saved ${name}`);
      }
    }

    console.log('Navigating to theme 154203390021 preview...');
    await sendCmd(ws, 'Page.navigate', { url: 'https://y9yn6k-me.myshopify.com/?preview_theme_id=154203390021' });
    await new Promise(r => setTimeout(r, 4000));

    // Scroll to bundle section so it's fully in view
    console.log('Scrolling to bundle section...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.pookie-bundle-section');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // Tier 1
    console.log('Clicking Tier 1...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t1 = document.querySelector('[data-tier="1"]');
        if (t1) { t1.click(); return 'clicked'; }
        return 'not found';
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    await screenshot('pookie-shot-tier-1-detail.png');

    // Tier 2
    console.log('Clicking Tier 2...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t2 = document.querySelector('[data-tier="2"]');
        if (t2) { t2.click(); return 'clicked'; }
        return 'not found';
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    await screenshot('pookie-shot-tier-2-detail.png');

    // Tier 3
    console.log('Clicking Tier 3...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t3 = document.querySelector('[data-tier="3"]');
        if (t3) { t3.click(); return 'clicked'; }
        return 'not found';
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    await screenshot('pookie-shot-tier-3-detail.png');

    ws.close();
    console.log('Bundle tier details captured!');
  };
}

main().catch(console.error);
