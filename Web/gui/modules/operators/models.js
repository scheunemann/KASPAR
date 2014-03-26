(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/Operator',
	                   ];	
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            Operator){

		var moduleName = 'kasparGUI.operators.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Operator', Operator);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
