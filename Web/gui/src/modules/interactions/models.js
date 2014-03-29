'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/Interaction',
        ], function(
		angular,
		resource,
		proxyServices,
        Interaction){

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
