import {test, expect} from '@playwright/test';

test('Demo test', async ({ page }) => {
    await page.goto('https://demo.applitools.com/');
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('John Smith');
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('password123');
    await page.getByText('Remember Me').click();
    await page.getByRole('link', { name: 'Sign in' }).click();
});