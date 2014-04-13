'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var operatorModels = require('operators/models');
	var userModels = require('users/models');
	var triggerModels = require('triggers/models');
	var interactionModels = require('interactions/models');
	var InteractionController = require('./InteractionController');
	var interactionDirectives = require('interactions/directives');
	
	var moduleName = 'kasparGUI.interactions.controllers';
	var dependancies = [
		        			operatorModels,
		        			languageServices,
		        			userModels,
		        			triggerModels,
		        			interactionModels,
	                    	interactionDirectives,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('interactionController', InteractionController);

	return moduleName;
});	
