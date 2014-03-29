'use strict';

define([
        'angular',
        'angularResource',
    	'common/services/proxyServices',
        './models/ButtonHotkey',
        './models/Trigger',
        './models/TriggerType',
        ], function(
		angular,
		resource,
		proxyServices,
        ButtonHotkey,
        Trigger,
        TriggerType){

	var moduleName = 'kasparGUI.triggers.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('ButtonHotkey', ButtonHotkey)
		.factory('Trigger', Trigger)
		.factory('TriggerType', TriggerType);
	
	module.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}]);

	return moduleName;
});
