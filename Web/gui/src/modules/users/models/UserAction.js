'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var UserAction = function($resource) {
		return $resource('/api/interaction/useraction/:button_id', {
			button_id : '@button_id'
		}, {
			cache : true
		});
	};

	return [ '$resource', UserAction ];
});
