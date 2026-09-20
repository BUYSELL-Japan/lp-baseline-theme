import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/stores/demo-theme4/', { waitUntil: 'networkidle0', timeout: 45000 });
await new Promise((r) => setTimeout(r, 1000));

const info = await page.evaluate(() => {
  const main = document.querySelector('main') || document.body;
  const sections = Array.from(document.querySelectorAll('section'));
  return {
    bodyChildCount: document.body.children.length,
    mainTag: main.tagName,
    sectionCount: sections.length,
    sections: sections.map((s, i) => ({
      index: i,
      id: s.id || null,
      firstHeadingText: (s.querySelector('h1,h2,h3')?.textContent || '').trim().substring(0, 60),
      textLength: s.textContent.length,
      topOffset: Math.round(s.getBoundingClientRect().top + window.scrollY),
      height: Math.round(s.getBoundingClientRect().height),
    })),
    bodyScrollHeight: document.body.scrollHeight,
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
