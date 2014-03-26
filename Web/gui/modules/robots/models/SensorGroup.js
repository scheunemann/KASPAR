(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

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
}());
