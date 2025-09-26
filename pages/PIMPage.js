const BasePage = require('./BasePage');

class PIMPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.addButton = '.oxd-button--secondary[class*="oxd-button--medium"]';
        this.employeeNameInput = 'input[placeholder="Type for hints..."]';
        this.employeeIdInput = '.oxd-input[class*="oxd-input--active"]';
        this.searchButton = 'button[type="submit"]';
        this.resetButton = '.oxd-button--ghost';
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
        await this.waitForLoadState();
    }

    async clickAddEmployee() {
        await this.click(this.addButton);
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
        await this.type(this.employeeNameInput, name);
        await this.click(this.searchButton);
        await this.waitForLoadState();
    }

    async getEmployeeCount() {
        await this.waitForElement(this.recordsTable);
        return await this.getElementCount(this.tableRows);
    }

    async resetSearch() {
        await this.click(this.resetButton);
        await this.waitForLoadState();
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