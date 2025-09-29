class APIClient {
    constructor(request, baseURL) {
        this.request = request;
        this.baseURL = baseURL;
        this.cookies = '';
    }

    async authenticate(username, password) {
        const response = await this.request.post(`${this.baseURL}/web/index.php/auth/validate`, {
            data: {
                username: username,
                password: password
            }
        });

        // Aggregate cookies from set-cookie headers if provided
        const setCookie = response.headers()['set-cookie'];
        if (setCookie) {
            if (Array.isArray(setCookie)) {
                this.cookies = setCookie.map(c => c.split(';')[0]).join('; ');
            } else {
                this.cookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
            }
        }
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