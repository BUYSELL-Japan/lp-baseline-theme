import puppeteer from 'puppeteer';
import http from 'http';

async function warmup(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    }).on('error', resolve);
  });
}

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Block Vite HMR websockets (causes ERR_ABORTED/timeout with networkidle)
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'websocket' || req.url().includes('/@vite/') || req.url().includes('/@fs/')) {
      // allow @vite and @fs as they serve JS modules
      req.continue();
    } else {
      req.continue();
    }
  });

  console.log(`Navigating to ${url}...`);
  // Use 'commit' which fires as soon as any bytes arrive - avoids timeout from Vite HMR
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
  } catch(e) {
    console.warn(`goto error: ${e.message}`);
  }

  // Wait for React to hydrate and render fully
  console.log('Waiting for React render...');
  await new Promise(r => setTimeout(r, 6000));

  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Saved: ${outputPath}`);
}

async function run() {
  const base = 'http://localhost:4321/demo';
  const dest = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images';

  for (const id of [2, 4, 5]) {
    const url = `${base}/theme${id}`;
    const out = `${dest}\\theme${id}_mockup.jpg`;
    console.log(`\n=== Theme ${id} ===`);
    // Warmup twice to ensure Vite has already compiled the page
    await warmup(url);
    await new Promise(r => setTimeout(r, 2000));
    await warmup(url);
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(url, out);
  }

  console.log('\nAll done!');
}

run().catch(console.error);
