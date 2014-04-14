'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var actionModels = require('actions/models');
	var actionDirectives = require('actions/directives');
	var ActionController = require('./ActionController');
	var ActionTestController = require('./ActionTestController');

	var moduleName = 'kasparGUI.actions';
	var dependancies = [ 
	                     actionModels, 
	                     actionDirectives,
	                     languageServices ];

	var module = angular.module(moduleName, dependancies)
		.controller('actionController', ActionController)
		.controller('actionTestController', ActionTestController);

	return moduleName;
});
