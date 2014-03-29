'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var OrderedAction = function($resource) {
		return $resource('/api/orderedaction/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', OrderedAction ];
});
