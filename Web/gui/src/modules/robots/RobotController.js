'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('robots/models');

	var RobotController = function($scope, Robot, proxyObjectResolver) {
		$scope.proxyObjectResolver = proxyObjectResolver;
		$scope.robots = Robot.query(function(robots) {
			for (var i = 0; i < robots.length; i++) {
				proxyObjectResolver.resolveProp(robots[i], 'model');
			}
		});

		$scope.connected = false;

		$scope.connect = function(robot) {
			$scope.connected = true;
		}

		$scope.disconnect = function(robot) {
			$scope.connected = false;
		}
	};

	return [ '$scope', 'Robot', 'proxyObjectResolver', RobotController ];
});
