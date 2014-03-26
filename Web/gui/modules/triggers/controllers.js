(function() {
	'use strict';
	
	var dependancies = [
	                     'angular',
	                     'modules/actions/models',
	                     'modules/triggers/models',
	                     './TriggerController',
	                   ];
	
	define(dependancies, function(
			angular,
			actionModels,
			triggerModels,
            TriggerController){
		
		var moduleName = 'kasparGUI.triggers.controllers';
		var controllerDeps = [
		                       actionModels,
		                       triggerModels,
		                     ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('triggerController', TriggerController);

		return moduleName;
	});	
}());
