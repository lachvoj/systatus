"use strict";

class Memory extends CardBase {
    constructor(module) {
        super ('memory', 'template1', module, MemoryController);
    }
}

class MemoryController extends ControllerBase {
    constructor(scope, apiService, config) {
        super('memory', scope, apiService, config);
        this.scope.chartOptions = new ChartOptions({
            yMin: 0,
            yMax: 100,
            yUnit: '%'
        });
        let gc = getLineGraphColor();
        this.scope.chartData.datasets.push({
            label: '% used',
            data: [],
            borderColor: gc.borderColor,
            backgroundColor: gc.backgroundColor
        });
        this.start();
    }

    transformApiData(apiData) {
        if (!apiData.memory) {
            return;
        }

        let labels = Object.keys(apiData.memory);
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] === "percent") {
                this.scope.tableData[labels[i]] = apiData.memory[labels[i]] + '%';
            }
            else {
                this.scope.tableData[labels[i]] = bytesToHumanReadable(apiData.memory[labels[i]], true);
            }
        }
        this.scope.chartData.labels.push(getHHMMSSTimestamp());
        this.scope.chartData.datasets[0].data.push(apiData.memory['percent']);

        super.transformApiData();
    }
}