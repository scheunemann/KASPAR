(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    './ObjectCache',
	                    './ProxyObjectResolver',
	                    './ProxyResourceInterceptor'
	                    ];	
	
	define(dependancies, function(
			angular,
			ObjectCache,
			ProxyObjectResolver,
			ProxyResourceInterceptor){

		var moduleName = 'kasparGUI.common.proxyServices';
		
		var module = angular.module(moduleName, [])
			.service('objectCache', ObjectCache)
			.service('proxyObjectResolver', ProxyObjectResolver)
			.factory('proxyResourceInterceptor', ProxyResourceInterceptor);
		
		return moduleName;
	});
		
}());
