'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var RobotInterface = function($resource) {
		return $resource('/api/robotinterface/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', RobotInterface ];
});
