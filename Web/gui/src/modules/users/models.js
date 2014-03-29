'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/CustomAction',
        './models/CustomTrigger',
        './models/User',
        './models/UserAction'
        ], function(
		angular,
		resource,
		proxyServices,
        CustomAction,
        CustomTrigger,
        User,
        UserAction){

	var moduleName = 'kasparGUI.users.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('CustomAction', CustomAction)
		.factory('CustomTrigger', CustomTrigger)
		.factory('User', User)
		.factory('UserAction', UserAction)
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
