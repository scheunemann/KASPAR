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
				$scope.$watch('trigger', function(trigger) {
					proxyObjectResolver.resolveProp(trigger, 'action');
				});

				$scope.$watch('selectedSensor', function(sensor) {
					if (sensor !== undefined) {
						$scope.trigger.sensorName = sensor.name;
					}
				});

				$scope.sensors = Sensor.query();
			},
		};
	};

	return [ 'proxyObjectResolver', 'Sensor', SensorTriggerEditor ];
});
