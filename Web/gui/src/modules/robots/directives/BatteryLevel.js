'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/services/interfaceServices');
	var template = require('text!./batteryLevel.tpl.html');

	var BatteryLevel = function(robotInterface, $timeout) {
		return {
			template : template,
			restrict : 'E',
			scope : {},
			controller : function($scope) {
				$scope.battery = robotInterface.getSensor('BATTERY');
				$scope.$watch('battery.value', function(value) {
					if (value == null || value < 0) {
						$scope.type = 'unknown';
					} else if (value > 25) {
						$scope.type = 'success';
					} else if (value > 10) {
						$scope.type = 'warning';
					} else if (value >= 0) {
						$scope.type = 'danger';
					}
				});
			}
		};
	};

	return [ 'robotInterface', '$timeout', BatteryLevel ];
});
