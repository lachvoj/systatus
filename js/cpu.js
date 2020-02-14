'use strict';

class Cpu extends DataProvider {
    constructor(table, charts) {
        super();
        var self = this;

        this.table = table;
        table.header = [];
        table.data = {};

        this.charts = charts;
        this.registerChartData('percent');
        charts.main = {
            options: {
                yMin: 0,
                yMax: 100,
                yUnit: '%'
            },
            dataNames: self.chartsDataNames.percent,
            data: self.chartsData.percent,
            labels: self.chartsLabels
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
        let pushTimestamp = false;
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

            for (let j = 0; j < chd.length; j++) {
                let pushDt = dt[dtk[j]];
                if (angular.isArray(dt))
                    pushDt = pushDt[indx];
                chd[j].push(pushDt);
            }
            pushTimestamp = true;
        }
        if (pushTimestamp)
            this.chartsLabels.push(getHHMMSSTimestamp());
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
                this.chartsData[chdk[i]].push([]);
                this.chartsDataNames[chdk[i]].push(keys[j]);
            }
        }
    }
}