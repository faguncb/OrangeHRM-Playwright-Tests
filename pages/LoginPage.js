const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators
        this.usernameInput = 'input[name="username"]';
        this.passwordInput = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';
        this.errorMessage = '.oxd-alert-content';
        this.forgotPasswordLink = '.orangehrm-login-forgot-header';
        this.loginTitle = '.orangehrm-login-title';
    }

    async goto() {
        await this.navigate('/web/index.php/auth/login');
        await this.waitForElement(this.loginTitle);
    }

    async login(username, password) {
        await this.type(this.usernameInput, username);
        await this.type(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    async getErrorMessage() {
        await this.waitForElement(this.errorMessage);
        return await this.getText(this.errorMessage);
    }

    async isLoginPageDisplayed() {
        return await this.isVisible(this.loginTitle);
    }

    async clickForgotPassword() {
        await this.click(this.forgotPasswordLink);
    }
}

module.exports = LoginPage;