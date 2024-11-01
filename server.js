const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

let browser = null;

// Utility function to pause execution for a set amount of time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize the browser with retry logic at startup
const initBrowser = async () => {
    const browserStartAttempts = 5;

    for (let i = 0; i < browserStartAttempts; i++) {
        try {
            console.log(`Starting Chrome (attempt ${i + 1}/${browserStartAttempts})...`);
            browser = await puppeteer.launch({
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    '--disable-infobars',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--enable-webgl',
                ],
                timeout: 10000,
                protocolTimeout: 20000,
            });

            console.log("Chrome started successfully.");
            return;
        } catch (error) {
            console.log(`Error during Chrome startup (attempt ${i + 1}/${browserStartAttempts}):`, error);

            if (browser?.isConnected()) {
                console.log("Closing browser...");
                await browser.close();
            }

            // Reset browser for next attempt
            browser = null;
            await sleep(1000);
        }
    }

    throw new Error("Failed to start browser after multiple attempts");
};

// Middleware to ensure the browser is available for each request
const ensureBrowser = async (req, res, next) => {
    if (!browser?.isConnected()) {
        console.log("Reinitializing browser...");
        await initBrowser();
    }
    next();
};

// Screenshot route
app.get('/screenshot', ensureBrowser, async (req, res) => {
    const $url = req.query.url;
    let $width = req.query.width || 1920;
    let $height = req.query.height || 1080;

    if (!$url || $url === '') {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: parseInt($width), height: parseInt($height) });
        await page.goto($url, { waitUntil: 'networkidle2' });

        const screenshot = await page.screenshot();
        await page.close();

        res.setHeader('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).send('Failed to capture screenshot');
    }
});

// Start the Express server and initialize the browser
app.listen(PORT, async () => {
    try {
        await initBrowser();
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error("Failed to initialize browser at startup:", error);
        process.exit(1);
    }
});
