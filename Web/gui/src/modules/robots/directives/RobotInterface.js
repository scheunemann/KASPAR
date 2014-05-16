'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/models');
	require('robots/models');
	require('robots/services/interfaceServices');
	var template = require('text!./robotInterface.tpl.html');

	var RobotInterface = function($q, Robot, robotInterface, Setting, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
				connected: "=?",
				showConnect : "=?"
			},
			controller : function($scope) {
				$scope.language = language.getText();
				if ($scope.connected === undefined) {
					$scope.connected = false;
				}
				
				if ($scope.showConnect === undefined) {
					$scope.showConnect = false;
				}
				
				var settings = Setting.query({
					'key' : 'robot'
				});
				$scope.robots = Robot.query();

				$scope.robots.$promise.then(function() {
					settings.$promise.then(function() {
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
				});

				$scope.$watch('robot', function(robot) {
					robotInterface.setRobot(robot);
					$scope.connected = robotInterface.getConnected();
				});

				$scope.setConnected = function(state) {
					if(state) {
						robotInterface.setConnected(state);
					} else {
						robotInterface.setConnected(false);
					}
					
					$scope.connected = state;
				};
			}
		};
	};

	return [ '$q', 'Robot', 'robotInterface', 'Setting', 'language', RobotInterface ];
});
