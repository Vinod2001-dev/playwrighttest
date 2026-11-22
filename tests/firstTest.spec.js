const { test, expect } = require('@playwright/test');

// Beginner examples: https://playwright.dev/docs/locators
test.describe('Working with links', () => {
	test.beforeEach(async ({ page }) => {
		console.log('Starting test: ' + test.info().title);	
		await page.goto('https://playwright.dev/');
	});

	test('1 - find a link by visible text', async ({ page }) => {
		const docsLink = page.getByRole('link', { name: 'Get started' });
		await expect(docsLink).toBeVisible();
	});

	test('2 - find a link with a CSS selector', async ({ page }) => {
		const docsLink = page.locator('a', { hasText: 'Get started' });
		await expect(docsLink).toHaveAttribute('href', '/docs/intro');
	});

	test('3 - find a link with an XPath selector', async ({ page }) => {
		const docsLink = page.locator('//a[normalize-space()="Get started"]');
		await expect(docsLink).toBeVisible();
	});

	test('4 - verify link text and URL without clicking', async ({ page }) => {
		const docsLink = page.getByRole('link', { name: 'Get started' });
		await expect(docsLink).toHaveText('Get started');
		await expect(docsLink).toHaveAttribute('href', '/docs/intro');
	});

	test('5 - click a link and verify the destination', async ({ page }) => {
		await page.getByRole('link', { name: 'Get started' }).click();
		await expect(page).toHaveURL(/.*\/docs\/intro/);
		await expect(page.getByRole('heading', { name: /Installation/i })).toBeVisible();
	});

	test('6 - open a link in a new tab', async ({ page, context }) => {
		const apiLink = page.getByRole('link', { name: 'API' }).first();

		const newPagePromise = context.waitForEvent('page');
		await apiLink.click({ modifiers: ['Control'] });
		const newPage = await newPagePromise;

		await newPage.waitForLoadState();
		await expect(newPage).toHaveURL(/.*\/docs\/api\/class-playwright/);
		await newPage.close();
	});

	test('7 - open a link with the keyboard', async ({ page }) => {
		const docsLink = page.getByRole('link', { name: 'Get started' });
		await docsLink.focus();
		await expect(docsLink).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/.*\/docs\/intro/);
	});

	test('8 - check every visible link has a URL', async ({ page }) => {
		const links = page.locator('a:visible');
		const count = await links.count();

		for (let i = 0; i < count; i++) {
			await expect(links.nth(i)).toHaveAttribute('href', /.+/);
		}
	});

	test('9 - collect link text and URLs', async ({ page }) => {
		const linkDetails = await page.locator('a:visible').evaluateAll((elements) =>
			elements.map((link) => ({
				text: link.textContent.trim(),
				url: link.href,
			}))
		);

		console.log(linkDetails);
		expect(linkDetails.length).toBeGreaterThan(0);
	});
});

