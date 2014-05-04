'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var actionModels = require('actions/models');
	var triggerModels = require('triggers/models');
	var userModels = require('users/models');
	var UserController = require('./UserController');

	var moduleName = 'kasparGUI.users.controllers';
	var dependancies = [
						actionModels, 
						languageServices, 
						triggerModels, 
						userModels, 
					];

	var module = angular.module(moduleName, dependancies).controller('userController', UserController);

	return moduleName;
});
