(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'modules/common/services/displayServices',
	                    'modules/common/services/proxyServices',
	                    'modules/common/filters',
	                    'modules/actions/models',
	                    './directives/ActionEditor',
	                    './directives/AdvancedPoseEditor',
	                    './directives/GroupEditor',
	                    './directives/PoseEditor',
	                    './directives/SequenceEditor',
	                    './directives/SoundEditor',
	                    ];
	
	define(dependancies, function(
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
		var directiveDeps = [
			         			displayServices,
			        			proxyServices,
			        			filters,
			        			actionModels,
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('actionEditor', ActionEditor)
			.directive('advancedPoseEditor', AdvancedPoseEditor)
			.directive('groupEditor', GroupEditor)
			.directive('poseEditor', PoseEditor)
			.directive('sequenceEditor', SequenceEditor)
			.directive('soundEditor', SoundEditor);

		return moduleName;
	});		
}());
