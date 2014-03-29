'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var Action = require('./models/Action');
	var ActionType = require('./models/ActionType');
	var OrderedAction = require('./models/OrderedAction');

	var moduleName = 'kasparGUI.actions.models';
	var dependancies = [ 'ngResource', proxyServices, ];

	var module = angular.module(moduleName, dependancies)
		.factory('Action', Action)
		.factory('ActionType', ActionType)
		.factory('OrderedAction', OrderedAction);

	module.config([ '$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	} ]);

	return moduleName;
});
