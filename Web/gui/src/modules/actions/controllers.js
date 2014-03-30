'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var actionModels = require('actions/models');
	var actionDirectives = require('actions/directives');
	var ActionController = require('./ActionController');
	var ActionTestController = require('./ActionTestController');

	var moduleName = 'kasparGUI.actions';
	var dependancies = [ actionModels, actionDirectives ];

	var module = angular.module(moduleName, dependancies)
		.controller('actionController', ActionController)
		.controller('actionTestController', ActionController);

	return moduleName;
});
