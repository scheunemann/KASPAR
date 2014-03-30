'use strict';

define(function(require) {
	var angular = require('angular');
	var actionModels = require('actions/models');
	var triggerModels = require('triggers/models');
	var triggerDirectives = require('triggers/directives');
	var TriggerController = require('./TriggerController');
	
	var moduleName = 'kasparGUI.triggers.controllers';
	var dependancies = [
	                       actionModels,
	                       triggerModels,
	                       triggerDirectives,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('triggerController', TriggerController);

	return moduleName;
});	
