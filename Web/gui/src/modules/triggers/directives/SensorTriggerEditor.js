'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('robots/models');
	var template = require('text!./sensorTriggerEditor.tpl.html');

	var SensorTriggerEditor = function(proxyObjectResolver, Sensor) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				trigger : "=",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
			},
			controller : function($scope) {
				$scope.sensors = Sensor.query();

				$scope.$watch('trigger', function(trigger) {
					proxyObjectResolver.resolveProp(trigger, 'action');
				});

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

	return [ 'proxyObjectResolver', 'Sensor', SensorTriggerEditor ];
});
