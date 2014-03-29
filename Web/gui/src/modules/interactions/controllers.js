'use strict';

define([
        'angular',
        'common/services/proxyServices',
        'operators/models',
        'users/models',
        'triggers/models',
        'interactions/models',
        './InteractionController',
      ], function(
		angular,
		proxyServices,
		operatorModels,
		userModels,
		triggerModels,
		interactionModels,
        InteractionController) {
	
	var moduleName = 'kasparGUI.interactions.controllers';
	var dependancies = [
		          			proxyServices,
		        			operatorModels,
		        			userModels,
		        			triggerModels,
		        			interactionModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('interactionController', InteractionController);

	return moduleName;
});	
