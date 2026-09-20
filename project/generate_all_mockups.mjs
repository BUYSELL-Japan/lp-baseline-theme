import puppeteer from 'puppeteer';
import path from 'path';

const themes = [
  { name: 'theme1', url: 'https://demo-standard.global-reaches.com/' },
  { name: 'theme2', url: 'https://demo-modern.global-reaches.com/' },
  { name: 'theme3', url: 'https://demo-elegant.global-reaches.com/' },
  { name: 'theme4', url: 'https://demo-tropical.global-reaches.com/' },
  { name: 'theme5', url: 'https://demo-dining.global-reaches.com/' },
];

async function generateMockups() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new"
  });
  for (const theme of themes) {
    console.log(`Generating mockup for ${theme.name}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      await page.goto(theme.url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Wait an extra second for animations to settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const outputPath = path.join('C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\public\\images', `${theme.name}_mockup.jpg`);
      await page.screenshot({ path: outputPath, fullPage: true, type: 'jpeg', quality: 80 });
      console.log(`Saved ${outputPath}`);
    } catch (err) {
      console.error(`Failed to generate mockup for ${theme.name}:`, err);
    }
    await page.close();
  }
  await browser.close();
}

generateMockups();
