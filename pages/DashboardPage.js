const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.dashboardHeader = '.oxd-topbar-header-breadcrumb h6';
        this.userDropdown = '.oxd-userdropdown';
        this.logoutOption = 'a[href*="logout"]';
        this.sidebarMenu = '.oxd-sidepanel-body';
        this.quickLaunchWidgets = '.quickLaunge';
        this.timeAtWork = '.orangehrm-dashboard-widget[data-v-37d651f2]';

        // Menu items
        this.adminMenu = 'a[href*="/admin/"]';
        this.pimMenu = 'a[href*="/pim/"]';
        this.leaveMenu = 'a[href*="/leave/"]';
        this.timeMenu = 'a[href*="/time/"]';
        this.recruitmentMenu = 'a[href*="/recruitment/"]';
        this.myInfoMenu = 'a[href*="/pim/viewMyDetails"]';
        this.performanceMenu = 'a[href*="/performance/"]';
        this.dashboardMenu = 'a[href*="/dashboard/"]';
    }

    async isDashboardDisplayed() {
        await this.waitForElement(this.dashboardHeader);
        const headerText = await this.getText(this.dashboardHeader);
        return headerText === 'Dashboard';
    }

    async navigateToModule(moduleName) {
        const moduleMap = {
            'Admin': this.adminMenu,
            'PIM': this.pimMenu,
            'Leave': this.leaveMenu,
            'Time': this.timeMenu,
            'Recruitment': this.recruitmentMenu,
            'My Info': this.myInfoMenu,
            'Performance': this.performanceMenu,
            'Dashboard': this.dashboardMenu
        };

        await this.click(moduleMap[moduleName]);
        await this.waitForLoadState();
    }

    async logout() {
        await this.click(this.userDropdown);
        await this.click(this.logoutOption);
    }

    async getQuickLaunchItems() {
        const elements = await this.page.$$('.quickLaunge .quickLinkText');
        const items = [];
        for (const element of elements) {
            items.push(await element.textContent());
        }
        return items;
    }

    async getUserName() {
        await this.waitForElement(this.userDropdown);
        return await this.getText('.oxd-userdropdown-name');
    }
}

module.exports = DashboardPage;