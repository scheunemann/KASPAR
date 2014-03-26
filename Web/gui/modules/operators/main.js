(function() {
	'use strict';

	var dependancies = [ 
	                    'angular',
	                     './controllers',
	                     './directives',
	                     './models'
	                     ];

	define(dependancies, function(angular, controllers, directives, models) {

		var moduleName = 'kasparGUI.operators';
		var controllerDeps = [ 
								controllers,
								directives,
								models
		                     ];

		var module = angular.module(moduleName, controllerDeps);
		return moduleName;
	});
}());
