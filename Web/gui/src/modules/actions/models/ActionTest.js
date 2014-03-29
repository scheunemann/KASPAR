'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ActionTest = function($resource) {
		return $resource('/api/action/:id/test', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', ActionTest ];
});
