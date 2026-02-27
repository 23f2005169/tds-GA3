const { chromium } = require('playwright');

(async () => {
  const seeds = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55];
  // Correct Base URL based on your link
  const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/?seed=';
  let totalSum = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `${baseUrl}${seed}`;
    console.log(`Scraping: ${url}`);
    
    try {
      // Navigate and wait for the network to be idle
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for at least one <td> to appear and contain text (not empty)
      await page.waitForFunction(() => {
        const cells = Array.from(document.querySelectorAll('td'));
        return cells.length > 0 && cells.some(cell => cell.innerText.trim() !== "");
      }, { timeout: 10000 });

      // Extract and sum numbers
      const pageSum = await page.$$eval('td', cells => {
        return cells.reduce((acc, cell) => {
          const text = cell.innerText.replace(/[$, ]/g, ''); // Remove formatting
          const num = parseFloat(text);
          return isNaN(num) ? acc : acc + num;
        }, 0);
      });

      console.log(`Seed ${seed} Sum: ${pageSum}`);
      totalSum += pageSum;

    } catch (err) {
      console.error(`Error on Seed ${seed}: ${err.message}`);
    }
  }

  console.log('\n--- FINAL LOG OUTPUT ---');
  // Ensuring your email is in the log for the grader
  console.log(`User: 23f2005169@ds.study.iitm.ac.in`);
  console.log(`TOTAL_SUM: ${totalSum}`);
  
  await browser.close();
})();
