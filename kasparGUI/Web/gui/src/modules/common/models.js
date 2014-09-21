'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('common/services/modelServices');
	var Menu = require('./models/Menu');
	var Setting = require('./models/Setting');

	var moduleName = 'kasparGUI.common.models';
	var dependancies = [
						angularResource,
						];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Menu', Menu)
		.factory('Setting', Setting);
	
	return moduleName;
});
