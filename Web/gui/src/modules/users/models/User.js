'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var User = function($resource) {
		return $resource('/api/user/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', User ];
});
