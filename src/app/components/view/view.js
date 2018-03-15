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

        activate();
        var dialogBox = createDialog(0,0);
        console.log(dialogBox);

        function activate() {
            canvas.attr({ viewBox: "0 0 1100 510", preserveAspectRatio: "xMidYMid meet" });
            var bg = canvas.image("./img/building_bg.png", 100, 0, 900, 510); 

            while(counter <= 6) {
                var index = Math.floor((Math.random() * objPos.length));
                if(isRepeated(index)) { continue; }
                else { 
                    var pos = objPos[index];
                    createIcon(pos.x, pos.y)
                    // createPowerIcon(pos.x, pos.y);
                    counter++;
                }
            }
            counter = 0;
            while(counter <= 4) {
                var index = Math.floor((Math.random() * objPos.length));
                if(isRepeated(index)) { continue; }
                else { 
                    var pos = objPos[index];
                    // createSensorIcon(pos.x, pos.y);
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
            var leftArrow = dialog.polygon(15,18, 25,13, 25,23).attr({ fill: "#22221E"});
            //var rightArrow = dialog.polygon(252,18, 243,14, 243,23).attr({ fill: "#22221E"});

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
            
            return {dialog, slider, diaText};
        }


        function createPowerIcon(x, y) {
            createIcon(x, y, 'Powerscout &lt;PS1039&gt;', 'powerscout');
        }

        function createSensorIcon(x, y) {
            createIcon(x, y, 'Sensor &lt;SR1039&gt;', 'sensor');
        }


        function createIcon(x, y) {
            var bgBox = canvas.rect(x, y, 17, 18, 3, 3).attr({ fill: "#ff5e00"});
            var icon = canvas.image("./img/powerscout.png", x, y, 17, 17);

            var g = canvas.g(bgBox, icon);

            g.hover(function(){
                dialogBox.dialog.attr({ x: x, y: y-10}).removeClass('hide');
            }, function(){
                //dialogBox.addClass('hide');
            });
        }



        // function createIcon(x, y, text, iconName) {
        // var colorClass = iconName==='powerscout'?'orange':'green';
        // var fobjectSVG = 
        //         '<foreignObject x="' + x + '" y="' + y +'">' +
        //             '<body>' + 
        //                 '<div class="icon-wrapper">' +
        //                     '<div class="img-wrapper">' + 
        //                         '<span class="icon-box ' + 
        //                           colorClass + 
        //                          '"><img src="../img/' + iconName + '.png"></span>' + 
        //                     '</div>' + 
        //                     '<div class="dialog">' + 
        //                         '<div class="dialog-text">' + 
        //                             text
        //                         '</div>' + 
        //                         '<div class="switch-wrapper">' + 
        //                             '<label class="switch">' + 
        //                                 '<input type="checkbox">' + 
        //                                 '<span class="slider round"></span>' + 
        //                             '</label>' + 
        //                         '</div>' + 
        //                     '</div>' + 
        //                 '</div>' + 
        //             '</body>' + 
        //         '</foreignObject>';
        //     var parseAbc = Snap.parse( fobjectSVG );
        //     canvas.append(parseAbc);
        // }

        

    }

})();