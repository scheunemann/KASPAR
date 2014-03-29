'use strict';

define(function(require) {
	var angular = require('angular');
	var ExceptFilter = require('./filters/ExceptFilter');
	var InterpolateFilter = require('./filters/InterpolateFilter');
	var IntersectFilter = require('./filters/IntersectFilter');

	var moduleName = 'kasparGUI.common.filters';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.filter('except', ExceptFilter)
		.filter('interpolate', InterpolateFilter)
		.filter('intersect', IntersectFilter);

	return moduleName;
});
