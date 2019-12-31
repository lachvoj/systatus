class MemoryController {
    constructor(scope, apiService, intervalService) {
        this.scope = scope;
        this.options = {};
        this.options.limit = 120
        this.apiService = apiService;
        this.intervalService = intervalService;
        this.scope.data = {
            stop: true,
            memory: {}
        };
        this.scope.chartOptions = {
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        callback: function (value, index, values) {
                            return value + '%';
                        }
                    }
                }]
            }
        };
        this.scope.chartData = {
            labels: [],
            datasets: [{
                label: '% used',
                data: [],
                borderColor: 'rgba(0, 100, 0, 0.5)',
                backgroundColor: 'rgba(0, 100, 0, 0.1)'
            }]
        };
        this.scope.stop = this.stop.bind(this);
        this.scope.start = this.start.bind(this);
        this.start();
    }

    stop() {
        if (!this.interval)
            return;

        this.scope.data.stop = true;
        this.intervalService.cancel(this.interval);
        this.interval = null;
    }

    start() {
        if (this.interval)
            return;

        this.scope.data.stop = false;
        var self = this;
        this.interval = this.intervalService(function () {
            self.apiService.getData('/systatus/api/memory').then(function successCB(response) {
                self.transformApiData(response.data);
            }, function errorCB(response) { });
            // var apiData = (JSON.parse(
            //     '{"temperatures": {"acpitz": [{"label": "", "current": 26.8, "high": 95.0, "critical": 95.0}], "coretemp": [{"label": "Core 0", "current": 18.0, "high": 90.0, "critical": 90.0}, {"label": "Core 1", "current": 18.0, "high": 90.0, "critical": 90.0}, {"label": "Core 2", "current": 21.0, "high": 90.0, "critical": 90.0}, {"label": "Core 3", "current": 25.0, "high": 90.0, "critical": 90.0}]}, "memory": {"total": 8270249984, "available": 5202784256, "percent": 37.1, "used": 2748727296, "free": 317153280, "active": 2225643520, "inactive": 1280016384, "buffers": 1000599552, "cached": 4203769856, "shared": 4747264, "slab": 2212950016}}'
            // ));
            // apiData.memory.percent =  Math.floor(Math.random() * Math.floor(100));
            // self.transformApiData(apiData);
        }, this.options.interval | 1000);
    }

    transformApiData(apiData) {
        if (!apiData.memory) {
            return;
        }

        let labels = Object.keys(apiData.memory);
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] === "percent") {
                this.scope.data.memory[labels[i]] = apiData.memory[labels[i]] + '%';
            }
            else {
                this.scope.data.memory[labels[i]] = bytesToHumanReadable(apiData.memory[labels[i]], true);
            }
        }
        let today = new Date();
        function formatTimeValue(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        this.scope.chartData.labels.push(formatTimeValue(today.getHours()) + ":" + formatTimeValue(today.getMinutes()) + ":" + formatTimeValue(today.getSeconds()));
        this.scope.chartData.datasets[0].data.push(apiData.memory['percent']);
        if (this.options.limit && this.options.limit > 0 && this.scope.chartData.datasets[0].data.length > this.options.limit) {
            let toRemoveItemsCount = this.scope.chartData.datasets[0].data.length - this.options.limit;
            this.scope.chartData.datasets[0].data.splice(0, toRemoveItemsCount);
            this.scope.chartData.labels.splice(0, toRemoveItemsCount);
        }
    }
}

class Memory {
    constructor(module, config) {
        self = this;
        this.name = 'memory';
        angular.element(document.getElementById('navbar-items')).append('<li class="nav-item"><a class="nav-link" href="#' + this.name + '">Memory</a></li>');
        angular.element(document.getElementById('content')).append('<div ' + this.name + ' id="' + this.name + '" class="card"></div>');

        module.controller(this.name, [scopeName, apiServiceName, intervalServiceName, MemoryController]);
        module.directive(this.name, function () {
            return {
                transclude: true,
                templateUrl: '/systatus/components/memory.html',
                // template: '<div class="card-header">    <h5>Memory</h5></div><div class="card-body">    <div class="row">        <div class="col-md-3">            <table class="table table-sm small">                <tr ng-repeat="(key, val) in data.memory">                    <th>{{key}}</th>                    <td>{{val}}</td>                </tr>            </table>        </div>        <div class="col-md-9">            <div class="row">                <canvas line-graph class="col-md-12"></canvas>            </div>            <div class="row">                <div class="col-md-12 clearfix">                    <button ng-if="(data.stop)" ng-click="start()" type="button" class="btn btn-success float-right">Start</button>                    <button ng-if="(!data.stop)" ng-click="stop()" type="button" class="btn btn-danger float-right">Stop</button>                </div>            </div>        </div>    </div></div>',
                controller: self.name,
                scope: {
                    data: '@?',
                    stop: '=?',
                    start: '=?'
                }
            };
        });
    }

    initCard(viewString) {

    }
}