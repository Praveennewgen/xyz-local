(function() {
    'use strict';

    angular.module('iot').component('chooseLayout', {
        controller: chooseLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/chooseLayout/chooseLayout.html',
    });

    /** @ngInject */
    chooseLayoutController.$inject = [];

    function chooseLayoutController() {
       var vm = this;
    }    

})();