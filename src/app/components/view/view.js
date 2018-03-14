(function() {
    'use strict';

    angular.module('iot').component('view', {
        controller: viewLayoutController,
        controllerAs: 'vm',
        templateUrl: 'app/components/view/view.html',
    });

     viewLayoutController.$inject = [];

    function viewLayoutController() {
        var vm = this;
      /* togglePannel for open close side pannel*/
        vm.togglePannel= false;
        vm.openOverlay=false;
        
        var indexSet = [];
        var counter = 1;
        var canvas = '';
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

        function isRepeated(index) {
            
            for(var i = 0; i < indexSet.length; i++) {
                if(indexSet[i] === index) { return true; }
            }
            indexSet.push(index);
            return false;
        }

        function activate() {
            canvas = Snap("#svg");
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
        activate();

        function createPowerIcon(x, y) {
            createIcon(x, y, 'Powerscout &lt;PS1039&gt;', 'powerscout');
        }

        function createSensorIcon(x, y, text) {
            createIcon(x, y, 'Sensor &lt;SR1039&gt;', 'sensor');
        }

        function createIcon(x, y, text, iconName) {
        var colorClass = iconName==='powerscout'?'orange':'green';
        var fobjectSVG = 
                '<foreignObject x="' + x + '" y="' + y +'">' +
                    '<body>' + 
                        '<div class="icon-wrapper">' +
                            '<div class="img-wrapper">' + 
                                '<span class="icon-box ' + 
                                  colorClass + 
                                 '"><img src="../img/' + iconName + '.png"></span>' + 
                            '</div>' + 
                            '<div class="dialog">' + 
                                '<div class="dialog-text">' + 
                                    text
                                '</div>' + 
                                '<div class="switch-wrapper">' + 
                                    '<label class="switch">' + 
                                        '<input type="checkbox">' + 
                                        '<span class="slider round"></span>' + 
                                    '</label>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                    '</body>' + 
                '</foreignObject>';
            var parseAbc = Snap.parse( fobjectSVG );
            canvas.append(parseAbc);
        }

        

    }

})();