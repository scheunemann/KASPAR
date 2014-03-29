'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Interaction = function($resource) {
		return $resource('/api/interaction/:id', {
			id : '@id'
		}, {
			cache : false
		});
	};

	return [ '$resource', Interaction ];
});
