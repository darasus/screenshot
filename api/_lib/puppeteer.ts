import {launch, Page} from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
let _page: Page | null;

async function getPage() {
  if (_page) return _page;
  const options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
  const browser = await launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(url, width, height) {
  const page = await getPage();
  await page.goto(url);
  await page.setViewport({
    width: Number(width) || 1280,
    height: Number(height) || 720,
    deviceScaleFactor: 2,
  });

  await page.waitForSelector('#event-image');

  await page.evaluate(sel => {
    const elements = document.getElementsByTagName(sel);
    for (let i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, 'header');

  await page.evaluate(sel => {
    const elements = document.querySelectorAll(sel);
    for (let i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, '.intercom-lightweight-app');

  const file = await page.screenshot();
  return file;
}
