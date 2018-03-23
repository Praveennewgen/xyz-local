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
        vm.simulateDisabled = true;

        var layoutType = $stateParams.layoutType;
        var zipCode = '10001';
        vm.properties = null;
        vm.layoutDetails = null;
        vm.objPos = null;

        activate();

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
            var zipData = {};
            zipData.ZipCode = zipCode;
            postObject.powerscouts = _.filter(vm.layoutDetails.powerscouts, areEnabled);
            postObject.sensors = _.filter(vm.layoutDetails.sensors, areEnabled);
            postObject.range = vm.selectedRange.id;
            postObject.weather = zipData;

            $http.post('/Home/Simulate', postObject).then(function(response) {
                console.log(response);
            })

            console.log(postObject);

            function areEnabled(item) {
                return item.enabled;
            }
        }

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

        getZipCode();

        function getZipCode() {

            var geocoder = new google.maps.Geocoder();
            var win = function(position) {
                var mylat = position.coords.latitude;
                var mylng = position.coords.longitude;
                var latlng = new google.maps.LatLng(mylat, mylng);
                geocoder.geocode({ 'latLng': latlng },
                    function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log("The user's zipcode is " + results[0].address_components[6].short_name);
                            zipCode = results[0].address_components[6].short_name;
                        }
                    });
            };
            var fail = function(e) {
                console.log("GPS Failed:" + e);
                //return '10001';
            };

            navigator.geolocation.getCurrentPosition(win, fail, { enableHighAccuracy: true, maximumAge: 600000, timeout: 10000 });
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

        function activate() {
            vm.showLoading = true;
            $http.get('/Home/GetLayoutData?type=' + layoutType.toLowerCase(), false)
                .then(function(res) {
                    var res1 = JSON.parse(res.data);
                    vm.layoutDetails = res1;

                    vm.disablePowerscout = vm.layoutDetails.powerscouts.length;
                    vm.disableSensor = vm.layoutDetails.sensors.length;

                    $http.get('/Home/GetLayouts', false)
                        .then(function(res) {
                            var res2 = JSON.parse(res.data);
                            updateLayoutDetails(res2.data);
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
    }

})();