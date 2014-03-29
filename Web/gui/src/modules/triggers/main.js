'use strict';

define([ 
        'angular',
        './controllers',
        './directives',
        './models'
        ], function(angular, controllers, directives, models) {

	var moduleName = 'kasparGUI.triggers';
	var dependancies = [ 
							controllers,
							directives,
							models
	                     ];

	var module = angular.module(moduleName, dependancies);
	return moduleName;
});
