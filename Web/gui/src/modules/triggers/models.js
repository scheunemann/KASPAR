'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var ButtonHotkey = require('./models/ButtonHotkey');
	var Trigger = require('./models/Trigger');
	var TriggerType = require('./models/TriggerType');

	var moduleName = 'kasparGUI.triggers.models';
	var dependancies = [ 'ngResource', proxyServices, ];

	var module = angular.module(moduleName, dependancies)
		.factory('ButtonHotkey', ButtonHotkey)
		.factory('Trigger', Trigger)
		.factory('TriggerType', TriggerType);

	module.config([ '$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	} ]);

	return moduleName;
});
