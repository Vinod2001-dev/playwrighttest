
import { test, expect } from '@playwright/test';

const username = process.env.USERNAME_SAUCE || 'standard_user';
const password = process.env.PASSWORD_SAUCE || 'secret_sauce';


test.beforeEach(async ({ page }) => {
  console.log('Starting test: ' + test.info().title);
  await page.goto('https://www.saucedemo.com/');
});

// TC01 - Valid login
test('TC01 - Login with valid credentials', async ({ page }) => {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory.html/);
});

// TC02 - Invalid username
test('TC02 - Login with invalid username', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('invalid_user');
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

// TC03 - Invalid password
test('TC03 - Login with invalid password', async ({ page }) => {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

// TC04 - Empty username
test('TC04 - Login with empty username', async ({ page }) => {
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username is required'
  );
});

// TC05 - Empty password
test('TC05 - Login with empty password', async ({ page }) => {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Password is required'
  );
});

// TC06 - Locked out user
test('TC06 - Login with locked out user', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'locked out'
  );
});

// TC07 - Verify inventory page
test('TC07 - Verify inventory page', async ({ page }) => {
  await login(page);

  await expect(page.locator('.inventory_list')).toBeVisible();
});

// TC08 - Verify product names
test('TC08 - Verify product names', async ({ page }) => {
  await login(page);

  await expect(page.locator('.inventory_item_name').first()).toBeVisible();

  await expect(page.locator('.inventory_item_name')).toHaveCount(6);
});

// TC09 - Verify product prices
test('TC09 - Verify product prices', async ({ page }) => {
  await login(page);

  await expect(page.locator('.inventory_item_price').first()).toBeVisible();

  await expect(page.locator('.inventory_item_price')).toHaveCount(6);
});

// TC10 - Sort products A to Z
test('TC10 - Sort products A to Z', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="product-sort-container"]')
    .selectOption('az');

  const names = await page.locator('.inventory_item_name').allTextContents();

  expect(names).toEqual([...names].sort());
});

// TC11 - Sort products Z to A
test('TC11 - Sort products Z to A', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="product-sort-container"]')
    .selectOption('za');

  const names = await page.locator('.inventory_item_name').allTextContents();

  expect(names).toEqual([...names].sort().reverse());
});

// TC12 - Sort price low to high
test('TC12 - Sort price low to high', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="product-sort-container"]')
    .selectOption('lohi');

  const prices = await page.locator('.inventory_item_price').allTextContents();

  const values = prices.map(price => Number(price.replace('$', '')));

  expect(values).toEqual([...values].sort((a, b) => a - b));
});

// TC13 - Sort price high to low
test('TC13 - Sort price high to low', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="product-sort-container"]')
    .selectOption('hilo');

  const prices = await page.locator('.inventory_item_price').allTextContents();

  const values = prices.map(price => Number(price.replace('$', '')));

  expect(values).toEqual([...values].sort((a, b) => b - a));
});

// TC14 - Add product to cart
test('TC14 - Add product to cart', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

// TC15 - Remove product from cart
test('TC15 - Remove product from cart', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

// TC16 - Verify cart page
test('TC16 - Verify cart page', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  await expect(page.locator('.cart_item')).toHaveCount(1);

  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
});

// TC17 - Continue shopping
test('TC17 - Continue shopping', async ({ page }) => {
  await login(page);

  await page.locator('.shopping_cart_link').click();

  await page.locator('[data-test="continue-shopping"]').click();

  await expect(page).toHaveURL(/inventory.html/);
});

// TC18 - Complete checkout
test('TC18 - Complete checkout', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('560001');

  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('.summary_info')).toBeVisible();

  await page.locator('[data-test="finish"]').click();

  await expect(page.locator('.complete-header')).toHaveText(
    'Thank you for your order!'
  );
});

// TC19 - Cancel checkout
test('TC19 - Cancel checkout', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="cancel"]').click();

  await expect(page).toHaveURL(/cart.html/);
});

// TC20 - Logout
test('TC20 - Logout', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Open Menu' }).click();

  await page.locator('[data-test="logout-sidebar-link"]').click();

  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

// Reusable login function
async function login(page) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory.html/);
}
