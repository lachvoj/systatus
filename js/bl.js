"use strict";

class ApiService {
    constructor(period) {
        var self = this;
        this.period = period | 1000;
        this.http = http;
        this.interval = setIntarval(function () {
            self.obtainData();
        }, period);
        this.obtainData();
    }

    obtainData() {
        var self = this;
        $.ajax(
            window.prefix + '/api',
            {
                success: function(data, textStatus, jqXHR) {
                    self.getDataSuccessHandler(data);
                },
                error: function(jqXHR, textStatus, error) {
                    self.getDataErrorHandler(error);
                }
            }
        );
    }

    getDatasSuccessHandler(data) {
        if (typeof data == 'string') {
            window.location.reload();
            return;
        }
        this.data.downloads = data;
    }

    getDataErrorHandler(error) {
        console.log(error);
        clearInterval(this.interval);
    }
}

document.onload = function() {
    let apiService = new ApiService(1000);

    var ctx = document.getElementById('myChart').getContext('2d');
};