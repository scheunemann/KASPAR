(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/ButtonHotkey',
	                    './models/Trigger',
	                    './models/TriggerType',
	                    ];
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            ButtonHotkey,
            Trigger,
            TriggerType){

		var moduleName = 'kasparGUI.triggers.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('ButtonHotkey', ButtonHotkey)
			.factory('Trigger', Trigger)
			.factory('TriggerType', TriggerType);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
