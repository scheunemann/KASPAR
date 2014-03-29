'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ActionType = function($resource) {
		return $resource('/api/action/type/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ActionType ];
});
