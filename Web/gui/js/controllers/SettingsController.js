(function() {
	'use strict';

	var dependancies = [ 
                     'angular', 
                     'js/services/proxyServices',
                     'js/models/Setting',
                     'js/models/Robot'
                     ];
	
	define(dependancies, function(angular, proxyServices, Setting, Robot) {
		'use strict';

		var SettingsController = function($q, $scope, Setting, Robot, proxyObjectResolver) {
			$scope.proxyObjectResolver = proxyObjectResolver;
			var settings = Setting.query({
				'key' : 'robot'
			});
			$scope.robots = Robot.query(function(robots) {
				for (var i = 0; i < $scope.robots.length; i++) {
					$scope.proxyObjectResolver.resolveProp(robots[i], 'model');
				}
			});

			$scope.connected = false;

			$q.all($scope.robots.$promise, settings.$promise).then(function() {
				if (settings.length > 0) {
					$scope.robotSetting = settings[0];
					for (var i = 0; i < $scope.robots.length; i++) {
						if ($scope.robots[i].name == $scope.robotSetting.value) {
							$scope.robot = $scope.robots[i];
							break;
						}
					}
				}
			});

			$scope.$watch('robot', function(selected) {
				if (selected != undefined) {
					settings.$promise.then(function() {
						if ($scope.robotSetting == undefined) {
							$scope.robotSetting = new Setting({
								'key' : 'robot',
								'value' : $scope.robot.name
							});
							$scope.robotSetting.$save();
						} else if ($scope.robotSetting.value != $scope.robot.name) {
							$scope.robotSetting.value = $scope.robot.name;
							$scope.robotSetting.$save();
						}
					});
				}
			});
		};

		return [ '$q', '$scope', 'Setting', 'Robot', 'proxyObjectResolver', SettingsController ];

	});
}());
