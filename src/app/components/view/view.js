(function() {
    'use strict';

    angular.module('iot').component('view', {
        controller: viewLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/view/view.html',
    });

    viewLayoutController.$inject = ['$scope', '$http', '$stateParams', '$state'];

    function viewLayoutController($scope, $http, $stateParams, $state) {
        var vm = this;
        /* togglePannel for open close side pannel*/
        vm.togglePannel = false;
        vm.openOverlay = false;
        vm.showLoading = false;
        vm.disablePowerscout = 0;
        vm.disableSensor = 0;

        var layoutType = $stateParams.layoutType;
        vm.properties = null;
        vm.layoutDetails = null;
        vm.objPos = null;

        activate();

        $http.get('./data/iconCoordinates.json', false)
            .then(function(res) {
                vm.objPos = res.data.positions;
            }, function(err) {
                console.log("Error in fetching data: " + err);
            });

        $http.get('./data/selectRange.json', false)
            .then(function(res) {
                vm.range = res.data.range;
                vm.selectedRange = vm.range[0];
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
                //vm.showLoading=false;     
            });

        function activate() {
            vm.showLoading = true;
            $http.get('/Home/GetLayoutDetails?type=' + layoutType, false)
                .then(function(res) {
                    vm.layoutDetails = res.data;

                    vm.disablePowerscout = vm.layoutDetails.powerscout.data.length;
                    vm.disableSensor = vm.layoutDetails.sensors.data.length;

                    $http.get('/Home/GetLayout', false)
                        .then(function(res) {
                            updateLayoutDetails(res.data.data);
                            vm.showLoading = false;
                            //  vm.showLoading=true;             
                        }, function(err) {
                            vm.showLoading = false;
                            console.log("Error in fetching data from json: " + err);
                            // vm.showLoading=false;
                        });

                }, function(err) {
                    vm.showLoading = false;
                    console.log("Error in fetching data: " + err);
                });
        }

        function updateLayoutDetails(data) {
            vm.menuData = data;
            data.forEach(function(item) {
                if (item.LayoutType === layoutType) {
                    vm.selectedMenu = item;
                }
            });
            vm.powerscoutSize = vm.selectedMenu.PowerscoutSize;
            vm.sensorSize = vm.selectedMenu.SensorSize;
            vm.weatherSize = vm.selectedMenu.WeatherSize;
        }


        vm.changeLayout = function(selectedLayoutObj) {
            $state.go('view', { layoutType: selectedLayoutObj.LayoutType });
        }

        vm.selectLayoutOption = function(layoutOption) {
            vm.selectedMenu = layoutOption;
        }

        vm.selectedRangeOption = function(range) {
            vm.selectedRange = range;
        }

        vm.evtSimulate = function() {
            vm.openOverlay = true;
            var postObject = {};
            postObject.powerscout = _.filter(vm.layoutDetails.powerscout.data, areEnabled);
            postObject.sensors = _.filter(vm.layoutDetails.sensors.data, areEnabled);
            postObject.range = vm.selectedRange.id;

            $http.post('/Home/Simulate', postObject).then(function(response) {
                console.log(response);
            })

            console.log(postObject);

            function areEnabled(item) {
                return item.enabled;
            }
        }
    }

})();