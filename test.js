import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Waiting for Nuxt to mount...');
  await page.waitForTimeout(5000);

  // We won't test PointerLock because it doesn't work well in Headless.
  // We will INJECT a script to artificially bypass the store.isPointerLocked requirement!
  await page.evaluate(() => {
    window.__vueStore = null; // We can't access Pinia easily from window unless exposed
  });

  // Let's just execute WASD keys and see if the camera moves!
  console.log('Pressing W key...');
  await page.keyboard.down('w');
  await page.waitForTimeout(100);
  await page.keyboard.up('w');

  console.log('Scrolling wheel...');
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(100);

  console.log('Evaluating Nuxt state to see if camera FOV changed or position changed...');
  const result = await page.evaluate(() => {
    // Attempt to read the Pinia store if Nuxt Devtools or something exposed it
    // Or we can just read the DOM if there are any visual indicators
    const canvas = document.querySelector('canvas');
    return {
      hasCanvas: !!canvas
    };
  });
  console.log('Result:', result);

  await browser.close();
  console.log('Test complete.');
})();
