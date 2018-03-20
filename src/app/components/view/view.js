(function() {
    'use strict';

    angular.module('iot').component('view', {
        controller: viewLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/view/view.html',
    });

     viewLayoutController.$inject = ['$scope', '$http'];

    function viewLayoutController($scope, $http) {
        var vm = this;
      /* togglePannel for open close side pannel*/
        vm.togglePannel= false;
        vm.openOverlay=false;
        
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
        var counter = 1;
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
                x: 935,
                y: 305
            }
        ];

        vm.selectLayoutOption = function(layoutOption){
            vm.selectedMenu = layoutOption;
        }
        vm.selectedRangeOption= function(range){
            vm.selectedRange=range;
        }

        activate();
        var dialogBox = createDialog(0,0);

        function activate() {
            canvas.attr({ viewBox: "0 0 1100 510", preserveAspectRatio: "xMidYMid meet" });
            var bg = canvas.image("./img/building_bg.png", 100, 0, 900, 510)
                        .click(function(){
                            dialogBox.dialog.addClass('hide');
                        }); 

            while(counter <= 6) {
                var index = Math.floor((Math.random() * objPos.length));
                if(isRepeated(index)) { continue; }
                else { 
                    var pos = objPos[index];
                    createPowerIcon(pos.x, pos.y);
                    counter++;
                }
            }
            counter = 0;
            while(counter <= 4) {
                var index = Math.floor((Math.random() * objPos.length));
                if(isRepeated(index)) { continue; }
                else { 
                    var pos = objPos[index];
                    createSensorIcon(pos.x, pos.y);
                    counter++;
                }
            }  
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

        function createPowerIcon(x, y) {
            createIcon(x, y, 'Powerscout &lt;PS1039&gt;', 'powerscout');
        }

        function createSensorIcon(x, y) {
            createIcon(x, y, 'Sensor &lt;SR1039&gt;', 'sensor');
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
                    diaX = x - 250;
                    dialogBox.leftArrow.addClass('hide');
                    dialogBox.rightArrow.removeClass('hide');
                } else {
                    dialogBox.leftArrow.removeClass('hide');
                    dialogBox.rightArrow.addClass('hide');
                }

                dialogBox.diaText.node.innerHTML = text;
                g.attr({width: 300});
                dialogBox.dialog.attr({ x: diaX, y: diaY-10}).removeClass('hide');



            }, function(){
                //dialogBox.dialog.addClass('hide');
                
            });
        }
    }

})();