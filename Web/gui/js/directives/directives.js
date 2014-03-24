(function() {
	'use strict';

	var dependancies = [
	                    'js/directives/ActionButton',
	                    'js/directives/ActionButtons',
	                    'js/directives/ActionEditor',
	                    'js/directives/AdvancedPoseEditor',
	                    'js/directives/ButtonTriggerEditor',
	                    'js/directives/CompoundTriggerEditor',
	                    'js/directives/GroupEditor',
	                    'js/directives/HotKeyEditor',
	                    'js/directives/JointEditor',
	                    'js/directives/KeyBinding',
	                    'js/directives/Model',
	                    'js/directives/NotEmpty',
	                    'js/directives/OperatorInteraction',
	                    'js/directives/PoseEditor',
	                    'js/directives/RobotEditor',
	                    'js/directives/RobotInterface',
	                    'js/directives/Saveable',
	                    'js/directives/SensorTriggerEditor',
	                    'js/directives/SensorValueEditor',
	                    'js/directives/SequenceEditor',
	                    'js/directives/SoundEditor',
	                    'js/directives/TimeTriggerEditor',
	                    'js/directives/TriggerEditor',
	                    'js/directives/UserInteraction'
	                    ];	
	
	define(dependancies, function(
            ActionButton,
            ActionButtons,
            ActionEditor,
            AdvancedPoseEditor,
            ButtonTriggerEditor,
            CompoundTriggerEditor,
            GroupEditor,
            HotKeyEditor,
            JointEditor,
            KeyBinding,
            Model,
            NotEmpty,
            OperatorInteraction,
            PoseEditor,
            RobotEditor,
            RobotInterface,
            Saveable,
            SensorTriggerEditor,
            SensorValueEditor,
            SequenceEditor,
            SoundEditor,
            TimeTriggerEditor,
            TriggerEditor,
            UserInteraction){

		var moduleName = 'kasparGUI.directives';
		var directiveDeps = [
		                     'kasparGUI.displayServices',
		                     'kasparGUI.filters', 
		                     'kasparGUI.models', 
		                     'kasparGUI.proxyServices'
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('model', Model)
			.directive('saveable', Saveable)
			.directive('notEmpty', NotEmpty)
			.directive('robotEditor', RobotEditor)
			.directive('actionEditor', ActionEditor)
			.directive('poseEditor', PoseEditor)
			.directive('robotInterface', RobotInterface)
			.directive('advancedPoseEditor', AdvancedPoseEditor)
			.directive('jointEditor', JointEditor)
			.directive('soundEditor', SoundEditor)
			.directive('groupEditor', GroupEditor)
			.directive('sequenceEditor', SequenceEditor)
			.directive('triggerEditor', TriggerEditor)
			.directive('buttonTriggerEditor', ButtonTriggerEditor)
			.directive('hotkeyEditor', HotKeyEditor)
			.directive('timeTriggerEditor', TimeTriggerEditor)
			.directive('compoundTriggerEditor', CompoundTriggerEditor)
			.directive('sensorTriggerEditor', SensorTriggerEditor)
			.directive('sensorValueEditor', SensorValueEditor)
			.directive('operatorInteraction', OperatorInteraction)
			.directive('userInteraction', UserInteraction)
			.directive('actionButton', ActionButton)
			.directive('actionButtons', ActionButtons)
			.directive('keybinding', KeyBinding);
		
		return module;
	});		
}());
