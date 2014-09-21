'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('triggers/models');
	require('robots/models');

	var TriggerController = function($scope, $http, Action, Trigger, TriggerType, Robot, language) {
		$scope.language = language.getText();
		$scope.triggers = Trigger.query();
		$scope.actions = Action.query();
		$scope.types = TriggerType.query();
		$scope.newobjs = [];

		$scope.setFiles = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;
			});
		};
		
		$scope.$watch('trigger', function(action) {
			if (action !== undefined) {
				var abstractTrigger = $scope.trigger;
				var concreteTrigger = $scope.trigger.getConcreteClassInstance();
				concreteTrigger.$promise.then(function(){ 
					$scope.triggers[$scope.triggers.indexOf(abstractTrigger)] = concreteTrigger;
					$scope.trigger = concreteTrigger;
				});
			}
		});
		
		$scope.newTrigger = function() {
			$scope.trigger = new Trigger();
			$scope.triggers.push($scope.trigger);
		};

		$scope.deleteTrigger = function(trigger) {
			$scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
			$scope.trigger = $scope.triggers[0];
			trigger.$delete();
		};

		var errorFunc = function(status) {
			console.log("Error sending file:" + status);
		};
		
		var successFunc = function(data, status, headers, config) {
			$scope.newobjs.push(data);
		};
		
		$scope.importFiles = function(files) {
			for (var i = 0; i < files.length; i++) {
				var fd = new FormData();
				fd.append("data", files[i]);

				var obj = $http.post('/api/Trigger/import', fd, {
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				}).success(successFunc).error(errorFunc);
			}
		};
	};

	return [ '$scope', '$http', 'Action', 'Trigger', 'TriggerType', 'Robot', 'language', TriggerController ];
});
