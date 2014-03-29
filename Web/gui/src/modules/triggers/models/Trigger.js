'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Trigger = function($resource) {
		return $resource('/api/trigger/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Trigger ];
});
