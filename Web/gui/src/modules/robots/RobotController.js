'use strict';

define([ 
        'angular', 
        'common/services/proxyServices',
        'robots/models',
        ], function(angular, proxyServices, models) {

	var RobotController = function($scope, Robot, proxyObjectResolver) {
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

	return [ '$scope', 'Robot', 'proxyObjectResolver', RobotController ];
});
