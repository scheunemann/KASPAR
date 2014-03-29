'use strict';

define(function(require) {
	var angular = require('angular');
	var actionModels = require('actions/models');
	var triggerModels = require('triggers/models');
	var TriggerController = require('./TriggerController');
	
	var moduleName = 'kasparGUI.triggers.controllers';
	var dependancies = [
	                       actionModels,
	                       triggerModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('triggerController', TriggerController);

	return moduleName;
});	
