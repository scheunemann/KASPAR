'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var commonModels = require('common/models');
	var robotModels = require('robots/models');
	var CommonController = require('./CommonController');
	var SettingsController = require('./SettingsController');
	
	var moduleName = 'kasparGUI.common.controllers';
	var dependancies = [
		          			uiRouter,
		        			commonModels,
		        			robotModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('commonController', CommonController)
		.controller('settingsController', SettingsController);

	return moduleName;
});	
