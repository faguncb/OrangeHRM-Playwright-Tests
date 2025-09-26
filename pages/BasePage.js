class BasePage {
    constructor(page) {
        this.page = page;
        this.timeout = 30000;
    }

    async navigate(path = '') {
        await this.page.goto(`${path}`);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForElement(selector, timeout = this.timeout) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async click(selector) {
        await this.waitForElement(selector);
        await this.page.click(selector);
    }

    async type(selector, text) {
        await this.waitForElement(selector);
        await this.page.fill(selector, text);
    }

    async getText(selector) {
        await this.waitForElement(selector);
        return await this.page.textContent(selector);
    }

    async isVisible(selector) {
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            return await this.page.isVisible(selector);
        } catch {
            return false;
        }
    }

    async takeScreenshot(name) {
        await this.page.screenshot({
            path: `screenshots/${name}-${Date.now()}.png`,
            fullPage: true
        });
    }

    async waitForLoadState(state = 'networkidle') {
        await this.page.waitForLoadState(state);
    }

    async getElementCount(selector) {
        return await this.page.locator(selector).count();
    }

    async selectOption(selector, value) {
        await this.waitForElement(selector);
        await this.page.selectOption(selector, value);
    }

    async checkCheckbox(selector) {
        await this.waitForElement(selector);
        await this.page.check(selector);
    }

    async uncheckCheckbox(selector) {
        await this.waitForElement(selector);
        await this.page.uncheck(selector);
    }
}

module.exports = BasePage;