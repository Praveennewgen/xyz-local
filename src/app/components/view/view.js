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
        
        $http.get('./data/category.json', false)
            .then(function(res) {
                vm.menuData = res.data.layoutOption;
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

        var indexSet = [];
        var counter = 1;
        var canvas = Snap("#svg");
        var objPos = [
            {
                x: 160,
                y: 110
            }, 
            {
                x: 215,
                y: 180
            },
            {
                x: 280,
                y: 290
            },
            {
                x: 390,
                y: 210
            },
            {
                x: 390,
                y: 330
            },
            {
                x: 450,
                y: 430
            },
            {
                x: 510,
                y: 60
            },
            {
                x: 545,
                y: 130
            },
            {
                x: 595,
                y: 385
            },
            {
                x: 680,
                y: 40
            },
            {
                x: 710,
                y: 300
            },
            {
                x: 710,
                y: 420
            },
            {
                x: 925,
                y: 295
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
            var bg = canvas.image("./img/building_bg.png", 100, 0, 900, 510); 

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
                                .hover(function() {
                                    this.removeClass('hide');
                                }, function(){
                                    this.addClass('hide');
                                }).addClass('hide');

            var diaBox = dialog.rect(24, 0, 215, 36, 3, 3).attr({ fill: "#22221E"});
            var leftArrow = dialog.polygon(16,18, 25,13, 25,23).attr({ fill: "#22221E"});
            var rightArrow = dialog.polygon(247,18, 238,14, 238,23).attr({ fill: "#22221E"});

            var sliderBg = dialog.rect(195, 13, 30, 10, 6, 10).attr({ fill: "red", stroke: "white", strikeWidth: "1"});
            var sliderBtn = dialog.circle(200, 18, 8).attr({ fill: "white"});

            var diaText = dialog.text(34, 22, 'PowerScout <PS1309>').attr({fill: "#4a5359"});

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
            
            return {dialog, slider, diaText, leftArrow, rightArrow};
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

            var g = canvas.g(bgBox, icon);

            g.hover(function(){
                var diaX = x;
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
                dialogBox.dialog.attr({ x: diaX, y: diaY-10}).removeClass('hide');
            }, function(){
                //dialogBox.addClass('hide');
            });
        }
    }

})();