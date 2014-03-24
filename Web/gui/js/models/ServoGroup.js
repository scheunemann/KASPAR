(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var ServoGroup = function($resource) {
			return $resource('/api/robot/:robot/servogroup/:id', {
				robot : '@robot',
				id : '@id',
				cache : true
			});
		};

		return [ '$resource', ServoGroup ];
	});
}());
