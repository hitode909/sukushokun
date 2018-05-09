const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  for (var i = 2; i < process.argv.length; i+=2) {
    const uri = process.argv[i];
    const name = process.argv[i+1];
    console.log(`Downloading ${uri} as ${name}`);
    const pathPC = `Downloads/${name}-pc.png`;
    const pathSP = `Downloads/${name}-sp.png`;

    let page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});
    await page.goto(uri);
    await page.screenshot({path: pathPC, fullPage: true});

    page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto(uri);
    await page.screenshot({path: pathSP, fullPage: true});
  }
  await browser.close();
})();
