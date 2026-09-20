import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import path from 'path';

const BASE = 'http://localhost:4322';
const OUT_DIR = path.join(process.cwd(), 'verify_shots');
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const theme of [1, 2, 3, 4, 5]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  const url = `${BASE}/demo/edge-theme${theme}`;
  console.log(`\n=== theme${theme}: ${url} ===`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.waitForSelector('main, section', { timeout: 20000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));

  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 250) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 150));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));

  const result = await page.evaluate(() => {
    const ids = ['about', 'news', 'access', 'gallery', 'menu', 'pricing', 'staff', 'faq', 'contact', 'company', 'storeInfo'];
    const present = {};
    for (const id of ids) {
      present[id] = !!document.getElementById(id);
    }
    // gallery内の画像枚数とキャプション有無を確認(image-onlyパターンの検証)
    const galleryImgs = document.querySelectorAll('#gallery img').length;
    return { present, galleryImgCount: galleryImgs };
  });

  console.log('  section presence:', JSON.stringify(result.present));
  console.log('  gallery image count:', result.galleryImgCount);

  const aboutHidden = !result.present.about;
  const newsHidden = !result.present.news;
  const accessHidden = !result.present.access;
  const galleryVisible = result.present.gallery && result.galleryImgCount > 0;
  const siblingsIntact = result.present.menu && result.present.pricing && result.present.staff && result.present.faq && result.present.contact && result.present.company && result.present.storeInfo;

  console.log(`  [パターン1: 全角スペースのみタイトル] About hidden: ${aboutHidden ? 'PASS' : 'FAIL'}`);
  console.log(`  [パターン1: 全角スペースのみタイトル] News hidden: ${newsHidden ? 'PASS' : 'FAIL'}`);
  console.log(`  [パターン1: 全角スペースのみタイトル] Access hidden: ${accessHidden ? 'PASS' : 'FAIL'}`);
  console.log(`  [パターン2: 画像URLのみ] Gallery still visible with image: ${galleryVisible ? 'PASS' : 'FAIL'}`);
  console.log(`  [回帰確認] 他の正常セクション(menu/pricing/staff/faq/contact/company/storeInfo)は表示維持: ${siblingsIntact ? 'PASS' : 'FAIL'}`);

  if (consoleErrors.length) {
    console.log('  page errors:', consoleErrors.slice(0, 5));
  } else {
    console.log('  no page errors');
  }

  await page.screenshot({ path: path.join(OUT_DIR, `edge_theme${theme}.png`), fullPage: true });
  await page.close();
}

await browser.close();
console.log('\nDone.');
