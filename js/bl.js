'use strict';

const scopeName = '$scope';
const elementName = '$element';
const intervalName = '$interval'
const appName = 'app';
const apiServiceName = 'api';
const configName = 'config';

class Config {
    constructor() {
        this.interval = 1000;
        this.limit = 120;
    }
}

window.onload = function () {
    const appName = 'systatus';
    var module = angular.module(appName, []);

    module.service(apiServiceName, ['$http', '$timeout', configName, ApiService]);
    module.service(configName, [Config]);
    new LineGraph(module);
    new DataTable(module);
    new Memory(module);
    new Temperature(module);
    new Cpu(module);

    angular.bootstrap(document, [appName]);
};