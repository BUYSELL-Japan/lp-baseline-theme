import puppeteer from 'puppeteer';

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'websocket') {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch(e) {
    console.warn(`goto error: ${e.message}`);
  }

  try {
    await page.waitForSelector('main', { timeout: 20000 });
    console.log('Main content detected.');
  } catch(e) {
    console.warn('waitForSelector timed out, continuing anyway');
  }

  console.log('Waiting for React hydration and images (8s)...');
  await new Promise(r => setTimeout(r, 8000));

  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Saved: ${outputPath}`);
}

async function run() {
  const base = 'http://localhost:4321/demo';
  const dest = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images';

  for (const id of [1, 3]) {
    const url = `${base}/theme${id}`;
    const out = `${dest}\\theme${id}_mockup.jpg`;
    console.log(`\n=== Theme ${id} ===`);
    try {
      await fetch(url).catch(() => {});
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1000));

    await takeScreenshot(url, out);
  }

  console.log('\nAll done!');
}

run().catch(console.error);
