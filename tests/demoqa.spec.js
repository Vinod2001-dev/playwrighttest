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