'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var RobotModel = function($resource) {
		return $resource('/api/robot/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', RobotModel ];
});
