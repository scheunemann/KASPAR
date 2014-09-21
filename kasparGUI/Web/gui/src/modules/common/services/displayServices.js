'use strict';

define(function(require) {
	var angular = require('angular');
	var HotkeyFormatter = require('./HotkeyFormatter'); 

	var moduleName = 'kasparGUI.common.displayServices';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('hotkeyFormatter', HotkeyFormatter);

	return moduleName;
});
