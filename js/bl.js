"use strict";

class ApiService {
    constructor(period, dataCB) {
        var self = this;
        this.dataCB = dataCB;
        this.period = period | 1000;
        this.interval = setInterval(function () {
            self.obtainData();
        }, period);
        this.obtainData();
    }

    getDataSuccessHandler(data) {
        if (typeof data == 'string') {
            window.location.reload();
            return;
        }
        this.dataCB(data);
    }

    getDataErrorHandler(error) {
        console.log(error);
        clearInterval(this.interval);
    }

    obtainData() {
        var self = this;
        $.ajax(
            document.URL + 'api',
            {
                success: function (data, textStatus, jqXHR) {
                    self.getDataSuccessHandler(data);
                },
                error: function (jqXHR, textStatus, error) {
                    self.getDataErrorHandler(error);
                }
            }
        );
    }
}

function bytesToHumanReadable(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

var memChartdata = {};
function apiDataToMemoryChartData(apiData) {
    if (!memChartdata.labels) {
        memChartdata.labels = [];
    }
    let today = new Date();
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    memChartdata.labels.push(checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds()));

    if (!memChartdata.datasets) {
        memChartdata.datasets = [];
    }
    else if (memChartdata.datasets.length === 0) {
        memChartdata.datasets.push({
            label: '% used',
            data: [],
            borderColor: 'rgba(0, 100, 0, 0.5)',
            backgroundColor: 'rgba(0, 100, 0, 0.1)'
        });
    }
    memChartdata.datasets[0].data.push(apiData.memory['percent']);
    if (memChartdata.limit && memChartdata.limit > 0 && memChartdata.datasets[0].data.length > memChartdata.limit) {
        let toRemoveItemsCount = memChartdata.datasets[0].data.length - memChartdata.limit;
        memChartdata.datasets[0].data.splice(0, toRemoveItemsCount);
        memChartdata.labels.splice(0, toRemoveItemsCount);
    }
}

var memDomObjs;
function updateMemory(apiData) {
    let labels = Object.keys(apiData.memory);
    if (!memDomObjs) {
        memDomObjs = {};
        var memTableDom = $('#mem-table');
        for (var i = 0; i < labels.length; i++) {
            var row = $('<tr></tr>').append('<th>' + labels[i] + '</th>')
            memDomObjs[labels[i]] = $('<td></td>');
            row.append(memDomObjs[labels[i]]);
            memTableDom.append(row);
        }
    }
    for (var i = 0; i < labels.length; i++) {
        if (labels[i] === "percent") {
            memDomObjs[labels[i]].text(apiData.memory[labels[i]] + '%');
        }
        else {
            memDomObjs[labels[i]].text(bytesToHumanReadable(apiData.memory[labels[i]], true));
        }
    }
    apiDataToMemoryChartData(apiData);
}

window.onload = function () {
    // let apiData = (JSON.parse(
    //     '{"temperatures": {"acpitz": [{"label": "", "current": 26.8, "high": 95.0, "critical": 95.0}], "coretemp": [{"label": "Core 0", "current": 18.0, "high": 90.0, "critical": 90.0}, {"label": "Core 1", "current": 18.0, "high": 90.0, "critical": 90.0}, {"label": "Core 2", "current": 21.0, "high": 90.0, "critical": 90.0}, {"label": "Core 3", "current": 25.0, "high": 90.0, "critical": 90.0}]}, "memory": {"total": 8270249984, "available": 5202784256, "percent": 37.1, "used": 2748727296, "free": 317153280, "active": 2225643520, "inactive": 1280016384, "buffers": 1000599552, "cached": 4203769856, "shared": 4747264, "slab": 2212950016}}'
    // ));


    let memoryCtx = document.getElementById('memoryGraph').getContext('2d');
    var memoryLineChart = new Chart(memoryCtx, {
        type: 'line',
        data: memChartdata,
        options: {
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
        }
    });

    // setInterval(function() {
    //     updateMemory(apiData);
    //     memoryLineChart.update();
    // }, 1000);

    memChartdata.limit = 120;
    let apiService = new ApiService(1000, function (dt) {
        updateMemory(dt);
        memoryLineChart.update();
    });
};