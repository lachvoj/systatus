'use strict';

class LineGraphController {
    constructor(scope, element, attrs) {
        var self = this;
        this.scope = scope;

        let chartDataName = attrs.chartData || 'main';
        if (!scope.$parent.charts[chartDataName]) {
            console.warn('Chart no data named: ' + chartDataName + ' in parent scope.');
            return;
        }
        this.scope.data = scope.$parent.charts[chartDataName];

        if (this.scope.data.options) {
            this.scope.options = new ChartOptions(scope.$parent.charts[chartDataName].options);
        }
        else {
            this.scope.options = new ChartOptions({});
        }

        this.scope.zoom = false;

        this.ctx = element.find('canvas')[0].getContext('2d');
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: scope.data,
            options: scope.options
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
        this.chart.update();
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
                }
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