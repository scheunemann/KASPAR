'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var proxyServices = require('common/services/proxyServices');
	var filters = require('common/filters');
	var triggerModels = require('triggers/models');
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
		        			proxyServices,
		        			filters,
		        			triggerModels,
		        			'rzModule',
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('buttonTriggerEditor', ButtonTriggerEditor)
		.directive('compoundTriggerEditor', CompoundTriggerEditor)
		.directive('hotkeyEditor', HotkeyEditor)
		.directive('sensorTriggerEditor', SensorTriggerEditor)
		.directive('sensorValueEditor', SensorValueEditor)
		.directive('timeTriggerEditor', TimeTriggerEditor)
		.directive('triggerEditor', TriggerEditor);

	return moduleName;
});		
