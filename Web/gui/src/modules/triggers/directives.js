'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var filters = require('common/filters');
	var triggerModels = require('triggers/models');
	var robotModels = require('robots/models');
	var ButtonTriggerEditor = require('./directives/ButtonTriggerEditor');
	var CompoundTriggerEditor = require('./directives/CompoundTriggerEditor');
	var HotkeyEditor = require('./directives/HotkeyEditor');
	var SensorTriggerEditor = require('./directives/SensorTriggerEditor');
	var SensorValueEditor = require('./directives/SensorValueEditor');
	var TimeTriggerEditor = require('./directives/TimeTriggerEditor');
	var TriggerEditor = require('./directives/TriggerEditor');

	var moduleName = 'kasparGUI.triggers.directives';
	var dependancies = [
		         			displayServices,
		        			filters,
		        			robotModels,
		        			triggerModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('buttontriggerEditor', ButtonTriggerEditor)
		.directive('compoundtriggerEditor', CompoundTriggerEditor)
		.directive('hotkeyEditor', HotkeyEditor)
		.directive('sensortriggerEditor', SensorTriggerEditor)
		.directive('sensorValueEditor', SensorValueEditor)
		.directive('timetriggerEditor', TimeTriggerEditor)
		.directive('triggerEditor', TriggerEditor);

	return moduleName;
});		
