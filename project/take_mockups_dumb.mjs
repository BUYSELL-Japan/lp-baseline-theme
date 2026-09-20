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

  console.log(`Navigating to ${url}...`);
  // Do NOT wait for anything. Just trigger the navigation and immediately resolve
  try {
    page.goto(url).catch(() => {});
  } catch(e) {}

  console.log('Waiting 10 seconds for everything to load and render...');
  await new Promise(r => setTimeout(r, 10000));

  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Saved: ${outputPath}`);
}

async function run() {
  const base = 'http://localhost:4321/demo';
  const dest = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images';

  for (const id of [1, 2, 3, 4]) {
    const url = `${base}/theme${id}`;
    const out = `${dest}\\theme${id}_mockup.jpg`;
    console.log(`\n=== Theme ${id} ===`);
    await warmup(url);
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(url, out);
  }

  // Restore Theme 5 from the user's uploaded artifact image!
  console.log('\nAll done!');
}

run().catch(console.error);
