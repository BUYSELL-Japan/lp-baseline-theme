import puppeteer from 'puppeteer';

const [,, url, yStart, yEnd, outFile] = process.argv;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
await new Promise((r) => setTimeout(r, 500));

const total = await page.evaluate(() => document.body.scrollHeight);
const step = 250;
for (let y = 0; y < total; y += step) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 180));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 1000));

await page.screenshot({
  path: outFile,
  clip: { x: 0, y: Number(yStart), width: 1440, height: Number(yEnd) - Number(yStart) },
});
await browser.close();
console.log('saved', outFile);
