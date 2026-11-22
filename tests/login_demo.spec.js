import {test, expect} from '@playwright/test';

test.beforeEach(async ({ page }) => {
    console.log('Starting test: ' + test.info().title);
});
test('Demo test', async ({ page }) => {
    await page.goto('https://demo.applitools.com/');
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill(process.env.USERNAME);
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.PASSWORD);
    await page.getByText('Remember Me').click();
    await page.getByRole('link', { name: 'Sign in' }).click();
});