'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('actions/models');
	require('triggers/models');
	require('users/models');

	var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, proxyObjectResolver) {
		$scope.users = User.query(function(users) {
			$scope.selectedUser = users[0];
		});

		$scope.$watch('selectedUser', function() {
			proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
			proxyObjectResolver.resolveProp($scope.selectedUser, 'customTriggers');
		});
	};

	return [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'proxyObjectResolver', UserController ];

});
