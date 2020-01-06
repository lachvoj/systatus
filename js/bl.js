"use strict";

class ConfigItem {
    constructor(cl, enabled, options) {
        this.cl = cl;
        this.enabled = enabled;
        this.options = options;
        this.instance = null;
    }
}

var config = {
    memory: new ConfigItem(Memory, true, {
        interval: 1000,
        limit: 120
    }),
    temperature: new ConfigItem(Temperature, true)
};

const scopeName = '$scope';
const elementName = '$element';
const intervalServiceName = '$interval'
const appName = 'app';
const apiServiceName = 'api';

window.onload = function () {
    const appName = 'systatus';
    var module = angular.module(appName, []);

    module.service(apiServiceName, ['$http', ApiService]);
    new LineGraph(module);

    var configKeys = Object.keys(config);
    for (var i = 0; i < configKeys.length; i++) {
        let configItem = config[configKeys[i]];
        if (configItem.enabled) {
            configItem.instance = new configItem.cl(module, configItem);
        }
    }

    angular.bootstrap(document, [appName]);
};