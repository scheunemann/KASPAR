'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ServoModel = function($resource) {
		return $resource('/api/robot/servo/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoModel ];
});
