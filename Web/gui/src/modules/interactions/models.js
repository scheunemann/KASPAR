'use strict';

define(function(require) {
	var angular = require('angular');
	var resource = require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var Interaction = require('./models/Interaction');

	var moduleName = 'kasparGUI.interactions.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Interaction', Interaction);
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
