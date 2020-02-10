'use strict';

const scopeName = '$scope';
const elementName = '$element';
const attrsName = '$attrs';
const intervalName = '$interval'
const appName = 'systatus';
const apiServiceName = 'api';
const configName = 'config';
const mainMenuName = 'mainMenu';

class Config {
    constructor() {
        this.interval = 1000;
        this.limit = 120;
    }
}

class MainMenu {
    constructor() {
        this.items = [];
    }
}

window.onload = function () {
    const appName = 'systatus';
    var module = angular.module(appName, ['ngAnimate']);

    module.service(apiServiceName, ['$http', '$timeout', configName, ApiService]);
    module.service(configName, [Config]);
    module.service(mainMenuName, [MainMenu]);
    new NavBar(module);
    new Card(module);
    new LineGraph(module);
    new DataTable(module);

    angular.bootstrap(document, [appName]);
};