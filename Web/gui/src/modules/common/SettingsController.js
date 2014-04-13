'use strict';

define(function(require) {
	var angular = require('angular')
	require('common/models');
	require('robots/models');

	var SettingsController = function($q, $scope, Setting, Robot, language) {
		$scope.robots = Robot.query();
		$scope.settings = Setting.query();
		
		$scope.settings.$promise.then(function(settings) {
			for (var i = 0; i < settings.length; i++) {
				if (settings[i].key == 'robot') {
					$scope.robotSetting = settings[i];
					break;
				}
			}

			if ($scope.robotSetting == undefined) {
				$scope.robotSetting = new Setting({
					key : 'robot',
					value: '',
				});
			}
		});

		$scope.$watch('robotSetting.value', function(newValue, oldValue) {
			if (newValue != undefined) {
				$scope.robotSetting.$save();
			}
		});
	};

	return [ '$q', '$scope', 'Setting', 'Robot', 'language', SettingsController ];

});
