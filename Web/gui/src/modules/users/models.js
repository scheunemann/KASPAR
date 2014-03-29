'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var CustomAction = require('./models/CustomAction');
	var CustomTrigger = require('./models/CustomTrigger');
	var User = require('./models/User');
	var UserAction = require('./models/UserAction');

	var moduleName = 'kasparGUI.users.models';
	var dependancies = [ 'ngResource', proxyServices, ];

	var module = angular.module(moduleName, dependancies)
		.factory('CustomAction', CustomAction)
		.factory('CustomTrigger', CustomTrigger)
		.factory('User', User)
		.factory('UserAction', UserAction);

	module.config([ '$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	} ]);

	return moduleName;
});
