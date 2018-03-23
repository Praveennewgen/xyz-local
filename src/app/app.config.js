(function() {
    'use strict';

    angular.module('iot').config(configBlock);

    /** @ngInject */
    function configBlock($locationProvider, $logProvider) {
        $locationProvider.html5Mode(false);
        $logProvider.debugEnabled(true);
    }

})();