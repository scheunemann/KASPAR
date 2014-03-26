(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'modules/common/services/displayServices',
	                    'modules/common/services/proxyServices',
	                    'modules/common/filters',
	                    './directives/KeyBinding',
	                    './directives/Model',
	                    './directives/Navbar',
	                    './directives/NotEmpty',
	                    './directives/Saveable',
	                    ];	
	
	define(dependancies, function(
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
		var directiveDeps = [
			         			displayServices,
			        			proxyServices,
			        			filters,
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('keybinding', KeyBinding)
			.directive('model', Model)
			.directive('navbar', Navbar)
			.directive('notEmpty', NotEmpty)
			.directive('saveable', Saveable);

		return moduleName;
	});		
}());
