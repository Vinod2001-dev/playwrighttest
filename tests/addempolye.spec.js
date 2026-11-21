import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible({timeout: 40000});
  await page.getByRole('textbox', { name: 'Username' }).click();
});