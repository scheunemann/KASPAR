'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var Interaction = require('./models/Interaction');
	var InteractionLog = require('./models/InteractionLog');

	var moduleName = 'kasparGUI.interactions.models';
	var dependancies = [
	                   	angularResource, 
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Interaction', Interaction)
		.factory('InteractionLog', InteractionLog);

	return moduleName;
});
