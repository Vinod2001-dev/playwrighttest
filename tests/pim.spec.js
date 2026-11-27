import { test, expect } from '@playwright/test';

const orangeHrmUsername = process.env.ORANGEHRM_USERNAME || 'Admin';
const orangeHrmPassword = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.beforeEach(async ({ page }) => {
  await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
});

async function login(page) {
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible({ timeout: 40000 });
  await page.getByRole('textbox', { name: 'Username' }).fill(orangeHrmUsername);
  await page.getByRole('textbox', { name: 'Password' }).fill(orangeHrmPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard\/index$/);
}

async function loginAndOpenPim(page) {
  await login(page);
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page).toHaveURL(/pim\/viewEmployeeList$/);
}

function pimField(page, label) {
  return page.locator('.oxd-input-group').filter({
    has: page.getByText(label, { exact: true }),
  });
}

function pimTextField(page, label) {
  return pimField(page, label).locator('input');
}

function pimSelect(page, label) {
  return pimField(page, label).locator('.oxd-select-text');
}

test('search PIM employee and verify dashboard', async ({ page }) => {
  await loginAndOpenPim(page);
  const firstEmployee = page.getByRole('row').nth(1);
  const employeeId = (await firstEmployee.getByRole('cell').nth(1).innerText()).trim();
  expect(employeeId).not.toBe('');

  await pimTextField(page, 'Employee Id').fill(employeeId);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('cell', { name: employeeId, exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Dashboard' }).click();

  await expect(page).toHaveURL(/dashboard\/index$/);
  await expect(page.getByText('Time at Work', { exact: true })).toBeVisible();
});

test('PIM link is available from the dashboard', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('link', { name: 'PIM' })).toBeVisible();
});

test('opens the PIM employee list', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page).toHaveURL(/pim\/viewEmployeeList$/);
});

test('shows the Employee Information heading', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
});

test('shows the employee search button', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
});

test('shows the employee search reset button', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
});

test('shows the employee name search field', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimTextField(page, 'Employee Name')).toBeVisible();
});

test('shows the employee ID search field', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimTextField(page, 'Employee Id')).toBeVisible();
});

test('shows the employment status filter', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimSelect(page, 'Employment Status')).toBeVisible();
});

test('shows the include filter', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimSelect(page, 'Include')).toBeVisible();
});

test('shows the supervisor name search field', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimTextField(page, 'Supervisor Name')).toBeVisible();
});

test('shows the job title filter', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimSelect(page, 'Job Title')).toBeVisible();
});

test('shows the sub unit filter', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(pimSelect(page, 'Sub Unit')).toBeVisible();
});

test('shows the Add Employee button', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
});

test('shows the PIM reports tab', async ({ page }) => {
  await loginAndOpenPim(page);
  await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
});

test('Add button opens the add employee page', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/pim\/addEmployee$/);
});

test('add employee page shows its heading', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
});

test('add employee form shows the first name field', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
});

test('add employee form shows the middle name field', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('textbox', { name: 'Middle Name' })).toBeVisible();
});

test('add employee form shows the last name field', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
});

test('add employee form shows the employee ID field and save button', async ({ page }) => {
  await loginAndOpenPim(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(pimTextField(page, 'Employee Id')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
});