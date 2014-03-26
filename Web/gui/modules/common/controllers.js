(function() {
	'use strict';
	
	var dependancies = [
	                     'angular',
	                     'angularUIRouter',
	                     'modules/common/services/proxyServices',
	                     'modules/common/models',
	                     'modules/robots/models',
	                     './CommonController',
	                     './SettingsController',
	                   ];
	
	define(dependancies, function(
			angular,
			uiRouter,
			proxyServices,
			commonModels,
			robotModels,
            CommonController,
            SettingsController){
		
		var moduleName = 'kasparGUI.common.controllers';
		var controllerDeps = [
			          			'ui.router',
			        			proxyServices,
			        			commonModels,
			        			robotModels,
		                     ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('commonController', CommonController)
			.controller('settingsController', SettingsController);

		return moduleName;
	});	
}());
