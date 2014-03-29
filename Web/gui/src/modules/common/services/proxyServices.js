'use strict';

define(function(require) {
	var angular = require('angular');
	var ObjectCache = require('./ObjectCache');
	var ProxyObjectResolver = require('./ProxyObjectResolver');
	var ProxyResourceInterceptor = require('./ProxyResourceInterceptor');

	var moduleName = 'kasparGUI.common.proxyServices';
	var dependancies = [];
	
	var module = angular.module(moduleName, dependancies)
		.service('objectCache', ObjectCache)
		.service('proxyObjectResolver', ProxyObjectResolver)
		.factory('proxyResourceInterceptor', ProxyResourceInterceptor);
	
	return moduleName;
});
