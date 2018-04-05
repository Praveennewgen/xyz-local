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
        welcomeMessage();

        function welcomeMessage() {
            $mdDialog.show({
                    template: '<div class="welcome_box"><div class="welcome_header info-header">Welcome to the IoT Device Simulation app! </div>' +
                        '<div class="message_text"><p>Using this web app, you will be able to simulate data collected by environmental sensors installed within a typical office building. The data can then be monitored and analyzed in a separate dashboard as part of the Energy Management System solution, just as it would in a real-world application of this solution. </p><p style="margin-top:15px">Click the info button on the following pages for help</p></div>' +
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