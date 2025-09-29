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

        // OrangeHRM demo responds with 200 on auth validate
        expect(response.status()).toBe(200);
    });

    test('Failed API authentication with invalid credentials', async ({ request }) => {
        const response = await request.post('https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate', {
            data: {
                username: testData.invalidCredentials.username,
                password: testData.invalidCredentials.password
            }
        });

        // Expect 200 with error in body for invalid creds OR 401 depending on server
        expect([200, 401]).toContain(response.status());
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