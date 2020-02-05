'use strict';

class Memory extends CardBase {
    constructor(module) {
        super ('memory', 'template2', module, MemoryController);
    }
}

class MemoryController extends ControllerBase {
    constructor(scope, apiService, config) {
        super('memory', scope, apiService, config);
        this.scope.tableData.header = [];
        this.scope.tableData.data = [];
        this.scope.chartOptions = {
            yMin: 0,
            yMax: 100,
            yUnit: '%'
        };
        let gc = getLineGraphColor();
        this.scope.chartData.datasets.push({
            label: '% used',
            data: [],
            borderColor: gc.borderColor,
            backgroundColor: gc.backgroundColor,
            borderWidth: 1
        });
        this.start();
    }

    setupTableHeader(apiData) {
        this.scope.tableData.header = Object.keys(apiData.memory);
    }

    transformApiData(apiData) {
        if (!apiData.memory) {
            return;
        }

        if (this.scope.tableData.header.length == 0) {
            this.setupTableHeader(apiData);
        }

        this.scope.tableData.data = [];
        let labels = Object.keys(apiData.memory);
        let td = this.scope.tableData.data;
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] === "percent") {
                td.push(apiData.memory[labels[i]] + '%');
            }
            else {
                td.push(bytesToHumanReadable(apiData.memory[labels[i]], true));
            }
        }
        this.scope.chartData.labels.push(getHHMMSSTimestamp());
        this.scope.chartData.datasets[0].data.push(apiData.memory['percent']);

        super.transformApiData();
    }
}