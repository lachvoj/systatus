class LineGraphController {
    constructor(scope, element) {
        var self = this;
        this.scope = scope;
        if (!scope.$parent.chartData || !scope.$parent.chartOptions)
        {
            return;
        }
        this.scope.data = scope.$parent.chartData;
        this.scope.options = scope.$parent.chartOptions;
        this.ctx = element[0].getContext('2d');
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: scope.data,
            options: scope.options
        });
        this.scope.$watchCollection('data.labels', function() {
            self.onUpdate();
        });
    }

    onUpdate() {
        this.chart.update();
    }
}

class LineGraph {
    constructor(module) {
        var self = this;
        this.name = 'lineGraph';
        module.controller(this.name, [scopeName, elementName, LineGraphController]);
        module.directive(this.name, function() {
            return {
                transclude: true,
                controller: self.name,
                scope: {}
            };
        });
    }
}