'use strict';

define(function(require) {
	var angular = require('angular');
	var robotModels = require('robots/models');
	var RobotController = require('./RobotController');
	
	var moduleName = 'kasparGUI.robots.controllers';
	var dependancies = [ 
	                       robotModels, 
	                       ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('robotController', RobotController);

	return moduleName;
});	
