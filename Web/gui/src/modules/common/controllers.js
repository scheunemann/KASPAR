'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var uiRouter = require('angularUIRouter');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var CommonController = require('./CommonController');
	var SettingsController = require('./SettingsController');
	
	var moduleName = 'kasparGUI.common.controllers';
	var dependancies = [
		          			uiRouter,
		        			languageServices,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('commonController', CommonController)
		.controller('settingsController', SettingsController);

	return moduleName;
});	
