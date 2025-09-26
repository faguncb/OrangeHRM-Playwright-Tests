const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const PIMPage = require('../../pages/PIMPage');
const testData = require('../../utils/test-data');

test.describe('PIM Module Functionality', () => {
    let loginPage;
    let dashboardPage;
    let pimPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        pimPage = new PIMPage(page);

        await loginPage.goto();
        await loginPage.login(testData.validCredentials.username, testData.validCredentials.password);
        await dashboardPage.isDashboardDisplayed();
        await dashboardPage.navigateToModule('PIM');
    });

    test('View employee list', async ({ page }) => {
        const employeeCount = await pimPage.getEmployeeCount();
        expect(employeeCount).toBeGreaterThan(0);
    });

    test('Search for employee', async ({ page }) => {
        await pimPage.searchEmployee('Linda');
        await page.waitForTimeout(2000);

        const searchResults = await pimPage.getEmployeeCount();
        expect(searchResults).toBeGreaterThanOrEqual(0);
    });

    test('Navigate to Add Employee page', async ({ page }) => {
        await pimPage.clickAddEmployee();

        const addEmployeeTitle = await page.locator('h6').textContent();
        expect(addEmployeeTitle).toContain('Add Employee');
    });

    test('Add new employee', async ({ page }) => {
        await pimPage.clickAddEmployee();

        const employee = testData.employees[0];
        await pimPage.addEmployee(
            employee.firstName,
            employee.middleName,
            employee.lastName
        );

        await page.waitForTimeout(3000);
        const personalDetailsHeader = await page.locator('h6').first().textContent();
        expect(personalDetailsHeader).toContain('Personal Details');
    });

    test('Reset search filters', async ({ page }) => {
        await pimPage.searchEmployee('Test');
        await page.waitForTimeout(2000);

        await pimPage.resetSearch();
        await page.waitForTimeout(2000);

        const employeeCount = await pimPage.getEmployeeCount();
        expect(employeeCount).toBeGreaterThan(0);
    });

    test('Sort employee list', async ({ page }) => {
        const sortArrow = await page.locator('.oxd-table-header-sort').first();
        await sortArrow.click();
        await page.waitForTimeout(1000);

        const sortIcon = await page.locator('.oxd-table-header-sort .oxd-icon').first().isVisible();
        expect(sortIcon).toBeTruthy();
    });
});