'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/Menu',
        './models/Setting',
        ], function(
		angular,
		resource,
		proxyServices,
        Menu,
        Setting
        ){

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
