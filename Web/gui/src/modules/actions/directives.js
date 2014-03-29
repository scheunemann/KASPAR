'use strict';

define([
        'angular',
        'common/services/displayServices',
        'common/services/proxyServices',
        'common/filters',
        'actions/models',
        './directives/ActionEditor',
        './directives/AdvancedPoseEditor',
        './directives/GroupEditor',
        './directives/PoseEditor',
        './directives/SequenceEditor',
        './directives/SoundEditor',
        ], function(
		angular,
		displayServices,
		proxyServices,
		filters,
		actionModels,
        ActionEditor,
        AdvancedPoseEditor,
        GroupEditor,
        PoseEditor,
        SequenceEditor,
        SoundEditor){

	var moduleName = 'kasparGUI.actions.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
		        			actionModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('actionEditor', ActionEditor)
		.directive('advancedPoseEditor', AdvancedPoseEditor)
		.directive('groupEditor', GroupEditor)
		.directive('poseEditor', PoseEditor)
		.directive('sequenceEditor', SequenceEditor)
		.directive('soundEditor', SoundEditor);

	return moduleName;
});		
