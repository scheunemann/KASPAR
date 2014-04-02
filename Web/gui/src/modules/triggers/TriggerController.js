'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('triggers/models');
	require('robots/models');

	var TriggerController = function($scope, Action, Trigger, TriggerType, Robot) {
		$scope.trigger = null;
		$scope.triggers = Trigger.query();
		$scope.actions = Action.query();
		$scope.types = TriggerType.query();
		$scope.newobjs = [];

		$scope.setFiles = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;
			});
		};

		$scope.newTrigger = function() {
			$scope.trigger = new Trigger();
			$scope.triggers.push($scope.trigger);
		};

		$scope.deleteTrigger = function(trigger) {
			$scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
			$scope.trigger = $scope.triggers[0];
			trigger.$delete();
		}

		$scope.importFiles = function(files) {
			for (var i = 0; i < files.length; i++) {
				var fd = new FormData();
				fd.append("data", files[i]);

				var obj = $http.post('/api/Trigger/import', fd, {
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				}).success(function(data, status, headers, config) {
					$scope.newobjs.push(data);
				}).error(function() {
					console.log("Error sending file:" + status);
				});
			}
		};
	};

	return [ '$scope', 'Action', 'Trigger', 'TriggerType', 'Robot', TriggerController ];
});
