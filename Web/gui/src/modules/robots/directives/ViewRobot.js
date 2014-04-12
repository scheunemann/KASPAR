'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/models');
	var template = require('text!./viewRobot.tpl.html');

	var ViewRobot = function(ServoConfig, ServoGroup, Servo) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
			},
			controller : function($scope) {
				$scope.groupsOpen = false;
				$scope.configsOpen = false;
				$scope.servosOpen = false;
				$scope.$watch('robot', function(robot) {
					if(robot != undefined) {
						$scope.servoConfigs = ServoConfig.query({robot_id: robot.id});
						$scope.servoGroups = ServoGroup.query({robot_id: robot.id});
						$scope.servos = robot.servos;
					}
				});
			}
		};
	};

	return [ 'ServoConfig', 'ServoGroup', 'Servo', ViewRobot ];
});
