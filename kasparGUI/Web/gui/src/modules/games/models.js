'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var Trigger = require('./models/Game');

	var moduleName = 'kasparGUI.games.models';
	var dependancies = [
						angularResource
					];

	var module = angular.module(moduleName, dependancies)
		.factory('Trigger', Trigger);

	return moduleName;
});
