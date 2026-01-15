import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Web Shell/);
});

test('renders main content', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
});
