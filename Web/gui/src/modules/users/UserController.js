'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('triggers/models');
	require('users/models');

	var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, language) {
		$scope.language = language.getText();
		$scope.users = User.query();
	};

	return [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'language', UserController ];

});
