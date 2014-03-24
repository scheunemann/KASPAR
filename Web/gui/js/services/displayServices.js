(function() {
	'use strict';

	var dependancies = [
	                    'js/services/HotkeyFormatter'
	                    ];	
	
	define(dependancies, function(
			HotkeyFormatter){

		var moduleName = 'kasparGUI.displayServices';
		
		var module = angular.module(moduleName, [])
			.service('hotkeyFormatter', HotkeyFormatter);
		
		return module;
	});
		
}());
