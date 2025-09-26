class APIClient {
    constructor(request, baseURL) {
        this.request = request;
        this.baseURL = baseURL;
        this.cookies = null;
    }

    async authenticate(username, password) {
        const response = await this.request.post(`${this.baseURL}/web/index.php/auth/validate`, {
            data: {
                username: username,
                password: password
            }
        });

        // Store cookies for subsequent requests
        this.cookies = await response.headers()['set-cookie'];
        return response;
    }

    async get(endpoint) {
        return await this.request.get(`${this.baseURL}${endpoint}`, {
            headers: {
                'Cookie': this.cookies
            }
        });
    }

    async post(endpoint, data) {
        return await this.request.post(`${this.baseURL}${endpoint}`, {
            data: data,
            headers: {
                'Cookie': this.cookies,
                'Content-Type': 'application/json'
            }
        });
    }

    async put(endpoint, data) {
        return await this.request.put(`${this.baseURL}${endpoint}`, {
            data: data,
            headers: {
                'Cookie': this.cookies,
                'Content-Type': 'application/json'
            }
        });
    }

    async delete(endpoint) {
        return await this.request.delete(`${this.baseURL}${endpoint}`, {
            headers: {
                'Cookie': this.cookies
            }
        });
    }
}

module.exports = APIClient;