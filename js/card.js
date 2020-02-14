'use strict';

class CardController {
    constructor(scope, attrs, apiService, config, mainMenu) {
        var self = this;
        this.scope = scope;

        this.config = config;
        this.scope.name = attrs.cardName;
        mainMenu.items.push(this.scope.name);
        this.scope.callApiOnce = true;
        this.scope.apiStart = true;
        this.scope.showGraphs = false;

        this.initDataContainers(scope);
        this.initDataProvider(scope);
        this.registerEndpoint(scope, apiService);

        this.scope.toggleApiStart = function () { self.scope.apiStart = !self.scope.apiStart };
        this.scope.toggleGraphArea = function () { self.scope.showGraphs = !self.scope.showGraphs };
        this.scope.requestOnce = this.requestOnce.bind(this);
    }

    requestOnce() {
        this.scope.callApiOnce = true;
        this.scope.apiStart = true;
    }

    initDataProvider(scope) {
        let dataProviderClassName,
            dataProviderConstructor;

        dataProviderClassName = scope.name.charAt(0).toUpperCase() + scope.name.slice(1);
        try {
            dataProviderConstructor = Function('return ' + dataProviderClassName)();
        }
        catch (e) {
            console.warn('Unknown class: ' + dataProviderClassName);
            return;
        }
        this.dataProvider = new dataProviderConstructor(scope.table, scope.charts);
    }

    registerEndpoint(scope, apiService) {
        var self = this;

        apiService.registerEndpoint({
            scope: scope,
            successCB: function (response) {
                self.apiSuccessResponse(response.data);
            },
            errorCB: function (error) {
                console.log(error);
            }
        });
    }

    initDataContainers(scope) {
        scope.table = {};
        scope.charts = {};
    }

    apiSuccessResponse(apiData) {
        if (this.scope.callApiOnce) {
            this.scope.callApiOnce = false;
            this.scope.apiStart = false;
        }

        if (!this.dataProvider) {
            this.scope.apiStart = false;
            return;
        }

        this.dataProvider.transformApiData(apiData);

        if (!this.config.limit || this.config.limit <= 0)
            return;

        let chrts = Object.keys(this.scope.charts);
        for (let i = 0; i < chrts.length; i++) {
            let chd = this.scope.charts[chrts[i]];

            if (chd.labels.length <= this.config.limit)
                continue;

            let toRemoveItemsCount = chd.labels.length - this.config.limit;
            chd.labels.splice(0, toRemoveItemsCount);
            if (!angular.isArray(chd.data[0]))
                chd.data.splice(0, toRemoveItemsCount);
            else {
                for (let j = 0; j < chd.data.length; j++) {
                    chd.data[j].splice(0, toRemoveItemsCount);
                }
            }
        }
    }
}

class Card {
    constructor(module) {
        var self = this;
        this.name = 'crd';
        module.controller(this.name, [scopeName, attrsName, apiServiceName, configName, mainMenuName, CardController]);
        module.directive(this.name, function () {
            return {
                restrict: 'E',
                replace: true,
                controller: self.name,
                scope: {
                    toggleApiStart: '=?',
                    requestOnce: '=?'
                },
                templateUrl: function (elem, attr) {
                    let templateName = attr.template || 'card';
                    return '/systatus/components/' + templateName + '.html';
                }
            };
        });
    }
}