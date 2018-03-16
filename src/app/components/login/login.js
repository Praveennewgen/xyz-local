(function() {
    'use strict';

    angular.module('iot').component('login', {
        controller: loginController,
        controllerAs: 'vm',
        templateUrl: 'app/components/login/login.html',
    });

        /** @ngInject */
    loginController.$inject = [];

    function loginController() {
      // var vm = this;
    }    

})();