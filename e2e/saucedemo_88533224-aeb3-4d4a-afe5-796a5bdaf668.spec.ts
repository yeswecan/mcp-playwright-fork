
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('sauceDemo_2025-03-23', async ({ page }) => {
  
    // playwright_navigate
    await page.evaluate(async () => {
      await executeTool('playwright_navigate', {"url":"https://www.saucedemo.com/","waitUntil":"networkidle"});
    });

    // playwright_fill
    await page.evaluate(async () => {
      await executeTool('playwright_fill', {"selector":"#user-name","value":"standard_user"});
    });

    // playwright_fill
    await page.evaluate(async () => {
      await executeTool('playwright_fill', {"selector":"#password","value":"secret_sauce"});
    });

    // playwright_click
    await page.evaluate(async () => {
      await executeTool('playwright_click', {"selector":"#login-button"});
    });

    // playwright_expect_response
    await page.evaluate(async () => {
      await executeTool('playwright_expect_response', {"url":"**/inventory.html","id":"login-verification"});
    });

    // playwright_assert_response
    await page.evaluate(async () => {
      await executeTool('playwright_assert_response', {"id":"login-verification"});
    });

    // playwright_screenshot
    await page.evaluate(async () => {
      await executeTool('playwright_screenshot', {"name":"login-success-verification","fullPage":true});
    });
});