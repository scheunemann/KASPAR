(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

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
}());
