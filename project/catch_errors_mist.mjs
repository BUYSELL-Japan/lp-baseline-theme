import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\buyse\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe'
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

  await page.goto('http://localhost:4321/demo/mist', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Checking root element...');
  const bodyContent = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  console.log('Body HTML:', bodyContent);

  await browser.close();
})();
