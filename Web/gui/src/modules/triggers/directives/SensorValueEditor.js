'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./sensorValueEditor.tpl.html');

	var SensorValueEditor = function(Sensor, modelBuilder, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sensor : "=",
				trigger : "=",
				currentValue : "=value",
			},
			link : function(scope, iElement, iAttrs, controller) {
				scope.comparisons = [ {
					name : 'less than',
					compare : '<'
				}, {
					name : 'less or equal to',
					compare : '<='
				}, {
					name : 'exactly',
					compare : '=='
				}, {
					name : 'greater or equal to',
					compare : '>='
				}, {
					name : 'greater than',
					compare : '>'
				} ]
			},
			controller : function($scope, $window) {
				$scope.language = language.getText();
				$scope.Math = $window.Math;
				$scope.sensor = null;
				$scope.basicopen = false;
				$scope.advancedopen = true;
				$scope.$watch('trigger.sensorValue', function(value) {
					if (value != undefined && value != null) {
						$scope.basicopen = value.indexOf != undefined && value.indexOf('eval::') == 0;
						$scope.advancedopen = !$scope.basicopen;
					}
				});
				$scope.$watch('sensor', function(sensor) {
					if (sensor != undefined && sensor.id != undefined) {
						if (sensor._link == undefined) {
							$scope.sensor = Sensor.get({
								id : sensor.id
							});
							$scope.sensor.$promise.then(function(sensor) {
								if ($scope.sensor != undefined) {
									$scope.sensor = $scope.sensor.getConcreteClassInstance();
								}
							});
						} else {
							var Model = modelBuilder.getModel(sensor._link.model);
							$scope.model = Model.get({
								id : $scope.model
							});
						}
					}
				});
			}
		};
	};

	return [ 'Sensor', 'modelBuilder', 'language', SensorValueEditor ];
});
