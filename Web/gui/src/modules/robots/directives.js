'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var displayServices = require('common/services/displayServices');
	var interfaceServices = require('robots/services/interfaceServices');
	var filters = require('common/filters');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var RobotEditor = require('./directives/RobotEditor');
	var RobotInterface = require('./directives/RobotInterface');
	var CalibrateRobot = require('./directives/CalibrateRobot');
	var ViewRobot = require('./directives/ViewRobot');

	var moduleName = 'kasparGUI.robots.directives';
	var dependancies = [
		         			displayServices,
		        			languageServices,
		         			interfaceServices,
		        			filters,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('robotEditor', RobotEditor)
		.directive('robotInterface', RobotInterface)
		.directive('calibrateRobot', CalibrateRobot)
		.directive('viewRobot', ViewRobot);

	return moduleName;
});		
