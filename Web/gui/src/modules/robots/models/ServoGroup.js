'use strict';

define([], function(angular) {

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
