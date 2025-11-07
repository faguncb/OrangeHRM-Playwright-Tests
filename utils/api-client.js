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
        const setCookieHeaders = response.headersArray()
            .filter(header => header.name.toLowerCase() === 'set-cookie')
            .map(header => header.value.split(';')[0]);

        if (setCookieHeaders.length > 0) {
            this.cookies = setCookieHeaders.join('; ');
        }

        if (!this.cookies) {
            const cookieHeader = response.headers()['set-cookie'];
            if (cookieHeader) {
                const cookieValues = Array.isArray(cookieHeader)
                    ? cookieHeader
                    : cookieHeader.split('\n');
                this.cookies = cookieValues.map(c => c.split(';')[0]).join('; ');
            }
        }

        if (response.status() === 302) {
            const location = response.headers()['location'];
            if (location) {
                await this.request.get(location.startsWith('http') ? location : `${this.baseURL}${location}`, {
                    headers: {
                        Cookie: this.cookies,
                    },
                });
            }
        }
        return response;
    }

    async get(endpoint) {
        return await this.request.get(`${this.baseURL}${endpoint}`, {
            headers: {
                'Cookie': this.cookies,
                'Accept': 'application/json, text/plain, */*',
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