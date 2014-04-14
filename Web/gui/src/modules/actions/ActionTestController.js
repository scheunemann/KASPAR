'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');

	var ActionTestController = function($scope, $http, $q, $timeout, Action, ActionTest, language) {
		$scope.language = language.getText();
		$scope.running = false;
		$scope.actions = Action.query();
		$scope.output = '';

		$scope.startAction = function(action) {
			$scope.output += 'Start action ' + action.name + '\n';
			ActionTest.save({
				id : $scope.action.id
			}).$promise.then(getOutput());
		};

		var getOutput = function() {
			$scope.output += 'TODO: live update of running actions\n';
		}

		$scope.stopAction = function(action) {
			$scope.output += 'TODO: Stop action ' + action.name + '\n';
		};
	};

	return [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionTest', 'language', ActionTestController ];
});
