'use strict';

define([
        'angular',
        'common/services/proxyServices',
        'users/models',
        'operators/models',
        './OperatorController',
      ], function(
		angular,
		proxyServices,
		userModels,
		operatorModels,
        OperatorController){
	
	var moduleName = 'kasparGUI.operators.controllers';
	var dependancies = [ 
		          			proxyServices,
		        			userModels,
		        			operatorModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('operatorController', OperatorController);

	return moduleName;
});	
