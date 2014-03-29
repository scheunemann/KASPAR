'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/Operator',
       ], function(
		angular,
		resource,
		proxyServices,
        Operator){

	var moduleName = 'kasparGUI.operators.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Operator', Operator);
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
