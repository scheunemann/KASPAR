'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var JointPosition = function($resource) {
		return $resource('/api/jointposition/:id', {
			id : '@id'
		}, {
			cache : false
		});
	};

	return [ '$resource', JointPosition ];
});
