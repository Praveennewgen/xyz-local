(function() {
    'use strict';

    angular.module('iot').component('chooseLayout', {
        controller: chooseLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/chooseLayout/chooseLayout.html',
    });

    /** @ngInject */
    chooseLayoutController.$inject = ['$scope', '$http'];

    function chooseLayoutController($scope, $http) {
      var vm = this;
      $http.get('./data/category.json', false)
            .then(function(res) {
                vm.layoutData = res.data.layoutOption;
                vm.selectedLayout= vm.layoutData[0];
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
            });
            
            vm.selectLayoutCategory = function(layoutOption){
                vm.selectedLayout = layoutOption;
            } 
    } 
      

})();