const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.dashboardHeader = '.oxd-topbar-header-breadcrumb-module';
        this.userDropdown = '.oxd-userdropdown';
        this.logoutOption = 'a[href*="logout"]';
        this.sidebarMenu = '.oxd-sidepanel-body';
        this.quickLaunchSection = '.orangehrm-dashboard-widget:has-text("Quick Launch")';
        this.quickLaunchItemsLocator = '.orangehrm-dashboard-widget:has-text("Quick Launch") .oxd-text--span';
        this.timeAtWork = '.orangehrm-dashboard-widget:has-text("Time at Work")';

        // Menu items
        this.moduleRoutes = {
            'Admin': '/web/index.php/admin/viewAdminModule',
            'PIM': '/web/index.php/pim/viewEmployeeList',
            'Leave': '/web/index.php/leave/viewLeaveList',
            'Time': '/web/index.php/time/viewEmployeeTimesheet',
            'Recruitment': '/web/index.php/recruitment/viewCandidates',
            'My Info': '/web/index.php/pim/viewMyDetails',
            'Performance': '/web/index.php/performance/searchEvaluatePerformanceReview',
            'Dashboard': '/web/index.php/dashboard/index'
        };
    }

    async isDashboardDisplayed() {
        await this.waitForElement(this.dashboardHeader);
        const headerText = await this.getText(this.dashboardHeader);
        return headerText === 'Dashboard';
    }

    async navigateToModule(moduleName) {
        const route = this.moduleRoutes[moduleName];
        const menuLink = this.page.getByRole('link', { name: moduleName, exact: true }).first();
        await menuLink.waitFor({ state: 'visible', timeout: this.timeout });
        await Promise.all([
            this.page.waitForURL(`**${route}**`, { timeout: this.timeout }),
            menuLink.click()
        ]);
    }

    async logout() {
        await this.click(this.userDropdown);
        await this.click(this.logoutOption);
    }

    async getQuickLaunchItems() {
        await this.waitForElement(this.quickLaunchSection);
        const texts = await this.page.locator(this.quickLaunchItemsLocator).allTextContents();
        return texts.map(text => text.trim()).filter(Boolean);
    }

    async getUserName() {
        await this.waitForElement(this.userDropdown);
        const name = await this.getText('.oxd-userdropdown-name');
        return name ? name.trim() : '';
    }

    async getBreadcrumbModule() {
        await this.waitForElement(this.dashboardHeader);
        return (await this.getText(this.dashboardHeader)).trim();
    }
}

module.exports = DashboardPage;