(function() {
    'use strict';

    angular.module('iot').directive('customSvg', function() {
        return {
            restrict: 'E',
            template: '<svg id="svg"></svg>',
            scope: {
                layoutDetails: '=',
                disablePowerscout: '=',
                disableSensor: '=',
                objPos: '=coordinates',
                sidePanelOpen: '=',
                properties: '='
            },
            link: linkCustomSvg
        };
    });

    function linkCustomSvg(scope, element) {
        //var canvas = Snap('#svg');
        var canvas = Snap(element[0].childNodes[0]);
        var dialogBox = null;
        var indexSet = [];

        canvas.attr({ viewBox: "0 0 1100 510", preserveAspectRatio: "xMidYMid meet" });

        canvas.rect(0, 0, 1100, 510).attr({ fill: 'white' }).click(clearActiveData);

        canvas.image("./img/building_bg.png", 100, 0, 900, 510)
            .click(clearActiveData);

        if (scope.layoutDetails !== null) {
            renderDataToSVG(scope.layoutDetails.powerscouts, scope.layoutDetails.sensors);
        }


        function renderDataToSVG(powerscouts, sensors) {
            var counter = 1;
            var pos, index;
            if (powerscouts !== null) {
                while (counter <= powerscouts.length) {
                    index = Math.floor((Math.random() * scope.objPos.length));
                    if (isRepeated(index)) { continue; } else {
                        pos = scope.objPos[index];
                        powerscouts[counter - 1].enabled = false;
                        createIcon(pos.x, pos.y, 'powerscout', counter - 1);
                        counter++;
                    }
                }
            }
            counter = 1;
            if (sensors !== null) {
                while (counter <= sensors.length) {
                    index = Math.floor((Math.random() * scope.objPos.length));
                    if (isRepeated(index)) { continue; } else {
                        pos = scope.objPos[index];
                        sensors[counter - 1].enabled = false;
                        createIcon(pos.x, pos.y, 'sensor', counter - 1);
                        counter++;
                    }
                }
            }

            dialogBox = createDialog(0, 0, powerscouts, sensors);
        }

        function isRepeated(index) {
            for (var i = 0; i < indexSet.length; i++) {
                if (indexSet[i] === index) { return true; }
            }
            indexSet.push(index);
            return false;
        }

        function createIcon(x, y, type, index) {

            var powerData = scope.layoutDetails.powerscouts;
            var sensorData = scope.layoutDetails.sensors;

            var text = type === 'powerscout' ? 'Powerscout &lt;' + powerData[index].Powerscout + '&gt;' : 'Sensor &lt;' + sensorData[index].SensorId + '&gt;';

            var fillColor = type === 'powerscout' ? '#ff5e00' : '#669933';

            var bgBox = canvas.rect(x, y, 17, 18, 3, 3).attr({ fill: fillColor });
            var icon = canvas.image("./img/" + type + ".png", x, y, 17, 17);
            var halo1 = canvas.circle(x + 8.5, y + 9, 21).attr({ stroke: 'white', strokeWidth: '1', opacity: '0.33' });
            var halo2 = canvas.circle(x + 8.5, y + 9, 17).attr({ stroke: 'white', strokeWidth: '1', opacity: '0.33' });
            var halo3 = canvas.circle(x + 8.5, y + 9, 13).attr({ stroke: 'white', strokeWidth: '1', opacity: '0.33' });

            var haloGroup = canvas.g(halo1, halo2, halo3).addClass('halo');

            var g = canvas.g(haloGroup, bgBox, icon).addClass('icon');
            var objProperties;

            g.hover(function() {
                    var diaX = x + 12;
                    var diaY = y;

                    if (type === 'powerscout') {
                        objProperties = powerData[index];
                    } else {
                        objProperties = sensorData[index];
                    }

                    if (objProperties.enabled) {
                        dialogBox.sliderText.node.innerHTML = 'On';
                        dialogBox.sliderText.attr({ x: 200 });
                        dialogBox.sliderBtn.attr({ cx: 225 });
                        dialogBox.sliderBg.attr({ fill: 'green' });
                    } else {
                        dialogBox.sliderText.node.innerHTML = 'Off';
                        dialogBox.sliderText.attr({ x: 211 });
                        dialogBox.sliderBtn.attr({ cx: 200 });
                        dialogBox.sliderBg.attr({ fill: 'red' });
                    }

                    dialogBox.slider.data('type', type);
                    dialogBox.slider.data('index', index);



                    if (x + 260 > 1100) {
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
                    dialogBox.dialog.attr({ x: diaX, y: diaY - 10 }).removeClass('hide');
                })
                .click(function() {
                    scope.$apply(function() {
                        updatePropertyWindow(type, objProperties);
                        scope.sidePanelOpen = true;
                    });
                });
        }

        function createDialog(x, y, powerData, sensorData) {

            var dialog = canvas.svg(x - 10, y, 255, 36, 0, 0, 250, 36)
                .addClass('hide');

            var diaBox = dialog.rect(24, 0, 215, 36, 3, 3).attr({ fill: "#22221E" });
            var leftArrow = dialog.polygon(16, 18, 25, 13, 25, 23).attr({ fill: "#22221E" });
            var rightArrow = dialog.polygon(247, 18, 238, 14, 238, 23).attr({ fill: "#22221E" });

            var sliderBg = dialog.rect(195, 10, 34, 14, 6, 10).attr({ fill: "red", stroke: "white", strikeWidth: "1" });
            var sliderBtn = dialog.circle(200, 17, 9).attr({ fill: "white" });
            var sliderText = dialog.text(211, 21, 'Off').attr({ fill: "white", fontSize: 10 });

            var diaText = dialog.text(34, 22, '').attr({ fill: "#6e6e6e" });

            dialog.g(diaBox, leftArrow, diaText);
            var slider = dialog.g(sliderBg, sliderBtn, sliderText).attr({ cursor: "pointer" })
                .click(function() {
                    var type = this.data('type');
                    var index = this.data('index');
                    var enable;

                    if (type === 'powerscout') {
                        powerData[index].enabled = !powerData[index].enabled;
                        enable = powerData[index].enabled;

                        scope.$apply(function() {
                            if (enable) { scope.disablePowerscout--; } else { scope.disablePowerscout++; }
                        });
                    } else {
                        sensorData[index].enabled = !sensorData[index].enabled;
                        enable = sensorData[index].enabled;
                        scope.$apply(function() {
                            if (enable) { scope.disableSensor--; } else { scope.disableSensor++; }
                        });
                    }

                    if (enable) {
                        sliderText.node.innerHTML = 'On';
                        sliderText.attr({ x: 200 });
                        sliderBtn.animate({ cx: 225 }, 300);
                        sliderBg.animate({ fill: "green" }, 300);
                    } else {
                        sliderText.node.innerHTML = 'Off';
                        sliderText.attr({ x: 211 })
                        sliderBtn.animate({ cx: 200 }, 300);
                        sliderBg.animate({ fill: "red" }, 300);
                    }
                }).attr({ cursor: "pointer" });

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

        function clearActives() {
            var allHalo = canvas.selectAll('.halo');
            allHalo.forEach(function(halo) {
                halo.removeClass('active');
            });
        }

        function updatePropertyWindow(type, objProperties) {

            var properties = {};

            properties.type = objProperties['Type'];
            properties.building = objProperties['Building'];
            properties.breakerDetails = objProperties['BreakerDetails'];
            properties.breakerLabel = objProperties['BreakerLabel'];
            properties.modbusAdd = objProperties['ModbusBaseAddress'];
            properties.serialNumber = objProperties['SerialNumber'];
            properties.ratedAmperage = objProperties['RatedAmperage'];
            properties.unitElectricityCost = objProperties['UnitElectricCost'] || null;
            if (type === 'powerscout') {
                properties.iconName = 'electric-tower';
                properties.id = objProperties['Powerscout'];
            } else {
                properties.iconName = 'sensor';
                properties.id = objProperties['SensorId'];

            }
            scope.properties = properties;
        }

        function clearActiveData() {
            clearActives();
            dialogBox.dialog.addClass('hide');
            scope.properties = null;
            scope.$apply();
        }

    }

})();