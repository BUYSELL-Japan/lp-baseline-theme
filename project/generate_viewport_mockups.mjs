import puppeteer from 'puppeteer';
import http from 'http';

async function warmup(url) {
  return new Promise((resolve) => {
    console.log(`Warming up ${url}...`);
    http.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    }).on('error', resolve);
  });
}

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a standard desktop viewport
  await page.setViewport({ width: 1200, height: 800 });
  
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  } catch (e) {
    console.warn(`goto warning: ${e.message}. Continuing anyway...`);
  }
  
  // Wait a bit to ensure fonts/images are loaded
  await new Promise(r => setTimeout(r, 3000));
  
  console.log(`Taking viewport screenshot for ${outputPath}...`);
  // fullPage: false means it only takes the visible viewport (hero section)
  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
}

async function run() {
  const themes = [
    { id: 1, url: 'http://localhost:4321/demo/theme1' },
    { id: 2, url: 'http://localhost:4321/demo/theme2' },
    { id: 3, url: 'http://localhost:4321/demo/theme3' },
    { id: 4, url: 'http://localhost:4321/demo/theme4' },
    { id: 5, url: 'http://localhost:4321/demo/theme5' }
  ];

  for (const theme of themes) {
    const outputPath = `C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\public\\images\\theme${theme.id}_mockup.jpg`;
    try {
      await warmup(theme.url);
      await takeScreenshot(theme.url, outputPath);
      console.log(`Saved ${outputPath}`);
    } catch (e) {
      console.error(`Failed for theme ${theme.id}: ${e.message}`);
    }
  }
  
  console.log("Done generating all viewport mockups!");
}

run();
