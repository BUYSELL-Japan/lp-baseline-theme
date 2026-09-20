import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new"
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 }); // Desktop width

  const themes = [
    { id: 1, url: 'https://demo.global-reaches.com/theme1' },
    { id: 2, url: 'https://demo.global-reaches.com/theme2' },
    { id: 3, url: 'https://demo.global-reaches.com/theme3' },
    { id: 4, url: 'https://demo.global-reaches.com/theme4' },
    { id: 5, url: 'https://demo-dining.global-reaches.com' }
  ];

  const outDir = 'C:/Users/buyse/OneDrive/デスクトップ/Antigravity/LP-LP/public/images';

  for (const theme of themes) {
    console.log(`Navigating to ${theme.url}...`);
    await page.goto(theme.url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Scroll to bottom to trigger any lazy loading or animations
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 1000));

    console.log(`Taking full page screenshot for theme ${theme.id}...`);
    // Convert fixed/sticky to absolute to avoid fullPage rendering bugs
    await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          el.style.position = 'absolute';
        }
      }
    });
    const buffer = await page.screenshot({ fullPage: true });
    
    // Resize to a reasonable width to save file size, e.g., 800px wide
    const outputPath = path.join(outDir, `theme${theme.id}_mockup.jpg`);
    await sharp(buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
      
    console.log(`Saved ${outputPath}`);
  }
  
  await browser.close();
  console.log("Done generating all full-page mockups!");
}

run().catch(console.error);
