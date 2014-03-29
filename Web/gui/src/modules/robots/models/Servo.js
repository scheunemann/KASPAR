'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Servo = function($resource) {
		return $resource('/api/robot/:robot/servo/:id', {
			robot : '@robot',
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Servo ];
});
