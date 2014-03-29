'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var ActionController = require('./ActionController');
	var ActionTestController = require('./ActionTestController');

	var moduleName = 'kasparGUI.actions';
	var dependancies = [ actionModels, ];

	var module = angular.module(moduleName, dependancies)
		.controller('actionController', ActionController)
		.controller('actionTestController', ActionController);

	return moduleName;
});
