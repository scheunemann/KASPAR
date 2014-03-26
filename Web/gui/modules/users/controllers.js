(function() {
	'use strict';

	var dependancies = [ 
	                    'angular',
	                    'modules/common/services/proxyServices',
	                    'modules/actions/models',
	                    'modules/triggers/models',
	                    'modules/users/models',
	                    './UserController'
	                    ];

	define(dependancies, function(
			angular,
			proxyServices, 
			actionModels, 
			triggerModels, 
			userModels, 
			UserController) {

		var moduleName = 'kasparGUI.users.controllers';
		var controllerDeps = [ 
			          			proxyServices, 
			        			actionModels, 
			        			triggerModels, 
			        			userModels, 
	                         ];

		var module = angular.module(moduleName, controllerDeps)
			.controller('userController', UserController);

		return moduleName;
	});
}());
