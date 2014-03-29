'use strict';

define(function(require) {
	var angular = require('angular');

	var ServoGroup = function($resource) {
		return $resource('/api/robot/:robot/servogroup/:id', {
			robot : '@robot',
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoGroup ];
});
