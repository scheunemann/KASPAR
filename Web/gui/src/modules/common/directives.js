'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var proxyServices = require('common/services/proxyServices');
	var filters = require('common/filters');
	var KeyBinding = require('./directives/KeyBinding');
	var Model = require('./directives/Model');
	var Navbar = require('./directives/Navbar');
	var NotEmpty = require('./directives/NotEmpty');
	var Saveable = require('./directives/Saveable');

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
