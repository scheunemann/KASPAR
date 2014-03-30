'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var proxyServices = require('common/services/proxyServices');
	var filters = require('common/filters');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var RobotEditor = require('./directives/RobotEditor');
	var RobotInterface = require('./directives/RobotInterface');

	var moduleName = 'kasparGUI.robots.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('robotEditor', RobotEditor)
		.directive('robotInterface', RobotInterface);

	return moduleName;
});		
