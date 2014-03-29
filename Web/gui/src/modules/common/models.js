'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var Menu = require('./models/Menu');
	var Setting = require('./models/Setting');

	var moduleName = 'kasparGUI.common.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Menu', Menu)
		.factory('Setting', Setting);
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
