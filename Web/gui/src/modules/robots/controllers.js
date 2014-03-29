'use strict';

define(function(require) {
	var angular = require('angular');
	var robotModels = require('robots/models');
	var proxyServices = require('common/services/proxyServices');
	var RobotController = require('./RobotController');
	
	var moduleName = 'kasparGUI.robots.controllers';
	var dependancies = [ 
	                       robotModels, 
	                       proxyServices, 
	                       ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('robotController', RobotController);

	return moduleName;
});	
