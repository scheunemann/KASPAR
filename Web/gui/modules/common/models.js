(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/Menu',
	                    './models/Setting',
	                    ];
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            Menu,
            Setting
            ){

		var moduleName = 'kasparGUI.common.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Menu', Menu)
			.factory('Setting', Setting);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
