const { test, expect } = require('@playwright/test');
const APIClient = require('../../utils/api-client');
const testData = require('../../utils/test-data');

test.describe('Employees API Tests', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new APIClient(request, 'https://opensource-demo.orangehrmlive.com');
        await apiClient.authenticate(
            testData.validCredentials.username,
            testData.validCredentials.password
        );
    });

    test('Get employees list', async () => {
        const response = await apiClient.get('/web/index.php/api/v2/pim/employees');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(Array.isArray(data.data)).toBeTruthy();
    });

    test('Search for specific employee', async () => {
        const response = await apiClient.get('/web/index.php/api/v2/pim/employees?name=Linda');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
    });

    test('Get employee details', async () => {
        // First get an employee ID
        const listResponse = await apiClient.get('/web/index.php/api/v2/pim/employees?limit=1');
        const listData = await listResponse.json();

        if (listData.data && listData.data.length > 0) {
            const employeeId = listData.data[0].empNumber;
            const detailsResponse = await apiClient.get(`/web/index.php/api/v2/pim/employees/${employeeId}`);
            expect(detailsResponse.status()).toBe(200);
        }
    });
});