(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'modules/common/services/displayServices',
	                    'modules/common/services/proxyServices',
	                    'modules/common/filters',
	                    'modules/common/models',
	                    'modules/robots/models',
	                    './directives/JointEditor',
	                    './directives/RobotEditor',
	                    './directives/RobotInterface',
	                    ];	
	
	define(dependancies, function(
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
		var directiveDeps = [
			         			displayServices,
			        			proxyServices,
			        			filters,
			        			commonModels,
			        			robotModels,
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('robotEditor', RobotEditor)
			.directive('robotInterface', RobotInterface)
			.directive('jointEditor', JointEditor);

		return moduleName;
	});		
}());
