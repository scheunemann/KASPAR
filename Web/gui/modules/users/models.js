(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/CustomAction',
	                    './models/CustomTrigger',
	                    './models/User',
	                    './models/UserAction'
	                    ];
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            CustomAction,
            CustomTrigger,
            User,
            UserAction){

		var moduleName = 'kasparGUI.users.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('CustomAction', CustomAction)
			.factory('CustomTrigger', CustomTrigger)
			.factory('User', User)
			.factory('UserAction', UserAction)
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
