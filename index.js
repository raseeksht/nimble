import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const sleep = async (time) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(1)
      }, time * 1000)
  })
}

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    console.log("Browser executable path:", browser.process().spawnargs.find(arg => arg.includes('chrome')));
    const page = await browser.newPage();
    await page.goto('https://cloudtechservice.nimbleerp.com/');
    await sleep(0.4);
    await page.type('#LoginID', '');
    await page.type('#LoginPassword', 'password');
    // await page.click('#btnSubmit');
    await page.keyboard.press('Enter');


    // await browser.close();
  } catch (error) {
    console.error("Error launching browser:", error);
  }
})();