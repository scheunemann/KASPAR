'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Action = function($resource) {
		return $resource('/api/action/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Action ];
});
