'use strict';

define(function(require) {
        var angular = require('angular');
        require('robots/models');
        var template = require('text!./sensorTriggerEditor.tpl.html');

        var SensorTriggerEditor = function(Sensor, Trigger, language) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    trigger: "=",
                    actions: "=",
                },
                link: function(scope, iElement, iAttrs, controller) {},
                controller: function($scope) {
                    $scope.language = language.getText();
                    $scope.sensors = Sensor.query();

                    $scope.$watch('trigger.sensorName', function(sensorName) {
                            $scope.sensors.$promise.then(function(sensors) {
                                    if (sensorName !== undefined) {
                                        for (var i = 0; i < sensors.length; i++) {
                                            if (sensors[i].name == sensorName) {
                                                $scope.selectedSensor = sensors[i];
                                                break;
                                            }
                                        }
                                    }
                                });
                        });
                },
            };
        };

        return ['Sensor', 'Trigger', 'language', SensorTriggerEditor];
    });
