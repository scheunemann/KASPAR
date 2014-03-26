(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/Action',
	                    './models/ActionType',
	                    './models/OrderedAction'
	                    ];	
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
			Action,
            ActionType,
            OrderedAction){

		var moduleName = 'kasparGUI.actions.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Action', Action)
			.factory('ActionType', ActionType)
			.factory('OrderedAction', OrderedAction);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
