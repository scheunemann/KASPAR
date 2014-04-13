'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/models');
	require('robots/models');
	var template = require('text!./robotInterface.tpl.html');

	var RobotInterface = function($q, Robot, robotInterface, Setting) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
				showConnect : "=?"
			},
			controller : function($scope) {
				if ($scope.showConnect == undefined) {
					$scope.showConnect = false;
				}
				
				var settings = Setting.query({
					'key' : 'robot'
				});
				$scope.robots = Robot.query();

				$q.all($scope.robots.$promise, settings.$promise).then(function() {
					if (settings.length > 0) {
						for (var i = 0; i < $scope.robots.length; i++) {
							if ($scope.robots[i].name == settings[0].value) {
								$scope.robot = $scope.robots[i];
								$scope.configured = true;
								break;
							}
						}
					}
				});

				$scope.$watch('robot', function(robot) {
					robotInterface.setRobot(robot);
				});

				$scope.$watch('connected', function(connected) {
					robotInterface.setConnected(connected);
				});
			}
		};
	};

	return [ '$q', 'Robot', 'robotInterface', 'Setting', RobotInterface ];
});
