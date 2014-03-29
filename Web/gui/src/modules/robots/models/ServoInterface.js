'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ServoInterface = function($resource) {
		return $resource('/api/servointerface/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoInterface ];
});
