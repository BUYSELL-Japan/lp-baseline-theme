import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import path from 'path';

const BASE = 'http://localhost:4321';
const OUT_DIR = path.join(process.cwd(), 'verify_shots');
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { store: 'demo-theme1', theme: 'theme1', label: 'demo-standard' },
  { store: 'demo-theme2', theme: 'theme2', label: 'demo-modern' },
  { store: 'demo-theme3', theme: 'theme3', label: 'demo-elegant' },
  { store: 'demo-theme4', theme: 'theme4', label: 'demo-tropical' },
  { store: 'demo-theme5', theme: 'theme5', label: 'demo-dining' },
  { store: '01kr58qnkhzdhyqz9vn438wsjk', theme: 'theme3', label: 'real-mvp' },
  { store: '01kq6mw114knve53qhtse2tftj', theme: 'theme4', label: 'real-test' },
];

async function shootFullPage(page, url, outPath) {
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push('console.error: ' + msg.text()); });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.waitForSelector('main, section', { timeout: 20000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));

  // ページ全体を細かい間隔(250px刻み)でスクロールし、tall なセクション内部の要素も
  // 含めて whileInView(viewport:{once:true}) を確実に発火させてから先頭に戻る
  const total = await page.evaluate(() => document.body.scrollHeight);
  const step = 250;
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 180));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: outPath, fullPage: true });
  return consoleErrors;
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const url = `${BASE}/stores/${t.store}/`;
  const outPath = path.join(OUT_DIR, `${t.theme}_${t.label}.png`);
  console.log(`\n=== ${t.theme} (${t.label}) : ${url} ===`);
  try {
    const errors = await shootFullPage(page, url, outPath);
    console.log(`  screenshot saved: ${outPath}`);
    if (errors.length) {
      console.log(`  console errors (${errors.length}):`);
      errors.slice(0, 10).forEach((e) => console.log('   -', e.substring(0, 200)));
    } else {
      console.log('  no console errors');
    }

    const summary = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.map((s) => {
        const h2 = s.querySelector('h2, h1');
        const text = h2 ? h2.textContent.trim() : '(no heading)';
        const rect = s.getBoundingClientRect();
        const opacity = window.getComputedStyle(s).opacity;
        return { id: s.id || '(no id)', heading: text.substring(0, 40), height: Math.round(rect.height), opacity };
      });
    });
    console.log(`  sections rendered: ${summary.length}`);
    summary.forEach((s) => console.log(`    - #${s.id}: "${s.heading}" (h=${s.height}px, opacity=${s.opacity})`));
  } catch (e) {
    console.log('  ERROR:', e.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log('\nDone.');
