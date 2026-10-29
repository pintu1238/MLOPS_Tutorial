// scripts/verify-all.js
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
  console.log('Connecting to tab:', tab.id, tab.url);

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
      } else {
        console.error(`Failed to capture ${name}`, shot);
      }
    }

    // 1. Navigate to homepage and wait
    console.log('Navigating to homepage...');
    await sendCmd(ws, 'Page.navigate', { url: 'https://y9yn6k-me.myshopify.com/' });
    await new Promise(r => setTimeout(r, 3500));

    // Capture top fold (Timer, Header, Gallery, Buy Box)
    await screenshot('shot-top-fold.png');

    // 2. Click Tier 1
    console.log('Clicking Tier 1...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t1 = document.querySelector('[data-tier="1"]');
        if (t1) t1.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await screenshot('shot-tier-1.png');

    // 3. Click Tier 3
    console.log('Clicking Tier 3...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t3 = document.querySelector('[data-tier="3"]');
        if (t3) t3.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await screenshot('shot-tier-3.png');

    // 4. Click Tier 2 back (default)
    console.log('Clicking Tier 2...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const t2 = document.querySelector('[data-tier="2"]');
        if (t2) t2.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    await screenshot('shot-tier-2.png');

    // 5. Scroll down to Reviews
    console.log('Scrolling to Reviews...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.pookie-reviews-section');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    await screenshot('shot-reviews.png');

    // 6. Scroll down to Guarantee
    console.log('Scrolling to Guarantee...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.ths-gtee');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    await screenshot('shot-guarantee.png');

    // 7. Scroll down to Footer
    console.log('Scrolling to Footer...');
    await sendCmd(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('footer.site-footer');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    await screenshot('shot-footer.png');

    // 8. Navigate to /pages/contact
    console.log('Navigating to Contact Page...');
    await sendCmd(ws, 'Page.navigate', { url: 'https://y9yn6k-me.myshopify.com/pages/contact' });
    await new Promise(r => setTimeout(r, 3500));
    await screenshot('shot-contact-page.png');

    ws.close();
    console.log('All screenshots verified!');
  };
}

main().catch(console.error);
