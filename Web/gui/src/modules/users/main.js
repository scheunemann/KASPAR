'use strict';

define(function(require) {
	angular = require('angular');
	controllers = require('./controllers');
	directives = require('./directives');
	models = require('./models');

	var moduleName = 'kasparGUI.users';
	var dependancies = [ 
							controllers,
							directives,
							models
	                     ];

	var module = angular.module(moduleName, dependancies);
	return moduleName;
});
