(function() {
  'use strict';

  angular.module('iot').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/home',
      component: 'home',
    })
    .state('chooseLayout', {
          url: '/',
          component: 'chooseLayout',
          params: {
              callBackState: '',
          },
      })
      .state('view', {
          url: '/view/:layoutType',
          component: 'view',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
