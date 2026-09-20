import puppeteer from 'puppeteer';

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
}

async function run() {
  console.log("Taking full page screenshot for theme 5...");
  const outputPath = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images\\theme5_mockup.jpg';
  await takeScreenshot('https://lp-baseline-theme.pages.dev/demo/theme5', outputPath);
  console.log("Saved " + outputPath);
  
  // Create another copy in public/images just in case LP-LP uses it
  const publicOutputPath = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\public\\images\\theme5_mockup.jpg';
  await takeScreenshot('https://lp-baseline-theme.pages.dev/demo/theme5', publicOutputPath);
  console.log("Saved " + publicOutputPath);
}

run();
