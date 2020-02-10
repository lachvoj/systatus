'use strict';

class DataTableController {
    constructor(scope, attrs) {
        this.scope = scope;

        let dataTableDataName = attrs.tableData || 'table';
        if (!scope.$parent[dataTableDataName]) {
            console.warn('Data table no data named: ' + dataTableDataName + ' in parent scope.');
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
        module.controller(this.name, [scopeName, attrsName, DataTableController]);
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