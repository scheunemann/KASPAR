(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    './HotkeyFormatter'
	                    ];	
	
	define(dependancies, function(
			angular,
			HotkeyFormatter){

		var moduleName = 'kasparGUI.common.displayServices';
		
		var module = angular.module(moduleName, [])
			.service('hotkeyFormatter', HotkeyFormatter);
		
		return moduleName;
	});
		
}());
