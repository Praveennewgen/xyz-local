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
        vm.messageInfo = false;
        $http.get('./data/chooseLayout.json', false)
            .then(function(res) {
                //  vm.showLoading=true;
                vm.layoutData = res.data.data;
                // vm.selectedLayout= vm.layoutData[0];
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
            });
        vm.messagesShow = function() {
            vm.messageInfo = true;
        }
        vm.closeInfo = function() {
            vm.messageInfo = false;
        }
        vm.selectLayoutCategory = function(layoutOption) {
            vm.selectedLayout = layoutOption;
        }

        vm.evtSelectLayout = function(category) {
            $state.go('view', { layoutType: category });
        }

        vm.selectLayoutCategory = function(layoutItem) {
            vm.selectedLayout = layoutItem;
        }

    }


})();