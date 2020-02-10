'use strict';

class Cpu {
    constructor(table, charts) {
        var self = this;

        this.table = table;
        table.header = [];
        table.data = {};

        this.charts = charts;
        this.chartsData = {
            percent: {
                datasets: [],
                labels: []
            }
        };
        charts.main = {
            options: {
                yMin: 0,
                yMax: 100,
                yUnit: '%'
            },
            datasets: self.chartsData.percent.datasets,
            labels: self.chartsData.percent.labels
        };
    }

    transformApiData(apiData) {
        if (!apiData.cpu)
            return;

        let cpuData = apiData.cpu;

        if (this.table.header.length === 0)
            this.initialize(cpuData);

        let data = cpuData.times.data;
        if (cpuData.temperature)
            this.addElementsToData(data, cpuData.temperature.data);
        if (cpuData.frequency)
            this.addElementsToData(data, cpuData.frequency.data);
        if (cpuData.percent)
            this.addElementsToData(data, cpuData.percent.data);
        this.table.data = data;
        
        let chdk = Object.keys(this.chartsData);
        let dtk = Object.keys(cpuData.times.data);
        for (let i = 0; i < chdk.length; i++) {
            let indx;
            let chd = this.chartsData[chdk[i]];
            let dt;
            if (cpuData[chdk[i]])
                dt = cpuData[chdk[i]].data;
            else if ((indx = cpuData.times.header.indexOf(chdk[i])) >= 0)
                dt = cpuData.times.data;
            else
                continue;

            for (let j = 0; j < chd.datasets.length; j++) {
                let pushDt = dt[dtk[j]];
                if (dt.constructor === Array)
                    pushDt = pushDt[indx];
                chd.datasets[j].data.push(pushDt);
            }
            chd.labels.push(getHHMMSSTimestamp());
        }
    }

    addElementsToData(data, elements) {
        let dataKeys = Object.keys(data);
        for (let i = 0; i < dataKeys.length; i++) {
            data[dataKeys[i]].push(elements[dataKeys[i]] || 0);
        }
    }

    initialize(cpuData) {
        this.table.header = cpuData.times.header;
        if (cpuData.temperature)
            this.table.header.push('temperature');
        if (cpuData.frequency)
            this.table.header.push('frequency');
        if (cpuData.percent)
            this.table.header.push('percent');

        let chdk = Object.keys(this.chartsData);
        for (let i = 0; i < chdk.length; i++) {
            let keys;
            if (cpuData[chdk[i]])
                keys = Object.keys(cpuData[chdk[i]].data);
            else if (cpuData.times)
                keys = Object.keys(cpuData.times.data);
            else
                continue;

            for (let j = 0; j < keys.length; j++) {
                let gc = getLineGraphColor(j);
                this.chartsData[chdk[i]].datasets.push({
                    label: keys[j],
                    data: [],
                    borderColor: gc.borderColor,
                    backgroundColor: gc.backgroundColor,
                    borderWidth: 1
                });
            }
        }
    }
}