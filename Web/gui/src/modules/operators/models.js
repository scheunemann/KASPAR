'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var Operator = require('./models/Operator');

	var moduleName = 'kasparGUI.operators.models';
	var dependancies = [
	                   	angularResource,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Operator', Operator);

	return moduleName;
});
