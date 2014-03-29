'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices =require('common/services/displayServices');
	var proxyServices = require('common/services/proxyServices');
	var filters = require('common/filters');
	var actionModels = require('actions/models');
	var ActionEditor = require('./directives/ActionEditor');
	var AdvancedPoseEditor = require('./directives/AdvancedPoseEditor');
	var GroupEditor = require('./directives/GroupEditor');
	var PoseEditor = require('./directives/PoseEditor');
	var SequenceEditor = require('./directives/SequenceEditor');
	var SoundEditor = require('./directives/SoundEditor');

	var moduleName = 'kasparGUI.actions.directives';
	var dependancies = [ displayServices, proxyServices, filters, actionModels, ];

	var module = angular.module(moduleName, dependancies)
		.directive('actionEditor', ActionEditor)
		.directive('advancedPoseEditor', AdvancedPoseEditor)
		.directive('groupEditor', GroupEditor)
		.directive('poseEditor', PoseEditor)
		.directive('sequenceEditor', SequenceEditor)
		.directive('soundEditor', SoundEditor);

	return moduleName;
});
