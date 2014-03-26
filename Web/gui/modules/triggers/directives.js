(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'modules/common/services/displayServices',
	                    'modules/common/services/proxyServices',
	                    'modules/common/filters',
	                    'modules/triggers/models',
	                    './directives/ButtonTriggerEditor',
	                    './directives/CompoundTriggerEditor',
	                    './directives/HotkeyEditor',
	                    './directives/SensorTriggerEditor',
	                    './directives/SensorValueEditor',
	                    './directives/TimeTriggerEditor',
	                    './directives/TriggerEditor',
	                    ];	
	
	define(dependancies, function(
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
		var directiveDeps = [
			         			displayServices,
			        			proxyServices,
			        			filters,
			        			triggerModels,
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('buttonTriggerEditor', ButtonTriggerEditor)
			.directive('compoundTriggerEditor', CompoundTriggerEditor)
			.directive('hotkeyEditor', HotkeyEditor)
			.directive('sensorTriggerEditor', SensorTriggerEditor)
			.directive('sensorValueEditor', SensorValueEditor)
			.directive('timeTriggerEditor', TimeTriggerEditor)
			.directive('triggerEditor', TriggerEditor);

		return moduleName;
	});		
}());
