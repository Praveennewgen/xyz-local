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
        
        $http.get('./data/chooseLayout.json', false)
        var layoutType = $stateParams.layoutType;

        $http.get('./data/category.json', false)
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
        var objPos = [
            {
                x: 170,
                y: 120
            }, 
            {
                x: 225,
                y: 190
            },
            {
                x: 290,
                y: 120
            },
            {
                x: 290,
                y: 300
            },
            {
                x: 170,
                y: 300
            },
            {
                x: 400,
                y: 220
            },
            {
                x: 400,
                y: 340
            },
            {
                x: 460,
                y: 440
            },
            {
                x: 520,
                y: 70
            },
            {
                x: 555,
                y: 140
            },
            {
                x: 605,
                y: 395
            },
            {
                x: 690,
                y: 50
            },
            {
                x: 720,
                y: 310
            },
            {
                x: 720,
                y: 430
            },
            {
                x: 930,
                y: 305
            },
            {
                x: 930,
                y: 425
            },
            {
                x: 850,
                y: 425
            },
            {
                x: 935,
                y: 45
            },
            {
                x: 832,
                y: 305
            },
            {
                x: 970,
                y: 118
            },
            {
                x: 840,
                y: 49
            },
            {
                x: 545,
                y: 300
            },
            {
                x: 450,
                y: 140
            },
            {
                x: 425,
                y: 75
            },
            {
                x: 315,
                y: 185
            },
            {
                x: 643,
                y: 145
            },
            {
                x: 865,
                y: 215
            },
            {
                x: 585,
                y: 265
            },
            {
                x: 828,
                y: 140
            },
            {
                x: 452,
                y: 378
            },
            {
                x: 652,
                y: 450
            },
            {
                x: 718,
                y: 360
            },
            {
                x: 885,
                y: 370
            },
            {  
                x: 125,
                y: 188
            },
            {  
                x: 594,
                y: 343
            },
            {  
                x: 525,
                y: 440
            },
            {  
                x: 655,
                y: 215
            },
            {  
                x: 455,
                y: 235
            },
            {  
                x: 555,
                y: 45
            },
            {  
                x: 940,
                y: 190
            }
        ];

        vm.selectLayoutOption = function(layoutOption){
            vm.selectedMenu = layoutOption;
        }
        vm.selectedRangeOption= function(range){
            vm.selectedRange=range;
        }

        activate();


        

        function activate() {
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
            var powerData = null;
            var sensorData = null;

            $http.get('./data/layoutDetails-' + layoutType +'.json', false)
                    .then(function(res) {
                         powerData = res.data.powerscout.data;
                         sensorData = res.data.sensors.data;
                         renderDataToSVG(powerData, sensorData);
                    }, function(err) {
                        console.log("Error in fetching data from json: " + err);
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
            createIcon(x, y, 'Powerscout &lt;'+ powerElement.Powerscout + '&gt;+ ', 'powerscout');
        }

        function createSensorIcon(x, y, sensorElement) {
            createIcon(x, y, 'Sensor &lt;' + sensorElement.SensorId + '&gt;', 'sensor');
        }


        function createIcon(x, y, text, sensorType) {

            var fillColor = '#669933';
            if(sensorType === 'powerscout') {
                fillColor = '#ff5e00';
            }
            var bgBox = canvas.rect(x, y, 17, 18, 3, 3).attr({ fill: fillColor});
            var icon = canvas.image("./img/" + sensorType + ".png", x, y, 17, 17);
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



            }, function(){
                //dialogBox.dialog.addClass('hide');
                
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

        

        function clearActives(){
            var allHalo = canvas.selectAll('.halo');
            allHalo.forEach(function(halo) {
               halo.removeClass('active'); 
            });
        }
    }

})();