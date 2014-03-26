(function() {
	'use strict';
	
	var dependancies = [
	                     'angular',
	                     'modules/common/services/proxyServices',
	                     'modules/operators/models',
	                     'modules/users/models',
	                     'modules/triggers/models',
	                     'modules/interactions/models',
	                     './InteractionController',
	                   ];
	
	define(dependancies, function(
			angular,
			proxyServices,
			operatorModels,
			userModels,
			triggerModels,
			interactionModels,
            InteractionController) {
		
		var moduleName = 'kasparGUI.interactions.controllers';
		var controllerDeps = [
			          			proxyServices,
			        			operatorModels,
			        			userModels,
			        			triggerModels,
			        			interactionModels,
		                     ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('interactionController', InteractionController);

		return moduleName;
	});	
}());
