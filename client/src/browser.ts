import path from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';

const DEBUG = false;

export async function startBrowser() {
    const additionalArgs = DEBUG ? ['--v=1'] : [];
    const browser = await puppeteer.launch({
        dumpio: DEBUG,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-quic',
            '--origin-to-force-quic-on=cdn.local:444',
            //'--ignore-certificate-errors',
            // '--ignore-certificate-errors-spki-list=UKSGn1BWV+byKw1SyRSFQjtNpYIetyS0P349jea/6T4=',
            // '--log-net-log=/out/netlog.json',
            ...additionalArgs
        ]
    });

    const page = await browser.newPage();

    // await page.tracing.start({path: '/out/trace.json', categories: ['netlog']});

    page
        .on('pageerror', ({message}) => console.log(`[${chalk.red('PAGE_ERROR')}] ${message}`))
        .on('requestfailed', request =>
            console.log(`[${chalk.red('REQ_FAILED')}] ${request.failure().errorText} ${request.url()}`));

    if (DEBUG) {
        await page.setRequestInterception(true);
        page
            .on('console', message =>
                console.log(`[CONSOLE][${message.type().toUpperCase()}] ${message.text()}`))
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
    }

    const version = await page.browser().version();
    console.log(version);

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    await page.click('#ready');

    await page.waitForTimeout(2000);

    // await page.tracing.stop();

    while (true) {
        await page.screenshot({path: path.resolve(__dirname, '../out/screenshot.png')});
        await page.waitForTimeout(1000);
    }

    // TODO: close when stopping
    // await browser.close();
    // server.close();
}
