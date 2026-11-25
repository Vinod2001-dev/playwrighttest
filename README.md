# Playwright Test Automation

This repository contains end-to-end browser tests built with [Playwright Test](https://playwright.dev/) and JavaScript.

The suite includes OrangeHRM login and PIM workflows, a DemoQA form test, SauceDemo login tests, assertion examples, and Playwright website smoke tests.

## Technology

- Node.js
- Playwright Test
- JavaScript
- Faker.js
- dotenv for optional local environment variables
- GitHub Actions

## Test coverage

| Test file | Coverage |
| --- | --- |
| `tests/login.spec.js` | 18 OrangeHRM login scenarios, including valid and invalid credentials, required fields, case sensitivity, whitespace, SQL injection input, password masking, Enter-key submission, password reset navigation, logout behavior, and form state |
| `tests/pim.spec.js` | OrangeHRM PIM search and navigation workflow |
| `tests/addempolye.spec.js` | Initial OrangeHRM login page smoke check |
| `tests/demoqa.spec.js` | DemoQA text-box submission, empty submission, email validation, clearing fields, and resubmission using data from `testdata/demoqa.json` |
| `tests/loginsaucedemo.spec.js` | SauceDemo login scenarios |
| `tests/login_demo.spec.js` | Optional Applitools demo login, enabled with environment variables |
| `tests/assertions.spec.js` | Playwright locator and dialog assertion examples |
| `tests/firstTest.spec.js` | Playwright website smoke test |
| `tests/example.spec.js` | Playwright website and SauceDemo title/navigation smoke tests |

Tests run against:

- Chromium
- Firefox
- WebKit
- Microsoft Edge
- OrangeHRM demo application
- DemoQA
- SauceDemo
- Applitools demo application (optional)
- Playwright documentation website

## Prerequisites

- Node.js 22.13 or later
- npm
- Internet access for external demo websites

## Installation

From the repository root:

```powershell
npm ci
npx playwright install
```

To install browser system dependencies on Linux or CI:

```bash
npx playwright install --with-deps
```

## Running tests

Run the complete suite:

```powershell
npm test
```

Run one browser project:

```powershell
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:msedge
```

Run a specific test file:

```powershell
npx playwright test tests/login.spec.js --project=chromium
npx playwright test tests/demoqa.spec.js --project=chromium
```

Run tests in Playwright UI mode:

```powershell
npm run test:ui
```

Run tests in headed mode:

```powershell
npm run test:headed
```

Open the latest HTML report:

```powershell
npm run report
```

The npm scripts can be used alongside direct Playwright commands:

```powershell
npx playwright test
npx playwright test tests/login.spec.js
npx playwright test tests/demoqa.spec.js
```

Run a test by title:

```powershell
npx playwright test -g "TC01"
```

## Configuration

The shared configuration is in [`playwright.config.js`](playwright.config.js).

Configured behavior includes:

- Test directory: `tests`
- Fully parallel execution
- Local workers: `4`
- CI workers: `3`
- Local retries: `1`
- CI retries: `2`
- Test timeout: `60` seconds
- Assertion timeout: `20` seconds
- HTML reports
- Trace, screenshot, and video capture
- `.env` loading for local runs
- Microsoft Edge project
- OrangeHRM base URL: `https://opensource-demo.orangehrmlive.com`

The Applitools demo login is skipped unless `RUN_DEMO_LOGIN=true`, `USERNAME`, and `PASSWORD` are set. Keep credentials in an ignored local `.env` file or GitHub Actions secrets; do not commit them.

## Reports and artifacts

The HTML report is generated in `playwright-report/`.

Open it after a test run:

```powershell
npx playwright show-report
```

Trace, screenshot, video, and failure artifacts are written to `test-results/`.

## Project structure

```text
playwrighttest/
|-- .github/workflows/playwright.yml  # GitHub Actions CI workflow
|-- testdata/
|   `-- demoqa.json                  # DemoQA test data
|-- tests/
|   |-- login.spec.js                # OrangeHRM login scenarios
|   |-- pim.spec.js                  # OrangeHRM PIM workflow
|   |-- addempolye.spec.js           # OrangeHRM smoke test
|   |-- demoqa.spec.js               # DemoQA text-box test
|   |-- loginsaucedemo.spec.js       # SauceDemo login scenarios
|   |-- login_demo.spec.js           # Optional Applitools demo login
|   |-- assertions.spec.js           # Assertion examples
|   |-- firstTest.spec.js            # Playwright smoke test
|   `-- example.spec.js              # Playwright and SauceDemo examples
|-- playwright.config.js             # Playwright configuration
|-- package.json                     # Dependencies and package metadata
`-- README.md
```

## Continuous integration

The GitHub Actions workflow runs on pushes and pull requests to `main` or `master`, and on a scheduled run at midnight UTC.

CI installs Node.js dependencies and Playwright browsers, runs the complete test suite, and uploads `playwright-report/` for 30 days.

## Test data

DemoQA form values are maintained in [`testdata/demoqa.json`](testdata/demoqa.json). Update this JSON file to change the submitted name, email, and addresses.

OrangeHRM demo credentials used by the tests are:

```text
Username: Admin
Password: admin123
```
