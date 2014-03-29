'use strict';

define([ 
        'angular',
        'common/services/proxyServices',
        'actions/models',
        'triggers/models',
        'users/models',
        './UserController'
        ], function(
		angular,
		proxyServices, 
		actionModels, 
		triggerModels, 
		userModels, 
		UserController) {

	var moduleName = 'kasparGUI.users.controllers';
	var dependancies = [ 
		          			proxyServices, 
		        			actionModels, 
		        			triggerModels, 
		        			userModels, 
                         ];

	var module = angular.module(moduleName, dependancies)
		.controller('userController', UserController);

	return moduleName;
});
