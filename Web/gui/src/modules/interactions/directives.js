'use strict';

define(function(require) {
	var angular = require('angular');
	var displayServices = require('common/services/displayServices');
	var proxyServices = require('common/services/proxyServices');
	var filters = require('common/filters');
	var interactionModels = require('interactions/models');
	var ActionButton = require('./directives/ActionButton');
	var ActionButtons = require('./directives/ActionButtons');
	var OperatorInteraction = require('./directives/OperatorInteraction');
	var UserInteraction = require('./directives/UserInteraction');

	var moduleName = 'kasparGUI.interactions.directives';
	var dependancies = [
		         			displayServices,
		        			proxyServices,
		        			filters,
		        			interactionModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.directive('actionButton', ActionButton)
		.directive('actionButtons', ActionButtons)
		.directive('operatorInteraction', OperatorInteraction)
		.directive('userInteraction', UserInteraction);

	return moduleName;
});		
