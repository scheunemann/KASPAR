'use strict';

define([
        'angular',
        'common/services/proxyServices',
        'robots/models',
        './RobotController',
        ], function(
		angular,
        robotModels,
        proxyServices,
        RobotController){
	
	var moduleName = 'kasparGUI.robots.controllers';
	var dependancies = [ 
	                       robotModels, 
	                       proxyServices, 
	                       ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('robotController', RobotController);

	return moduleName;
});	
