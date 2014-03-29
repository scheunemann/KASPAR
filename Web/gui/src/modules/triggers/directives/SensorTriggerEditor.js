'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('robots/models');

	var SensorTriggerEditor = function(proxyObjectResolver, Sensor) {
		return {
			templateUrl : 'partials/trigger/sensor.html',
			restrict : 'E',
			scope : {
				sensor : "=trigger",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
			},
			controller : function($scope) {
				/*
				 * id = Column(Integer, ForeignKey('%s.id' % 'Trigger'),
				 * primary_key=True) sensorName = Column(String(50))
				 * sensorValue = Column(String(50)) # >0, >=0, <0, <=0,
				 * ==0,=='abc'
				 */
				$scope.$watch('sensor', function(sensor) {
					proxyObjectResolver.resolveProp(sensor, 'action');
				});

				$scope.$watch('selectedSensor', function(sensor) {
					if (sensor !== undefined) {
						$scope.sensor.sensorName = sensor.name;
					}
				});

				$scope.sensors = Sensor.query();
			},
		};
	};

	return [ 'proxyObjectResolver', 'Sensor', SensorTriggerEditor ];
});
