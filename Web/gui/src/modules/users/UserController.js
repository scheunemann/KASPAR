'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('triggers/models');
	require('users/models');

	var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger) {
		$scope.users = User.query();
		$scope.users.$promise.then(function(users) {
			$scope.selectedUser = users[0];
		});
	};

	return [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', UserController ];

});
