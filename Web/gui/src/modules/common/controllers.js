'use strict';

define([
        'angular',
        'angularUIRouter',
        'common/services/proxyServices',
        'common/models',
        'robots/models',
        './CommonController',
        './SettingsController',
      ], function(
		angular,
		uiRouter,
		proxyServices,
		commonModels,
		robotModels,
        CommonController,
        SettingsController){
	
	var moduleName = 'kasparGUI.common.controllers';
	var dependancies = [
		          			'ui.router',
		        			proxyServices,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('commonController', CommonController)
		.controller('settingsController', SettingsController);

	return moduleName;
});	
