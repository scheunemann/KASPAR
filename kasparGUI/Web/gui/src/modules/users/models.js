'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var CustomAction = require('./models/CustomAction');
	var CustomTrigger = require('./models/CustomTrigger');
	var User = require('./models/User');
	var UserAction = require('./models/UserAction');

	var moduleName = 'kasparGUI.users.models';
	var dependancies = [ angularResource, ];

	var module = angular.module(moduleName, dependancies)
		.factory('CustomAction', CustomAction)
		.factory('CustomTrigger', CustomTrigger)
		.factory('User', User)
		.factory('UserAction', UserAction);

	return moduleName;
});
