'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var ButtonHotkey = require('./models/ButtonHotkey');
	var Trigger = require('./models/Trigger');
	var ButtonTrigger = require('./models/ButtonTrigger');
	var TriggerType = require('./models/TriggerType');

	var moduleName = 'kasparGUI.triggers.models';
	var dependancies = [
						angularResource
					];

	var module = angular.module(moduleName, dependancies)
		.factory('ButtonHotkey', ButtonHotkey)
		.factory('Trigger', Trigger)
		.factory('ButtonTrigger', ButtonTrigger)
		.factory('TriggerType', TriggerType);

	return moduleName;
});
