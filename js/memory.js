'use strict';

class Memory {
    constructor(table, charts) {
        var self = this;

        this.table = table;
        table.header = [];
        table.data = [];

        this.charts = charts;
        let gc = getLineGraphColor();
        this.chartsData = {
            percent:{
                datasets: [{
                    label: '% used',
                    data: [],
                    borderColor: gc.borderColor,
                    backgroundColor: gc.backgroundColor,
                    borderWidth: 1
                }],
                labels: [],
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

    setupTableHeader(apiData) {
        this.table.header = Object.keys(apiData.memory);
    }

    transformApiData(apiData) {
        if (!apiData.memory) {
            return;
        }

        if (this.table.header.length == 0) {
            this.setupTableHeader(apiData);
        }

        let labels = this.table.header;
        let td = [];
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] === "percent") {
                td.push(apiData.memory[labels[i]] + '%');
            }
            else {
                td.push(bytesToHumanReadable(apiData.memory[labels[i]], true));
            }
            let chd = this.chartsData[labels[i]];
            if (chd) {
                chd.labels.push(getHHMMSSTimestamp());
                chd.datasets[0].data.push(apiData.memory[labels[i]]);
            }
        }
        this.table.data = td;
    }
}