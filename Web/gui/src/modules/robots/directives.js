'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var interfaceServices = require('robots/services/interfaceServices');
	var filters = require('common/filters');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var RobotEditor = require('./directives/RobotEditor');
	var RobotInterface = require('./directives/RobotInterface');

	var moduleName = 'kasparGUI.robots.directives';
	var dependancies = [
		         			displayServices,
		         			interfaceServices,
		        			filters,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('robotEditor', RobotEditor)
		.directive('robotInterface', RobotInterface);

	return moduleName;
});		
