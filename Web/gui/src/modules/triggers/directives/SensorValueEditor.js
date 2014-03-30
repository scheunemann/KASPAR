'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	var template = require('text!./sensorValueEditor.tpl.html');

	var SensorValueEditor = function($compile, proxyObjectResolver) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sensor : "=",
				trigger: "=",
				currentValue: "=value",
			},
			link : function(scope, iElement, iAttrs, controller) {
				scope.basicopen = false;
				scope.advancedopen = true;
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
				$scope.Math = $window.Math;				
				$scope.$watch('sensor', function(sensor) {
					proxyObjectResolver.resolveProp(sensor, 'value_type');
				});
			}
		};
	};

	return [ '$compile', 'proxyObjectResolver', SensorValueEditor ];
});
