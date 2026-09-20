import puppeteer from 'puppeteer';

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Wait for 3 seconds to ensure Astro finishes compiling the page
  await new Promise(r => setTimeout(r, 3000));
  
  console.log(`Taking screenshot...`);
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
}

async function run() {
  console.log("Taking full page screenshot for theme 5 from localhost...");
  const outputPath = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\images\\theme5_mockup.jpg';
  await takeScreenshot('http://localhost:4321/demo/theme5', outputPath);
  console.log("Saved " + outputPath);
  
  // Create another copy in public/images just in case LP-LP uses it
  const publicOutputPath = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\public\\images\\theme5_mockup.jpg';
  await takeScreenshot('http://localhost:4321/demo/theme5', publicOutputPath);
  console.log("Saved " + publicOutputPath);
}

run();
