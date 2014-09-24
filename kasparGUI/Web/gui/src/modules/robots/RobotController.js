'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/models');

	var RobotController = function($scope, Robot, language) {
		$scope.language = language.getText();
		$scope.robots = Robot.query();
//
//		$scope.connected = false;
//
//		$scope.connect = function(robot) {
//			$scope.connected = true;
//		};
//
//		$scope.disconnect = function(robot) {
//			$scope.connected = false;
//		};
	};

	return [ '$scope', 'Robot', 'language', RobotController ];
});
