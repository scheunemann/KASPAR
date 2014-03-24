(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices',
	                     'js/models/Robot',
	                     'js/models/Setting'
	                     ];

	define(dependancies, function(angular, proxyServices, Robot, Setting) {

		var RobotInterface = function($q, Robot, Setting, proxyObjectResolver) {
			return {
				templateUrl : 'partials/robot/interface.html',
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
}());
