'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var Action = require('./models/Action');
	var ActionTest = require('./models/ActionTest');
	var ActionType = require('./models/ActionType');
	var JointPosition = require('./models/JointPosition');
	var OrderedAction = require('./models/OrderedAction');

	var moduleName = 'kasparGUI.actions.models';
	var dependancies = [ 'ngResource', proxyServices, ];

	var module = angular.module(moduleName, dependancies)
		.factory('Action', Action)
		.factory('ActionTest', ActionTest)
		.factory('ActionType', ActionType)
		.factory('JointPosition', JointPosition)
		.factory('OrderedAction', OrderedAction);

	module.config([ '$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	} ]);

	return moduleName;
});
