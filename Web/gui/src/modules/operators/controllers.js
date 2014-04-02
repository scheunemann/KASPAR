'use strict';

define(function(require) {
	var angular = require('angular');
	var userModels = require('users/models');
	var operatorModels = require('operators/models');
	var OperatorController = require('./OperatorController');
	
	var moduleName = 'kasparGUI.operators.controllers';
	var dependancies = [ 
		        			userModels,
		        			operatorModels,
	                     ];
	
	var module = angular.module(moduleName, dependancies)
		.controller('operatorController', OperatorController);

	return moduleName;
});	
