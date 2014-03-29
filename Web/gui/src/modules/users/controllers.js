'use strict';

define(function(require) {
	var angular = require('angular');
	var proxyServices = require('common/services/proxyServices');
	var actionModels = require('actions/models');
	var triggerModels = require('triggers/models');
	var userModels = require('users/models');
	var UserController = require('./UserController');

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
