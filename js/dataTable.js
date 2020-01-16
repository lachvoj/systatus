'use strict';

class DataTableController {
    constructor(scope, element, attrs) {
        var self = this;
        this.scope = scope;

        let dataTableDataName = element.attr('table-data');
        if (!dataTableDataName || !scope.$parent[dataTableDataName]) {
            dataTableDataName = 'tableData';
        }
        if (!scope.$parent[dataTableDataName]) {
            return;
        }
        this.scope.table = scope.$parent[dataTableDataName];
        
        this.scope.isArray = angular.isArray;
        this.scope.addGraph = this.addGraph.bind(this);
        this.scope.removeGraph = this.removeGraph.bind(this);
    }

    addGraph(name) {}
    removeGraph(name) {}
}

class DataTable {
    constructor(module) {
        var self = this;
        this.name = 'dt';
        module.controller(this.name, [scopeName, elementName, DataTableController]);
        module.directive(this.name, function() {
            return {
                transclude: true,
                templateUrl: '/systatus/components/dataTable.html',
                replace: true,
                controller: self.name,
                scope: {
                    addGraph: '=?',
                    removeGraph: '=?',
                    isArray: '=?',
                    table: '@?'
                }
            }
        });
    }
}