import { test, expect } from '@playwright/test'

test('Assertions Demo', async ({ page }) => {
    await page.goto('https://kitchen.applitools.com/')
    await page.pause();
    await page.getByRole('img', { name: 'Chefs with code ingredients' }).click();
  await page.getByText('A pantry full of web').click();
  await page.getByRole('link', { name: 'Alert' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Trigger an Alert' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: 'Trigger a Confirmation' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Trigger a Prompt' }).click();
  await page.goto('https://kitchen.applitools.com/');
  await page.getByRole('link', { name: 'Canvas' }).click();
  await page.getByText('A pantry full of web').click();
  await page.getByRole('heading', { name: 'The Kitchen' }).click();
  await page.goto('about:blank');
})