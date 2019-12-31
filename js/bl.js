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
    // temperature: new ConfigItem(Temperature, false)
};

const scopeName = '$scope';
const elementName = '$element';
const intervalServiceName = '$interval'
const appName = 'app';
const apiServiceName = 'api';


function bytesToHumanReadable(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
};

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