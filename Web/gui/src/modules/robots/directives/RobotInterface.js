'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('common/models');
	require('robots/models');
	var template = require('text!./robotInterface.tpl.html');

	var RobotInterface = function($q, Robot, Setting, proxyObjectResolver) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				connected : "=",
				robot : "=",
			},
			controller : function($scope) {
				var settings = Setting.query({
					'key' : 'robot'
				});
				$scope.robots = Robot.query();
				$scope.connected = false;

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

				$scope.connect = function(robot) {
					$scope.connected = true;
				}

				$scope.disconnect = function(robot) {
					$scope.connected = false;
				}
			}
		};
	};

	return [ '$q', 'Robot', 'Setting', 'proxyObjectResolver', RobotInterface ];
});
