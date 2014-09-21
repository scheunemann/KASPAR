'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/models');
	var template = require('text!./calibrateRobot.tpl.html');

	var ViewRobot = function(ServoConfig, ServoGroup, Servo, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.$watch('robot', function(robot) {
					if(robot !== undefined) {
						$scope.servos = robot.servos;
					}
				});
			}
		};
	};

	return [ 'ServoConfig', 'ServoGroup', 'Servo', 'language', ViewRobot ];
});
