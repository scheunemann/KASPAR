'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');

	var ActionTestController = function($scope, $http, $q, $timeout, Action, ActionTest, ActionType, language) {
		$scope.language = language.getText();
		$scope.running = false;
		$scope.actions = Action.query();
		$scope.output = '';
		$scope.typeFilter = {
			type: '',
 		};
 		$scope.type = null;
		$scope.types = ActionType.query();
		$scope.types.$promise.then(function(types) {
			var action = {
				name: 'Action'
			};
			$scope.types.push(action);
			$scope.type = action;
		});

		$scope.$watch('type', function(type, old) {
			if (type && type.name != 'Action') {
				$scope.typeFilter.type = type.name;
			} else {
				$scope.typeFilter.type = '';
			}
		});

		$scope.startAction = function(action) {
			$scope.output += 'Start action ' + action.name + '\n';
			ActionTest.save({
				id : $scope.action.id
			}).$promise.then(getOutput());
		};

		var getOutput = function() {
			$scope.output += 'TODO: live update of running actions\n';
		};

		$scope.stopAction = function(action) {
			$scope.output += 'TODO: Stop action ' + action.name + '\n';
		};
	};

	return [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionTest', 'ActionType', 'language', ActionTestController ];
});
