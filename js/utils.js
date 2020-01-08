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

function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
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

class ChartOptions {
    //radius, xLines, yLines, yMin, yMax, yUnit
    constructor(cfgObj) {
        var self = this;
        this.scales = {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {}
            }]
        };
        this.elements = {
            point: {
                radius: 0
            }
        };

        if (cfgObj.radius) {
            this.elements.point.radius = cfgObj.radius;
        }
        if (cfgObj.xLines) {
            this.scales.xAxes.gridLines.display = true;
        }
        if (cfgObj.yLines) {
            this.scales.yAxes.gridLines.display = true;
        }
        if (cfgObj.yMin !== undefined && typeof (cfgObj.yMin) === 'number') {
            this.scales.yAxes[0].ticks.suggestedMin = cfgObj.yMin;
        }
        if (cfgObj.yMax !== undefined && typeof (cfgObj.yMax) === 'number') {
            this.scales.yAxes[0].ticks.suggestedMax = cfgObj.yMax;
        }
        if (cfgObj.yUnit) {
            this.scales.yAxes[0].ticks.callback = function (value, index, values) {
                return value + cfgObj.yUnit;
            };
        }
    }
}

class ControllerBase {
    constructor(name, scope, apiService, config) {
        this.scope = scope;
        this.scope.name = name;
        this.scope.upperName = capitalizeFirst(name);
        this.options = {
            limit: config.limit
        };
        this.scope.apiStop = true;
        this.scope.tableData = {};
        this.scope.chartData = {
            labels: [],
            datasets: []
        }
        this.scope.stop = this.stop.bind(this);
        this.scope.start = this.start.bind(this);

        var self = this;
        apiService.registerEndpoint({
            scope: self.scope,
            successCB: function(response) {
                self.transformApiData(response.data);
            },
            errorCB: function(error) {
                console.log(error);
            }
        });
    }

    stop() {
        this.scope.apiStop = true;
    }

    start() {
        this.scope.apiStop = false;
    }

    transformApiData(apiData) {
        //override in child and call on end for dataset limit functionality
        let chd = this.scope.chartData;
        if (!this.options.limit || this.options.limit <= 0 || chd.datasets[0].data.length <= this.options.limit)
            return;

        let toRemoveItemsCount = chd.datasets[0].data.length - this.options.limit;
        chd.labels.splice(0, toRemoveItemsCount);
        for (let i = 0; i < chd.datasets.length; i++) {
            chd.datasets[i].data.splice(0, toRemoveItemsCount);
        }
    }
}

class CardBase {
    constructor(name, templateName, module, controller) {
        var self = this;
        this.name = name;
        this.upperName = capitalizeFirst(name);
        angular.element(document.getElementById('navbar-items')).append('<li class="nav-item"><a class="nav-link" href="#' + this.name + '">' + this.upperName + '</a></li>');
        angular.element(document.getElementById('content')).append('<div ' + this.name + ' id="' + this.name + '" class="card"></div>');
        module.controller(this.name, [scopeName, apiServiceName, configName, controller]);
        module.directive(this.name, function () {
            return {
                transclude: true,
                templateUrl: '/systatus/components/' + templateName + '.html',
                controller: self.name,
                scope: {
                    data: '@?',
                    stop: '=?',
                    start: '=?'
                }
            };
        });
    }
}