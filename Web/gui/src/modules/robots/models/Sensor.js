'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var Sensor = function($resource) {
		return $resource('/api/robot/:id/sensor/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Sensor ];
});
