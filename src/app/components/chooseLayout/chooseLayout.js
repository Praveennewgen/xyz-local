(function() {
    'use strict';

    angular.module('iot').component('chooseLayout', {
        controller: chooseLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/chooseLayout/chooseLayout.html',
    });

    /** @ngInject */
    chooseLayoutController.$inject = ['$scope', '$http', '$state'];

    function chooseLayoutController($scope, $http, $state) {
        var vm = this;
        vm.showLoading = false;

        activate();

        vm.selectLayoutCategory = function(layoutOption) {
            vm.selectedLayout = layoutOption;
        }

        vm.evtSelectLayout = function(category) {
            $state.go('view', { layoutType: category });
        }

        vm.selectLayoutCategory = function(layoutItem) {
            vm.selectedLayout = layoutItem;
        }

        function activate() {
            vm.showLoading = true;
            $http.get('/Home/GetLayout', false)
                .then(function(res) {
                    vm.layoutData = res.data.data;
                    vm.showLoading = false;
                    // vm.selectedLayout= vm.layoutData[0];
                }, function(err) {
                    vm.showLoading = false;
                    console.log("Error in fetching data from json: " + err);
                });
        }

    }


})();