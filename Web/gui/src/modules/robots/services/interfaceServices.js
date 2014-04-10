'use strict';

define(function(require) {
	var angular = require('angular');
	var RobotInterface = require('./RobotInterface'); 

	var moduleName = 'kasparGUI.robot.interfaceServices';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('robotInterface', RobotInterface);

	return moduleName;
});
