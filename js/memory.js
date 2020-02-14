'use strict';

class Memory extends DataProvider {
    constructor(table, charts) {
        super();
        var self = this;

        this.table = table;
        table.header = [];
        table.data = [];

        this.charts = charts;
        this.registerChartData('percent');
        charts.main = {
            options: {
                yMin: 0,
                yMax: 100,
                yUnit: '%'
            },
            dataNames: 'used %',
            data: self.chartsData.percent,
            labels: self.chartsLabels
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
        let pushTimestamp = false;
        for (var i = 0; i < labels.length; i++) {
            if (labels[i] === "percent") {
                td.push(apiData.memory[labels[i]] + '%');
            }
            else {
                td.push(bytesToHumanReadable(apiData.memory[labels[i]], true));
            }
            let chd = this.chartsData[labels[i]];
            if (chd) {
                pushTimestamp = true;
                chd.push(apiData.memory[labels[i]]);
            }
        }
        if (pushTimestamp)
            this.chartsLabels.push(getHHMMSSTimestamp());

        this.table.data = td;
    }
}