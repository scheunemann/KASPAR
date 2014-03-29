'use strict';

define([
        'angular',
        'common/services/displayServices',
        'common/services/proxyServices',
        'common/filters',
        'common/models',
        'robots/models',
        './directives/JointEditor',
        './directives/RobotEditor',
        './directives/RobotInterface',
        ], function(
        angular,
		displayServices,
		proxyServices,
		filters,
		commonModels,
		robotModels,
        JointEditor,
        RobotEditor,
        RobotInterface){

	var moduleName = 'kasparGUI.robots.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('robotEditor', RobotEditor)
		.directive('robotInterface', RobotInterface)
		.directive('jointEditor', JointEditor);

	return moduleName;
});		
