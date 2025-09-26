const { test, expect } = require('@playwright/test');
const APIClient = require('../../utils/api-client');
const testData = require('../../utils/test-data');

test.describe('API Authentication Tests', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new APIClient(request, 'https://opensource-demo.orangehrmlive.com');
    });

    test('Successful API authentication', async () => {
        const response = await apiClient.authenticate(
            testData.validCredentials.username,
            testData.validCredentials.password
        );

        expect(response.status()).toBe(302); // Redirect after successful login
    });

    test('Failed API authentication with invalid credentials', async ({ request }) => {
        const response = await request.post('https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate', {
            data: {
                username: testData.invalidCredentials.username,
                password: testData.invalidCredentials.password
            }
        });

        expect(response.status()).toBe(302);
    });

    test('Get dashboard data after authentication', async () => {
        await apiClient.authenticate(
            testData.validCredentials.username,
            testData.validCredentials.password
        );

        const response = await apiClient.get('/web/index.php/api/v2/dashboard/employees/time-at-work');
        expect(response.status()).toBeLessThan(400);
    });
});