const pup = require('puppeteer');

async function scrapeProduct(url) {
    try {
        const browser = await pup.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Scraping image source
        const srcTxt = await page.evaluate(() => {
            const imgElement = document.querySelector('#landingImage');
            return imgElement ? imgElement.src : null;
        });

        // Scraping product title
        const rawTxt = await page.evaluate(() => {
            const titleElement = document.querySelector('#productTitle');
            return titleElement ? titleElement.textContent.trim() : null;
        });

        console.log(srcTxt, rawTxt);

        await browser.close();
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

scrapeProduct('https://www.amazon.in/Red-Tape-Cushioned-Slip-Resistance-Absorption/dp/B0C6F5NBF3?refinements=p_89%3ARed+Tape%2Cp_n_pct-off-with-tax%3A27060457031');
