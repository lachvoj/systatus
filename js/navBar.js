class NavBar {
    constructor(module) {
        var self = this;
        this.name = 'nb';
        module.controller(this.name, [scopeName, mainMenuName, function(scope, mainMenu) {
            scope.items = mainMenu.items;
        }]);
        module.directive(this.name, function () {
            return {
                restrict: 'E',
                replace: true,
                controller: self.name,
                scope: {
                    items: '@?'
                },
                templateUrl: '/systatus/components/navBar.html'
            }

        });
    }
}