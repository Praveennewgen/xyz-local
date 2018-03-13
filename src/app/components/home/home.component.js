(function() {
  'use strict';

  angular.module('iot').component('home', {
    controller: HomeController,
    controllerAs: 'vm',
    templateUrl: 'app/components/home/home.view.html',
  });

  /** @ngInject */
  function HomeController($log, SAMPLE_CONSTANT) {
    var vm = this;

    vm.greeting = '';

    vm.showSampleConstant = showSampleConstant;

    activate();

    function activate() {
      vm.greeting = 'Hello, world!';
      $log.debug('home activation');
    }

    function showSampleConstant() {
      alert(SAMPLE_CONSTANT);
    }
  }

})();
