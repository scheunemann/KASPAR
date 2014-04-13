'use strict';

define(function(require) {
	var angular = require('angular');
	var Language = require('./Language');

	var moduleName = 'kasparGUI.common.languageServices';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('language', Language);

	return moduleName;
});
