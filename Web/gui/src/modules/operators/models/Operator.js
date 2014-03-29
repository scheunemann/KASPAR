'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Operator = function($resource) {
		return $resource('/api/operator/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Operator ];
});
