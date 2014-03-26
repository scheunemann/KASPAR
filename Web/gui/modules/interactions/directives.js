(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'modules/common/services/displayServices',
	                    'modules/common/services/proxyServices',
	                    'modules/common/filters',
	                    'modules/interactions/models',
	                    './directives/ActionButton',
	                    './directives/ActionButtons',
	                    './directives/OperatorInteraction',
	                    './directives/UserInteraction'
	                    ];	
	
	define(dependancies, function(
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
		var directiveDeps = [
			         			displayServices,
			        			proxyServices,
			        			filters,
			        			interactionModels,
		                     ];
		
		var module = angular.module(moduleName, directiveDeps)
			.directive('actionButton', ActionButton)
			.directive('actionButtons', ActionButtons)
			.directive('operatorInteraction', OperatorInteraction)
			.directive('userInteraction', UserInteraction);

		return moduleName;
	});		
}());
