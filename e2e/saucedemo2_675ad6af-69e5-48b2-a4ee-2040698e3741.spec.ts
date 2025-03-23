
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('sauceDemo2_2025-03-23', async ({ page }) => {
  
    // playwright_navigate
    await page.evaluate(async () => {
      await executeTool('playwright_navigate', {"url":"https://www.saucedemo.com/"});
    });
});