import { test } from '@playwright/test';

test('Optional Applitools demo login', async ({ page }) => {
  test.skip(
    process.env.RUN_DEMO_LOGIN !== 'true' || !process.env.USERNAME || !process.env.PASSWORD,
    'Set RUN_DEMO_LOGIN=true and provide USERNAME and PASSWORD to run the optional demo login'
  );
  await page.goto('https://demo.applitools.com/');
  await page.getByRole('textbox', { name: 'Enter your username' }).fill(process.env.USERNAME);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.PASSWORD);
  await page.getByText('Remember Me').click();
  await page.getByRole('link', { name: 'Sign in' }).click();
});