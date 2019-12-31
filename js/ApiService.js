class ApiService {
    constructor(http) {
        this.http = http;
    }

    getData(endpoint) {
        return this.http({
            method: 'POST',
            url: endpoint
        });
    }
}