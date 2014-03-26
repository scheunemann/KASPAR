(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    ];

	define(dependancies, function(angular) {

		var moduleName = 'kasparGUI.operators.directives';
		var directiveDeps = [];

		var module = angular.module(moduleName, directiveDeps);
		
		return moduleName;
	});
}());
