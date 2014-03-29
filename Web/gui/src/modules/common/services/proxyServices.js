'use strict';

define([
        'angular',
        './ObjectCache',
        './ProxyObjectResolver',
        './ProxyResourceInterceptor'
        ], function(
		angular,
		ObjectCache,
		ProxyObjectResolver,
		ProxyResourceInterceptor){

	var moduleName = 'kasparGUI.common.proxyServices';
	var dependancies = [];
	
	var module = angular.module(moduleName, dependancies)
		.service('objectCache', ObjectCache)
		.service('proxyObjectResolver', ProxyObjectResolver)
		.factory('proxyResourceInterceptor', ProxyResourceInterceptor);
	
	return moduleName;
});
