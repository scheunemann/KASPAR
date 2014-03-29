'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ServoConfig = function($resource) {
		return $resource('/api/robot/:robot/servoconfig/:id', {
			robot : '@robot',
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoConfig ];
});
