'use strict';

define([
        'angular',
        'common/services/displayServices',
        'common/services/proxyServices',
        'common/filters',
        './directives/KeyBinding',
        './directives/Model',
        './directives/Navbar',
        './directives/NotEmpty',
        './directives/Saveable',
        ], function(
        angular,
		displayServices,
		proxyServices,
		filters,
        KeyBinding,
        Model,
        Navbar,
        NotEmpty,
        Saveable){

	var moduleName = 'kasparGUI.common.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('keybinding', KeyBinding)
		.directive('model', Model)
		.directive('navbar', Navbar)
		.directive('notEmpty', NotEmpty)
		.directive('saveable', Saveable);

	return moduleName;
});		
