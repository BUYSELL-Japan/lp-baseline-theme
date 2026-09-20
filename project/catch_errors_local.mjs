import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new"
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  await page.goto('http://localhost:4321/demo/char', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded.');
  
  // Check for review/口コミ section
  const hasReviews = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('口コミ') || text.includes('レビュー') || text.includes('お客様の声') || text.includes('Review');
  });
  console.log('Has reviews section:', hasReviews);
  
  // Check for [IMG] text
  const hasIMG = await page.evaluate(() => {
    return document.body.innerText.includes('[IMG]');
  });
  console.log('Has [IMG] text:', hasIMG);

  await browser.close();
})();
