const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
    testDir: 'tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'reports/html' }],
        ['json', { outputFile: 'reports/results.json' }],
        ['junit', { outputFile: 'reports/results.xml' }],
        ['list']
    ],
    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 10000,
        navigationTimeout: 30000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],

    outputDir: 'test-results/',
});


