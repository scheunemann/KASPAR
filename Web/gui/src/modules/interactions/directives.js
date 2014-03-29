'use strict';

define([
        'angular',
        'common/services/displayServices',
        'common/services/proxyServices',
        'common/filters',
        'interactions/models',
        './directives/ActionButton',
        './directives/ActionButtons',
        './directives/OperatorInteraction',
        './directives/UserInteraction'
        ], function(
		angular,
		displayServices,
		proxyServices,
		filters,
		interactionModels,
        ActionButton,
        ActionButtons,
        OperatorInteraction,
        UserInteraction){

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
