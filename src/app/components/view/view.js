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
        // vm.enablePowerscout = 0;
        vm.disablePowerscout = 0;
        // vm.enableSensor = 0;
        vm.disableSensor = 0;

        var layoutType = $stateParams.layoutType;
        vm.properties = null;

        $http.get('./data/chooseLayout.json', false)
            .then(function(res) {               
                updateLayoutDetails(res.data.data); 
             //  vm.showLoading=true;             
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
               // vm.showLoading=false;
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

        var indexSet = [];
        var dialogBox = null;
        var canvas = Snap("#svg");
        var powerData = null;
        var sensorData = null;

        vm.selectLayoutOption = function(layoutOption){
            vm.selectedMenu = layoutOption;
        }

        vm.selectedRangeOption= function(range){
            vm.selectedRange=range;
        }

        vm.evtSimulate = function() {
            var postObject = {};
            postObject.Powerscout = _.filter(powerData, areEnabled);
            postObject.Sensors = _.filter(sensorData, areEnabled);

            console.log(postObject);

            function areEnabled(item) {
                return item.enabled;
            }
        }

        InitializeSVG();


        function InitializeSVG() {
            
            var objPos = null;

            canvas.attr({ viewBox: "0 0 1100 510", preserveAspectRatio: "xMidYMid meet" });
            var pseudoRect = canvas.rect(0, 0, 1100, 510).attr({ fill: 'white'})
                            .click(function(){
                                dialogBox.dialog.addClass('hide');
                                clearActives();
                                $scope.$apply(function(){
                                    vm.properties = null;
                                });
                            });
            var bg = canvas.image("./img/building_bg.png", 100, 0, 900, 510)
                        .click(function(){
                            dialogBox.dialog.addClass('hide');
                            clearActives();
                            $scope.$apply(function(){
                                vm.properties = null;
                            });
                        }); 
            

            $http.get('./data/layoutDetails-' + layoutType +'.json', false)
                    .then(function(res) {
                         powerData = res.data.powerscout.data;
                         sensorData = res.data.sensors.data;

                         vm.disablePowerscout = powerData.length;
                         vm.disableSensor = sensorData.length;

                         $http.get('./data/iconCoordinates.json',false)
                                .then(function(res){
                                    objPos = res.data.positions;
                                    renderDataToSVG();
                                },  function(err) {
                                    console.log("Error in fetching data: " + err);
                                });
                    }, function(err) {
                        console.log("Error in fetching data: " + err);
                    });

            function renderDataToSVG() {
                var counter = 1;
                var pos, index;
                if (powerData !== null) {
                    while(counter <= powerData.length) {
                        index = Math.floor((Math.random() * objPos.length));
                        if(isRepeated(index)) { continue; }
                        else { 
                            pos = objPos[index];
                            powerData[counter-1].enabled = false;
                            createIcon(pos.x, pos.y, 'powerscout', counter-1);
                            counter++;
                        }
                    }
                }
                counter = 1;
                if (sensorData !== null) {
                    while(counter <= sensorData.length) {
                        index = Math.floor((Math.random() * objPos.length));
                        if(isRepeated(index)) { continue; }
                        else { 
                            pos = objPos[index];
                            sensorData[counter-1].enabled = false;
                            createIcon(pos.x, pos.y, 'sensor', counter-1);
                            counter++;
                        }
                    }
                }

                dialogBox = createDialog(0, 0);
            }
        }


        function createIcon(x, y, type, index) {

            var text = type === 'powerscout'? 'Powerscout &lt;'+ powerData[index].Powerscout + '&gt;' : 'Sensor &lt;' + sensorData[index].SensorId + '&gt;';

            var fillColor = type === 'powerscout'? '#ff5e00' : '#669933';

            var bgBox = canvas.rect(x, y, 17, 18, 3, 3).attr({ fill: fillColor});
            var icon = canvas.image("./img/" + type + ".png", x, y, 17, 17);
            var halo1 = canvas.circle(x+8.5, y+9, 21).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});
            var halo2 = canvas.circle(x+8.5, y+9, 17).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});
            var halo3 = canvas.circle(x+8.5, y+9, 13).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});

            var haloGroup = canvas.g(halo1, halo2, halo3).addClass('halo');

            var g = canvas.g(haloGroup, bgBox, icon).addClass('icon');
            var objProperties;

            g.hover(function(){
                var diaX = x + 12;
                var diaY = y;
                    
                if(type === 'powerscout') {
                    objProperties = powerData[index];
                } else {
                    objProperties = sensorData[index];
                }

                if(objProperties.enabled) {
                    dialogBox.sliderText.node.innerHTML = 'On';
                    dialogBox.sliderText.attr({x: 200});
                    dialogBox.sliderBtn.attr({cx: 220});
                    dialogBox.sliderBg.attr({fill: 'green'});
                } else {
                    dialogBox.sliderText.node.innerHTML = 'Off';
                    dialogBox.sliderText.attr({x: 211});
                    dialogBox.sliderBtn.attr({cx: 200});
                    dialogBox.sliderBg.attr({fill: 'red'});
                }

                dialogBox.slider.data('type', type);
                dialogBox.slider.data('index', index);



                if(x + 260 > 1100) {
                    diaX = x - 262;
                    dialogBox.leftArrow.addClass('hide');
                    dialogBox.rightArrow.removeClass('hide');
                } else {
                    dialogBox.leftArrow.removeClass('hide');
                    dialogBox.rightArrow.addClass('hide');
                }

                dialogBox.diaText.node.innerHTML = text;
                clearActives();
                haloGroup.addClass('active');
                dialogBox.dialog.attr({ x: diaX, y: diaY-10}).removeClass('hide');
            })
            .click(function(){
                $scope.$apply(function() {
                    vm.togglePannel = true;

                    vm.properties = updatePropertyWindow(type, objProperties);
                })
            });
        }

        function isRepeated(index) {            
            for(var i = 0; i < indexSet.length; i++) {
                if(indexSet[i] === index) { return true; }
            }
            indexSet.push(index);
            return false;
        }
        
        function createDialog(x, y){          

            var dialog = canvas.svg(x-10, y, 255, 36, 0, 0, 250, 36)
                                .addClass('hide');

            var diaBox = dialog.rect(24, 0, 215, 36, 3, 3).attr({ fill: "#22221E"});
            var leftArrow = dialog.polygon(16,18, 25,13, 25,23).attr({ fill: "#22221E"});
            var rightArrow = dialog.polygon(247,18, 238,14, 238,23).attr({ fill: "#22221E"});

            var sliderBg = dialog.rect(195, 10, 34, 14, 6, 10).attr({ fill: "red", stroke: "white", strikeWidth: "1"});
            var sliderBtn = dialog.circle(200, 17, 9).attr({ fill: "white"});
            var sliderText = dialog.text( 211 ,21, 'Off' ).attr({ fill: "white", fontSize: 10});

            var diaText = dialog.text(34, 22, '').attr({fill: "#6e6e6e"});

            var diaBg = dialog.g(diaBox,leftArrow,diaText);
            var slider = dialog.g(sliderBg,sliderBtn,sliderText)
                                .click(function(){
                                    var type = this.data('type');
                                    var index = this.data('index');
                                    var enable;
                                    
                                    if(type === 'powerscout') {
                                        powerData[index].enabled = !powerData[index].enabled;
                                        enable = powerData[index].enabled;
                                        $scope.$apply(function(){
                                            if(enable) { vm.disablePowerscout--; } 
                                            else { vm.disablePowerscout++; }
                                        });
                                    } else {
                                        sensorData[index].enabled = !sensorData[index].enabled;
                                        enable = sensorData[index].enabled;
                                        $scope.$apply(function(){
                                            if(enable) { vm.disableSensor--; } 
                                            else { vm.disableSensor++; }
                                        });
                                    }

                                    if(enable){
                                      sliderText.node.innerHTML = 'On';
                                      sliderText.attr({x: 200});
                                      sliderBtn.animate({cx: 225}, 300); 
                                      sliderBg.animate({ fill: "green"}, 300);
                                    } else {
                                      sliderText.node.innerHTML = 'Off';
                                      sliderText.attr({x: 211})
                                      sliderBtn.animate({cx: 200}, 300); 
                                      sliderBg.animate({ fill: "red"}, 300); 
                                    }
                                }).attr({ cursor: "pointer"});
            
            return {
                dialog: dialog, 
                slider: slider, 
                diaText: diaText, 
                leftArrow: leftArrow, 
                rightArrow: rightArrow,
                sliderBtn: sliderBtn,
                sliderBg: sliderBg,
                sliderText: sliderText
            }
        }

        function updatePropertyWindow(type, objProperties) {

            var properties = {};
            
            properties.type = objProperties['Type'];
            properties.building = objProperties['Building'];
           if(type === 'powerscout') {
               properties.iconName = 'electric-tower';
               properties.id = objProperties['Powerscout'];
               properties.breakerDetails = objProperties['Breaker Details'];
               properties.breakerLabel = objProperties['Breaker Label'];
               properties.modbusAdd = objProperties['Modbus base address'];
               properties.serialNumber = objProperties['Serial Number'];
               properties.ratedAmperage = objProperties['Rated Amperage'];
               properties.unitElectricityCost = objProperties['UnitElectricCost'];
           } else {
               properties.iconName = 'sensor';
               properties.id = objProperties['SensorId'];
               properties.breakerDetails = objProperties['BreakerDetails'];
               properties.breakerLabel = objProperties['BreakerLabel'];
               properties.modbusAdd = objProperties['ModbusBaseAddress'];
               properties.serialNumber = objProperties['SerialNumber'];
           }

           return properties;
        }
        

        function clearActives(){
            var allHalo = canvas.selectAll('.halo');
            allHalo.forEach(function(halo) {
               halo.removeClass('active'); 
            });
            
        }
    }

})();