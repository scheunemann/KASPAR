(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    ];

	define(dependancies, function(angular) {

		var moduleName = 'kasparGUI.users.directives';
		var directiveDeps = [];

		var module = angular.module(moduleName, directiveDeps);
		
		return moduleName;
	});
}());
