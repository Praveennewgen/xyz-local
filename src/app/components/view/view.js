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
                x: 250,
                y: 60
            }, 
            {
                x: 410,
                y: 60
            },
            {
                x: 410,
                y: 220
            },
            {
                x: 250,
                y: 220
            },
            {
                x: 460,
                y: 60
            },
            {
                x: 615,
                y: 135
            },
            {
                x: 770,
                y: 140
            },
            {
                x: 1020,
                y: 60
            },
            {
                x: 700,
                y: 400
            },
            {
                x: 470,
                y: 360
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
            canvas.attr({ viewBox: "0 0 1300 510", preserveAspectRatio: "xMidYMin meet" });
            var bg = canvas.image("./img/building_bg.png", 200, 0, 900, 510); 

            while(counter <= 6) {
            var index = Math.floor((Math.random() * 10));
            if(isRepeated(index)) { continue; }
            else { 
                var pos = objPos[index];
                createIcon(pos.x, pos.y, 'PS-173'+ counter);
                counter++;
            }
        }     
        }
        activate();

        function createIcon(x, y, text) {
        var fobjectSVG = 
                '<foreignObject x="' + x + '" y="' + y +'">' +
                    '<body>' + 
                        '<div class="icon-wrapper">' +
                            '<div class="img-wrapper">' + 
                                '<span class="icon-box orange"><img src="../img/powerscout.png"></span>' + 
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