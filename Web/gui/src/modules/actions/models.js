'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/Action',
        './models/ActionType',
        './models/OrderedAction'
        ], function(
		angular,
		resource,
		proxyServices,
		Action,
        ActionType,
        OrderedAction){

	var moduleName = 'kasparGUI.actions.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Action', Action)
		.factory('ActionType', ActionType)
		.factory('OrderedAction', OrderedAction);
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
