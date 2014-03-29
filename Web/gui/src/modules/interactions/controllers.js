'use strict';

define(function(require) {
	var angular = require('angular');
	var proxyServices = require('common/services/proxyServices');
	var operatorModels = require('operators/models');
	var userModels = require('users/models');
	var triggerModels = require('triggers/models');
	var interactionModels = require('interactions/models');
	var InteractionController = require('./InteractionController');
	
	var moduleName = 'kasparGUI.interactions.controllers';
	var dependancies = [
		          			proxyServices,
		        			operatorModels,
		        			userModels,
		        			triggerModels,
		        			interactionModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('interactionController', InteractionController);

	return moduleName;
});	
