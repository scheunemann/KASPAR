'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');

	var ActionTestController = function($scope, $http, $q, $timeout, Action, ActionTest) {
		$scope.running = false;
		$scope.actions = Action.query();
		$scope.output = '';

		$scope.$watch('action', function(action) {
			if (action != undefined) {
				$scope.actionTest = new ActionTest({
					'id' : action.id
				});
			}
		});

		$scope.startAction = function(action) {
			$scope.output += 'Start action ' + action.name + '\n';
			$scope.actionTest.$save(getOutput());
		};

		var getOutput = function() {
			$scope.output += 'TODO: live update of running actions\n';
		}

		$scope.stopAction = function(action) {
			$scope.output += 'TODO: Stop action ' + action.name + '\n';
		};
	};

	return [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionTest', ActionTestController ];
});
