const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const path = (name, device, ext) => `Downloads/${name}-${device}.${ext}`;
const TIMEOUT = 30*1000;
const WAITUNTIL = 'load';

const visit = async (page, uri) => {
  page.setDefaultNavigationTimeout(TIMEOUT);
  try {
    await page.goto(uri, {waitUntil: WAITUNTIL});
  } catch(error) {
    console.dir('navigation error');
    console.dir(error);
  }
};

const downloadPC = async (browser, uri, name) => {
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});
    await visit(page, uri);
    await page.screenshot({path: path(name, 'pc', 'png'), fullPage: true});
    await downloadPDF(page, name, 'pc');
    await page.close();
};

const downloadSP = async (browser, uri, name) => {
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await visit(page, uri);
    await page.screenshot({path: path(name, 'sp', 'png'), fullPage: true});
    await downloadPDF(page, name, 'sp');
    await page.close();
};

const downloadPDF = async (page, name, device)=> {
  await page.emulateMedia('screen');
  await page.pdf({path: path(name, device, 'pdf')});
}

const targets = [];
for (var i = 2; i < process.argv.length; i+=2) {
  const uri = process.argv[i];
  const name = process.argv[i+1];
  ['pc', 'touch'].forEach((device) => {
    targets.push({uri, name, device});
  });
}

(async () => {
  console.log('Launching browser');
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

  for (const target of targets) {
    console.log(target.uri);
    const fn = target.device === 'pc' ? downloadPC : downloadSP;
    try {
      await fn(browser, target.uri, target.name);
    } catch(error) {
      console.dir(error);
    }
  }

  try {
    console.log('Closing browser');
    await browser.close();
  } catch(error) {
    console.dir(error);
  }
})();
