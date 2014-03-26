(function() {
	'use strict';

	var dependancies = [ 
	                    'angular',
	                    'modules/actions/models',
	                    './ActionController',
	                    './ActionTestController',
	                   ];

	define(dependancies, function(
			angular,
			actionModels,
			ActionController,
			ActionTestController){

		var moduleName = 'kasparGUI.actions.controllers';
		var controllerDeps = [ 
		                      actionModels,
	                         ];

		var module = angular.module(moduleName, controllerDeps)
			.controller('actionController', ActionController)
			.controller('actionTestController', ActionController);

		return moduleName;
	});
}());
