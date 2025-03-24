import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('SauceDemo_2025-03-24', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('https://www.saucedemo.com');

    // Fill input field
    await page.fill('#user-name', 'standard_user');

    // Fill input field
    await page.fill('#password', 'secret_sauce');

    // Click element
    await page.click('#login-button');

    // Assert Products text is visible
    await expect(page.locator('.title')).toHaveText('Products');

    // Take screenshot
    await page.screenshot({ path: 'products-page.png' });
});