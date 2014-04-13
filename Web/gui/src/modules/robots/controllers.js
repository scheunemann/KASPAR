'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var robotModels = require('robots/models');
	var RobotController = require('./RobotController');
	
	var moduleName = 'kasparGUI.robots.controllers';
	var dependancies = [ 
	                       robotModels, 
		        			languageServices,
	                       ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('robotController', RobotController);

	return moduleName;
});	
