const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const testData = require('../../utils/test-data');

test.describe('Dashboard Functionality', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        await loginPage.goto();
        await loginPage.login(testData.validCredentials.username, testData.validCredentials.password);
        await dashboardPage.isDashboardDisplayed();
    });

    test('Verify dashboard widgets are displayed', async ({ page }) => {
        const widgetCount = await page.locator('.orangehrm-dashboard-widget').count();
        expect(widgetCount).toBeGreaterThan(0);

        const timeAtWork = await page.locator('.orangehrm-dashboard-widget-name >> text=Time at Work').isVisible();
        expect(timeAtWork).toBeTruthy();
    });

    test('Navigate to Admin module', async ({ page }) => {
        await dashboardPage.navigateToModule('Admin');
        const headerText = await dashboardPage.getBreadcrumbModule();
        expect(headerText).toContain('Admin');
    });

    test('Navigate to PIM module', async ({ page }) => {
        await dashboardPage.navigateToModule('PIM');
        const headerText = await dashboardPage.getBreadcrumbModule();
        expect(headerText).toContain('PIM');
    });

    test('Navigate to Leave module', async ({ page }) => {
        await dashboardPage.navigateToModule('Leave');
        const headerText = await dashboardPage.getBreadcrumbModule();
        expect(headerText).toContain('Leave');
    });

    test('Quick Launch items are displayed', async ({ page }) => {
        const quickLaunchItems = await dashboardPage.getQuickLaunchItems();
        expect(quickLaunchItems.length).toBeGreaterThan(0);
    });

    test('User dropdown menu functionality', async ({ page }) => {
        await page.click(dashboardPage.userDropdown);

        const aboutLink = await page.locator('text=About').isVisible();
        expect(aboutLink).toBeTruthy();

        const supportLink = await page.locator('text=Support').isVisible();
        expect(supportLink).toBeTruthy();

        const changePasswordLink = await page.locator('text=Change Password').isVisible();
        expect(changePasswordLink).toBeTruthy();

        const logoutLink = await page.locator('text=Logout').isVisible();
        expect(logoutLink).toBeTruthy();
    });
});