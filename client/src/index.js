const puppeteer = require('puppeteer');
const express = require('express');

const PORT = 3000;

function startExpress() {
    const app = express();
    app.use(express.static('static'));
    server = app.listen(PORT);
    console.log('Frontend server listening on port ' + PORT);
}

async function startBrowser() {
    const browser = await puppeteer.launch({
        dumpio: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-quic',
            '--origin-to-force-quic-on=cdn.local:443',
            //'--ignore-certificate-errors',
            // '--ignore-certificate-errors-spki-list=UKSGn1BWV+byKw1SyRSFQjtNpYIetyS0P349jea/6T4=',
            // '--log-net-log=/out/netlog.json',
            '--v=1'
        ]
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    // await page.tracing.start({path: '/out/trace.json', categories: ['netlog']});

    page
        .on('console', message =>
            console.log(`[CONSOLE][${message.type().toUpperCase()}] ${message.text()}`))
        .on('pageerror', ({ message }) => console.log(`[PAGE_ERROR] ${message}`))
        .on('request', request => {
            if (!request.url().startsWith('data:')) {
                console.log(`[REQUEST] ${request.url()}`);
            }
            request.continue();
        })
        .on('response', response => {
            if (!response.url().startsWith('data:')) {
                console.log(`[RESPONSE] ${response.status()} ${response.url()}`)
            }
        })
        .on('requestfailed', request =>
            console.log(`[REQ_FAILED] ${request.failure().errorText} ${request.url()}`));

    const version = await page.browser().version();
    console.log(version);

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    await page.click('#play');

    await page.waitForTimeout(2000);
    
    // await page.tracing.stop();

    while (true) {
        await page.screenshot({ path: '/out/screenshot.png' });
        await page.waitForTimeout(1000);
    }

    // await browser.close();
    // server.close();
}

startExpress();
startBrowser();
