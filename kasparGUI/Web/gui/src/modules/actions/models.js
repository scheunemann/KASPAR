'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var Action = require('./models/Action');
	var ActionTest = require('./models/ActionTest');
	var ActionType = require('./models/ActionType');
	var JointPosition = require('./models/JointPosition');
	var SequenceOrder = require('./models/SequenceOrder');

	var moduleName = 'kasparGUI.actions.models';
	var dependancies = [ 
						angularResource,
						];

	var module = angular.module(moduleName, dependancies)
		.factory('Action', Action)
		.factory('ActionTest', ActionTest)
		.factory('ActionType', ActionType)
		.factory('JointPosition', JointPosition)
		.factory('SequenceOrder', SequenceOrder);

	return moduleName;
});
