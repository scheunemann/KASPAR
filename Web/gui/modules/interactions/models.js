(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/Interaction',
	                    ];	
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            Interaction){

		var moduleName = 'kasparGUI.interactions.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Interaction', Interaction);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
