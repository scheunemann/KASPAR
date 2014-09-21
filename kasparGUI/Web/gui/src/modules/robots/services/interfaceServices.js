'use strict';

define(function(require) {
	var angular = require('angular');
	var RobotInterface = require('./RobotInterfaceIO'); 

	var moduleName = 'kasparGUI.robot.interfaceServices';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('robotInterface', RobotInterface);

	return moduleName;
});
