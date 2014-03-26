(function() {
	'use strict';
	
	var dependancies = [
	                    'angular',
	                    'modules/common/services/proxyServices',
	                    'modules/robots/models',
	                    './RobotController',
	                    ];
	
	define(dependancies, function(
			angular,
            robotModels,
            proxyServices,
            RobotController){
		
		var moduleName = 'kasparGUI.robots.controllers';
		var controllerDeps = [ 
		                       robotModels, 
		                       proxyServices, 
		                       ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('robotController', RobotController);

		return moduleName;
	});	
}());
