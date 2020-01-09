'use strict';

class Temperature extends CardBase {
    constructor(module, config) {
        super('temperature', 'template1', module, TemperatureController);
    }
}

class TemperatureController extends ControllerBase {
    constructor(scope, apiService, config) {
        super('temperature', scope, apiService, config)
        this.scope.chartOptions = {
            yUnit: '°C'
        };
        this.start();
    }

    initializeDataset(apiData) {
        let labels = Object.keys(apiData.temperature);
        for (let i = 0; i < labels.length; i++) {
            for (let j = 0; j < apiData.temperature[labels[i]].length; j++) {
                let tItem = apiData.temperature[labels[i]][j];
                let nm = tItem.label;
                if (!nm || nm.length === 0) {
                    nm = labels[i] + j.toString();
                }
                let gc = getLineGraphColor(i + j);
                this.scope.chartData.datasets.push({
                    label: nm,
                    data: [],
                    borderColor: gc.borderColor,
                    backgroundColor: gc.backgroundColor,
                    borderWidth: 1
                });
            }
        }
    }

    transformApiData(apiData) {
        // console.log(apiData);
        if (!apiData.temperature)
            return;

        if (this.scope.chartData.datasets.length == 0)
            this.initializeDataset(apiData);

        this.scope.chartData.labels.push(getHHMMSSTimestamp());
        let labels = Object.keys(apiData.temperature);
        for (var i = 0; i < labels.length; i++) {
            for (var j = 0; j < apiData.temperature[labels[i]].length; j++) {
                let tItem = apiData.temperature[labels[i]][j];
                let nm = tItem.label;
                if (!nm || nm.length === 0) {
                    nm = labels[i] + j.toString();
                }
                this.scope.tableData[nm] = tItem.current;
                this.scope.chartData.datasets[i + j].data.push(tItem.current);
            }
        }
        super.transformApiData();
    }
}