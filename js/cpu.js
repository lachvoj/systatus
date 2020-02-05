'use strict';

class Cpu extends CardBase {
    constructor(module) {
        super('cpu', 'template2', module, CpuController);
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
        let keys = Object.keys(apiData.cpu.percent.data);
        for (let i = 0; i < keys.length; i++) {
            let gc = getLineGraphColor(i);
            this.scope.chartData.datasets.push({
                label: keys[i],
                data: [],
                borderColor: gc.borderColor,
                backgroundColor: gc.backgroundColor,
                borderWidth: 1
            });
        }
        this.scope.tableData.header = apiData.cpu.times.header;
        if (apiData.cpu.temperature) {
            this.scope.tableData.header.push('temperature')
        }
        if (apiData.cpu.freq) {
            this.scope.tableData.header.push('frequency')
        }
        if (apiData.cpu.percent) {
            this.scope.tableData.header.push('percent')
        }
    }

    addElementsToData(data, elements) {
        let dataKeys = Object.keys(data);
        for (let i = 0; i < dataKeys.length; i++) {
            data[dataKeys[i]].push(elements[dataKeys[i]] || 0);
        }
    }

    transformApiData(apiData) {
        if (!apiData.cpu)
            return;

        this.scope.tableData.data = apiData.cpu.times.data;
        if (apiData.cpu.temperature) {
            this.addElementsToData(this.scope.tableData.data, apiData.cpu.temperature.data)
        }
        if (apiData.cpu.freq) {
            this.addElementsToData(this.scope.tableData.data, apiData.cpu.freq.data)
        }
        if (apiData.cpu.percent) {
            this.addElementsToData(this.scope.tableData.data, apiData.cpu.percent.data)
        }

        if (this.scope.chartData.datasets.length == 0)
            this.initializeDataset(apiData);

        this.scope.chartData.labels.push(getHHMMSSTimestamp());
        let keys = Object.keys(apiData.cpu.percent.data);
        for (let i = 0; i < this.scope.chartData.datasets.length; i++) {
            this.scope.chartData.datasets[i].data.push(apiData.cpu.percent.data[keys[i]]);
        }
        super.transformApiData();
    }
}