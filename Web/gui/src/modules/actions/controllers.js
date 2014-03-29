'use strict';

define([ 
        'angular',
        'actions/models',
        './ActionController',
        './ActionTestController',
       ], function(
		angular,
		actionModels,
		ActionController,
		ActionTestController){

	var moduleName = 'kasparGUI.actions';
	var dependancies = [ 
	                      actionModels,
                         ];

	var module = angular.module(moduleName, dependancies)
		.controller('actionController', ActionController)
		.controller('actionTestController', ActionController);

	return moduleName;
});
