'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var TriggerType = function($resource) {
		return $resource('/api/trigger/type/:id', {
			id : '@id'
		}, {
			'get' : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', TriggerType ];
});
