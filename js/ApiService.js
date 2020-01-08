"use strict";

class ApiService {
    constructor(http, timeout, config) {
        this.http = http;
        this.timeout = timeout;
        this.config = config;
        this.registeredEndpoints = [];

        let self = this;
        let tick;
        let setTimeout;

        tick = function() {
            for (let i = 0; i < self.registeredEndpoints.length; i++) {
                let re = self.registeredEndpoints[i];
                if (re.scope.apiStop === true) continue;
                self.http({
                    method: 'POST',
                    url: '/systatus/api/' + re.scope.name
                }).then(re.successCB, re.errorCB);
            }
            setTimeout();
        };

        setTimeout = function() {
            self.timeout(function(){
                tick();
            }, self.config.interval | 1000);
        };
        setTimeout();
    }

    registerEndpoint(endpointObj) {
        //successCB, errorCB, scope
        this.registeredEndpoints.push(endpointObj);
    }
}