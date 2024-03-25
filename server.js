const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

app.get('/screenshot', async (req, res) => {
    const $url = req.query.url;
    let $width = req.query.width;
    let $height = req.query.height;
    if (!$url || $url === '') {
        return res.status(400).send('URL parameter is required');
    }
    if(!$width || $width === '' || !$height || $height === ''){
        $width = 1920;
        $height = 1080;
    }
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: parseInt($width), height: parseInt($height) }
        });
        const page = await browser.newPage();
        await page.goto($url, { waitUntil: 'networkidle2' });
        const screenshot = await page.screenshot();
        await browser.close();
        res.setHeader('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to capture screenshot');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));