'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var CustomTrigger = function($resource) {
		return $resource('/api/user/:uid/customtrigger/:id', {
			uid : '@user_id',
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', CustomTrigger ];
});
