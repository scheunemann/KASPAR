'use strict';

define([
        'angular',
        'common/services/displayServices',
        'common/services/proxyServices',
        'common/filters',
        'triggers/models',
        './directives/ButtonTriggerEditor',
        './directives/CompoundTriggerEditor',
        './directives/HotkeyEditor',
        './directives/SensorTriggerEditor',
        './directives/SensorValueEditor',
        './directives/TimeTriggerEditor',
        './directives/TriggerEditor',
        ], function(
		angular,
		displayServices,
		proxyServices,
		filters,
		triggerModels,
        ButtonTriggerEditor,
        CompoundTriggerEditor,
        HotkeyEditor,
        SensorTriggerEditor,
        SensorValueEditor,
        TimeTriggerEditor,
        TriggerEditor){

	var moduleName = 'kasparGUI.triggers.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
		        			triggerModels,
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
