(function() {
	'use strict';

	var dependancies = [
	                    'js/services/HotKeyFormatter'
	                    ];	
	
	define(dependancies, function(
			HotKeyFormatter){

		var moduleName = 'kasparGUI.displayServices';
		
		var module = angular.module(moduleName, [])
			.service('hotKeyFormatter', HotKeyFormatter);
		
		return module;
	});
		
}());
