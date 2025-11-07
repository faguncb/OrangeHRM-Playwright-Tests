const BasePage = require('./BasePage');

class PIMPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.addButton = 'button:has-text("Add")';
        this.employeeNameInput = 'input[placeholder="Type for hints..."]';
        this.employeeIdInput = 'input[placeholder="Type Employee Id"]';
        this.searchButton = 'button[type="submit"]';
        this.resetButton = 'button:has-text("Reset")';
        this.recordsTable = '.oxd-table-body';
        this.tableRows = '.oxd-table-body .oxd-table-card';

        // Add Employee Form
        this.firstNameInput = 'input[name="firstName"]';
        this.middleNameInput = 'input[name="middleName"]';
        this.lastNameInput = 'input[name="lastName"]';
        this.employeeIdField = '.oxd-grid-item:has-text("Employee Id") input';
        this.saveButton = 'button[type="submit"]';
        this.cancelButton = '.oxd-button--ghost';
    }

    async navigateToPIM() {
        await this.navigate('/web/index.php/pim/viewEmployeeList');
        await this.page.waitForURL('**/pim/viewEmployeeList**', { timeout: this.timeout });
    }

    async clickAddEmployee() {
        await Promise.all([
            this.page.waitForURL('**/pim/addEmployee**', { timeout: this.timeout }),
            this.page.locator(this.addButton).click()
        ]);
        await this.waitForElement(this.firstNameInput);
    }

    async addEmployee(firstName, middleName, lastName, employeeId = null) {
        await this.type(this.firstNameInput, firstName);
        await this.type(this.middleNameInput, middleName);
        await this.type(this.lastNameInput, lastName);

        if (employeeId) {
            await this.page.fill(this.employeeIdField, '');
            await this.type(this.employeeIdField, employeeId);
        }

        await this.click(this.saveButton);
    }

    async searchEmployee(name) {
        await this.page.fill(this.employeeNameInput, '');
        await this.type(this.employeeNameInput, name);
        await Promise.all([
            this.waitForEmployeeData(),
            this.page.locator(this.searchButton).click()
        ]);
    }

    async getEmployeeCount() {
        await this.waitForElement(this.recordsTable, { state: 'attached' });
        return await this.getElementCount(this.tableRows);
    }

    async resetSearch() {
        await Promise.all([
            this.waitForEmployeeData(),
            this.page.locator(this.resetButton).click()
        ]);
    }

    async waitForEmployeeData() {
        await this.page.waitForResponse(response => {
            return response.url().includes('/web/index.php/api/v2/pim/employees') && response.request().method() === 'GET';
        }, { timeout: this.timeout }).catch(() => {});
    }

    async deleteEmployee(rowIndex) {
        const deleteButton = `.oxd-table-body .oxd-table-card:nth-child(${rowIndex}) .bi-trash`;
        await this.click(deleteButton);
        await this.click('.oxd-button--label-danger');
        await this.waitForLoadState();
    }

    async editEmployee(rowIndex) {
        const editButton = `.oxd-table-body .oxd-table-card:nth-child(${rowIndex}) .bi-pencil-fill`;
        await this.click(editButton);
        await this.waitForLoadState();
    }
}

module.exports = PIMPage;