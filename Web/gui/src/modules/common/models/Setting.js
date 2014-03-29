'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Setting = function($resource) {
		return $resource('/api/setting/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Setting ];
});
