'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var CustomAction = function($resource) {
		return $resource('/api/user/:uid/customaction/:id', {
			uid : '@user_id',
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', CustomAction ];
});
