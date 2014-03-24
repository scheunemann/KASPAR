(function() {
	'use strict';

	var dependancies = [ 
                     'angular', 
                     'angularUIRouter',
                     'js/services/proxyServices',
                     'js/models/RobotModel',
                     'js/models/Robot',
                     'js/models/Servo',
                     'js/models/ServoConfig',
                     'js/models/ServoGroup'
                     ];

	define(dependancies, function(angular, uiRouter, proxyServices, RobotModel, Robot, Servo, ServoConfig, ServoGroup) {

		var RobotController = function($scope, $state, RobotModel, Robot, Servo, ServoConfig, ServoGroup, proxyObjectResolver) {
			$scope.proxyObjectResolver = proxyObjectResolver;
			$scope.robots = Robot.query(function(robots) {
				for (var i = 0; i < $scope.robots.length; i++) {
					$scope.proxyObjectResolver.resolveProp(robots[i], 'model');
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

		return [ '$scope', '$state', 'RobotModel', 'Robot', 'Servo', 'ServoConfig', 'ServoGroup', 'proxyObjectResolver', RobotController ];

	});
}());
