'use strict';

class Cpu extends CardBase {
    constructor(module) {
        super('cpu', 'cpu', module, CpuController);
    }
}

class CpuController extends ControllerBase {
    constructor(scope, apiService, config) {
        super('cpu', scope, apiService, config);
        this.scope.chartOptions = {
            yMin: 0,
            yMax: 100,
            yUnit: '%'
        };
        this.start();
    }

    initializeDataset(apiData) {
        for (let i = 0; i < apiData.cpu.percent.length; i++) {
            let gc = getLineGraphColor(i);
            this.scope.chartData.datasets.push({
                label: 'cpu' + i.toString(),
                data: [],
                borderColor: gc.borderColor,
                backgroundColor: gc.backgroundColor,
                borderWidth: 1
            });
        }
        this.scope.tableData.header = apiData.cpu.times.header;
    }

    transformApiData(apiData) {
        if (!apiData.cpu)
            return;

        this.scope.tableData.data = apiData.cpu.times.data;

        if (this.scope.chartData.datasets.length == 0)
            this.initializeDataset(apiData);

        this.scope.chartData.labels.push(getHHMMSSTimestamp());
        for (let i = 0; i < apiData.cpu.percent.length; i++) {
            this.scope.chartData.datasets[i].data.push(apiData.cpu.percent[i]);
        }
        super.transformApiData();
    }
}