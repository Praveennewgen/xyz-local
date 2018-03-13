(function() {
    'use strict';

    angular.module('iot').component('toolbar', {
        controller: ToolbarController,
        controllerAs: 'vm',
        templateUrl: 'app/directives/toolbar/toolbar.view.html',
    });

    /** @ngInject */
    ToolbarController.$inject = [];

    function ToolbarController() {
       // var vm = this;
    }

})();