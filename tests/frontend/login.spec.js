const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const testData = require('../../utils/test-data');

test.describe('Login Functionality', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.goto();
    });

    test('Successful login with valid credentials', async ({ page }) => {
        await loginPage.login(testData.validCredentials.username, testData.validCredentials.password);

        const isDashboardVisible = await dashboardPage.isDashboardDisplayed();
        expect(isDashboardVisible).toBeTruthy();

        const userName = await dashboardPage.getUserName();
        expect(userName).toContain('Paul');
    });

    test('Failed login with invalid credentials', async ({ page }) => {
        await loginPage.login(testData.invalidCredentials.username, testData.invalidCredentials.password);

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid credentials');

        const isLoginPageVisible = await loginPage.isLoginPageDisplayed();
        expect(isLoginPageVisible).toBeTruthy();
    });

    test('Login with empty credentials', async ({ page }) => {
        await loginPage.login('', '');

        const requiredMessages = await page.locator('.oxd-input-field-error-message').count();
        expect(requiredMessages).toBeGreaterThan(0);
    });

    test('Login with only username', async ({ page }) => {
        await loginPage.type(loginPage.usernameInput, testData.validCredentials.username);
        await loginPage.click(loginPage.loginButton);

        const errorMessage = await page.locator('.oxd-input-field-error-message').textContent();
        expect(errorMessage).toContain('Required');
    });

    test('Forgot password link navigation', async ({ page }) => {
        await loginPage.clickForgotPassword();

        await page.waitForURL('**/requestPasswordResetCode');
        const resetTitle = await page.locator('.orangehrm-forgot-password-title').textContent();
        expect(resetTitle).toContain('Reset Password');
    });

    test('Logout functionality', async ({ page }) => {
        await loginPage.login(testData.validCredentials.username, testData.validCredentials.password);
        await dashboardPage.isDashboardDisplayed();

        await dashboardPage.logout();

        const isLoginPageVisible = await loginPage.isLoginPageDisplayed();
        expect(isLoginPageVisible).toBeTruthy();
    });
});