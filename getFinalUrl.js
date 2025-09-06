const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/resolve-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Opcional: Set email user-agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const finalUrl = page.url();
    await browser.close();

    return res.json({ finalUrl });
  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
