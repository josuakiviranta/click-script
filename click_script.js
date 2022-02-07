const puppeteer = require('puppeteer');
const download = require('download-chromium');
const os = require('os');
const { getIpAddress } = require('./getIpAddress');
const tmp = os.tmpdir();

const pagesOpen = 30;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Downloading Chromium. This can take up to 5 minutes')
  const chromiumPath = await download({
    revision: 694644,
    installPath: `${tmp}/click-script-chromium`,
    onProgress: ({ percent, transferred, total }) => {
      console.log(`Downloading Chromium... ${percent}`)
    }
  })
  
  const urlToOpen = process.argv[2]

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: true,
      args: [
        `--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36"`,
        "--incognito",
        `--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 45.168.15.46"`
      ]
  });

  const context = await browser.createIncognitoBrowserContext()
  
  const startTime = new Date();
  let requestCount = 0;

  for (let pageIndex = 0; pageIndex < pagesOpen; pageIndex++) {
    (async () => {
      while (true) {
        const page = await context.newPage();
        let waitForResponse = new Promise((resolve, reject) => {
          page.on('response', async response => {
            resolve()
          });
        })

        await page.goto(urlToOpen);
        await waitForResponse
        await sleep(500)
        requestCount++;
        console.log(`Url: ${urlToOpen} Page ${pageIndex} finished loading, ${requestCount/+(new Date() - startTime) * 1000} requests / second`);
        await page.close()
      }
    })();
  }
})();
