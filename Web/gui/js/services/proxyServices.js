(function() {
	'use strict';

	var dependancies = [
	                    'js/services/ObjectCache',
	                    'js/services/ProxyObjectResolver',
	                    'js/services/ProxyResourceInterceptor'
	                    ];	
	
	define(dependancies, function(
			ObjectCache,
			ProxyObjectResolver,
			ProxyResourceInterceptor){

		var moduleName = 'kasparGUI.proxyServices';
		
		var module = angular.module(moduleName, [])
			.service('objectCache', ObjectCache)
			.service('proxyObjectResolver', ProxyObjectResolver)
			.factory('proxyResourceInterceptor', ProxyResourceInterceptor);
		
		return module;
	});
		
}());
