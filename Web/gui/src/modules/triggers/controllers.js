'use strict';

define([
        'angular',
        'actions/models',
        'triggers/models',
        './TriggerController',
      ], function(
		angular,
		actionModels,
		triggerModels,
        TriggerController){
	
	var moduleName = 'kasparGUI.triggers.controllers';
	var dependancies = [
	                       actionModels,
	                       triggerModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('triggerController', TriggerController);

	return moduleName;
});	
