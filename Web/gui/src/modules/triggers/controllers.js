'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var actionModels = require('actions/models');
	var triggerModels = require('triggers/models');
	var triggerDirectives = require('triggers/directives');
	var TriggerController = require('./TriggerController');
	
	var moduleName = 'kasparGUI.triggers.controllers';
	var dependancies = [
	                       	actionModels,
		        			languageServices,
		        			triggerModels,
		        			triggerDirectives,
		        		];
	
	var module = angular.module(moduleName, dependancies)
		.controller('triggerController', TriggerController);

	return moduleName;
});	
