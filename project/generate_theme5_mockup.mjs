import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function takeScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
}

async function run() {
  console.log("Taking full page screenshot for theme 5 from localhost...");
  const outputPath = 'C:\\Users\\buyse\\OneDrive\\デスクトップ\\Antigravity\\LP-LP\\public\\images\\theme5_mockup.jpg';
  await takeScreenshot('http://localhost:4321/demo/theme5', outputPath);
  console.log("Saved " + outputPath);
  console.log("Done generating Theme 5 mockup!");
}

run();
