'use strict';

class LineGraphController {
    constructor(scope, element, attrs) {
        var self = this;
        this.scope = scope;
        this.datasetsInitialized = false;

        let chartDataName = attrs.chartData || scope.$parent.chartDataName || 'main';
        if (!scope.$parent.charts[chartDataName]) {
            console.warn('Chart no data named: ' + chartDataName + ' in parent scope.');
            return;
        }
        this.scope.data = scope.$parent.charts[chartDataName];
        this.chartData = {
            labels: self.scope.data.labels,
            datasets: []
        };

        if (this.scope.data.options) {
            this.options = new ChartOptions(scope.$parent.charts[chartDataName].options);
        }
        else {
            this.options = new ChartOptions({});
        }

        this.scope.zoom = false;

        this.ctx = element.find('canvas')[0].getContext('2d');
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: self.chartData,
            options: self.options
        });
        
        this.scope.$watchCollection('data.labels', function () {
            self.onUpdate();
        });

        this.scope.toggleZoom = this.toggleZoom.bind(this);
    }

    toggleZoom() {
        this.scope.zoom = !this.scope.zoom;
    }

    onUpdate() {
        this.checkDatasetConsistency();
        this.chart.update();
    }

    checkDatasetConsistency() {
        let dt = this.scope.data.data;

        if (!angular.isArray(dt)) {
            console.warn('Charts data are not array!');
            return;
        }

        if (dt.length === 0)
            return;

        let ds = this.chartData.datasets;
        if (!angular.isArray(dt[0]) && ds.length === 0) {
            this.addDataset(dt, this.scope.data.dataNames);
            return;
        }

        if (!angular.isArray(dt[0]) || (ds.length === dt.length)) {
            return;
        }
        
        ds = [];
        for (let i = 0; i < dt.length; i++) {
            this.addDataset(dt[i], this.scope.data.dataNames[i], i);
        }
    }

    addDataset(data, label, index) {
        var self = this;
        let gc = getLineGraphColor(index || 0);

        this.chartData.datasets.push({
            label: label,
            data: data,
            borderColor: gc.borderColor,
            backgroundColor: gc.backgroundColor,
            borderWidth: 1
        });
    }
}

class LineGraph {
    constructor(module) {
        var self = this;
        this.name = 'lg';
        module.controller(this.name, [scopeName, elementName, attrsName, LineGraphController]);
        module.directive(this.name, function () {
            return {
                transclude: true,
                templateUrl: '/systatus/components/lineGraph.html',
                replace: true,
                controller: self.name,
                scope: {
                    toggleZoom: '=?',
                    toggleStart: '=?'
                },
                // template: '<div ng-class="{\'col-md-12\': zoom, \'col-md-4\': !zoom}"><div class="row"><canvas class="col-md-12"></canvas></div><div class="row"><div class="col-md-12 clearfix"><div class="btn-group btn-group-xs float-right"><button ng-click="toggleZoom()" type="button" class="btn btn-primary btn-xs"><span class="bg-icon" ng-class="{\'bg-icon-zoom-out\': zoom, \'bg-icon-zoom-in\': !zoom}"></span></button></div></div></div></div>'
            };
        });
    }
}

class ChartOptions {
    //title, radius, xLines, yLines, yMin, yMax, yUnit
    constructor(cfgObj) {
        var self = this;
        this.scales = {
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontSize: 10,
                    autoSkipPadding: 50,
                    minRotation: 0,
                    maxRotation: 0
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontSize: 10
                }
            }]
        };
        this.elements = {
            point: {
                radius: 0
            },
            line: {
                tension: 0.3
            }
        };

        if (cfgObj.title) {
            this.title = {
                display: true,
                text: cfgObj.title
            };
        }
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

        this.animation = {
            duration: 1000,
            easing: 'linear'
        };

        this.legend  = {
            position: 'left',
            labels: {
                boxWidth: 20,
                fontSize: 10,
                padding: 5
            }
        };
    }
}