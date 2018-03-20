(function() {
    'use strict';

    angular.module('iot').component('view', {
        controller: viewLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/view/view.html',
    });

    viewLayoutController.$inject = ['$scope', '$http', '$stateParams'];

    function viewLayoutController($scope, $http, $stateParams) {
        var vm = this;
      /* togglePannel for open close side pannel*/
        vm.togglePannel= false;
        vm.openOverlay=false;
        var layoutType = $stateParams.layoutType;
        vm.properties = {};

        $http.get('./data/chooseLayout.json', false)
            .then(function(res) {
                vm.menuData = res.data.data;
                vm.selectedMenu= vm.menuData[0];
            }, function(err) {
                console.log("Error in fetching data from json: " + err);
            });

        $http.get('./data/selectRange.json', false)
             .then(function(res){
                 vm.range=res.data.range;
                 vm.selectedRange=vm.range[0];
             }, function(err){
                 console.log("Error in fetching data from json: " + err);
             });
        vm.changeLayout=function(selectedLayout){
            alert(selectedLayout);
        }
        var indexSet = [];
        var dialogBox = null;
        var canvas = Snap("#svg");

        vm.selectLayoutOption = function(layoutOption){
            vm.selectedMenu = layoutOption;
        }

        vm.selectedRangeOption= function(range){
            vm.selectedRange=range;
        }

        InitializeSVG();


        function InitializeSVG() {
            var powerData = null;
            var sensorData = null;
            var objPos = null;

            canvas.attr({ viewBox: "0 0 1100 510", preserveAspectRatio: "xMidYMid meet" });
            var pseudoRect = canvas.rect(0, 0, 1100, 510).attr({ fill: 'white'})
                            .click(function(){
                                dialogBox.dialog.addClass('hide');
                                clearActives();
                            });
            var bg = canvas.image("./img/building_bg.png", 100, 0, 900, 510)
                        .click(function(){
                            dialogBox.dialog.addClass('hide');
                            clearActives();
                        }); 
            

            $http.get('./data/layoutDetails-' + layoutType +'.json', false)
                    .then(function(res) {
                         powerData = res.data.powerscout.data;
                         sensorData = res.data.sensors.data;

                         $http.get('./data/iconCoordinates.json',false)
                                .then(function(res){
                                    objPos = res.data.positions;
                                    renderDataToSVG(powerData, sensorData);
                                },  function(err) {
                                    console.log("Error in fetching data: " + err);
                                });
                    }, function(err) {
                        console.log("Error in fetching data: " + err);
                    });

            function renderDataToSVG(powerData, sensorData) {
                var counter = 1;
                if (powerData !== null) {
                    while(counter <= powerData.length) {
                        var index = Math.floor((Math.random() * objPos.length));
                        if(isRepeated(index)) { continue; }
                        else { 
                            var pos = objPos[index];
                            createPowerIcon(pos.x, pos.y, powerData[counter-1]);
                            counter++;
                        }
                    }
                }
                counter = 1;
                if (sensorData !== null) {
                    while(counter <= sensorData.length) {
                        var index = Math.floor((Math.random() * objPos.length));
                        if(isRepeated(index)) { continue; }
                        else { 
                            var pos = objPos[index];
                            createSensorIcon(pos.x, pos.y, sensorData[counter-1]);
                            counter++;
                        }
                    }
                }

                dialogBox = createDialog(0, 0);
            }
        }

        function createPowerIcon(x, y, powerElement) {
            createIcon(x, y, 'Powerscout &lt;'+ powerElement.Powerscout + '&gt;+ ', 'powerscout', powerElement);
        }

        function createSensorIcon(x, y, sensorElement) {
            createIcon(x, y, 'Sensor &lt;' + sensorElement.SensorId + '&gt;', 'sensor', sensorElement);
        }


        function createIcon(x, y, text, type, objProperties) {

            var fillColor = type === 'powerscout'? '#ff5e00' : '#669933';

            var bgBox = canvas.rect(x, y, 17, 18, 3, 3).attr({ fill: fillColor});
            var icon = canvas.image("./img/" + type + ".png", x, y, 17, 17);
            var halo1 = canvas.circle(x+8.5, y+9, 21).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});
            var halo2 = canvas.circle(x+8.5, y+9, 17).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});
            var halo3 = canvas.circle(x+8.5, y+9, 13).attr({stroke: 'white', strokeWidth:'1', opacity: '0.33'});

            var haloGroup = canvas.g(halo1, halo2, halo3).addClass('halo');

            var g = canvas.g(haloGroup, bgBox, icon).addClass('icon');

            g.hover(function(){
                var diaX = x + 12;
                var diaY = y;

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
                                
                
                //console.log(vm.properties);
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
                                .mouseover(function() {
                                    //this.removeClass('hide');
                                }).mouseout(function(){
                                    //this.addClass('hide');
                                }).addClass('hide');

            var diaBox = dialog.rect(24, 0, 215, 36, 3, 3).attr({ fill: "#22221E"});
            var leftArrow = dialog.polygon(16,18, 25,13, 25,23).attr({ fill: "#22221E"});
            var rightArrow = dialog.polygon(247,18, 238,14, 238,23).attr({ fill: "#22221E"});

            var sliderBg = dialog.rect(195, 13, 30, 10, 6, 10).attr({ fill: "red", stroke: "white", strikeWidth: "1"});
            var sliderBtn = dialog.circle(200, 18, 8).attr({ fill: "white"});

            var diaText = dialog.text(34, 22, 'PowerScout <PS1309>').attr({fill: "#6e6e6e"});

            var diaBg = dialog.g(diaBox,leftArrow,diaText);
            var slider = dialog.g(sliderBg,sliderBtn)
                                .data('enabled', false)
                                .click(function(){
                                    var enable = !this.data('enabled');
                                    this.data('enabled', enable);

                                    if(enable){
                                      sliderBtn.animate({cx: 220}, 300); 
                                      sliderBg.animate({ fill: "green"}, 300); 
                                    } else {
                                      sliderBtn.animate({cx: 200}, 300); 
                                      sliderBg.animate({ fill: "red"}, 300); 
                                    }
                                }).attr({ cursor: "pointer"});
            
            return {
                dialog: dialog, 
                slider: slider, 
                diaText: diaText, 
                leftArrow: leftArrow, 
                rightArrow: rightArrow
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