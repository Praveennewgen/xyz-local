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
        vm.togglePannel= false;
        vm.openOverlay=false;
        vm.showLoading=false;
        vm.disablePowerscout = 0;
        vm.disableSensor = 0;

        var layoutType = $stateParams.layoutType;
        vm.properties = null;
        vm.layoutDetails = null;
        vm.objPos = null;

        $http.get('./data/layoutDetails-' + layoutType +'.json', false)
                .then(function(res) {
                        vm.layoutDetails = res.data;

                        vm.disablePowerscout = vm.layoutDetails.powerscout.data.length;
                        vm.disableSensor = vm.layoutDetails.sensors.data.length;

                }, function(err) {
                    console.log("Error in fetching data: " + err);
                });

        $http.get('./data/chooseLayout.json', false)
            .then(function(res) {               
                updateLayoutDetails(res.data.data); 
             //  vm.showLoading=true;             
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
               // vm.showLoading=false;
            });
        
        $http.get('./data/iconCoordinates.json',false)
            .then(function(res){
                vm.objPos = res.data.positions;
            },  function(err) {
                console.log("Error in fetching data: " + err);
            }); 

        $http.get('./data/selectRange.json', false)
             .then(function(res){
                 vm.range=res.data.range;
                 vm.selectedRange=vm.range[0];
             }, function(err){
                 console.log("Error in fetching data from json: " + err);
                 //vm.showLoading=false;     
             });

             

        function updateLayoutDetails(data) {                            
                vm.menuData = data;               
                data.forEach(function(item){                   
                    if(item.LayoutType === layoutType){ 
                        vm.selectedMenu = item;
                    }
                });
                vm.powerscoutSize=vm.selectedMenu.PowerscoutSize;
                vm.sensorSize=vm.selectedMenu.SensorSize;
                vm.weatherSize=vm.selectedMenu.WeatherSize;                    
        }
        

        vm.changeLayout=function(selectedLayoutObj){
            $state.go('view', {layoutType:selectedLayoutObj.LayoutType});
        }

        vm.selectLayoutOption = function(layoutOption){
            vm.selectedMenu = layoutOption;
        }

        vm.selectedRangeOption= function(range){
            vm.selectedRange=range;
        }

        vm.evtSimulate = function() {
            var postObject = {};
            postObject.Powerscout = _.filter(vm.layoutDetails.powerscout.data, areEnabled);
            postObject.Sensors = _.filter(vm.layoutDetails.sensors.data, areEnabled);

            console.log(postObject);

            function areEnabled(item) {
                return item.enabled;
            }
        }        
    }

})();