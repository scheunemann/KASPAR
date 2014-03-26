(function() {
	'use strict';
	
	var dependancies = [
	                     'angular',
	                     'modules/common/services/proxyServices',
	                     'modules/users/models',
	                     'modules/operators/models',
	                     './OperatorController',
	                   ];
	
	define(dependancies, function(
			angular,
			proxyServices,
			userModels,
			operatorModels,
            OperatorController){
		
		var moduleName = 'kasparGUI.operators.controllers';
		var controllerDeps = [ 
			          			proxyServices,
			        			userModels,
			        			operatorModels,
		                     ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('operatorController', OperatorController);

		return moduleName;
	});	
}());
