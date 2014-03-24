(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Sensor = function($resource) {
			return $resource('/api/robot/:id/sensor/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Sensor ];
	});
}());
