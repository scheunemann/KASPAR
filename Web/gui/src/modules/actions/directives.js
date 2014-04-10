'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var interfaceServices = require('robots/services/interfaceServices');
	var robotDirectives = require('robots/directives');
	var filters = require('common/filters');
	var actionModels = require('actions/models');
	var ActionEditor = require('./directives/ActionEditor');
	var AdvancedPoseEditor = require('./directives/AdvancedPoseEditor');
	var GroupEditor = require('./directives/GroupEditor');
	var PoseEditor = require('./directives/PoseEditor');
	var JointEditor = require('./directives/JointEditor');
	var SequenceEditor = require('./directives/SequenceEditor');
	var SoundEditor = require('./directives/SoundEditor');

	var moduleName = 'kasparGUI.actions.directives';
	var dependancies = [ 
	                     displayServices,
	                     interfaceServices,
	                     filters, 
	                     actionModels,
	                     robotDirectives,
	                   ];

	var module = angular.module(moduleName, dependancies)
		.directive('actionEditor', ActionEditor)
		.directive('advancedPoseEditor', AdvancedPoseEditor)
		.directive('groupactionEditor', GroupEditor)
		.directive('poseactionEditor', PoseEditor)
		.directive('sequenceactionEditor', SequenceEditor)
		.directive('soundactionEditor', SoundEditor)
		.directive('jointEditor', JointEditor);

	return moduleName;
});
