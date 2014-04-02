'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var filters = require('common/filters');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var RobotEditor = require('./directives/RobotEditor');
	var RobotInterface = require('./directives/RobotInterface');

	var moduleName = 'kasparGUI.robots.directives';
	var dependancies = [
		         			displayServices,
		        			filters,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('robotEditor', RobotEditor)
		.directive('robotInterface', RobotInterface);

	return moduleName;
});		
