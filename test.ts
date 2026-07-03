import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Capture console logs from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log('Waiting for ENTER APARTMENT button...');
  await page.waitForSelector('.primary-btn', { timeout: 10000 });
  
  console.log('Clicking the button...');
  await page.click('.primary-btn');
  
  // Wait to see if the button disappears (meaning isPointerLocked became true)
  try {
    await page.waitForFunction(() => {
      return !document.querySelector('.primary-btn');
    }, { timeout: 5000 });
    console.log('SUCCESS: The button disappeared, pointer lock state was updated!');
  } catch (e) {
    console.log('FAILURE: The button did not disappear. Checking DOM state...');
    const hasCanvas = await page.evaluate(() => !!document.querySelector('#game-canvas-container canvas'));
    console.log('Has Canvas?', hasCanvas);
  }

  await browser.close();
  console.log('Test complete.');
})();
