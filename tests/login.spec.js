import { test, expect } from '@playwright/test';

const orangeHrmUsername = process.env.ORANGEHRM_USERNAME || 'Admin';
const orangeHrmPassword = process.env.ORANGEHRM_PASSWORD || 'admin123';

const LOGIN_URL = '/web/index.php/auth/login';

test.describe('OrangeHRM Login - Test Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });
  
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // 1. Positive Login & Logout
  test('TC01: Valid username and valid password login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  // 2. Negative - Wrong Username
  test('TC02: Invalid username and valid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('WrongAdmin');
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // 3. Negative - Wrong Password
  test('TC03: Valid username and invalid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpass123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // 4. Negative - Both Wrong
  test('TC04: Invalid username and invalid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('WrongUser');
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPass');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // 5. Validation - Both Fields Blank
  test('TC05: Blank username and blank password', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    const requiredErrors = page.getByText('Required');
    await expect(requiredErrors).toHaveCount(2);
  });

  // 6. Validation - Blank Username Only
  test('TC06: Blank username and valid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Required')).toHaveCount(1);
  });

  // 7. Validation - Blank Password Only
  test('TC07: Valid username and blank password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Required')).toHaveCount(1);
  });

  // 8. Case Sensitivity - Username
  test('TC08: Case-insensitive username check (lowercase admin)', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername.toLowerCase());
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // OrangeHRM usernames are case-insensitive, so login succeeds
    await expect(page).toHaveURL(/.*dashboard/);
  });

  // 9. Case Sensitivity - Password
  test('TC09: Case-sensitive password check (uppercase ADMIN123)', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword.toUpperCase());
    await page.getByRole('button', { name: 'Login' }).click();

    // Passwords are strictly case-sensitive
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // 10. Whitespace Handling
  test('TC10: Leading and trailing spaces in username and password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(`  ${orangeHrmUsername}  `);
    await page.getByRole('textbox', { name: 'Password' }).fill(`  ${orangeHrmPassword}  `);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // 11. Security - SQL Injection Attempt
  test('TC11: SQL injection string in username field', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill("' OR '1'='1");
    await page.getByRole('textbox', { name: 'Password' }).fill("' OR '1'='1");
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  // 12. Security - Password Masking
  test('TC12: Password field masks characters by default', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.fill(orangeHrmPassword);

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // 13. Keyboard Accessibility - Enter Key Submit
  test('TC13: Submit login form by pressing Enter key', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  // 14. Navigation - Forgot Password Link
  test('TC14: Forgot your password link redirects to reset page', async ({ page }) => {
    await page.getByText('Forgot your password?').click();

    await expect(page).toHaveURL(/.*requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  });

  // 15. Session Management - Logout and Browser Back Button
  test('TC15: Logout ends session and blocks access via browser Back button', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
    await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Perform logout
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // Try navigating back to dashboard
    await page.goBack();
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  // 16. Form State - Clearing Username and Password
  test('TC16: Username and password fields can be cleared', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });

    await username.fill(orangeHrmUsername);
    await password.fill(orangeHrmPassword);
    await username.clear();
    await password.clear();

    await expect(username).toHaveValue('');
    await expect(password).toHaveValue('');
    await page.close();
  });

  // 17. Form State - Required Validation After Input Is Cleared
  test('TC17: Required validation appears after clearing a completed field', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });

    await username.fill(orangeHrmUsername);
    await password.fill(orangeHrmPassword);
    await username.clear();
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Required')).toHaveCount(1);
  });

  // 18. Navigation - Reset Password Cancel Returns to Login
  test('TC18: Canceling password reset returns to the login page', async ({ page }) => {
    await page.getByText('Forgot your password?').click();
    await expect(page).toHaveURL(/.*requestPasswordResetCode/);

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

});

