'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var SensorGroup = function($resource) {
		return $resource('/api/robot/:id/sensorgroup/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', SensorGroup ];
});
