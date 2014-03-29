'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var SensorModel = function($resource) {
		return $resource('/api/robot/sensor/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', SensorModel ];
});
