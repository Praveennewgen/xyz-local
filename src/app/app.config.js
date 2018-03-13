(function() {
  'use strict';

  angular.module('iot').config(configBlock);

  /** @ngInject */
  function configBlock($locationProvider, $logProvider) {
    $locationProvider.html5Mode(true);
    $logProvider.debugEnabled(true);
  }

})();
