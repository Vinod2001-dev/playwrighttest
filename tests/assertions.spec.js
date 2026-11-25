import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  console.log('Starting test: ' + test.info().title);
});

test('Assertions Demo', async ({ page }) => {
  await page.setContent(`
    <button onclick="alert('Alert message')">Trigger an Alert</button>
    <button onclick="confirm('Confirmation message')">Trigger a Confirmation</button>
    <button onclick="prompt('Prompt message')">Trigger a Prompt</button>
  `);

  await triggerDialog(page, 'Trigger an Alert', 'Alert message');
  await triggerDialog(page, 'Trigger a Confirmation', 'Confirmation message');
  await triggerDialog(page, 'Trigger a Prompt', 'Prompt message');
});

async function triggerDialog(page, buttonName, expectedMessage) {
  const dialogPromise = page.waitForEvent('dialog');
  const clickPromise = page.getByRole('button', { name: buttonName }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toBe(expectedMessage);
  await dialog.dismiss();
  await clickPromise;
}