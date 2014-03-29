'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Robot = function($resource) {
		return $resource('/api/robot/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Robot ];
});
