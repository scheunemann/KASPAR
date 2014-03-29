'use strict';

define([ 'angular', './HotkeyFormatter' ], function(angular, HotkeyFormatter) {

	var moduleName = 'kasparGUI.common.displayServices';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('hotkeyFormatter', HotkeyFormatter);

	return moduleName;
});
