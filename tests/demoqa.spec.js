import {test, expect} from '@playwright/test';
import details from '../testdata/demoqa.json';
test('verify Working with Edit boxes', async ({page}) => {
await page.goto('https://demoqa.com/text-box');
await expect(page.getByRole('textbox', {name: 'Full Name'})).toBeVisible({timeout: 40000});
await page.getByRole('textbox', {name: 'Full Name'}).click();
await page.getByRole('textbox', {name: 'Full Name'}).fill(details.fullName);
await page.getByRole('textbox', {name: 'name@example.com'}).click();
await page.getByRole('textbox', {name: 'name@example.com'}).fill(details.email);
await page.getByRole('textbox', {name: 'Current Address'}).click();
await page.getByRole('textbox', {name: 'Current Address'}).fill(details.currentAddress);
await page.locator('#permanentAddress').fill(details.permanentAddress);
await page.getByRole('button', {name: 'Submit'}).click();

const output = page.locator('#output');

await expect(output.locator('p#name')).toContainText(details.fullName);
await expect(output.locator('p#email')).toContainText(details.email);
await expect(output.locator('p#currentAddress')).toContainText(details.currentAddress);
await expect(output.locator('p#permanentAddress')).toContainText(details.permanentAddress);

})

test('submit empty text box form without output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('#output')).not.toContainText('Name:', { timeout: 5000 });
});

test('show validation for an invalid email address', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    const email = page.getByRole('textbox', { name: 'name@example.com' });
    await email.fill('invalid-email');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(email).toHaveClass(/field-error/);
});

test('clear and resubmit text box fields', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    const fullName = page.getByRole('textbox', { name: 'Full Name' });
    const email = page.getByRole('textbox', { name: 'name@example.com' });

    await fullName.fill(details.fullName);
    await email.fill(details.email);
    await fullName.clear();
    await email.clear();

    await expect(fullName).toHaveValue('');
    await expect(email).toHaveValue('');

    await fullName.fill('Playwright Learner');
    await email.fill('learner@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('#output')).toContainText('Playwright Learner');
    await expect(page.locator('#output')).toContainText('learner@example.com');
});