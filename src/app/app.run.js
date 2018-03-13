(function() {
  'use strict';

  angular.module('iot').run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('App run end');
  }

})();
