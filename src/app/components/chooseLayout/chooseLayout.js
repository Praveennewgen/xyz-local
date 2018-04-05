(function() {
    'use strict';

    angular.module('iot').component('chooseLayout', {
        controller: chooseLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/chooseLayout/chooseLayout.html',
    });

    /** @ngInject */
    chooseLayoutController.$inject = ['$scope', '$http', '$state', '$mdDialog'];

    function chooseLayoutController($scope, $http, $state, $mdDialog) {
        var vm = this;
        vm.showLoading = false;
        activate();

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

        function activate() {
            vm.showLoading = true;
            $http.get('/Home/GetLayouts', false)
                .then(function(res) {
                    console.log(res);
                    var res1 = JSON.parse(res.data);
                    vm.layoutData = res1.data;
                    vm.showLoading = false;
                    // vm.selectedLayout= vm.layoutData[0];
                }, function(err) {
                    vm.showLoading = false;
                    console.log("Error in fetching data from json: " + err);
                });
        }

        welcomeMessage();

        function welcomeMessage() {
            $mdDialog.show({
                    template: '<div class="welcome_box"><div class="welcome_header info-header">Welcome to the IoT Device Simulation app! </div>' +
                        '<p class="message_text">Using this web app, you’ll be able to simulate data collected by environmental sensors installed within a typical office building. The data can then be monitored and analyzed in a separate dashboard as part of the Energy Management System solution, just as it would in a real-world application of this solution. </p>' +
                        '<div class="model_footer"><button ng-click="hide();" class="md-raised md-primary md-button md-ink-ripple">Next</button></div></div>',
                    parent: angular.element(document.querySelector('.custom_dialog')),
                    clickOutsideToClose: true,
                    controller: function($scope, $mdDialog) {
                        $scope.hide = function() {
                            $mdDialog.hide();
                        };
                    }

                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

    }


})();