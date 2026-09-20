import puppeteer from 'puppeteer';

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch(e) {
    console.warn(`goto error: ${e.message}`);
  }

  // Extra wait for images and fonts to finish rendering just in case
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Saved: ${outputPath}`);
}

async function run() {
  const base = 'http://127.0.0.1:4321/demo';
  const dest = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images';

  for (const id of [1, 2, 3, 4]) {
    const url = `${base}/theme${id}`;
    const out = `${dest}\\theme${id}_mockup.jpg`;
    console.log(`\n=== Theme ${id} ===`);
    await takeScreenshot(url, out);
  }

  console.log('\nAll done!');
}

run().catch(console.error);
