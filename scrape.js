const { chromium } = require('playwright');

(async () => {
  const seeds = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55];
  const baseUrl = 'https://datadash-qa.vercel.app/seeds/'; // Replace with the actual base URL if different
  let totalSum = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `${baseUrl}${seed}`;
    console.log(`Scraping: ${url}`);
    
    await page.goto(url);
    
    // Select all table cells (td) and get their text content
    const values = await page.$$eval('td', cells => 
      cells.map(cell => {
        const num = parseFloat(cell.innerText.replace(/,/g, ''));
        return isNaN(num) ? 0 : num;
      })
    );

    const pageSum = values.reduce((acc, val) => acc + val, 0);
    totalSum += pageSum;
  }

  console.log('--- FINAL TOTAL ---');
  console.log(`TOTAL_SUM: ${totalSum}`);
  
  await browser.close();
})();
