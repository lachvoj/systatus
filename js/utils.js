'use strict';

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

function formatTimeValue(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getHHMMSSTimestamp() {
    let now = new Date();
    let formatedHours = formatTimeValue(now.getHours());
    let formatedMinutes = formatTimeValue(now.getMinutes());
    let formatedSeconds = formatTimeValue(now.getSeconds());

    return (formatedHours + ":" + formatedMinutes + ":" + formatedSeconds);
}

var graphColorPallete = [
    { r: 62, g: 150, b: 81 },
    { r: 204, g: 37, b: 41 },
    { r: 57, g: 106, b: 177 },
    { r: 218, g: 124, b: 48 },
    { r: 83, g: 81, b: 84 },
    { r: 107, g: 76, b: 154 },
    { r: 146, g: 36, b: 40 },
    { r: 148, g: 139, b: 61 }
];

function getLineGraphColor(palleteIndex) {
    if (palleteIndex >= graphColorPallete.length) {
        palleteIndex = 0;
    }
    var pi = palleteIndex | 0;
    var cp = graphColorPallete;
    return {
        borderColor: 'rgba(' + cp[pi].r + ',' + cp[pi].g + ',' + cp[pi].b + ',0.5)',
        backgroundColor: 'rgba(' + cp[pi].r + ',' + cp[pi].g + ',' + cp[pi].b + ',0.1)'
    };
}

class DataProvider {
    constructor() {
        this.chartsData = {};
        this.chartsDataNames = {};
    }

    registerChartData(itemName) {
        this.chartsData[itemName] = [];
        this.chartsDataNames[itemName] = [];
        if (!this.chartsLabels)
            this.chartsLabels = [];
    }
}