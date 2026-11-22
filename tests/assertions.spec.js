import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    console.log('Starting test: ' + test.info().title);
});
test('Assertions Demo', async ({ page }) => {
  await page.goto('https://kitchen.applitools.com/');
  await page.pause();

  await page.getByRole('img', { name: 'Chefs with code ingredients' }).click();
  await page.getByText('A pantry full of web').click();
  await page.getByRole('link', { name: 'Alert' }).click();

  // ✅ Handle alert BEFORE clicking
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Trigger an Alert' }).click();

  // ✅ Handle confirmation BEFORE clicking
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Trigger a Confirmation' }).click();

  // ✅ Handle prompt BEFORE clicking
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Trigger a Prompt' }).click();
});